# 图片位置调整接入

迁移新增 `image_position_x` 和 `image_position_y`，范围 0 到 100，默认 50/50。

在分类、Hero、新闻封面和产品图片保存表单中各加入两项：

```html
<div class="positionEditor">
  <label>水平位置 <input name="image_position_x" type="range" min="0" max="100" value="50"></label>
  <label>垂直位置 <input name="image_position_y" type="range" min="0" max="100" value="50"></label>
</div>
```

对应 UPDATE/INSERT SQL 加入两个字段，并使用：

```js
const px=Math.max(0,Math.min(100,+String(fd.get('image_position_x')||50)));
const py=Math.max(0,Math.min(100,+String(fd.get('image_position_y')||50)));
```

前台输出图片时增加内联位置。这不会拉伸图片，只改变裁切焦点：

```html
<img src="/media/KEY" style="object-position: X% Y%" alt="...">
```

例如 Hero：

```js
`<img src="/media/${esc(x.image_key)}" style="object-position:${+x.image_position_x||50}% ${+x.image_position_y||50}%" alt="${esc(x.title)}">`
```

分类卡片、新闻封面、产品图使用相同写法。后台滑块 `input` 事件应同步修改预览图的 `style.objectPosition`。
