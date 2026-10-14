(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Content stays visible if JavaScript is off; animations only switch on here.
  document.documentElement.classList.add('js');

  $('#year').textContent = new Date().getFullYear();

  /* Mobile menu */
  const burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  }));

  /* Scroll progress + nav shadow */
  const bar = $('#progress'), nav = $('#nav');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 20);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Reveal on scroll + count-up */
  const countUp = () => $$('[data-count]').forEach(el => {
    const end = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = end + suffix; return; }
    const t0 = performance.now(), dur = 1300;
    const tick = t => {
      const k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.classList.contains('stats')) countUp();
    io.unobserve(e.target);
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* Typing effect */
  const roles = [
    'CDS & OData services',
    'analytical dashboards',
    'RFC & REST integrations',
    'Adobe Forms',
    'flexible workflows',
    'BAdIs & enhancements'
  ];
  const out = $('#typed');
  if (!reduce) {
    let r = 0, c = roles[0].length, del = true;
    const type = () => {
      const word = roles[r];
      out.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(type, 1600); }
      if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
      c += del ? -1 : 1;
      setTimeout(type, del ? 32 : 68);
    };
    setTimeout(type, 1800);
  }

  /* Subtle tilt on project cards (mouse only) */
  if (!reduce) {
    $$('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - .5) * -5;
        const ry = ((e.clientX - r.left) / r.width - .5) * 5;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* Highlight the nav link for the section in view */
  const links = $$('#menu a[href^="#"]:not(.nav-cta)');
  const spy = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });
})();
