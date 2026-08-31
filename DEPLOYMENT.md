# V5.1.4 部署

1. 备份 D1。
2. 用本包的 `public`、`src`、`migrations`、`package.json` 覆盖 GitHub 同名文件。
3. 保留现有 `wrangler.jsonc`。
4. 提交至 `main`。
5. Cloudflare Deploy command 使用 `npm run deploy`，部署最新 commit。
6. 打开后台后按 `Ctrl+Shift+R`。
7. 点击“公司资料”，应直接显示资料，不再弹出 innerHTML 错误。
8. 分别测试“核心优势”和“企业数据”的新增、编辑和删除。
