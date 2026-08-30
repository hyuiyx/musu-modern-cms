# SMUSU CMS V4.6 GitHub 直接覆盖版

本包基于 V4.2 的目录和接口结构制作。把本目录内的 `public`、`src`、`tools` 和 `package.json` 复制到现有 GitHub 仓库根目录并覆盖同名文件。不要删除仓库原有文件，也不要覆盖现有 `wrangler.jsonc`。

Cloudflare 构建命令设置为：

```bash
npm run deploy
```

部署过程自动修改原有 `public/admin.html` 与 `src/index.js`，并保留产品、分类、Hero、新闻案例、媒体库、询盘和设置功能。

## V4.6 视频后台

- 每条视频显示编辑、删除按钮
- 标题、Slug、描述、状态和排序可编辑
- 可保留或替换原视频
- 视频播放预览
- 视频封面上传、替换、移除
- 上传进度和按钮防重复提交
- 绿色成功提示和红色失败提示
- 删除 D1 记录，并尝试删除 R2 视频和封面
- R2 文件已手工删除时仍可清理 D1 残留

## 数据库

V4.6 API 首次使用时会通过 `PRAGMA table_info` 检查字段，只添加缺少字段，因此不会再次出现 duplicate column name。D1 仍建议先备份。

## 部署后验证

打开：

- `https://admin.ufya.tech/admin-v46.js?v=46`
- `https://admin.ufya.tech/admin-v46.css?v=46`

两个地址应返回文件内容。随后对后台执行 Ctrl+Shift+R。视频页标题应显示“视频管理 V4.6”。
