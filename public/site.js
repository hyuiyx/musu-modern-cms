/* SMUSU CMS V5.2.3 - mobile navigation recovery */
(() => {
  'use strict';
  const mobile = () => window.matchMedia('(max-width: 850px)').matches;
  const nav = document.querySelector('.navlinks');
  const hamburger = document.querySelector('.mobileBtn');
  const drops = [...document.querySelectorAll('.navlinks .drop')];

  const setOpen = (drop, open) => {
    drop.classList.toggle('menuOpenItem', open);
    const trigger = drop.querySelector(':scope > .dropTrigger, :scope > a');
    trigger?.setAttribute('aria-expanded', String(open));
  };
  const closeAll = except => drops.forEach(drop => { if (drop !== except) setOpen(drop, false); });

  // Remove the old inline handler so the hamburger is controlled only once.
  if (hamburger) {
    hamburger.removeAttribute('onclick');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const open = !document.body.classList.contains('menuOpen');
      document.body.classList.toggle('menuOpen', open);
      hamburger.setAttribute('aria-expanded', String(open));
      if (!open) closeAll();
    });
  }

  drops.forEach(drop => {
    const oldTrigger = drop.querySelector(':scope > .dropTrigger, :scope > a');
    const menu = drop.querySelector(':scope > .dropmenu');
    if (!oldTrigger || !menu) return;

    let trigger = oldTrigger;
    if (oldTrigger.tagName === 'A') {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'dropTrigger';
      trigger.textContent = oldTrigger.textContent.replace(/[▾▼]/g, '').trim();
      oldTrigger.replaceWith(trigger);
    }
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const open = !drop.classList.contains('menuOpenItem');
      closeAll(drop);
      setOpen(drop, open);
    });

    let timer = 0;
    drop.addEventListener('mouseenter', () => {
      if (mobile()) return;
      clearTimeout(timer);
      closeAll(drop);
      setOpen(drop, true);
    });
    drop.addEventListener('mouseleave', () => {
      if (mobile()) return;
      clearTimeout(timer);
      timer = window.setTimeout(() => setOpen(drop, false), 900);
    });

    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
      event.stopPropagation();
      closeAll();
      document.body.classList.remove('menuOpen');
      hamburger?.setAttribute('aria-expanded', 'false');
    }));
  });

  document.addEventListener('click', event => {
    if (event.target.closest('.navbar')) return;
    closeAll();
    if (mobile()) {
      document.body.classList.remove('menuOpen');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('resize', () => {
    closeAll();
    if (!mobile()) document.body.classList.remove('menuOpen');
  });

  const slides = [...document.querySelectorAll('.heroSlide')];
  const dots = [...document.querySelectorAll('.heroDots button')];
  if (slides.length > 1) {
    let index = 0, timer = 0;
    const show = next => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('on', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('on', i === index));
    };
    const start = () => {
      clearInterval(timer);
      timer = window.setInterval(() => show(index + 1), window.HERO_INTERVAL || 5000);
    };
    document.querySelector('.heroNext')?.addEventListener('click', () => { show(index + 1); start(); });
    document.querySelector('.heroPrev')?.addEventListener('click', () => { show(index - 1); start(); });
    dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.i)); start(); }));
    start();
  }
})();
