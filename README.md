# SMUSU CMS V5.1 完整覆盖包

覆盖 GitHub 中同名文件，但保留现有 `wrangler.jsonc`。部署命令使用 `npm run deploy`。首次打开后台“公司资料”会自动创建公司资料表。

重要：如果现有 V5.0 `site.css` 已经满意，请不要覆盖 `public/site.css`，只把 `public/site-v51.css` 放入 public，并在现有 site.css 最后增加 `@import url("/site-v51.css");`。
