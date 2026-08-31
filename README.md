# V5.2.6 询盘后台直接整合版

外接 admin-inquiries.js 一直未接管旧页面，因此本版不再加载外挂询盘文件。部署前直接替换 public/admin.js 中的 loadInq/showInq，并把新样式直接写入 public/admin.css。

覆盖 tools 和 package.json，保留其他文件，Cloudflare Deploy command 必须使用 npm run deploy。构建日志必须出现：V5.2.6 inquiry UI integrated directly into admin.js/admin.css。
