/* SMUSU CMS V5.1.9 - complete replacement, one menu handler only */
(() => {
  'use strict';
  const MOBILE_WIDTH = 850;
  const mobile = () => window.innerWidth <= MOBILE_WIDTH;
  const drops = () => [...document.querySelectorAll('.navlinks .drop')];

  function setOpen(drop, open) {
    if (!drop) return;
    drop.classList.toggle('menuOpenItem', open);
    drop.querySelector(':scope > a')?.setAttribute('aria-expanded', String(open));
  }

  function closeAll(except = null) {
    drops().forEach(drop => { if (drop !== except) setOpen(drop, false); });
  }

  // Use exactly one delegated click handler for all mobile dropdowns.
  document.addEventListener('click', event => {
    if (!mobile()) return;
    const trigger = event.target.closest('.navlinks .drop > a');
    if (trigger) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const drop = trigger.parentElement;
      const open = !drop.classList.contains('menuOpenItem');
      closeAll(drop);
      setOpen(drop, open);
      return;
    }
    if (event.target.closest('.navlinks .dropmenu a')) {
      closeAll();
      document.body.classList.remove('menuOpen');
      return;
    }
    if (!event.target.closest('.navlinks .drop')) closeAll();
  }, true);

  // The HTML already toggles body.menuOpen from the hamburger inline onclick.
  // Do not bind a second hamburger click handler.

  drops().forEach(drop => {
    let timer = 0;
    const trigger = drop.querySelector(':scope > a');
    trigger?.setAttribute('aria-haspopup', 'true');
    trigger?.setAttribute('aria-expanded', 'false');
    drop.addEventListener('mouseenter', () => {
      if (mobile()) return;
      clearTimeout(timer);
      closeAll(drop);
      setOpen(drop, true);
    });
    drop.addEventListener('mouseleave', () => {
      if (mobile()) return;
      clearTimeout(timer);
      timer = setTimeout(() => setOpen(drop, false), 900);
    });
  });

  window.addEventListener('resize', () => closeAll());

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
      timer = setInterval(() => show(index + 1), window.HERO_INTERVAL || 5000);
    };
    document.querySelector('.heroNext')?.addEventListener('click', () => { show(index + 1); start(); });
    document.querySelector('.heroPrev')?.addEventListener('click', () => { show(index - 1); start(); });
    dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.i)); start(); }));
    document.querySelector('.heroSlider')?.addEventListener('mouseenter', () => clearInterval(timer));
    document.querySelector('.heroSlider')?.addEventListener('mouseleave', start);
    start();
  }
})();
