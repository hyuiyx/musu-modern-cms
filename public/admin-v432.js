(() => {
  const q=s=>document.querySelector(s);
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const call=async(u,o={})=>{const r=await fetch(u,o),t=await r.text();let d;try{d=JSON.parse(t)}catch{d=t}if(!r.ok)throw new Error(typeof d==='string'?d:JSON.stringify(d));return d};
  const upload=(u,fd,bar)=>new Promise((ok,no)=>{const x=new XMLHttpRequest();x.open('POST',u);x.upload.onprogress=e=>{if(e.lengthComputable)bar.value=Math.round(e.loaded/e.total*100)};x.onload=()=>{let d;try{d=JSON.parse(x.responseText)}catch{d=x.responseText}x.status<300?ok(d):no(new Error(typeof d==='string'?d:JSON.stringify(d)))};x.onerror=()=>no(new Error('Upload failed'));x.send(fd)});
  const mediaUrl=k=>k?'/media/'+encodeURIComponent(k).replace(/%2F/gi,'/'):'';
  let videos=[];

  function installHeroFocalEditor(){
    const form=q('#heroForm'), preview=q('#heroPreview');
    if(!form||!preview||q('#heroFocalEditor'))return;
    const box=document.createElement('div');
    box.id='heroFocalEditor'; box.className='focalEditor';
    box.innerHTML=`<h4>图片显示位置</h4><p class="helpText">图片仍按 16:9 裁切。拖动滑块移动图片焦点，让产品主体完整显示。</p><div class="focalGrid"><label>水平位置 <span><b id="heroXValue" class="focalValue">50</b>%</span><input id="heroPositionX" name="image_position_x" type="range" min="0" max="100" value="50"></label><label>垂直位置 <span><b id="heroYValue" class="focalValue">50</b>%</span><input id="heroPositionY" name="image_position_y" type="range" min="0" max="100" value="50"></label></div><button id="heroCenterImage" type="button" class="secondary">恢复居中</button>`;
    preview.insertAdjacentElement('afterend',box);
    const x=q('#heroPositionX'),y=q('#heroPositionY');
    const paint=()=>{q('#heroXValue').textContent=x.value;q('#heroYValue').textContent=y.value;const img=preview.querySelector('img');if(img)img.style.objectPosition=`${x.value}% ${y.value}%`};
    x.addEventListener('input',paint);y.addEventListener('input',paint);
    q('#heroCenterImage').onclick=()=>{x.value=50;y.value=50;paint()};
    const oldEdit=window.editHero;
    if(typeof oldEdit==='function')window.editHero=id=>{oldEdit(id);setTimeout(async()=>{try{const all=await call('/api/admin/hero'),h=all.find(v=>Number(v.id)===Number(id));x.value=h?.image_position_x??50;y.value=h?.image_position_y??50;paint()}catch(e){console.error(e)}},0)};
    const observer=new MutationObserver(paint);observer.observe(preview,{childList:true,subtree:true});
    paint();
  }

  function installVideoEditor(){
    const section=q('#videos'); if(!section)return;
    section.innerHTML=`<h2>视频管理 V4.3.2</h2><form id="videoV432Form" class="assetBox videoV432Form"><input name="id" type="hidden"><div class="form"><input name="title" required placeholder="视频标题"><input name="slug" placeholder="URL Slug，可留空"><select name="status"><option value="draft">草稿</option><option value="published">发布</option></select><input name="sort_order" type="number" value="0" placeholder="排序"></div><textarea name="description" placeholder="视频描述"></textarea><h3>视频文件</h3><input name="file" type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime"><p class="helpText">新建必须选择文件，编辑时不选则保留原文件，最大 100 MB。</p><video id="videoV432Preview" controls preload="metadata" class="hide"></video><h3>视频封面</h3><input name="poster" type="file" accept="image/jpeg,image/png,image/webp,image/gif"><label class="removeCheck"><input name="remove_poster" type="checkbox" value="1">移除当前封面</label><img id="videoV432Poster" class="posterPreview hide" alt="视频封面预览"><progress id="videoV432Progress" value="0" max="100"></progress><div id="videoV432Result" class="saveResult"></div><div class="inline"><button type="submit">保存修改</button><button id="videoV432New" type="button" class="secondary">新建</button><button id="videoV432Delete" type="button" class="danger">删除当前视频</button></div></form><h3>现有视频</h3><div id="videoList" class="videoV432List"></div>`;
    const form=q('#videoV432Form'),preview=q('#videoV432Preview'),poster=q('#videoV432Poster'),result=q('#videoV432Result');
    window.loadVideosV432=async()=>{videos=await call('/api/admin/videos');q('#videoList').innerHTML=videos.map(v=>`<div class="row"><b>${safe(v.title)}</b><span>${safe(v.status)}</span><span>${v.file_size?(v.file_size/1048576).toFixed(1)+' MB':''}</span><span class="${v.video_key?'':'missingFile'}">${v.video_key?safe(v.description||''):'R2 文件可能已缺失'}</span><div class="inline"><button type="button" onclick="editVideoV432(${v.id})">编辑</button><button type="button" class="danger" onclick="deleteVideoV432(${v.id})">删除</button></div></div>`).join('')||'<p>暂无视频</p>'};
    window.editVideoV432=id=>{const v=videos.find(x=>Number(x.id)===Number(id));if(!v)return alert('找不到视频记录');form.reset();form.elements.id.value=v.id;form.elements.title.value=v.title||'';form.elements.slug.value=v.slug||'';form.elements.status.value=v.status||'draft';form.elements.sort_order.value=v.sort_order||0;form.elements.description.value=v.description||'';if(v.video_key){preview.src=mediaUrl(v.video_key);preview.classList.remove('hide');preview.load()}else{preview.removeAttribute('src');preview.classList.add('hide')}if(v.poster_key){poster.src=mediaUrl(v.poster_key);poster.classList.remove('hide')}else{poster.removeAttribute('src');poster.classList.add('hide')}result.textContent=`正在编辑视频 ID：${v.id}`;form.scrollIntoView({behavior:'smooth',block:'start'})};
    window.deleteVideoV432=async id=>{const v=videos.find(x=>Number(x.id)===Number(id));if(!v)return;if(!confirm(`确定删除“${v.title}”？将删除 D1 记录并尝试删除 R2 文件。`))return;try{await call(`/api/admin/videos/${id}`,{method:'DELETE'});if(String(form.elements.id.value)===String(id))reset();await window.loadVideosV432();alert('已删除，残留位置已清除')}catch(e){alert('删除失败：'+e.message)}};
    const reset=()=>{form.reset();form.elements.id.value='';form.elements.sort_order.value=0;preview.pause();preview.removeAttribute('src');preview.load();preview.classList.add('hide');poster.removeAttribute('src');poster.classList.add('hide');q('#videoV432Progress').value=0;result.textContent=''};
    q('#videoV432New').onclick=reset;q('#videoV432Delete').onclick=()=>{const id=form.elements.id.value;if(!id)return alert('请先点击列表中的“编辑”');window.deleteVideoV432(id)};
    form.elements.file.onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>100*1048576){e.target.value='';return alert('视频不能超过 100 MB')}preview.src=URL.createObjectURL(f);preview.classList.remove('hide');preview.load()};
    form.elements.poster.onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>5*1048576){e.target.value='';return alert('封面不能超过 5 MB')}poster.src=URL.createObjectURL(f);poster.classList.remove('hide');form.elements.remove_poster.checked=false};
    form.onsubmit=async e=>{e.preventDefault();const id=form.elements.id.value,file=form.elements.file.files[0];if(!id&&!file)return alert('新建视频必须选择文件');result.textContent='保存中...';try{const d=await upload(id?`/api/admin/videos/${id}`:'/api/admin/videos',new FormData(form),q('#videoV432Progress'));if(!id)form.elements.id.value=d.id;result.textContent='保存成功';await window.loadVideosV432();alert('视频已保存')}catch(err){result.textContent='保存失败：'+err.message;alert(err.message)}};
    document.querySelectorAll('[data-tab="videos"]').forEach(b=>b.addEventListener('click',()=>window.loadVideosV432()));
    window.loadVideosV432().catch(e=>{result.textContent=e.message});
  }

  const start=()=>{installHeroFocalEditor();installVideoEditor()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
