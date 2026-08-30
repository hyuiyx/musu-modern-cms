直接覆盖：
1. public/admin.html 覆盖 GitHub 的 public/admin.html
2. public/admin.js 覆盖 GitHub 的 public/admin.js
3. src/index.js 覆盖 GitHub 的 src/index.js
4. package.json 覆盖根目录 package.json
5. 将 public/admin-v46-additions.css 的内容复制到现有 public/admin.css 最末尾
6. 保留原 wrangler.jsonc
7. 提交 main，Cloudflare 部署命令使用 npm run deploy
8. 部署后 Ctrl+Shift+R
不再需要 admin-v46.js、v46-api.js 或 tools/apply-v46.mjs。
