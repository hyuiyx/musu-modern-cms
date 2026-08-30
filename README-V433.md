# SMUSU CMS V4.3.3 GitHub 覆盖包

将本压缩包内所有目录和文件复制到仓库根目录并覆盖同名文件，然后提交到 GitHub。Cloudflare 构建执行 `npm run deploy` 时会自动运行补丁脚本。

## 保留的配置
不要覆盖现有 `wrangler.jsonc`。现有 D1 database_id、R2 bucket_name、SITE_URL、ADMIN_HOST 会继续使用。

## 首次部署前的 D1
在 D1 Studio 执行 `PRAGMA table_info(hero_slides);` 和 `PRAGMA table_info(videos);`，再从 `migrations/0010_v433.sql` 中只执行缺少字段的 ALTER。不要在 D1 Studio 输入文件名。

## 部署后验证
1. 访问 `/admin-v433.js` 和 `/admin-v433.css`，应返回 200。
2. 后台 Hero 显示水平/垂直位置滑块。
3. 视频列表显示编辑、删除按钮。
4. 强制刷新浏览器：Ctrl+Shift+R。
