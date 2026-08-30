// Add this route inside api(req, env), before the final Not Found response.
// It removes the video row even when the R2 object was already deleted manually.
let videoMatch = u.pathname.match(/^\/api\/admin\/videos\/(\d+)$/);

if (videoMatch && req.method === 'DELETE') {
  const id = Number(videoMatch[1]);
  const video = await one(env.DB, 'SELECT * FROM videos WHERE id=?', id);

  if (!video) {
    return J({ error: 'Video not found' }, 404);
  }

  // Default: remove both D1 record and corresponding R2 video/poster files.
  // Add ?keep_files=1 if only the D1 record should be removed.
  const keepFiles = u.searchParams.get('keep_files') === '1';

  if (!keepFiles) {
    const keys = [video.video_key, video.poster_key].filter(Boolean);

    for (const key of keys) {
      // MEDIA.delete succeeds safely even if the object was removed manually earlier.
      await env.MEDIA.delete(key);

      // Only remove media_assets when no other CMS record references this key.
      const refs = await one(env.DB, `
        SELECT
          (SELECT COUNT(*) FROM videos WHERE id<>? AND (video_key=? OR poster_key=?)) +
          (SELECT COUNT(*) FROM categories WHERE image_key=?) +
          (SELECT COUNT(*) FROM hero_slides WHERE image_key=?) +
          (SELECT COUNT(*) FROM posts WHERE cover_key=?) +
          (SELECT COUNT(*) FROM product_images WHERE object_key=?) AS n
      `, id, key, key, key, key, key, key);

      if (!refs || Number(refs.n) === 0) {
        await env.DB.prepare('DELETE FROM media_assets WHERE object_key=?')
          .bind(key)
          .run();
      }
    }
  }

  await env.DB.prepare('DELETE FROM videos WHERE id=?').bind(id).run();
  return J({ success: true, files_deleted: !keepFiles });
}
