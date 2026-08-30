1. 备份 D1。
2. 覆盖 public/admin.html、public/admin.js、public/admin.css、public/company-admin.js、src/index.js、src/company.js、package.json。
3. 保留 wrangler.jsonc。
4. 前台 V5.0 样式已正常时，不覆盖 site.css，只上传 site-v51.css 并在原 CSS 末尾加入 @import。
5. 提交 main，Cloudflare Deploy command 使用 npm run deploy。
6. 打开 admin.ufya.tech，按 Ctrl+Shift+R，点击“公司资料”。
