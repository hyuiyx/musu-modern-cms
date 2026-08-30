# V4.3.4 视频上传修复覆盖包
将包内文件覆盖到 GitHub 仓库根目录，保留原 wrangler.jsonc，然后提交 main。Cloudflare 的部署命令使用 npm run deploy。

修复：视频列表编辑/删除按钮、上传进度、上传成功绿色提示、失败红色提示、按钮防重复提交、编辑回填、删除 D1 残留和 R2 文件。

部署后直接访问 /admin-v434.js?v=434，必须返回 JS 内容。随后 Ctrl+Shift+R 强制刷新。若页面仍显示旧“上传视频”，说明 Cloudflare 没有执行 npm run deploy 或部署的不是 main 最新提交。
