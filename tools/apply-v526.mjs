import fs from 'node:fs';

const jsPath = 'public/admin.js';
const cssPath = 'public/admin.css';
const htmlPath = 'public/admin.html';

let js = fs.readFileSync(jsPath, 'utf8');
const start = js.indexOf('async function loadInq(');
const end = js.indexOf('async function loadSettings(', start);
if (start < 0 || end < 0) {
  throw new Error('Cannot find loadInq/loadSettings in public/admin.js');
}

const inquiryCode = String.raw`
async function loadInq(page=1){
  const section=document.querySelector('#inquiries');
  if(!section)return;
  section.innerHTML='<div class="inqTitle"><div><h1>留言 / 询盘</h1><p>每条留言最多显示两行，点击详情查看完整内容。</p></div><div class="inqTools"><select id="inqStatus"><option value="">全部状态</option><option value="new">新询盘</option><option value="contacted">已联系</option><option value="following">跟进中</option><option value="quoted">已报价</option><option value="completed">已完成</option><option value="invalid">无效</option></select><button id="inqRefresh" type="button">刷新</button></div></div><div class="inqBox"><div class="inqGrid inqHead"><b>联系人</b><b>联系方式</b><b>状态</b><b>留言预览</b><b>时间</b><b>操作</b></div><div id="inquiryList"><div class="inqEmpty">正在加载...</div></div></div><div id="pager" class="inqPager"></div>';
  const filter=document.querySelector('#inqStatus');
  filter.value=window.INQ_STATUS||'';
  filter.onchange=()=>{window.INQ_STATUS=filter.value;loadInq(1)};
  document.querySelector('#inqRefresh').onclick=()=>loadInq(page);
  const query=new URLSearchParams({page:String(page),_t:String(Date.now())});
  if(window.INQ_STATUS)query.set('status',window.INQ_STATUS);
  try{
    const d=await call('/api/admin/inquiries?'+query.toString());
    INQ=Array.isArray(d.items)?d.items:[];
    const statusName=v=>({new:'新询盘',contacted:'已联系',following:'跟进中',quoted:'已报价',completed:'已完成',invalid:'无效'}[v]||v||'新询盘');
    const formatDate=v=>{if(!v)return '-';const x=new Date(v);return Number.isNaN(x.getTime())?safe(v):x.toLocaleString('zh-CN',{hour12:false})};
    document.querySelector('#inquiryList').innerHTML=INQ.length?INQ.map(x=>'<article class="inqGrid inqRow"><div class="inqPerson"><strong>'+safe(x.name||'未填写')+'</strong><small>'+safe(x.company||'')+'</small></div><div class="inqContact"><span>'+safe(x.email||'-')+'</span><small>'+safe(x.phone||x.country||'')+'</small></div><div><span class="inqBadge inq-'+safe(x.status||'new')+'">'+safe(statusName(x.status))+'</span></div><div class="inqMessage">'+safe(x.message||'')+'</div><time>'+formatDate(x.created_at)+'</time><div><button type="button" class="inqDetail" onclick="showInq('+Number(x.id)+')">详情</button></div></article>').join(''):'<div class="inqEmpty">暂无留言或询盘</div>';
    const pages=Math.max(1,Number(d.pages)||1),current=Math.max(1,Number(d.page)||page);
    document.querySelector('#pager').innerHTML='<button type="button" '+(current<=1?'disabled':'')+' onclick="loadInq('+(current-1)+')">上一页</button><span>第 '+current+' / '+pages+' 页</span><button type="button" '+(current>=pages?'disabled':'')+' onclick="loadInq('+(current+1)+')">下一页</button>';
  }catch(e){document.querySelector('#inquiryList').innerHTML='<div class="inqEmpty inqError">读取失败：'+safe(e.message)+'</div>'}
}
window.loadInq=loadInq;
window.showInq=id=>{
  const x=INQ.find(v=>Number(v.id)===Number(id));if(!x)return;
  const statusName=v=>({new:'新询盘',contacted:'已联系',following:'跟进中',quoted:'已报价',completed:'已完成',invalid:'无效'}[v]||v||'新询盘');
  document.querySelector('#detailBody').innerHTML='<div class="inqDetailView"><h2>询盘详情 #'+Number(x.id)+'</h2><dl><dt>联系人</dt><dd>'+safe(x.name||'-')+'</dd><dt>Email</dt><dd>'+safe(x.email||'-')+'</dd><dt>公司</dt><dd>'+safe(x.company||'-')+'</dd><dt>国家/地区</dt><dd>'+safe(x.country||'-')+'</dd><dt>电话</dt><dd>'+safe(x.phone||'-')+'</dd><dt>状态</dt><dd>'+safe(statusName(x.status))+'</dd><dt>提交时间</dt><dd>'+safe(x.created_at||'-')+'</dd></dl><h3>完整留言</h3><div class="inqFull">'+safe(x.message||'').replace(/\n/g,'<br>')+'</div></div>';
  document.querySelector('#detail').showModal();
};
`;

