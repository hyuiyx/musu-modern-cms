# V5.2.3 紧急恢复包

本包修复 V5.2.2 后手机总菜单、产品分类和 Contact/Feedback 消失的问题，同时保留询盘后台两行预览。

根因是旧 HTML 已有汉堡 onclick，不同版本又重复绑定；此外部分 CSS 隐藏了父链接但未保证替代按钮和总导航正常显示。本版启动时移除 inline onclick，只保留一个汉堡处理器，并用明确 CSS 控制总菜单和子菜单。

覆盖 public、tools、package.json，保留 wrangler.jsonc 和其他业务文件。Cloudflare 必须使用 npm run deploy。
