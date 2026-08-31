/* SMUSU CMS V5.2.4 - inquiry list enhancement */
(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  let inquiries = [];
  let currentPage = 1;
  let totalPages = 1;
  let currentStatus = '';

  async function request(url, options = {}) {
    const response = await fetch(url, options);
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) throw new Error(typeof data === 'string' ? data : (data.error || JSON.stringify(data)));
    return data;
  }

  function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return safe(value);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  }

  function statusText(status) {
    return ({ new: '新询盘', contacted: '已联系', following: '跟进中', quoted: '已报价', completed: '已完成', invalid: '无效' })[status] || status || '新询盘';
  }

  function ensureLayout() {
    const section = $('#inquiries');
    if (!section || $('#inquiryToolbar')) return;
    section.innerHTML = `
      <div class="inquiryHeading">
        <div><h1>留言 / 询盘</h1><p>列表最多显示两行内容，点击“详情”查看完整留言。</p></div>
      </div>
      <div id="inquiryToolbar" class="inquiryToolbar">
        <label>状态筛选
          <select id="inquiryStatusFilter">
            <option value="">全部状态</option>
            <option value="new">新询盘</option>
            <option value="contacted">已联系</option>
            <option value="following">跟进中</option>
            <option value="quoted">已报价</option>
            <option value="completed">已完成</option>
            <option value="invalid">无效</option>
          </select>
        </label>
        <button id="inquiryRefresh" type="button" class="secondary">刷新</button>
      </div>
      <div class="inquiryTableWrap">
        <div class="inquiryTable inquiryHeader" aria-hidden="true">
          <b>联系人</b><b>联系方式</b><b>状态</b><b>留言预览</b><b>提交时间</b><b>操作</b>
        </div>
        <div id="inquiryList"></div>
      </div>
      <div id="pager" class="inquiryPager"></div>`;

    $('#inquiryStatusFilter').addEventListener('change', event => {
      currentStatus = event.target.value;
      loadInquiryAdmin(1);
    });
    $('#inquiryRefresh').addEventListener('click', () => loadInquiryAdmin(currentPage));
  }

  function renderList() {
    const list = $('#inquiryList');
    if (!list) return;
    if (!inquiries.length) {
      list.innerHTML = '<div class="inquiryEmpty">暂无留言或询盘</div>';
      return;
    }
    list.innerHTML = inquiries.map(item => `
      <article class="inquiryTable inquiryRow">
        <div class="inquiryPerson"><b>${safe(item.name || '未填写')}</b><small>${safe(item.company || '')}</small></div>
        <div class="inquiryContact"><span>${safe(item.email || '-')}</span><small>${safe(item.phone || item.country || '')}</small></div>
        <div><span class="inquiryBadge inquiryBadge-${safe(item.status || 'new')}">${safe(statusText(item.status))}</span></div>
        <div class="inquiryPreview" title="点击详情查看完整内容">${safe(item.message || '')}</div>
        <time>${formatDate(item.created_at)}</time>
        <div><button type="button" class="inquiryDetailBtn" data-inquiry-id="${Number(item.id)}">详情</button></div>
      </article>`).join('');

    list.querySelectorAll('[data-inquiry-id]').forEach(button => {
      button.addEventListener('click', () => showInquiryDetail(Number(button.dataset.inquiryId)));
    });
  }

  function renderPager() {
    const pager = $('#pager');
    if (!pager) return;
    pager.innerHTML = `
      <button type="button" data-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''}>上一页</button>
      <span>第 ${currentPage} / ${totalPages} 页</span>
      <button type="button" data-page="${currentPage + 1}" ${currentPage >= totalPages ? 'disabled' : ''}>下一页</button>`;
    pager.querySelectorAll('[data-page]').forEach(button => {
      button.addEventListener('click', () => loadInquiryAdmin(Number(button.dataset.page)));
    });
  }

  async function loadInquiryAdmin(page = 1) {
    ensureLayout();
    const list = $('#inquiryList');
    if (list) list.innerHTML = '<div class="inquiryLoading">正在加载...</div>';
    try {
      const query = new URLSearchParams({ page: String(Math.max(1, page)) });
      if (currentStatus) query.set('status', currentStatus);
      const data = await request('/api/admin/inquiries?' + query.toString());
      inquiries = Array.isArray(data.items) ? data.items : [];
      currentPage = Number(data.page) || 1;
      totalPages = Math.max(1, Number(data.pages) || 1);
      renderList();
      renderPager();
    } catch (error) {
      if (list) list.innerHTML = `<div class="inquiryError">读取失败：${safe(error.message)}</div>`;
    }
  }

  function showInquiryDetail(id) {
    const item = inquiries.find(record => Number(record.id) === Number(id));
    if (!item) return;
    const dialog = $('#detail');
    const body = $('#detailBody');
    if (!dialog || !body) return alert(item.message || '');
    body.innerHTML = `
      <div class="inquiryDetail">
        <h2>询盘详情 #${Number(item.id)}</h2>
        <dl>
          <dt>联系人</dt><dd>${safe(item.name || '-')}</dd>
          <dt>Email</dt><dd>${safe(item.email || '-')}</dd>
          <dt>公司</dt><dd>${safe(item.company || '-')}</dd>
          <dt>国家/地区</dt><dd>${safe(item.country || '-')}</dd>
          <dt>电话</dt><dd>${safe(item.phone || '-')}</dd>
          <dt>状态</dt><dd>${safe(statusText(item.status))}</dd>
          <dt>提交时间</dt><dd>${formatDate(item.created_at)}</dd>
        </dl>
        <h3>完整留言</h3>
        <div class="inquiryFullMessage">${safe(item.message || '').replace(/\n/g, '<br>')}</div>
      </div>`;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  window.loadInquiryAdmin = loadInquiryAdmin;
  window.showInquiryDetail = showInquiryDetail;

  document.addEventListener('DOMContentLoaded', () => {
    const tab = document.querySelector('[data-tab="inquiries"]');
    if (!tab) return;
    tab.addEventListener('click', () => {
      window.setTimeout(() => loadInquiryAdmin(1), 0);
    });
  });
})();
