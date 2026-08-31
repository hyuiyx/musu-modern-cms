# SMUSU CMS V5.1.4 合并修复版

V5.1.4 修复公司资料后台打开时出现 `Cannot set properties of null (setting innerHTML)` 的问题。

根因是公司资料集合名称使用复数 API 路径，但部分后台容器 ID 使用单数名称：
- `features` 对应 `featureList`
- `metrics` 对应 `metricList`
- `certificates` 对应 `certificateList`

V5.1.4 增加明确映射和空元素保护，并修复核心优势、企业数据保存时调用错误 API 路径的问题。V5.1.3 的公司资料、视频编辑、后台缩略图、About 样式和下拉菜单修复均保留。

直接覆盖 GitHub 同名文件，保留原 `wrangler.jsonc`，提交 main，部署最新 commit，随后强制刷新。
