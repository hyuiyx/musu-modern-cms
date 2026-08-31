/* SMUSU CMS V5.2.4 stable mobile navigation */
(() => {
  'use strict';
  const isMobile = () => window.matchMedia('(max-width:850px)').matches;
  const hamburger = document.querySelector('.mobileBtn');
  const drops = [...document.querySelectorAll('.navlinks .drop')];

  function setOpen(drop, open) {
    drop.classList.toggle('menuOpenItem', open);
    drop.querySelector(':scope > a')?.setAttribute('aria-expanded', String(open));
  }
  function closeDrops(except = null) {
    drops.forEach(drop => { if (drop !== except) setOpen(drop, false); });
  }

  // Remove the old inline hamburger handler. From now on exactly one handler exists.
  if (hamburger) {
    hamburger.removeAttribute('onclick');
    hamburger.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const open = !document.body.classList.contains('menuOpen');
      document.body.classList.toggle('menuOpen', open);
      hamburger.setAttribute('aria-expanded', String(open));
      if (!open) closeDrops();
    });
  }

  // Keep the original parent anchors in the DOM. On mobile they only expand.
  drops.forEach(drop => {
    const trigger = drop.querySelector(':scope > a');
    const menu = drop.querySelector(':scope > .dropmenu');
    if (!trigger || !menu) return;
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', event => {
      if (!isMobile()) return;
      event.preventDefault();
      event.stopPropagation();
      const open = !drop.classList.contains('menuOpenItem');
      closeDrops(drop);
      setOpen(drop, open);
    });

    let timer = 0;
    drop.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      clearTimeout(timer);
      closeDrops(drop);
      setOpen(drop, true);
    });
    drop.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      clearTimeout(timer);
      timer = window.setTimeout(() => setOpen(drop, false), 900);
    });

    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      closeDrops();
      document.body.classList.remove('menuOpen');
    }));
  });

  document.addEventListener('click', event => {
    if (event.target.closest('.navbar')) return;
    closeDrops();
    if (isMobile()) document.body.classList.remove('menuOpen');
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
    const start = () => { clearInterval(timer); timer = setInterval(() => show(index + 1), window.HERO_INTERVAL || 5000); };
    document.querySelector('.heroNext')?.addEventListener('click', () => { show(index + 1); start(); });
    document.querySelector('.heroPrev')?.addEventListener('click', () => { show(index - 1); start(); });
    dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.i)); start(); }));
    start();
  }
})();