js = js.slice(0, start) + inquiryCode + '\n' + js.slice(end);
fs.writeFileSync(jsPath, js);

let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/\/\* V5\.2\.6 inquiry integrated start \*\/[\s\S]*?\/\* V5\.2\.6 inquiry integrated end \*\//g, '');
css += String.raw`
/* V5.2.6 inquiry integrated start */
.inqTitle{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:20px}.inqTitle h1{margin:0 0 6px}.inqTitle p{margin:0;color:#667085}.inqTools{display:flex;gap:10px;align-items:center}.inqTools select{min-width:150px;background:#fff}.inqBox{border:1px solid #e4e7ec;border-radius:14px;overflow:hidden;background:#fff}.inqGrid{display:grid;grid-template-columns:minmax(110px,.85fr) minmax(180px,1.2fr) 100px minmax(280px,2.2fr) 145px 72px;gap:14px;align-items:center}.inqHead{padding:12px 16px;background:#f8fafc;border-bottom:1px solid #e4e7ec;color:#475467;font-size:13px}.inqRow{height:88px;min-height:88px;padding:12px 16px;border-bottom:1px solid #edf0f3;overflow:hidden}.inqRow:last-child{border-bottom:0}.inqPerson,.inqContact{min-width:0;display:flex;flex-direction:column;gap:3px}.inqPerson strong,.inqContact span,.inqPerson small,.inqContact small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.inqPerson small,.inqContact small,.inqRow time{color:#667085;font-size:12px}.inqMessage{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;line-clamp:2!important;overflow:hidden!important;line-height:1.5!important;height:3em!important;max-height:3em!important;white-space:normal!important;word-break:break-word!important}.inqBadge{display:inline-flex;padding:5px 9px;border-radius:999px;font-size:12px;font-weight:800;white-space:nowrap;background:#fff4ed;color:#c4320a}.inq-contacted{background:#eff8ff;color:#175cd3}.inq-following{background:#f4f3ff;color:#5925dc}.inq-quoted,.inq-completed{background:#ecfdf3;color:#067647}.inq-invalid{background:#fef3f2;color:#b42318}.inqDetail{padding:8px 11px!important;background:#0b6bcb!important;white-space:nowrap}.inqPager{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:18px}.inqPager button:disabled{opacity:.45}.inqEmpty{padding:34px;text-align:center;color:#667085}.inqError{color:#b42318}.inqDetailView dl{display:grid;grid-template-columns:110px 1fr;gap:10px 14px}.inqDetailView dt{font-weight:800;color:#475467}.inqDetailView dd{margin:0;word-break:break-word}.inqFull{padding:16px;background:#f8fafc;border:1px solid #e4e7ec;border-radius:10px;line-height:1.75;word-break:break-word}@media(max-width:1100px){.inqGrid{grid-template-columns:minmax(100px,.8fr) minmax(165px,1fr) 95px minmax(220px,1.7fr) 70px}.inqHead>*:nth-child(5),.inqRow>time{display:none}}@media(max-width:760px){.inqTitle{align-items:stretch;flex-direction:column}.inqTools{flex-wrap:wrap}.inqBox{border:0;overflow:visible}.inqHead{display:none}.inqGrid.inqRow{grid-template-columns:minmax(0,1fr) auto;height:132px;min-height:132px;margin-bottom:12px;padding:14px;border:1px solid #e4e7ec;border-radius:12px;gap:8px 12px}.inqPerson,.inqContact{grid-column:1}.inqRow>div:nth-child(3){grid-column:2;grid-row:1}.inqMessage{grid-column:1/-1;height:3em!important}.inqRow>time{display:none}.inqRow>div:last-child{grid-column:2;grid-row:2/-1;align-self:end}.inqDetailView dl{grid-template-columns:1fr}}
/* V5.2.6 inquiry integrated end */
`;
fs.writeFileSync(cssPath, css);

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/<link[^>]+admin-inquiries\.css[^>]*>\s*/g, '').replace(/<script[^>]+admin-inquiries\.js[^>]*><\/script>\s*/g, '');
fs.writeFileSync(htmlPath, html);
console.log('V5.2.6 inquiry UI integrated directly into admin.js/admin.css');
