SMUSU CMS V4.6.2 直接覆盖版

基于 V4.6.1，新增分类图片位置调节：
- 水平位置 0-100
- 垂直位置 0-100
- 裁切铺满 cover
- 完整显示 contain
- 后台实时预览
- 保存到 D1 并应用到前台 Product Families

覆盖：public/admin.html、public/admin.js、src/index.js、package.json。
将 public/admin-v46-additions.css 内容复制到原 public/admin.css 最末尾。之前追加过旧版内容也可以直接再次追加，新规则会覆盖旧规则。
保留原 wrangler.jsonc。提交 main，部署命令 npm run deploy，完成后 Ctrl+Shift+R。
V4.6.2 会自动检查分类与视频字段，不需要手工执行 D1 ALTER。
