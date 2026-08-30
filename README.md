# V4.3.1 视频编辑与彻底删除补丁

## 为什么在 R2 删除后后台仍有一个位置
后台列表读取的是 D1 `videos` 表，不是 R2 文件列表。手工删除 R2 对象只删除文件，不会删除 D1 内容记录，因此标题和占位仍存在。

## 接入步骤
1. 把 `src/video-delete-route.js` 的路由代码复制到 `src/index.js` 的 `api(req,env)` 内，并放在最终 `Not Found` 之前。
2. 确保同一路径没有更早的旧 DELETE 路由。若有，删除旧 DELETE 路由。
3. 用 `public/video-list-replacement.js` 替换 `public/admin.js` 中旧的 `loadVideos`、`editVideo`、`deleteVideo` 和 `#videoDelete` 处理代码。
4. 确保后台视频表单存在 `public/video-buttons.html` 中列出的所有 ID。
5. 将 `public/video-buttons.css` 追加到 `public/admin.css`。
6. 部署后按 Ctrl+Shift+R 强制刷新。

## 删除行为
- 列表中每条记录都有“编辑”和“删除”。
- “删除”会删除 D1 `videos` 记录，因此占位立即消失。
- 同时尝试删除 R2 视频和封面。即使 R2 文件先被手工删除，D1 记录仍会正常删除。
- `media_assets` 仅在没有其他 CMS 记录引用同一对象时删除。
- 如果只想删除 D1 记录并保留 R2，可调用 `DELETE /api/admin/videos/:id?keep_files=1`。
