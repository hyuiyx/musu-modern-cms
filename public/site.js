/* SMUSU CMS V5.2.0 - mobile submenu selection fix */
(() => {
  'use strict';

  const MOBILE_WIDTH = 850;
  const isMobile = () => window.innerWidth <= MOBILE_WIDTH;
  const drops = [...document.querySelectorAll('.navlinks .drop')];

  function setOpen(drop, open) {
    drop.classList.toggle('menuOpenItem', open);
    drop.querySelector('.dropTrigger')?.setAttribute('aria-expanded', String(open));
  }

  function closeAll(except = null) {
    drops.forEach(drop => {
      if (drop !== except) setOpen(drop, false);
    });
  }

  // Convert Products / News / Contact parent links into real buttons.
  // A button can only open the submenu, so it can never navigate to the first item.
  drops.forEach(drop => {
    const oldTrigger = drop.querySelector(':scope > a');
    const menu = drop.querySelector(':scope > .dropmenu');
    if (!oldTrigger || !menu) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dropTrigger';
    button.innerHTML = oldTrigger.innerHTML.replace(/[▾▼]\s*$/, '').trim();
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', `${button.textContent.trim()} menu`);
    oldTrigger.replaceWith(button);

    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const open = !drop.classList.contains('menuOpenItem');
      closeAll(drop);
      setOpen(drop, open);
    });

    let closeTimer = 0;
    drop.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      clearTimeout(closeTimer);
      closeAll(drop);
      setOpen(drop, true);
    });
    drop.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => setOpen(drop, false), 900);
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', event => {
        // Do not prevent default. The selected submenu URL opens normally.
        event.stopPropagation();
        closeAll();
        document.body.classList.remove('menuOpen');
      });
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.drop')) closeAll();
  });

  window.addEventListener('resize', closeAll);

  // Keep the existing inline hamburger onclick as the only hamburger handler.

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
    document.querySelector('.heroSlider')?.addEventListener('mouseenter', () => clearInterval(timer));
    document.querySelector('.heroSlider')?.addEventListener('mouseleave', start);
    start();
  }
})();
