(()=>{
  const slides=[...document.querySelectorAll('.heroSlide')];
  const dots=[...document.querySelectorAll('.heroDots button')];
  if(slides.length>1){
    let i=0,t;
    const show=n=>{i=(n+slides.length)%slides.length;slides.forEach((x,j)=>x.classList.toggle('on',j===i));dots.forEach((x,j)=>x.classList.toggle('on',j===i))};
    const start=()=>{clearInterval(t);t=setInterval(()=>show(i+1),window.HERO_INTERVAL||5000)};
    document.querySelector('.heroNext')?.addEventListener('click',()=>{show(i+1);start()});
    document.querySelector('.heroPrev')?.addEventListener('click',()=>{show(i-1);start()});
    dots.forEach(x=>x.addEventListener('click',()=>{show(+x.dataset.i);start()}));
    document.querySelector('.heroSlider')?.addEventListener('mouseenter',()=>clearInterval(t));
    document.querySelector('.heroSlider')?.addEventListener('mouseleave',start);
    start();
  }

  document.querySelectorAll('.drop').forEach(drop=>{
    const trigger=drop.querySelector(':scope > a');
    if(!trigger)return;
    trigger.setAttribute('aria-haspopup','true');
    trigger.setAttribute('aria-expanded','false');
    trigger.addEventListener('click',e=>{
      if(window.matchMedia('(max-width:850px)').matches){
        e.preventDefault();
        const open=!drop.classList.contains('menuOpenItem');
        document.querySelectorAll('.drop.menuOpenItem').forEach(x=>{x.classList.remove('menuOpenItem');x.querySelector(':scope > a')?.setAttribute('aria-expanded','false')});
        drop.classList.toggle('menuOpenItem',open);
        trigger.setAttribute('aria-expanded',String(open));
      }
    });
  });

  document.addEventListener('click',e=>{
    if(!e.target.closest('.drop'))document.querySelectorAll('.drop.menuOpenItem').forEach(x=>{x.classList.remove('menuOpenItem');x.querySelector(':scope > a')?.setAttribute('aria-expanded','false')});
  });

  document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>{
    if(!a.closest('.drop')||a.closest('.dropmenu'))document.body.classList.remove('menuOpen');
  }));
})();
