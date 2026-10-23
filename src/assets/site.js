// PAME ERAS · shared interactions (menu, reveals, counters, gallery, forms).
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  window.PAME_ARROW = arrow;

  // header and footer are written into each page by the Eleventy layout
  const head = document.querySelector('.site-head');

  const menuBtn = head.querySelector('.menu-btn');
  menuBtn.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) menuBtn.click(); });
  const onScroll = () => head.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, {passive: true}); onScroll();

  // ---------- hero trace (any element with .hero-trace-slot) ----------
  document.querySelectorAll('[data-trace]').forEach(el => {
    el.insertAdjacentHTML('beforeend', '<svg class="hero-trace" viewBox="0 0 1200 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0,74 H240 L258,38 L274,100 L290,74 H600 L618,28 L634,104 L650,74 H930 L948,44 L962,98 L976,74 H1200"/></svg>');
  });

  // ---------- reveal on scroll ----------
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), {threshold: .12, rootMargin: '0px 0px -40px 0px'});
  window.PAME_observe = root => (root || document).querySelectorAll('.reveal:not(.in),.stagger:not(.in),[data-in]:not(.in)').forEach(el => io.observe(el));
  PAME_observe();

  // ---------- count-up ----------
  const countUp = el => {
    const end = +el.dataset.count, from = el.dataset.from ? +el.dataset.from : 0;
    if (reduce) { el.textContent = end + (el.dataset.suffix || ''); return; }
    const t0 = performance.now(), dur = 1300;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), v = Math.round(from + (end - from) * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + (el.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }), {threshold: .6});
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  // ---------- lightbox ----------
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo gallery');
  lb.innerHTML = `<div class="lb-top"><div><b></b><br><span></span></div><button class="lb-x" aria-label="Close gallery">✕</button></div>
    <div class="lb-stage"><button class="lb-nav" data-d="-1" aria-label="Previous photo">‹</button><img alt=""><button class="lb-nav" data-d="1" aria-label="Next photo">›</button></div>
    <div class="lb-thumbs"></div>`;
  document.body.append(lb);
  let lbList = [], lbI = 0, lbReturn = null;
  const lbShow = i => {
    lbI = (i + lbList.length) % lbList.length;
    const img = lb.querySelector('.lb-stage img');
    img.src = lbList[lbI]; img.style.animation = 'none'; img.offsetWidth; img.style.animation = '';
    img.alt = `${lb.querySelector('.lb-top b').textContent}, photo ${lbI + 1}`;
    lb.querySelector('.lb-top span').textContent = `Photo ${lbI + 1} of ${lbList.length}`;
    lb.querySelectorAll('.lb-thumbs button').forEach((b, j) => b.setAttribute('aria-current', j === lbI));
    lb.querySelectorAll('.lb-thumbs button')[lbI]?.scrollIntoView({block: 'nearest', inline: 'center'});
  };
  window.PAME_gallery = (title, photos, start = 0) => {
    lbReturn = document.activeElement; lbList = photos;
    lb.querySelector('.lb-top b').textContent = title;
    lb.querySelector('.lb-thumbs').innerHTML = photos.map((p, j) => `<button aria-label="Photo ${j + 1}"><img src="${p}" alt="" loading="lazy"></button>`).join('');
    lb.querySelectorAll('.lb-thumbs button').forEach((b, j) => b.addEventListener('click', () => lbShow(j)));
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
    lbShow(start); lb.querySelector('.lb-x').focus();
  };
  const lbClose = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lbReturn?.focus(); };
  lb.querySelector('.lb-x').addEventListener('click', lbClose);
  lb.querySelectorAll('.lb-nav').forEach(b => b.addEventListener('click', () => lbShow(lbI + +b.dataset.d)));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) lbClose(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowRight') lbShow(lbI + 1);
    if (e.key === 'ArrowLeft') lbShow(lbI - 1);
  });
  window.PAME_label = e => e.title.includes(e.year) || e.title.includes(e.city) ? e.title : `${e.title} · ${e.city} ${e.year}`;
  window.PAME_photos = ev => Array.from({length: ev.photos}, (_, i) => `img/events/${ev.id}/${i + 1}.jpg`);

  // ---------- forms (prototype: validate, then show the thank-you state) ----------
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.noValidate = true;
    form.addEventListener('submit', e => {
      e.preventDefault();
      let first = null;
      form.querySelectorAll('[required]').forEach(inp => {
        const box = inp.closest('.field, .check');
        const ok = inp.type === 'checkbox' ? inp.checked : inp.checkValidity() && inp.value.trim() !== '';
        box?.classList.toggle('invalid', !ok);
        inp.setAttribute('aria-invalid', !ok);
        if (!ok && !first) first = inp;
      });
      if (first) { first.focus(); return; }
      form.closest('.form-wrap').classList.add('sent');
      form.closest('.form-wrap').querySelector('.form-done').focus();
    });
    form.addEventListener('input', e => {
      const box = e.target.closest('.field, .check');
      if (box?.classList.contains('invalid')) {
        const ok = e.target.type === 'checkbox' ? e.target.checked : e.target.checkValidity();
        box.classList.toggle('invalid', !ok);
      }
    });
  });
})();
