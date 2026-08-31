/* SMUSU CMS V5.1.7 - complete replacement for public/site.js */
(() => {
  'use strict';

  const MOBILE_QUERY = '(max-width: 850px)';
  const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;
  const dropdowns = [...document.querySelectorAll('.drop')];
  let desktopCloseTimer = 0;

  function setExpanded(drop, expanded) {
    if (!drop) return;
    drop.classList.toggle('menuOpenItem', expanded);
    const trigger = drop.querySelector(':scope > a');
    if (trigger) trigger.setAttribute('aria-expanded', String(expanded));
  }

  function closeAll(except = null) {
    dropdowns.forEach(drop => {
      if (drop !== except) setExpanded(drop, false);
    });
  }

  dropdowns.forEach(drop => {
    const trigger = drop.querySelector(':scope > a');
    const menu = drop.querySelector(':scope > .dropmenu');
    if (!trigger || !menu) return;

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    // Desktop: keep the panel open while the pointer moves from title to options.
    drop.addEventListener('pointerenter', () => {
      if (isMobile()) return;
      clearTimeout(desktopCloseTimer);
      closeAll(drop);
      setExpanded(drop, true);
    });

    drop.addEventListener('pointerleave', () => {
      if (isMobile()) return;
      clearTimeout(desktopCloseTimer);
      desktopCloseTimer = window.setTimeout(() => setExpanded(drop, false), 900);
    });

    // Mobile: pointerdown capture runs before any legacy click handler.
    trigger.addEventListener('pointerdown', event => {
      if (!isMobile()) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const shouldOpen = !drop.classList.contains('menuOpenItem');
      closeAll(drop);
      setExpanded(drop, shouldOpen);
    }, true);

    // Suppress the synthetic click generated after touch/pointerdown.
    trigger.addEventListener('click', event => {
      if (!isMobile()) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }, true);

    menu.addEventListener('pointerdown', event => {
      event.stopPropagation();
    }, true);

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setExpanded(drop, false);
        document.body.classList.remove('menuOpen');
      });
    });
  });

  // Close only when the visitor taps completely outside the navigation dropdown.
  document.addEventListener('pointerdown', event => {
    if (isMobile() && !event.target.closest('.drop')) closeAll();
  });

  // Reset stale state when changing between desktop and mobile.
  window.matchMedia(MOBILE_QUERY).addEventListener?.('change', () => closeAll());

  // Mobile hamburger.
  const mobileButton = document.querySelector('.mobileBtn');
  if (mobileButton) {
    mobileButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      document.body.classList.toggle('menuOpen');
      if (!document.body.classList.contains('menuOpen')) closeAll();
    });
  }

  // Hero slider.
  const slides = [...document.querySelectorAll('.heroSlide')];
  const dots = [...document.querySelectorAll('.heroDots button')];
  if (slides.length > 1) {
    let index = 0;
    let timer = 0;
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
    document.querySelector('.heroSlider')?.addEventListener('pointerenter', () => clearInterval(timer));
    document.querySelector('.heroSlider')?.addEventListener('pointerleave', start);
    start();
  }
})();
