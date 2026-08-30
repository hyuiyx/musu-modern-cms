# SMUSU CMS V5.0 首页覆盖包

先确保 GitHub 已经是 V4.6.2。将本包内 `public`、`tools`、`package.json` 复制到仓库根目录并覆盖。保留原 `wrangler.jsonc`、`public/admin.*` 和数据库数据。

Cloudflare Workers Builds 的 Deploy command 设置为：

```bash
npm run deploy
```

部署脚本会在部署前把当前 `src/index.js` 的 `shell()`、`media()`、`home()` 替换为 V5.0 首页，其余产品、分类、新闻、案例、视频、询盘和后台 API 保持不变。

部署后先打开 `https://staging.ufya.tech/site.css`，确认返回新 CSS，再按 Ctrl+Shift+R 强制刷新首页。
