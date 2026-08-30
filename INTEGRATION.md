# SMUSU CMS V4.3 升级说明

此包基于用户提供的 V4.2 文本快照制作。因为输入是文本清单而不是原始 ZIP，包内提供完整的新视频模块和精确接入说明，不会覆盖或猜测未完整保真的原文件。

## 1. 备份
备份 D1，并保留现有 `wrangler.jsonc` 中的 D1 database_id、R2 bucket_name、SITE_URL 和 ADMIN_HOST。

## 2. 数据库
先在 D1 Studio 执行 `PRAGMA table_info(...)` 检查字段。仅执行尚不存在的 `ALTER TABLE` 行，然后执行索引和 UPDATE。

## 3. Worker 接入
复制 `src/video-v43.js` 到项目 `src/`。

在 `src/index.js` 顶部加入：
```js
import {videoAdminApi,videoPublicHtml} from './video-v43.js';
```

在 `api(req,env)` 完成 ADMIN_HOST 检查后、旧 videos API 前加入：
```js
const videoResponse=await videoAdminApi(req,env,u);
if(videoResponse)return videoResponse;
```
删除旧的 `/api/admin/videos` GET/POST 两段，避免旧路由抢先响应。

把原 `videos(env)` 改为：
```js
async function videos(env){
  const d=await data(env);
  return shell({title:'Videos'},await videoPublicHtml(env),d);
}
```

静态资源白名单加入 `/video-v43.js` 和 `/video-v43.css`。

## 4. 后台接入
用 `public/admin-video-section.html` 中的 section 替换旧视频 section。不要再保留旧 `#videoUpload` 点击逻辑。

复制 `public/video-v43.js`、`public/video-v43.css` 到 public。admin.html 的 head 加：
```html
<link rel="stylesheet" href="/video-v43.css">
```

原 tab 映射中的 videos 改成：
```js
videos: window.loadVideosV43
```

## 5. 图片焦点
按照 `IMAGE_POSITION_INTEGRATION.md` 接入分类、Hero、新闻和产品图片。数据库迁移已准备相应字段。

## 6. 版本号
package.json 修改为：
```json
{"name":"smusu-cms-v43","version":"4.3.0","private":true,"scripts":{"dev":"wrangler dev","deploy":"wrangler deploy"},"devDependencies":{"wrangler":"^4.2.0"}}
```

## 7. 验收
- 新建视频必须选择文件。
- 编辑标题/状态时不重新上传视频。
- 可替换视频及封面。
- 删除仅删除 D1 记录，R2 对象保留。
- 前台 `/videos/` 可播放已发布视频。
- 分类、Hero、新闻和产品图可调整焦点，刷新后保持。

注意：当前 R2 读取函数未实现 Range 响应优化。小中型 MP4 可播放，但大型视频拖动进度条可能不理想。后续建议增加 Range 支持或改成直传/流媒体方案。
