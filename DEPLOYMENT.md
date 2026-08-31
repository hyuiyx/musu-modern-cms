# V5.1.3 小白部署步骤

1. 在 Cloudflare 备份 D1 数据库。
2. 解压本包。
3. 将本包中的 `public`、`src`、`migrations`、`package.json`、`README.md` 覆盖到 GitHub 仓库根目录。
4. 不要覆盖或删除原来的 `wrangler.jsonc`。
5. 可删除旧的外挂文件：`admin-v*.js`、`admin-v*.css`、`v*-api.js`、`tools/apply-*.mjs`。V5.1.3 不依赖这些文件。
6. 提交到 GitHub `main` 分支。
7. Cloudflare Workers Builds 的 Deploy command 设置为 `npm run deploy`。
8. 确认部署的是最新 commit，而不是重新部署旧 Deployment。
9. 打开 `https://staging.ufya.tech/site.css`，应看到以 `:root{--navy:` 开头的完整 CSS。
10. 打开后台和前台，使用 `Ctrl+Shift+R` 强制刷新。

验收：
- 后台浏览器标题为 `SMUSU CMS V5.1.3`
- 视频页标题为 `视频管理 V5.1.3`，每条记录有编辑和删除按钮
- 产品图库缩略图桌面端约 150px 高，不再撑大页面
- `/about/` 有完整导航、布局、公司资料、图库、优势、指标、历程和证书样式
