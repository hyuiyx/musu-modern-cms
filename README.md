# V5.2.5 询盘后台最终覆盖

截图仍显示旧布局，说明旧 admin.js 的 tab onclick 在增强脚本之后再次渲染旧列表。V5.2.5 使用捕获阶段拦截“留言/询盘”按钮，阻止旧渲染函数执行，然后只渲染新表格。

覆盖 public、tools、package.json，保留 wrangler.jsonc 和其他业务文件，使用 npm run deploy。
