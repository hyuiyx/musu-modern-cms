/* SMUSU CMS V5.2.5 - inquiry admin final override */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const safe = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let items = [], page = 1, pages = 1, status = '';

  async function api(url) {
    const r = await fetch(url, {cache:'no-store'}), text = await r.text();
    let data; try { data = JSON.parse(text); } catch { data = text; }
    if (!r.ok) throw new Error(typeof data === 'string' ? data : (data.error || JSON.stringify(data)));
    return data;
  }
  const date = value => {
    if (!value) return '-'; const d = new Date(value);
    return Number.isNaN(d.getTime()) ? safe(value) : d.toLocaleString('zh-CN',{hour12:false});
  };
  const statusName = value => ({new:'新询盘',contacted:'已联系',following:'跟进中',quoted:'已报价',completed:'已完成',invalid:'无效'})[value] || value || '新询盘';

  function build() {
    const section = $('#inquiries');
    if (!section) return false;
    section.innerHTML = `<div class="inqTitle"><div><h1>留言 / 询盘</h1><p>每条留言只显示两行，点击“详情”查看完整内容。</p></div><div class="inqTools"><select id="inqStatus"><option value="">全部状态</option><option value="new">新询盘</option><option value="contacted">已联系</option><option value="following">跟进中</option><option value="quoted">已报价</option><option value="completed">已完成</option><option value="invalid">无效</option></select><button id="inqRefresh" type="button" class="secondary">刷新</button></div></div><div class="inqBox"><div class="inqGrid inqHead"><b>联系人</b><b>联系方式</b><b>状态</b><b>留言预览</b><b>时间</b><b>操作</b></div><div id="inqRows"></div></div><div id="inqPager" class="inqPager"></div>`;
    $('#inqStatus').value = status;
    $('#inqStatus').onchange = e => { status=e.target.value; load(1); };
    $('#inqRefresh').onclick = () => load(page);
    return true;
  }

  function render() {
    const host = $('#inqRows'); if (!host) return;
    host.innerHTML = items.length ? items.map(x => `<article class="inqGrid inqRow"><div class="inqPerson"><strong>${safe(x.name || '未填写')}</strong><small>${safe(x.company || '')}</small></div><div class="inqContact"><span>${safe(x.email || '-')}</span><small>${safe(x.phone || x.country || '')}</small></div><div><span class="inqBadge inq-${safe(x.status || 'new')}">${safe(statusName(x.status))}</span></div><div class="inqMessage">${safe(x.message || '')}</div><time>${date(x.created_at)}</time><div><button type="button" class="inqDetail" data-id="${Number(x.id)}">详情</button></div></article>`).join('') : '<div class="inqEmpty">暂无留言或询盘</div>';
    host.querySelectorAll('[data-id]').forEach(b => b.onclick = () => detail(Number(b.dataset.id)));
    const pager = $('#inqPager');
    pager.innerHTML = `<button type="button" data-p="${page-1}" ${page<=1?'disabled':''}>上一页</button><span>第 ${page} / ${pages} 页</span><button type="button" data-p="${page+1}" ${page>=pages?'disabled':''}>下一页</button>`;
    pager.querySelectorAll('[data-p]').forEach(b => b.onclick = () => load(Number(b.dataset.p)));
  }

  async function load(next=1) {
    if (!$('#inqRows')) build();
    $('#inqRows').innerHTML = '<div class="inqEmpty">正在加载...</div>';
    try {
      const q = new URLSearchParams({page:String(Math.max(1,next)),_t:String(Date.now())}); if(status) q.set('status',status);
      const data = await api('/api/admin/inquiries?'+q);
      items = Array.isArray(data.items)?data.items:[]; page=Number(data.page)||1; pages=Math.max(1,Number(data.pages)||1); render();
    } catch(e) { $('#inqRows').innerHTML = `<div class="inqEmpty inqError">读取失败：${safe(e.message)}</div>`; }
  }

  function detail(id) {
    const x=items.find(v=>Number(v.id)===id); if(!x)return;
    const dialog=$('#detail'), body=$('#detailBody');
    if(!dialog||!body)return alert(x.message||'');
    body.innerHTML=`<div class="inqDetailView"><h2>询盘详情 #${Number(x.id)}</h2><dl><dt>联系人</dt><dd>${safe(x.name||'-')}</dd><dt>Email</dt><dd>${safe(x.email||'-')}</dd><dt>公司</dt><dd>${safe(x.company||'-')}</dd><dt>国家/地区</dt><dd>${safe(x.country||'-')}</dd><dt>电话</dt><dd>${safe(x.phone||'-')}</dd><dt>状态</dt><dd>${safe(statusName(x.status))}</dd><dt>提交时间</dt><dd>${date(x.created_at)}</dd></dl><h3>完整留言</h3><div class="inqFull">${safe(x.message||'').replace(/\n/g,'<br>')}</div></div>`;
    dialog.showModal ? dialog.showModal() : dialog.setAttribute('open','');
  }

  // Capture phase blocks the old V4/V5 inquiry tab onclick before it can render the old layout.
  document.addEventListener('click', event => {
    const tab=event.target.closest('[data-tab="inquiries"]'); if(!tab)return;
    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
    document.querySelectorAll('.tab').forEach(x=>x.classList.add('hide'));
    $('#inquiries')?.classList.remove('hide');
    build(); load(1);
  }, true);

  window.loadInquiryV525=load;
})();
