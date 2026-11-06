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

  /* Demos: cards built from demos.js, opened in a full-screen viewer */
  const demos = Array.isArray(window.DEMOS) ? window.DEMOS : [];
  const grid = $('#demo-grid'), box = $('#lightbox'), stage = $('#lb-stage');
  let lastFocus = null;

  const parse = d => {
    const src = (d.src || '').trim();
    let m;
    if ((m = src.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/)))
      return { kind: 'frame', url: `https://drive.google.com/file/d/${m[1]}/preview`, thumb: `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800`, type: 'video' };
    if ((m = src.match(/docs\.google\.com\/(presentation|document|spreadsheets)\/d\/([\w-]+)/))) {
      const t = m[1] === 'presentation' ? 'embed' : 'preview';
      return { kind: 'frame', url: `https://docs.google.com/${m[1]}/d/${m[2]}/${t}`, type: m[1] === 'presentation' ? 'slides' : 'doc' };
    }
    if ((m = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/)))
      return { kind: 'frame', url: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0`, thumb: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`, type: 'video' };
    const ext = (src.split(/[?#]/)[0].match(/\.(\w+)$/) || [])[1]?.toLowerCase();
    if (['mp4', 'webm', 'mov', 'm4v'].includes(ext)) return { kind: 'video', url: src, type: 'video' };
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return { kind: 'image', url: src, thumb: src, type: 'image' };
    if (ext === 'pdf') return { kind: 'frame', url: src, type: 'pdf' };
    if (['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)) {
      // The Office viewer needs a public link, so repo files open this way once the site is live.
      const abs = new URL(src, location.href).href;
      return { kind: 'frame', url: 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(abs), type: ext.startsWith('p') ? 'slides' : 'doc' };
    }
    return { kind: 'frame', url: src, type: 'doc' };
  };

  const closeBox = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    box.hidden = true;
    stage.replaceChildren();   // removing the iframe/video stops playback
    document.body.classList.remove('lb-open');
    if (lastFocus) lastFocus.focus();
  };

  const openBox = (d, info) => {
    lastFocus = document.activeElement;
    $('#lb-title').textContent = d.title || 'Demo';
    $('#lb-open').href = d.src;
    let el;
    if (info.kind === 'video') { el = document.createElement('video'); el.src = info.url; el.controls = true; el.autoplay = true; el.playsInline = true; }
    else if (info.kind === 'image') { el = document.createElement('img'); el.src = info.url; el.alt = d.title || ''; }
    else { el = document.createElement('iframe'); el.src = info.url; el.title = d.title || 'Demo'; el.allow = 'autoplay; fullscreen; picture-in-picture'; el.allowFullscreen = true; }
    stage.replaceChildren(el);
    box.hidden = false;
    document.body.classList.add('lb-open');
    $('#lb-close').focus();
  };

  if (grid && box) {
    if (!demos.length) grid.innerHTML = '<p class="card demo-empty">Demos will appear here soon.</p>';
    demos.forEach((d, i) => {
      const info = parse(d);
      const type = (d.type || info.type || 'demo').toLowerCase();
      const thumb = d.thumb || info.thumb;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'card demo reveal';
      card.style.setProperty('--d', (i % 3) * 0.06 + 's');
      const t = document.createElement('div'); t.className = 'demo-thumb';
      if (thumb) {
        const img = document.createElement('img');
        img.src = thumb; img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer';
        img.onerror = () => img.remove();   // falls back to the gradient
        t.append(img);
      }
      const play = document.createElement('div'); play.className = 'demo-play'; play.innerHTML = '<i></i>';
      const badge = document.createElement('span'); badge.className = 'demo-badge'; badge.textContent = type;
      t.append(play, badge);
      const body = document.createElement('div'); body.className = 'demo-body';
      const h = document.createElement('h4'); h.textContent = d.title || 'Demo';
      body.append(h);
      if (d.desc) { const p = document.createElement('p'); p.textContent = d.desc; body.append(p); }
      card.append(t, body);
      card.addEventListener('click', () => openBox(d, info));
      grid.append(card);
      io.observe(card);
    });

    $('#lb-close').addEventListener('click', closeBox);
    box.addEventListener('click', e => { if (e.target === box || e.target === stage) closeBox(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden && !document.fullscreenElement) closeBox(); });
    $('#lb-full').addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
    });
  }

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
