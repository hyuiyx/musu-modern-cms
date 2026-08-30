// Replace the old loadVideos() and video delete/edit handlers with this code.
let VIDEOS = [];

function videoUrl(key) {
  return key ? '/media/' + encodeURIComponent(key).replace(/%2F/gi, '/') : '';
}

async function loadVideos() {
  VIDEOS = await call('/api/admin/videos');

  $('#videoList').innerHTML = VIDEOS.map(v => `
    <div class="row videoRow">
      <b>${safe(v.title)}</b>
      <span>${safe(v.status)}</span>
      <span class="preview2">${safe(v.description || '')}</span>
      <div class="inline">
        <button type="button" onclick="editVideo(${v.id})">编辑</button>
        <button type="button" class="danger" onclick="deleteVideo(${v.id})">删除</button>
      </div>
    </div>
  `).join('') || '<p>暂无视频</p>';
}

window.editVideo = id => {
  const v = VIDEOS.find(item => Number(item.id) === Number(id));
  if (!v) return alert('找不到该视频记录');

  $('#videoId').value = v.id;
  $('#videoTitle').value = v.title || '';
  $('#videoSlug').value = v.slug || '';
  $('#videoDesc').value = v.description || '';
  $('#videoStatus').value = v.status || 'draft';
  $('#videoSort').value = v.sort_order || 0;

  const preview = $('#videoPreview');
  if (v.video_key) {
    preview.src = videoUrl(v.video_key);
    preview.classList.remove('hide');
    preview.load();
  } else {
    // R2 object may have been deleted, but the D1 row can still be edited/deleted.
    preview.removeAttribute('src');
    preview.classList.add('hide');
  }

  const poster = $('#videoPosterPreview');
  if (v.poster_key) {
    poster.src = videoUrl(v.poster_key);
    poster.classList.remove('hide');
  } else {
    poster.removeAttribute('src');
    poster.classList.add('hide');
  }

  $('#videoSaveResult').textContent = `正在编辑视频 ID：${v.id}`;
  $('#videoForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.deleteVideo = async id => {
  const v = VIDEOS.find(item => Number(item.id) === Number(id));
  if (!v) return alert('找不到该视频记录');

  if (!confirm(`确定删除视频“${v.title}”吗？\n\n将删除 D1 视频记录，并尝试删除对应 R2 视频和封面文件。`)) return;

  try {
    await call(`/api/admin/videos/${id}`, { method: 'DELETE' });

    if (String($('#videoId').value) === String(id)) {
      $('#videoNew')?.click();
    }

    await loadVideos();
    alert('视频已删除，列表占位也已清除');
  } catch (error) {
    alert('删除失败：' + error.message);
  }
};

// Keep this handler if the form already has a bottom delete button.
$('#videoDelete').onclick = async () => {
  const id = $('#videoId').value;
  if (!id) return alert('请先从列表点击“编辑”选择视频');
  await window.deleteVideo(Number(id));
};
