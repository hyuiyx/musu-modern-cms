# SMUSU CMS V4.3.2 完整接入

本补丁针对截图中的两个实际问题：Hero 图片固定 `object-fit: cover` 但没有焦点控制，以及线上视频区仍是 V4.2 的纯上传界面。

## 一、数据库
在 D1 Studio 先执行：
```sql
PRAGMA table_info(hero_slides);
PRAGMA table_info(videos);
```
然后从 `migrations/0010_v432.sql` 中仅执行不存在字段对应的 ALTER。不要重复添加已有字段。

## 二、复制前端文件
复制：
- `public/admin-v432.js` 到项目 `public/`
- `public/admin-v432.css` 到项目 `public/`

在 `public/admin.html` 的 `</head>` 前加入：
```html
<link rel="stylesheet" href="/admin-v432.css">
```
在原 `/admin.js` 之后、`</body>` 前加入：
```html
<script src="/admin-v432.js"></script>
```
顺序必须在旧 admin.js 后面。补丁会自动替换旧视频区域并增强现有 Hero 表单。

在 `src/index.js` 静态资源列表中加入：
```js
'/admin-v432.js','/admin-v432.css'
```

## 三、复制后端文件
复制 `src/v432-api.js` 到项目 `src/`。
在 `src/index.js` 顶部加入：
```js
import {v432Api} from './v432-api.js';
```
在 `api(req,env)` 完成 ADMIN_HOST 校验后，任何旧 Hero/Video POST 路由之前加入：
```js
const v432Response=await v432Api(req,env,u);
if(v432Response)return v432Response;
```
删除旧 `/api/admin/videos` GET/POST 代码，或确保上面的调用位于旧代码之前。

## 四、让前台 Hero 使用保存的位置
把 Hero 图片标签从：
```js
`<img src="/media/${esc(x.image_key)}" alt="${esc(x.title)}">`
```
改为：
```js
`<img src="/media/${esc(x.image_key)}" style="object-position:${Number(x.image_position_x)||50}% ${Number(x.image_position_y)||50}%" alt="${esc(x.title)}">`
```
注意：后台滑块只是保存和预览。前台必须加入这段 `object-position` 才会实际生效。

## 五、部署
```bash
npm run deploy
```
部署后打开：
- `https://admin.ufya.tech/admin-v432.js`
- `https://admin.ufya.tech/admin-v432.css`

确认不是 404，然后按 `Ctrl+Shift+R` 强制刷新。

## 六、验收
1. Hero 编辑区出现“水平位置”和“垂直位置”两个滑块。
2. 拖动滑块时后台预览立即移动。
3. 保存 Hero 后刷新后台，位置仍然保留。
4. 刷新前台，Hero 按相同位置显示。
5. 视频列表每条记录出现“编辑”和“删除”。
6. 编辑时可以修改标题、Slug、描述、状态和排序，也可替换视频和封面。
7. 删除后 D1 占位消失，并尝试清理 R2 对象。
