# V5.2.4 稳定修复包

此版本针对“首次访问正常，刷新后子菜单消失”处理了缓存和事件双重问题：

- 不再替换 Products/News/Contact 的 DOM 元素
- 启动时删除旧汉堡 inline onclick，只保留一个事件处理器
- CSS 只保留一套菜单规则
- 部署脚本把页面资源改为 `/site.css?v=524` 和 `/site.js?v=524`，强制浏览器获取新版本
- 询盘后台每条固定高度，留言严格限制为两行，详情弹窗显示全文

覆盖 public、tools、package.json，保留 wrangler.jsonc 和其他业务文件。Cloudflare Deploy command 必须使用 npm run deploy。
