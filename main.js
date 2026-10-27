/* =========================================================
   V2 Development — interaction and motion layer
   Lenis smooth scroll + GSAP ScrollTrigger + a WebGL pass over
   a scroll-scrubbed film. Works without GSAP (static layout)
   and respects prefers-reduced-motion.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const narrow = () => window.innerWidth < 900;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGSAP && !reduced;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rm = (n) => 'RM' + Math.round(n).toLocaleString('en-MY');
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const debounce = (fn, ms) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; };
  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  root.classList.add(motion ? 'js-motion' : 'no-motion');
  if (reduced) root.classList.add('reduced');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---------------------------------------------------------
     Content (from V2 Development's published listings, Oct 2026)
     --------------------------------------------------------- */
  const MALAY_FREEHOLD = 'Malay Reserve, freehold, individual title';
  const PROJECTS = [
    {
      name: 'Taman Desa Bukit Permata', where: 'Jalan Kempas 1, Meru, Klang', type: 'Double-storey terrace',
      units: 30, bed: '4', bath: '3', builtUp: '1,860 sq ft', land: "20' × 80'", price: 'From RM681,000', done: '2028',
      tenure: MALAY_FREEHOLD, perks: 'Free SPA legal fees and MOT',
      img: 'proj-desa-bukit-permata.webp',
      gallery: ['proj-desa-bukit-permata.webp', 'proj-desa-bukit-permata-aerial.webp', 'proj-desa-bukit-permata-row.webp'],
      alt: "Artist's impression of a corner double-storey terrace with an amber and white facade at Taman Desa Bukit Permata"
    },
    {
      name: 'Taman Meru Permai', where: 'Jalan Jambu, Meru, Klang', type: 'Terrace, semi-D and bungalow',
      units: 30, mix: '23 single-storey terraces, 6 single-storey semi-detached homes and 1 double-storey bungalow',
      bed: '4 to 5', bath: '2 to 4', builtUp: 'From 1,200 sq ft', land: "20' × 82' (terrace)",
      price: 'From RM470,000', priceDetail: 'RM470,000 terrace, RM680,000 semi-D, RM1,700,000 bungalow', done: '2028',
      tenure: MALAY_FREEHOLD, img: 'proj-meru-permai.webp',
      alt: "Artist's impression of single-storey semi-detached homes with grey roofs at Taman Meru Permai"
    },
    {
      name: 'Taman Harmoni, Sepang', where: 'Taman Harmoni Indah 1, Sungai Pelek, Sepang', type: 'Semi-D and bungalow',
      units: 29, mix: '18 single-storey and 8 double-storey semi-detached homes, plus 1 single-storey and 2 double-storey bungalows',
      bed: '4 to 5', bath: '3 to 5', builtUp: '1,800 sq ft', land: "40' × 85'",
      price: 'From RM688,000', priceDetail: 'RM688,000 to RM1,550,000', done: '2028',
      tenure: 'Freehold, open title, individual title', perks: 'Free SPA legal fees', img: 'proj-harmoni-sepang.webp',
      alt: "Artist's impression of a pair of double-storey bungalows with a maroon accent wall at Taman Harmoni, Sepang"
    },
    {
      name: 'Taman Dato Harun 5', where: 'Jalan Dato Harun, Kampung Sungai Kembong, Pulau Indah', type: 'Single-storey terrace',
      units: 27, bed: '4', bath: '2', builtUp: '1,020 sq ft', land: "20' × 68'", price: 'Price on enquiry', done: '2028',
      tenure: MALAY_FREEHOLD, img: 'proj-dato-harun-5.webp',
      alt: "Artist's impression of single-storey terraces with orange and white gables at Taman Dato Harun 5"
    },
    {
      name: 'Taman Tok Muda Berjaya', where: 'Jalan Masjid, Kampung Tok Muda, Kapar', type: 'Single-storey terrace',
      units: 46, bed: '4', bath: '2', builtUp: '1,020 sq ft', land: "20' × 66'", price: 'Price on enquiry', done: '2026',
      tenure: MALAY_FREEHOLD, perks: 'Free SPA legal fees and MOT', img: 'proj-tok-muda-berjaya.webp',
      alt: "Artist's impression of single-storey terraces with car porches at Taman Tok Muda Berjaya"
    },
    {
      name: 'Taman Khalid Al-Walid 3', where: 'Jalan Kebun, Shah Alam', type: 'Double-storey terrace',
      units: 24, bed: '4', bath: '3', builtUp: '1,800 sq ft', land: "20' × 60'", price: 'Price on enquiry', done: '2024',
      tenure: MALAY_FREEHOLD, perks: 'Free SPA legal fees and MOT', img: 'proj-khalid-al-walid-3.webp',
      gallery: ['proj-khalid-al-walid-3.webp', 'proj-khalid-al-walid-3-aerial.webp'],
      alt: "Artist's impression of a corner double-storey terrace with orange panels at Taman Khalid Al-Walid 3"
    },
    {
      name: 'Taman Imam Yusof 5', where: 'Jalan Imam Yusof, Pulau Indah', type: 'Single-storey terrace',
      units: 91, bed: '4', bath: '2', price: 'Price on enquiry', done: '2024',
      tenure: MALAY_FREEHOLD, perks: 'Free SPA legal fees and MOT', img: 'proj-imam-yusof-5.webp',
      alt: 'Aerial impression of 91 single-storey terraces laid out in rows at Taman Imam Yusof 5'
    },
    {
      name: 'Taman Tok Muda Sejahtera', where: 'Jalan Tok Muda 1, Kapar', type: 'Single-storey terrace',
      bed: '4', bath: '2', builtUp: '1,020 sq ft', price: 'Last listed at RM392,000', done: 'Completed', sold: true,
      img: 'proj-tok-muda-sejahtera.webp',
      alt: "Artist's impression of single-storey terraces with plum accents at Taman Tok Muda Sejahtera"
    }
  ];

  const UPCOMING = [
    { lot: 'Lot 14835', where: 'Jalan Seri Jaya, U15 Shah Alam', units: 30, d: 70, size: "20' × 70'" },
    { lot: 'PT 158640', where: "Jalan Dato' Harun, Pulau Indah", units: 27, d: 73, size: "20' × 73'" },
    { lot: 'PT 158664', where: "Jalan Dato' Ahmad Razali, Pulau Indah", units: 27, d: 73, size: "20' × 73'" },
    { lot: 'Lot 114122', where: 'Jalan Tok Muda 1, Kapar', units: 35, d: 88, size: "20' × 88'" },
    { lot: 'Lot 114120', where: 'Jalan Tok Muda 1, Kapar', units: 70, d: 66, size: "20' × 66' to 67'" }
  ];

  /* ---------------------------------------------------------
     Smooth scroll (Lenis driven by GSAP's ticker)
     --------------------------------------------------------- */
  let lenis = null;
  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
  function scrollToTarget(target, onDone) {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6, easing: easeOutQuart, onComplete: onDone });
      return;
    }
    if (target === 0) window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    else { const el = typeof target === 'string' ? $(target) : target; if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
    if (onDone) setTimeout(onDone, reduced ? 0 : 700);
  }

  /* ---------------------------------------------------------
     Stage: the background film, scrubbed by page progress
     --------------------------------------------------------- */
  const Stage = (() => {
    const stage = $('.stage');
    const media = $('.stage__media');
    const video = $('.stage__video');
    const canvas = $('.stage__gl');
    const isPortrait = () => window.innerHeight > window.innerWidth * 1.05;
    let orient = isPortrait() ? 'portrait' : 'landscape';
    const posterFor = (o) => `poster-${o}.webp`;
    const srcFor = (o) => `bg-${o}.mp4`;

    if (reduced) {
      media.classList.add('is-still');
      media.style.backgroundImage = `url("${posterFor(orient)}")`;
      video.remove();
      canvas.remove();
      return { ready: Promise.resolve(), setProgress() {}, tick() {}, poster: posterFor(orient) };
    }

    let duration = 15;
    let target = 0;
    let current = 0;
    let ready = false;
    let needsUpload = true;
    video.poster = posterFor(orient);
    video.src = srcFor(orient);
    video.load();

    const readyP = new Promise((resolve) => {
      const done = () => { ready = true; needsUpload = true; resolve(); };
      if (video.readyState >= 2) done();
      else {
        video.addEventListener('loadeddata', done, { once: true });
        video.addEventListener('error', () => resolve(), { once: true });
      }
    });
    video.addEventListener('loadedmetadata', () => { if (isFinite(video.duration) && video.duration > 0) duration = video.duration; });
    video.addEventListener('seeked', () => { needsUpload = true; });
    const unlock = () => {
      const p = video.play();
      if (p && p.then) p.then(() => video.pause()).catch(() => {});
    };
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('pointerdown', unlock, { once: true });

    window.addEventListener('resize', debounce(() => {
      const o = isPortrait() ? 'portrait' : 'landscape';
      if (o === orient) return;
      orient = o;
      ready = false;
      video.poster = posterFor(o);
      video.src = srcFor(o);
      video.load();
      video.addEventListener('loadeddata', () => { ready = true; needsUpload = true; }, { once: true });
    }, 300));

    /* WebGL pass: velocity bend, chromatic split, warm grade, vignette, grain */
    let gl = null;
    let uni = {};
    let texW = 1280;
    let texH = 720;
    let hasFrame = false;
    let vel = 0;
    let mx = 0.5;
    let my = 0.5;
    let tmx = 0.5;
    let tmy = 0.5;
    const poster = new Image();
    poster.src = posterFor(orient);

    function initGL() {
      try {
        gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
      } catch (e) { gl = null; }
      if (!gl) return;
      const vs = 'attribute vec2 p;varying vec2 v;void main(){v=p*0.5+0.5;v.y=1.0-v.y;gl_Position=vec4(p,0.0,1.0);}';
      const fs = [
        'precision mediump float;',
        'uniform sampler2D u_tex;uniform vec2 u_res;uniform vec2 u_tex_res;uniform vec2 u_mouse;uniform float u_time;uniform float u_vel;',
        'varying vec2 v;',
        'float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
        'void main(){',
        '  float rs=u_res.x/u_res.y; float rt=u_tex_res.x/u_tex_res.y;',
        '  vec2 sc = rs<rt ? vec2(rs/rt,1.0) : vec2(1.0,rt/rs);',
        '  float vel=clamp(u_vel,-1.0,1.0);',
        '  vec2 c=v-0.5;',
        '  c.y += sin(v.x*3.14159)*0.022*vel;',
        '  c += (u_mouse-0.5)*0.016;',
        '  c *= sc/1.035;',
        '  vec2 t=c+0.5;',
        '  float sp=0.0032*abs(vel)+0.0005;',
        '  vec3 col;',
        '  col.r=texture2D(u_tex,t+vec2(0.0,sp)).r;',
        '  col.g=texture2D(u_tex,t).g;',
        '  col.b=texture2D(u_tex,t-vec2(0.0,sp)).b;',
        '  float l=dot(col,vec3(0.299,0.587,0.114));',
        '  col*=mix(vec3(0.86,0.97,0.92),vec3(1.05,0.98,0.87),smoothstep(0.15,0.85,l));',
        '  float d=length((v-0.5)*vec2(max(rs,1.0),1.0))/max(rs,1.0)*1.25;',
        '  col*=1.0-smoothstep(0.3,0.9,d)*0.5;',
        '  col+=(hash(v*u_res+fract(u_time))-0.5)*0.028;',
        '  gl_FragColor=vec4(col,1.0);',
        '}'
      ].join('\n');
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
      const v = sh(gl.VERTEX_SHADER, vs);
      const f = sh(gl.FRAGMENT_SHADER, fs);
      if (!v || !f) { gl = null; return; }
      const prog = gl.createProgram();
      gl.attachShader(prog, v);
      gl.attachShader(prog, f);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl = null; return; }
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['u_tex', 'u_res', 'u_tex_res', 'u_mouse', 'u_time', 'u_vel'].forEach((n) => { uni[n] = gl.getUniformLocation(prog, n); });
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform1i(uni.u_tex, 0);
      const usePoster = () => { if (!hasFrame) upload(poster, poster.naturalWidth, poster.naturalHeight); };
      if (poster.complete && poster.naturalWidth) usePoster(); else poster.addEventListener('load', usePoster, { once: true });
      window.addEventListener('pointermove', (e) => { tmx = e.clientX / window.innerWidth; tmy = e.clientY / window.innerHeight; }, { passive: true });
      canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); gl = null; stage.classList.remove('has-gl'); });
    }

    function upload(src, w, h) {
      if (!gl || !w || !h) return;
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src);
      } catch (e) { return; }
      texW = w;
      texH = h;
      if (!hasFrame) { hasFrame = true; stage.classList.add('has-gl'); }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    }

    function render(time) {
      if (ready && needsUpload && video.readyState >= 2 && !video.seeking) {
        upload(video, video.videoWidth, video.videoHeight);
        needsUpload = false;
      }
      if (!hasFrame) return;
      resize();
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;
      gl.uniform2f(uni.u_res, canvas.width, canvas.height);
      gl.uniform2f(uni.u_tex_res, texW, texH);
      gl.uniform2f(uni.u_mouse, mx, my);
      gl.uniform1f(uni.u_time, time);
      gl.uniform1f(uni.u_vel, vel);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    if (finePointer && !narrow()) initGL();

    return {
      ready: readyP,
      poster: posterFor(orient),
      setProgress(p) { target = clamp(p, 0, 1) * Math.max(0, duration - 0.12); },
      tick(velocity, time) {
        current += (target - current) * 0.14;
        if (Math.abs(target - current) < 0.0005) current = target;
        if (ready && !video.seeking && Math.abs(video.currentTime - current) > 0.012) {
          try { video.currentTime = current; } catch (e) { /* not seekable yet */ }
        }
        vel += (clamp((velocity || 0) / 38, -1, 1) - vel) * 0.08;
        if (gl) render(time || 0);
      }
    };
  })();

  /* ---------------------------------------------------------
     Render data-driven markup
     --------------------------------------------------------- */
  function cardFacts(p) {
    const f = [];
    f.push(p.units ? ['Homes', String(p.units)] : ['Bedrooms', p.bed]);
    f.push(p.builtUp ? ['Built-up', p.builtUp.replace('From ', '')] : ['Bedrooms', p.bed]);
    f.push(p.sold ? ['Status', 'Sold out'] : ['Completion', p.done]);
    return f;
  }

  function renderProjects() {
    const track = $('.projects__track');
    if (!track) return;
    track.innerHTML = PROJECTS.map((p, i) => `
      <li class="pj">
        <button class="pj__media" type="button" data-cursor="view" data-open="${i}" aria-label="View details for ${esc(p.name)}">
          <img src="${p.img}" alt="${esc(p.alt)}" loading="lazy" decoding="async" width="1600" height="1130">
          <span class="pj__tag${p.sold ? ' pj__tag--sold' : ''}">${esc(p.sold ? 'Sold out' : p.type)}</span>
        </button>
        <div class="pj__body">
          <h3 class="pj__name">${esc(p.name)}</h3>
          <p class="pj__where">${esc(p.where)}</p>
          <dl class="pj__facts">${cardFacts(p).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          <div class="pj__foot">
            <p class="pj__price">${esc(p.price)}</p>
            <button class="pj__open" type="button" data-open="${i}">Details</button>
          </div>
        </div>
      </li>`).join('');
  }

  function planSVG(u) {
    const perRow = u.units > 24 ? Math.ceil(u.units / 2) : u.units;
    const rows = Math.ceil(u.units / perRow);
    const gap = 10;
    const W = perRow * 20;
    const H = rows * u.d + (rows - 1) * gap + 16;
    let rects = '';
    for (let k = 0; k < u.units; k++) {
      const r = Math.floor(k / perRow);
      const c = k % perRow;
      rects += `<rect x="${c * 20}" y="${r * (u.d + gap)}" width="20" height="${u.d}" pathLength="1"/>`;
    }
    return `<svg viewBox="-2 -2 ${W + 4} ${H + 4}" preserveAspectRatio="xMinYMid meet" aria-hidden="true">${rects}<line class="road" x1="0" x2="${W}" y1="${H - 3}" y2="${H - 3}"/></svg>`;
  }

  function renderPipeline() {
    const list = $('.pipeline__list');
    if (!list) return;
    const total = UPCOMING.reduce((s, u) => s + u.units, 0);
    list.innerHTML = UPCOMING.map((u) => `
      <li class="lot">
        <div><p class="lot__name">${esc(u.lot)}</p><p class="lot__where">${esc(u.where)}</p></div>
        <p class="lot__units"><b data-count="${u.units}">${u.units}</b><span>single-storey terraces</span></p>
        <figure class="lot__plan">${planSVG(u)}<figcaption>${u.units} lots of ${esc(u.size)}, drawn to scale</figcaption></figure>
      </li>`).join('') +
      `<li class="pipeline__total"><span>Upcoming homes across five parcels</span><b>${total}</b></li>`;
  }

  /* ---------------------------------------------------------
     Project drawer (native <dialog>)
     --------------------------------------------------------- */
  const drawer = document.createElement('dialog');
  drawer.className = 'drawer';
  drawer.setAttribute('aria-labelledby', 'drawer-title');
  drawer.setAttribute('data-lenis-prevent', '');
  document.body.appendChild(drawer);

  function specRows(p) {
    const rows = [
      ['Home type', p.type], ['Homes', p.units ? String(p.units) : ''], ['Bedrooms', p.bed], ['Bathrooms', p.bath],
      ['Built-up', p.builtUp], ['Land size', p.land], ['Tenure', p.tenure], ['Completion', p.done],
      ['Price', p.priceDetail || p.price]
    ];
    return rows.filter((r) => r[1]).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  }

  function openDrawer(i) {
    const p = PROJECTS[i];
    if (!p) return;
    const imgs = (p.gallery || [p.img]).map((src, k) => `<img src="${src}" alt="${k === 0 ? esc(p.alt) : ''}" loading="lazy" decoding="async">`).join('');
    drawer.innerHTML = `
      <button class="drawer__close" type="button" aria-label="Close details"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <div class="drawer__gallery">${imgs}</div>
      <div class="drawer__body">
        <h2 id="drawer-title">${esc(p.name)}</h2>
        <p class="drawer__where">${esc(p.where)}</p>
        ${p.mix ? `<p class="drawer__mix">${esc(p.mix)}.</p>` : ''}
        <dl class="drawer__specs">${specRows(p)}</dl>
        ${p.perks ? `<p class="drawer__note">${esc(p.perks)}, as listed by V2 Development.</p>` : ''}
        ${p.sold ? '<p class="drawer__note">This development is sold out. Ask us about similar homes in Kapar.</p>' : ''}
        <button class="btn btn--brass" type="button" data-enquire="${esc(p.sold ? 'Buying a home' : p.name)}"><span>${p.sold ? 'Ask about similar homes' : 'Enquire about this home'}</span><span class="btn__icon" aria-hidden="true">${ARROW}</span></button>
        <p class="drawer__note">Images are artist's impressions. Prices and specifications are indicative; please confirm with our sales team.</p>
      </div>`;
    if (lenis) lenis.stop();
    drawer.showModal();
    drawer.scrollTop = 0;
    if (motion) gsap.fromTo(drawer, { xPercent: 100 }, { xPercent: 0, duration: 0.75, ease: 'expo.out' });
  }

  function closeDrawer(after) {
    if (!drawer.open) { if (after) after(); return; }
    const done = () => { drawer.close(); if (motion) gsap.set(drawer, { clearProps: 'transform' }); if (lenis) lenis.start(); if (after) after(); };
    if (motion) gsap.to(drawer, { xPercent: 100, duration: 0.45, ease: 'power3.in', onComplete: done });
    else done();
  }

  drawer.addEventListener('cancel', (e) => { e.preventDefault(); closeDrawer(); });
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('.drawer__close')) { closeDrawer(); return; }
    if (e.target === drawer) {
      const r = drawer.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDrawer();
    }
  });

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) { openDrawer(Number(opener.dataset.open)); return; }
    const enq = e.target.closest('[data-enquire]');
    if (enq) {
      e.preventDefault();
      const topic = enq.dataset.enquire;
      closeDrawer(() => enquireAbout(topic));
    }
  });

  function enquireAbout(topic) {
    const sel = $('#f-topic');
    if (sel) {
      let opt = Array.from(sel.options).find((o) => o.value === topic || o.text === topic);
      if (!opt) { opt = new Option(topic, topic); sel.add(opt, 1); }
      sel.value = opt.value;
    }
    scrollToTarget('#contact', () => { const n = $('#f-name'); if (n) n.focus({ preventScroll: true }); });
  }

  /* ---------------------------------------------------------
     Charts (vanilla SVG in the Bklit idiom: composed bars + line,
     ring, range ladder, radar). Re-rendered at true pixel width.
     --------------------------------------------------------- */
  function monotonePath(p) {
    const n = p.length;
    const dx = [];
    const m = [];
    const t = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; m[i] = (p[i + 1][1] - p[i][1]) / dx[i]; }
    t[0] = m[0];
    t[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
      const a = t[i] / m[i];
      const b = t[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
    }
    const f = (v) => Math.round(v * 100) / 100;
    let d = `M${f(p[0][0])},${f(p[0][1])}`;
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d += ` C${f(p[i][0] + h)},${f(p[i][1] + t[i] * h)} ${f(p[i + 1][0] - h)},${f(p[i + 1][1] - t[i + 1] * h)} ${f(p[i + 1][0])},${f(p[i + 1][1])}`;
    }
    return d;
  }
  const topRoundRect = (x, y, w, h, r) => {
    r = Math.min(r, w / 2, h);
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  };
  const srTable = (caption, head, rows) => `<div class="visually-hidden"><table><caption>${esc(caption)}</caption><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  function tipAt(body, tip, svg, x, y, vbW, vbH, html) {
    const r = svg.getBoundingClientRect();
    const br = body.getBoundingClientRect();
    let left = (x / vbW) * r.width + (r.left - br.left);
    const top = (y / vbH) * r.height + (r.top - br.top);
    left = clamp(left, 90, br.width - 90);
    tip.innerHTML = html;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    tip.classList.add('is-on');
  }

  const CHARTS = {
    timeline(body) {
      const data = [
        { y: 2024, due: 115, names: ['Taman Imam Yusof 5 (91)', 'Taman Khalid Al-Walid 3 (24)'] },
        { y: 2025, due: 0, names: [] },
        { y: 2026, due: 46, names: ['Taman Tok Muda Berjaya (46)'] },
        { y: 2027, due: 0, names: [] },
        { y: 2028, due: 116, names: ['Taman Desa Bukit Permata (30)', 'Taman Meru Permai (30)', 'Taman Harmoni, Sepang (29)', 'Taman Dato Harun 5 (27)'] }
      ];
      let run = 0;
      data.forEach((d) => { run += d.due; d.cum = run; });
      const W = Math.max(300, body.clientWidth);
      const H = Math.round(clamp(W * 0.46, 220, 320));
      const m = { l: 40, r: 14, t: 16, b: 30 };
      const iw = W - m.l - m.r;
      const ih = H - m.t - m.b;
      const max = 300;
      const bw = iw / data.length;
      const x = (i) => m.l + bw * i + bw / 2;
      const yv = (v) => m.t + ih - (v / max) * ih;
      const pts = data.map((d, i) => [x(i), yv(d.cum)]);
      const line = monotonePath(pts);
      const area = `${line} L${pts[pts.length - 1][0]},${m.t + ih} L${pts[0][0]},${m.t + ih} Z`;
      body.innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
          <defs><linearGradient id="g-cum" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CDA35A" stop-opacity="0.3"/><stop offset="1" stop-color="#CDA35A" stop-opacity="0"/></linearGradient></defs>
          <g class="grid">${[0, 100, 200, 300].map((v) => `<line x1="${m.l}" x2="${W - m.r}" y1="${yv(v)}" y2="${yv(v)}"/><text x="${m.l - 10}" y="${yv(v) + 4}" text-anchor="end">${v}</text>`).join('')}</g>
          ${data.map((d, i) => d.due ? `<path class="bar" data-i="${i}" d="${topRoundRect(x(i) - bw * 0.22, yv(d.due), bw * 0.44, (d.due / max) * ih, 7)}"/>` : '').join('')}
          <path class="cum-area" d="${area}" fill="url(#g-cum)"/>
          <path class="cum-line" d="${line}" pathLength="1"/>
          <line class="crosshair" x1="0" x2="0" y1="${m.t}" y2="${m.t + ih}"/>
          ${pts.map((p, i) => `<circle class="cum-dot" data-i="${i}" cx="${p[0]}" cy="${p[1]}" r="4.5"/>`).join('')}
          ${data.map((d, i) => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${d.y}</text>`).join('')}
          ${data.map((d, i) => `<rect class="hit" data-i="${i}" x="${m.l + bw * i}" y="${m.t}" width="${bw}" height="${ih}"/>`).join('')}
        </svg>
        <div class="chart-tip" aria-hidden="true"></div>
        ${srTable('Homes by completion year', ['Year', 'Homes due', 'Running total'], data.map((d) => [d.y, d.due, d.cum]))}`;
      const svg = $('svg', body);
      const tip = $('.chart-tip', body);
      const cross = $('.crosshair', svg);
      const show = (i) => {
        const d = data[i];
        cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.classList.add('is-on');
        $$('.bar', svg).forEach((b) => b.classList.toggle('is-hot', Number(b.dataset.i) === i));
        $$('.cum-dot', svg).forEach((c) => c.setAttribute('r', Number(c.dataset.i) === i ? 7 : 4.5));
        const names = d.names.length ? d.names.map((n) => `<span>${esc(n)}</span>`).join('') : '<span>No completions scheduled</span>';
        tipAt(body, tip, svg, x(i), Math.min(yv(d.cum), yv(d.due)), W, H, `<strong>${d.y}</strong><span>Due: <b class="tip-val">${d.due} homes</b></span><span>Running total: ${d.cum}</span>${names}`);
      };
      const hide = () => { tip.classList.remove('is-on'); cross.classList.remove('is-on'); $$('.bar', svg).forEach((b) => b.classList.remove('is-hot')); $$('.cum-dot', svg).forEach((c) => c.setAttribute('r', 4.5)); };
      $$('.hit', svg).forEach((h) => { h.addEventListener('pointerenter', () => show(Number(h.dataset.i))); });
      svg.addEventListener('pointerleave', hide);
    },

    mix(body) {
      const segs = [
        { label: 'Single-storey terrace', v: 187, c: '#CDA35A' },
        { label: 'Double-storey terrace', v: 54, c: '#ECE6DA' },
        { label: 'Semi-detached', v: 32, c: '#C0704F' },
        { label: 'Bungalow', v: 4, c: '#6F8E7C' }
      ];
      const total = segs.reduce((s, d) => s + d.v, 0);
      let acc = 0;
      segs.forEach((s) => { s.pct = (s.v / total) * 100; s.start = acc; acc += s.pct; });
      body.innerHTML = `
        <div class="ring-wrap">
          <svg viewBox="0 0 220 220" aria-hidden="true">
            <circle cx="110" cy="110" r="80" fill="none" stroke="rgba(236,230,218,0.07)" stroke-width="20"/>
            ${segs.map((s, i) => `<circle class="ring-seg" data-i="${i}" cx="110" cy="110" r="80" pathLength="100" stroke="${s.c}" stroke-dashoffset="${25 - s.start}"/>`).join('')}
            <text class="ring-center-num" x="110" y="116" text-anchor="middle">${total}</text>
            <text class="ring-center-label" x="110" y="140" text-anchor="middle">homes</text>
          </svg>
          <div class="legend">${segs.map((s, i) => `<button type="button" data-i="${i}"><i></i><span>${esc(s.label)}</span><b>${s.v}</b></button>`).join('')}</div>
        </div>
        ${srTable('Homes by type', ['Type', 'Homes', 'Share'], segs.map((s) => [s.label, s.v, s.pct.toFixed(1) + '%']))}`;
      $$('.legend i', body).forEach((el, i) => { el.style.background = segs[i].c; });
      const circles = $$('.ring-seg', body);
      const num = $('.ring-center-num', body);
      const lab = $('.ring-center-label', body);
      const btns = $$('.legend button', body);
      const fill = () => circles.forEach((c, i) => { c.style.strokeDasharray = `${Math.max(0, segs[i].pct - 0.6)} ${100 - Math.max(0, segs[i].pct - 0.6)}`; });
      circles.forEach((c) => { c.style.strokeDasharray = '0 100'; });
      body.__fill = fill;
      if (body.closest('.chart').classList.contains('is-in')) requestAnimationFrame(fill);
      const hot = (i) => {
        circles.forEach((c, k) => { c.classList.toggle('is-hot', k === i); c.classList.toggle('is-dim', k !== i); });
        btns.forEach((b, k) => b.classList.toggle('is-hot', k === i));
        num.textContent = segs[i].v;
        lab.textContent = `${segs[i].label.toLowerCase()}, ${Math.round(segs[i].pct)}%`;
      };
      const cool = () => { circles.forEach((c) => c.classList.remove('is-hot', 'is-dim')); btns.forEach((b) => b.classList.remove('is-hot')); num.textContent = total; lab.textContent = 'homes'; };
      circles.forEach((c) => c.addEventListener('pointerenter', () => hot(Number(c.dataset.i))));
      btns.forEach((b) => { b.addEventListener('pointerenter', () => hot(Number(b.dataset.i))); b.addEventListener('focus', () => hot(Number(b.dataset.i))); b.addEventListener('blur', cool); });
      $('.ring-wrap', body).addEventListener('pointerleave', cool);
    },

    prices(body) {
      const rows = [
        { name: 'Taman Tok Muda Sejahtera', pts: [{ v: 392000, l: 'Single-storey terrace, sold out', sold: true }] },
        { name: 'Taman Meru Permai', pts: [{ v: 470000, l: 'Single-storey terrace' }, { v: 680000, l: 'Single-storey semi-D' }, { v: 1700000, l: 'Double-storey bungalow' }] },
        { name: 'Taman Desa Bukit Permata', pts: [{ v: 681000, l: 'Double-storey terrace' }] },
        { name: 'Taman Harmoni, Sepang', pts: [{ v: 688000, l: 'Single-storey semi-D' }, { v: 888000, l: 'Single-storey bungalow' }, { v: 938000, l: 'Double-storey semi-D' }, { v: 1550000, l: 'Double-storey bungalow' }] }
      ];
      const W = Math.max(300, body.clientWidth);
      const m = { l: 8, r: 16, t: 8, b: 30 };
      const rowH = 62;
      const H = m.t + rows.length * rowH + m.b;
      const lo = 300000;
      const hi = 1800000;
      const xv = (v) => m.l + ((v - lo) / (hi - lo)) * (W - m.l - m.r);
      const ticks = [400000, 800000, 1200000, 1600000];
      let dots = '';
      let tracks = '';
      let names = '';
      rows.forEach((r, i) => {
        const y = m.t + i * rowH + 40;
        names += `<text class="ladder-name" x="${m.l}" y="${y - 16}">${esc(r.name)}</text>`;
        const a = xv(Math.min(...r.pts.map((p) => p.v)));
        const b = xv(Math.max(...r.pts.map((p) => p.v)));
        if (b - a > 1) tracks += `<line class="ladder-track" x1="${a}" x2="${b}" y1="${y}" y2="${y}"/>`;
        r.pts.forEach((p, k) => { dots += `<circle class="ladder-dot${p.sold ? ' ladder-dot--sold' : ''}" data-r="${i}" data-k="${k}" cx="${xv(p.v)}" cy="${y}" r="6"/>`; });
      });
      body.innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
          <g class="grid">${ticks.map((t) => `<line x1="${xv(t)}" x2="${xv(t)}" y1="${m.t}" y2="${H - m.b}"/><text x="${xv(t)}" y="${H - 8}" text-anchor="middle">${t >= 1000000 ? 'RM' + (t / 1000000).toFixed(1) + 'm' : 'RM' + t / 1000 + 'k'}</text>`).join('')}</g>
          ${names}${tracks}${dots}
        </svg>
        <div class="chart-tip" aria-hidden="true"></div>
        ${srTable('Listed prices by development', ['Development', 'Home type', 'Price'], rows.flatMap((r) => r.pts.map((p) => [r.name, p.l, rm(p.v)])))}`;
      const svg = $('svg', body);
      const tip = $('.chart-tip', body);
      $$('.ladder-dot', svg).forEach((d) => {
        const r = rows[Number(d.dataset.r)];
        const p = r.pts[Number(d.dataset.k)];
        d.addEventListener('pointerenter', () => tipAt(body, tip, svg, Number(d.getAttribute('cx')), Number(d.getAttribute('cy')) - 6, W, H, `<strong>${esc(r.name)}</strong><span>${esc(p.l)}</span><span class="tip-val">${rm(p.v)}</span>`));
        d.addEventListener('pointerleave', () => tip.classList.remove('is-on'));
      });
    },

    radar(body) {
      const hq = [2.998, 101.532];
      const pts = [
        { n: 'Taman Khalid Al-Walid 3', at: [2.983, 101.493] },
        { n: 'Taman Desa Bukit Permata', at: [3.120, 101.443] },
        { n: 'Taman Meru Permai', at: [3.132, 101.452] },
        { n: 'Taman Tok Muda Berjaya and Sejahtera', at: [3.112, 101.371] },
        { n: 'Taman Dato Harun 5', at: [2.940, 101.312] },
        { n: 'Taman Imam Yusof 5', at: [2.930, 101.322] },
        { n: 'Taman Dato Ahmad Razali 2', at: [2.948, 101.318] },
        { n: 'Taman Harmoni, Sepang', at: [2.645, 101.706] },
        { n: 'Lot 14835, U15 Shah Alam (upcoming)', at: [3.143, 101.508], next: true }
      ];
      const W = Math.max(280, body.clientWidth);
      const size = Math.min(W, 380);
      const cx = W / 2;
      const cy = size / 2;
      const R = size / 2 - 14;
      const kx = 111.32 * Math.cos((hq[0] * Math.PI) / 180);
      const ky = 110.57;
      pts.forEach((p) => {
        p.dx = (p.at[1] - hq[1]) * kx;
        p.dy = (p.at[0] - hq[0]) * ky;
        p.km = Math.hypot(p.dx, p.dy);
        p.x = cx + (p.dx / 50) * R;
        p.y = cy - (p.dy / 50) * R;
      });
      const a0 = -Math.PI / 2;
      const a1 = a0 + Math.PI / 4.5;
      body.innerHTML = `
        <svg viewBox="0 0 ${W} ${size}" width="${W}" height="${size}" aria-hidden="true">
          <defs><linearGradient id="g-sweep" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#CDA35A" stop-opacity="0"/><stop offset="1" stop-color="#CDA35A" stop-opacity="0.28"/></linearGradient></defs>
          ${[10, 20, 30, 40, 50].map((k) => `<circle class="radar-ring" cx="${cx}" cy="${cy}" r="${(k / 50) * R}"/><text class="radar-ring-label" x="${cx + 4}" y="${cy - (k / 50) * R + 12}">${k} km</text>`).join('')}
          <line class="radar-ring" x1="${cx - R}" x2="${cx + R}" y1="${cy}" y2="${cy}"/><line class="radar-ring" x1="${cx}" x2="${cx}" y1="${cy - R}" y2="${cy + R}"/>
          <g class="radar-sweep"><path d="M${cx},${cy} L${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 0 1 ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} Z" fill="url(#g-sweep)"/></g>
          <circle class="radar-hq" cx="${cx}" cy="${cy}" r="5"/>
          <text x="${cx + 9}" y="${cy + 16}">Shah Alam office</text>
          ${pts.map((p, i) => `${p.next ? '' : `<circle class="radar-ping" data-i="${i}" cx="${p.x}" cy="${p.y}" r="5"/>`}<circle class="radar-pt${p.next ? ' radar-pt--next' : ''}" data-i="${i}" cx="${p.x}" cy="${p.y}" r="5.5"/>`).join('')}
        </svg>
        <div class="chart-tip" aria-hidden="true"></div>
        ${srTable('Approximate distance from the Shah Alam office', ['Development', 'Distance'], pts.map((p) => [p.n, 'About ' + Math.round(p.km) + ' km']))}`;
      $$('.radar-ping', body).forEach((el) => { el.style.animationDelay = (Number(el.dataset.i) * 0.37).toFixed(2) + 's'; });
      const svg = $('svg', body);
      const tip = $('.chart-tip', body);
      $$('.radar-pt', svg).forEach((el) => {
        const p = pts[Number(el.dataset.i)];
        el.addEventListener('pointerenter', () => tipAt(body, tip, svg, p.x, p.y - 6, W, size, `<strong>${esc(p.n)}</strong><span class="tip-val">About ${Math.round(p.km)} km away</span>`));
        el.addEventListener('pointerleave', () => tip.classList.remove('is-on'));
      });
    }
  };

  function renderCharts() {
    $$('[data-chart]').forEach((fig) => {
      const body = $('.chart__body', fig);
      const fn = CHARTS[fig.dataset.chart];
      if (fn && body) fn(body);
    });
  }

  function chartsReveal() {
    const figs = $$('[data-chart]');
    const reveal = (fig) => { fig.classList.add('is-in'); const b = $('.chart__body', fig); if (b && b.__fill) requestAnimationFrame(() => b.__fill()); };
    if (!('IntersectionObserver' in window) || reduced) { figs.forEach(reveal); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.3 });
    figs.forEach((f) => io.observe(f));
    let lastW = window.innerWidth;
    window.addEventListener('resize', debounce(() => { if (window.innerWidth === lastW) return; lastW = window.innerWidth; renderCharts(); figs.forEach((f) => { if (f.classList.contains('is-in')) reveal(f); }); }, 250));
  }

  /* ---------------------------------------------------------
     Honours: the four badges dissolve into gold dust and
     re-form into one another, pixel to nearest pixel.
     --------------------------------------------------------- */
  function honours() {
    const sec = $('.honours');
    if (!sec || !motion) return;
    const items = $$('.honours__list li', sec);
    const pips = $$('.honours__pips span', sec);
    const golds = $$('.medal--lg .medal__gold', sec);
    const canvas = $('.honours__dust', sec);
    const stageEl = $('.honours__stage', sec);
    const ctx = canvas.getContext('2d');
    const SRC = ['badge-happy-clients.webp', 'badge-satisfaction.webp', 'badge-houses-in-progress.webp', 'badge-quality-built.webp'];
    const S = 240;
    const N = narrow() ? 2600 : 4400;
    const PALETTE = ['#8C6A2F', '#B38943', '#CDA35A', '#E3C47F', '#F6E6B8'];
    let homes = null;
    const seed = new Float32Array(N);
    const shade = new Uint8Array(N);
    const offX = new Float32Array(N);
    const offY = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const PX = new Float32Array(N);
    const PY = new Float32Array(N);
    const buckets = [[], [], [], [], []];
    let qTarget = 0;
    let q = 0;
    let active = -1;
    let box = { x: 0, y: 0, s: 1, ps: 2 };
    const pointer = { x: -1e5, y: -1e5 };

    for (let i = 0; i < N; i++) { seed[i] = Math.random(); }

    const load = (src) => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
    const sample = (img) => {
      const c = document.createElement('canvas');
      c.width = c.height = S;
      const x = c.getContext('2d', { willReadFrequently: true });
      x.drawImage(img, 0, 0, S, S);
      const d = x.getImageData(0, 0, S, S).data;
      const pts = [];
      for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) if (d[(y * S + xx) * 4 + 3] > 140) pts.push(xx, y);
      const count = pts.length / 2;
      const idx = shuffle(Array.from({ length: count }, (_, i) => i));
      const out = new Float32Array(N * 2);
      for (let i = 0; i < N; i++) {
        const k = idx[i % count];
        out[i * 2] = (pts[k * 2] + Math.random()) / S;
        out[i * 2 + 1] = (pts[k * 2 + 1] + Math.random()) / S;
      }
      return out;
    };
    const match = (a, b) => {
      const cell = 0.04;
      const G = Math.ceil(1 / cell);
      const grid = Array.from({ length: G * G }, () => []);
      for (let j = 0; j < N; j++) {
        const gx = Math.min(G - 1, (b[j * 2] / cell) | 0);
        const gy = Math.min(G - 1, (b[j * 2 + 1] / cell) | 0);
        grid[gy * G + gx].push(j);
      }
      const used = new Uint8Array(N);
      const out = new Float32Array(N * 2);
      const left = [];
      const order = shuffle(Array.from({ length: N }, (_, i) => i));
      for (const i of order) {
        const ax = a[i * 2];
        const ay = a[i * 2 + 1];
        const gx = Math.min(G - 1, (ax / cell) | 0);
        const gy = Math.min(G - 1, (ay / cell) | 0);
        let best = -1;
        let bd = Infinity;
        for (let r = 0; r <= 2 && best < 0; r++) {
          for (let yy = gy - r; yy <= gy + r; yy++) {
            for (let xx = gx - r; xx <= gx + r; xx++) {
              if (xx < 0 || yy < 0 || xx >= G || yy >= G) continue;
              if (r > 0 && Math.abs(yy - gy) < r && Math.abs(xx - gx) < r) continue;
              const list = grid[yy * G + xx];
              for (let k = 0; k < list.length; k++) {
                const j = list[k];
                if (used[j]) continue;
                const dx = b[j * 2] - ax;
                const dy = b[j * 2 + 1] - ay;
                const dd = dx * dx + dy * dy;
                if (dd < bd) { bd = dd; best = j; }
              }
            }
          }
        }
        if (best >= 0) { used[best] = 1; out[i * 2] = b[best * 2]; out[i * 2 + 1] = b[best * 2 + 1]; } else left.push(i);
      }
      const free = [];
      for (let j = 0; j < N; j++) if (!used[j]) free.push(j);
      shuffle(free);
      left.forEach((i, k) => { const j = free[k]; out[i * 2] = b[j * 2]; out[i * 2 + 1] = b[j * 2 + 1]; });
      return out;
    };

    Promise.all(SRC.map(load)).then((imgs) => {
      const raw = imgs.map(sample);
      homes = [raw[0]];
      for (let k = 1; k < raw.length; k++) homes.push(match(homes[k - 1], raw[k]));
      for (let i = 0; i < N; i++) {
        const x = homes[0][i * 2];
        const y = homes[0][i * 2 + 1];
        const g = clamp(Math.round((x * 0.6 + (1 - y) * 0.4) * 3.2 + (seed[i] - 0.5) * 2.2), 0, 4);
        shade[i] = g;
        buckets[g].push(i);
      }
      sizeCanvas();
    }).catch(() => { /* badges still show as crisp medals */ });

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = stageEl.offsetWidth * 1.32;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(w * dpr);
      const s = (canvas.width / 1.32);
      box = { x: canvas.width * (0.16 / 1.32), y: canvas.height * (0.16 / 1.32), s, ps: Math.max(1.4, (s / S) * 1.3), dpr };
    }
    window.addEventListener('resize', debounce(sizeCanvas, 200));

    stageEl.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * canvas.width;
      pointer.y = ((e.clientY - r.top) / r.height) * canvas.height;
    });
    stageEl.addEventListener('pointerleave', () => { pointer.x = pointer.y = -1e5; });

    function setActive(k) {
      if (k === active) return;
      active = k;
      items.forEach((li, i) => li.classList.toggle('is-active', i === k));
    }

    function draw(time) {
      q += (qTarget - q) * 0.14;
      const k = Math.min(2, Math.floor(q));
      const t = clamp(q - k, 0, 1);
      const tt = smooth(0.15, 0.85, t);
      setActive(Math.round(q));
      pips.forEach((p, i) => p.style.setProperty('--fill', clamp(q + 1 - i, 0, 1).toFixed(3)));
      const restA = 1 - smooth(0, 0.08, tt);
      const restB = smooth(0.92, 1, tt);
      golds.forEach((g, i) => { g.style.opacity = i === k ? restA : i === k + 1 ? restB : 0; });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!homes) return;
      const dust = 1 - Math.max(restA, restB);
      const A = homes[k];
      const B = homes[k + 1];
      const R = 70 * box.dpr;
      const now = time * 0.001;
      for (let i = 0; i < N; i++) {
        const ax = A[i * 2];
        const ay = A[i * 2 + 1];
        const dx = B[i * 2] - ax;
        const dy = B[i * 2 + 1] - ay;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const s = seed[i];
        const ti = smooth(0, 1, (tt - s * 0.3) / 0.7);
        const bump = Math.sin(Math.PI * ti);
        const amp = Math.min(dist * 0.85, 0.2) * bump;
        const ang = s * 6.2832 + now * 0.8;
        const x = ax + dx * ti - dy * amp * Math.sin(s * 12) + Math.cos(ang) * amp * 0.4;
        const y = ay + dy * ti + dx * amp * Math.sin(s * 12) + Math.sin(ang) * amp * 0.4 - bump * 0.02 * s;
        let px = box.x + x * box.s;
        let py = box.y + y * box.s;
        const ddx = px + offX[i] - pointer.x;
        const ddy = py + offY[i] - pointer.y;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < R * R) { const d = Math.sqrt(d2) || 1; const f = (1 - d / R) * 2.6; vx[i] += (ddx / d) * f; vy[i] += (ddy / d) * f; }
        vx[i] = (vx[i] - offX[i] * 0.06) * 0.84;
        vy[i] = (vy[i] - offY[i] * 0.06) * 0.84;
        offX[i] += vx[i];
        offY[i] += vy[i];
        PX[i] = px + offX[i];
        PY[i] = py + offY[i];
      }
      const ps = box.ps;
      for (let b = 0; b < 5; b++) {
        ctx.fillStyle = PALETTE[b];
        const list = buckets[b];
        // full dust during a transition; a sparse twinkle at rest
        for (let n = 0; n < list.length; n++) {
          const i = list[n];
          let a = dust;
          if (a < 0.02) {
            if (i % 9 !== 0) continue;
            a = 0.35 + 0.35 * Math.sin(now * 2 + seed[i] * 40);
            const disp = Math.abs(offX[i]) + Math.abs(offY[i]);
            if (disp > 1.5) a = Math.min(1, a + disp * 0.08);
          }
          ctx.globalAlpha = a;
          ctx.fillRect(PX[i] - ps / 2, PY[i] - ps / 2, ps, ps);
        }
      }
      ctx.globalAlpha = 1;
    }

    let ticking = false;
    const tickFn = (time) => draw(time * 1000);
    ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * 3.2),
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => { qTarget = self.progress * 3; }
    });
    // keep drawing while the section is anywhere near the viewport
    ScrollTrigger.create({
      trigger: sec,
      start: 'top bottom',
      end: () => 'bottom+=' + Math.round(window.innerHeight * 3.2) + ' top',
      onToggle: (self) => {
        if (self.isActive && !ticking) { gsap.ticker.add(tickFn); ticking = true; }
        if (!self.isActive && ticking) { gsap.ticker.remove(tickFn); ticking = false; }
      }
    });
    setActive(0);
  }

  /* ---------------------------------------------------------
     Section choreography
     --------------------------------------------------------- */
  function heroIntro() {
    const nav = $('[data-nav]');
    if (!motion) { if (nav) nav.classList.add('is-ready'); return; }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.stage__media', { '--stage-scale': 1.16 }, { '--stage-scale': 1, duration: 2.8, ease: 'power3.out' }, 0)
      .fromTo('.hero__title .line > span', { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.5, stagger: 0.12 }, 0.1)
      .to('[data-hero-fade]', { opacity: 1, y: 0, duration: 1.3, stagger: 0.1 }, 0.65)
      .fromTo('.hero__seal', { opacity: 0 }, { opacity: 1, duration: 1 }, 0.8)
      .fromTo('.hero__seal .medal', { scale: 0.55, rotation: -35 }, { scale: 1, rotation: 0, duration: 1.8 }, 0.8)
      .add(() => nav && nav.classList.add('is-ready'), 0.5);
  }

  // the hero drifts up and dims as the film carries you down
  function heroScrollPrep() {
    const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__content', { yPercent: -22, opacity: 0, ease: 'none', scrollTrigger: st });
    gsap.to('.hero__seal', { y: -180, rotation: 24, ease: 'none', scrollTrigger: { ...st } });
  }

  function splitHeadings() {
    if (!motion || !window.SplitText) return;
    $$('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        }
      });
    });
  }

  function manifesto() {
    const el = $('[data-words]');
    if (!el || !motion || !window.SplitText) return;
    const split = SplitText.create(el, { type: 'words', wordsClass: 'word' });
    gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: true } });
    gsap.from('.story__meta', { opacity: 0, y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.story__meta', start: 'top 90%', once: true } });
  }

  function marquee() {
    const track = $('[data-marquee]');
    if (!track) return;
    const row = $('.marquee__row', track);
    const clone = row.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
    if (!motion) return;
    let x = 0;
    let dir = -1;
    let w = row.offsetWidth;
    let visible = false;
    window.addEventListener('resize', debounce(() => { w = row.offsetWidth; }, 200));
    ScrollTrigger.create({ trigger: '.marquee', start: 'top bottom', end: 'bottom top', onToggle: (s) => { visible = s.isActive; } });
    gsap.ticker.add((t, dt) => {
      if (!visible) return;
      const v = lenis ? lenis.velocity : 0;
      if (lenis && lenis.direction) dir = lenis.direction > 0 ? -1 : 1;
      x += dir * (0.7 + Math.min(Math.abs(v) * 0.35, 9)) * (dt / 16.67);
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    });
  }

  function projectsMotion() {
    if (!motion) return;
    const pin = $('.projects__pin');
    const track = $('.projects__track');
    const cards = $$('.pj', track);
    const counter = $('.js-proj-index');
    const bar = $('.projects__counter-bar');
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
      const skew = gsap.quickTo(cards, 'skewX', { duration: 0.6, ease: 'power3.out' });
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          pin: true,
          start: 'top top',
          end: () => '+=' + dist(),
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(cards.length, 1 + Math.round(self.progress * (cards.length - 1)));
            counter.textContent = idx;
            bar.style.setProperty('--p', Math.max(1 / cards.length, self.progress).toFixed(3));
            skew(clamp(self.getVelocity() / -320, -5, 5));
          }
        }
      });
      const settle = () => skew(0);
      ScrollTrigger.addEventListener('scrollEnd', settle);
      cards.forEach((card) => {
        const img = $('.pj__media img', card);
        const media = $('.pj__media', card);
        gsap.fromTo(img, { xPercent: 7 }, { xPercent: -7, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        gsap.fromTo(media, { clipPath: 'inset(24% 16% 0% 16% round 999px 999px 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0px 0px)', ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 102%', end: 'left 62%', scrub: true } });
      });
      return () => ScrollTrigger.removeEventListener('scrollEnd', settle);
    });
    mm.add('(max-width: 899px)', () => {
      cards.forEach((card) => {
        gsap.fromTo($('.pj__media', card), { clipPath: 'inset(16% 10% 0% 10% round 999px 999px 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0px 0px)', ease: 'none', scrollTrigger: { trigger: card, start: 'top 96%', end: 'top 55%', scrub: true } });
      });
    });
  }

  function progressStack() {
    const cards = $$('.pcard');
    cards.forEach((c, i) => c.style.setProperty('--i', i));
    if (!motion) return;
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card, {
        scale: 0.92,
        '--shade': 0.5,
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: () => 'top ' + (parseFloat(getComputedStyle(next).top) || 0) + 'px', scrub: true, invalidateOnRefresh: true }
      });
    });
    $$('.pcard__img img').forEach((img) => {
      gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img.closest('.pcard'), start: 'top bottom', end: 'top 15%', scrub: true } });
    });
  }

  function pipelineMotion() {
    if (!motion) return;
    $$('.lot').forEach((row) => {
      const rects = $$('.lot__plan rect', row);
      gsap.set(rects, { strokeDasharray: 1, strokeDashoffset: 1, fillOpacity: 0 });
      gsap.to(rects, { strokeDashoffset: 0, fillOpacity: 1, ease: 'none', stagger: { each: 0.02, from: 'start' }, scrollTrigger: { trigger: row, start: 'top 88%', end: 'top 45%', scrub: true } });
      const b = $('.lot__units b', row);
      const n = Number(b.dataset.count);
      const o = { v: 0 };
      gsap.to(o, { v: n, duration: 1.4, ease: 'power3.out', onUpdate: () => { b.textContent = Math.round(o.v); }, scrollTrigger: { trigger: row, start: 'top 85%', once: true } });
    });
  }

  function partnersMotion() {
    if (!motion) return;
    const panel = $('.partners__panel');
    if (!panel) return;
    const r = () => (narrow() ? 32 : 48);
    gsap.fromTo(panel,
      { clipPath: () => `inset(12% 7% 0% 7% round ${Math.round(window.innerWidth * 0.4)}px ${Math.round(window.innerWidth * 0.4)}px ${r()}px ${r()}px)` },
      { clipPath: () => `inset(0% 0% 0% 0% round ${r()}px ${r()}px ${r()}px ${r()}px)`, ease: 'none', scrollTrigger: { trigger: '.partners', start: 'top 95%', end: 'top 25%', scrub: true, invalidateOnRefresh: true } });
    gsap.from('.partners__ways li', { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.partners__ways', start: 'top 85%', once: true } });
  }

  function reveals() {
    if (!motion) return;
    const groups = [
      ['.numbers__grid .panel', 0.08],
      ['.contact__list > div', 0.06],
      ['.footer__grid > *', 0.08]
    ];
    groups.forEach(([sel, stagger]) => {
      const els = $$(sel);
      if (!els.length) return;
      gsap.from(els, { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', stagger, scrollTrigger: { trigger: els[0], start: 'top 88%', once: true } });
    });
  }

  function scrims() {
    const scrim = $('.stage__scrim');
    if (!hasGSAP || !scrim) return;
    $$('[data-scrim]').forEach((sec) => {
      const v = parseFloat(sec.dataset.scrim);
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => { if (self.isActive) gsap.to(scrim, { opacity: v, duration: 1.2, ease: 'power2.out', overwrite: true }); }
      });
    });
  }

  /* ---------------------------------------------------------
     Interaction details
     --------------------------------------------------------- */
  function navBehaviour() {
    const nav = $('[data-nav]');
    const toggle = $('.nav__toggle');
    const menu = $('#menu');
    let lastY = 0;
    let menuOpen = false;
    const onScroll = (y) => {
      nav.classList.toggle('is-hidden', y > lastY + 2 && y > 200 && !menuOpen);
      if (y < lastY - 2 || y < 200) nav.classList.remove('is-hidden');
      lastY = y;
    };
    if (lenis) lenis.on('scroll', (e) => onScroll(e.scroll));
    else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

    const setMenu = (open) => {
      menuOpen = open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) {
        nav.classList.remove('is-hidden');
        menu.hidden = false;
        if (lenis) lenis.stop();
        if (motion) gsap.fromTo($$('#menu nav a, .menu__foot'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.9, ease: 'expo.out' });
        const first = $('#menu nav a');
        if (first) first.focus();
      } else {
        menu.hidden = true;
        if (lenis) lenis.start();
      }
    };
    toggle.addEventListener('click', () => setMenu(!menuOpen));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { setMenu(false); toggle.focus(); } });

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.classList.contains('skip-link')) return;
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      const el = $(href);
      if (!el) return;
      e.preventDefault();
      if (menuOpen) setMenu(false);
      scrollToTarget(href === '#top' ? 0 : href);
    });
    const toTop = $('[data-to-top]');
    if (toTop) toTop.addEventListener('click', () => scrollToTarget(0));

    if (hasGSAP) {
      $$('.nav__links a').forEach((a) => {
        const sec = $(a.getAttribute('href'));
        if (!sec) return;
        ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (self) => a.classList.toggle('is-current', self.isActive) });
      });
    }
  }

  function cursor() {
    if (!finePointer || reduced || !hasGSAP) return;
    root.classList.add('has-cursor');
    const el = $('.cursor');
    el.classList.add('is-hidden');
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; el.classList.remove('is-hidden'); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => el.classList.add('is-hidden'));
    document.addEventListener('pointerover', (e) => {
      const t = e.target;
      if (!t.closest) return;
      const view = t.closest('[data-cursor="view"]');
      const link = t.closest('a, button, select, input, textarea, label, [tabindex="0"]');
      el.classList.toggle('is-view', !!view);
      el.classList.toggle('is-link', !view && !!link);
    });
    gsap.ticker.add(() => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    });
  }

  function magnetic() {
    if (!finePointer || !motion) return;
    $$('[data-magnetic]').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'power3.out' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.2);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
      });
      btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  function tilt() {
    if (!finePointer || !motion) return;
    $$('[data-tilt]').forEach((el) => {
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power3.out' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3.out' });
      const area = el.closest('section') || el;
      area.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const nx = clamp((e.clientX - (r.left + r.width / 2)) / r.width, -1, 1);
        const ny = clamp((e.clientY - (r.top + r.height / 2)) / r.height, -1, 1);
        ry(nx * 14);
        rx(-ny * 10);
      });
      area.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  function pressure() {
    const el = $('[data-pressure]');
    if (!el) return;
    const text = el.textContent.trim();
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = text;
    el.appendChild(sr);
    // letters grouped per word so the mark can wrap between words on phones
    const chars = [];
    text.split(' ').forEach((word, w) => {
      if (w) el.appendChild(document.createTextNode(' '));
      const group = document.createElement('span');
      group.className = 'footer__word-group';
      group.setAttribute('aria-hidden', 'true');
      Array.from(word).forEach((ch) => {
        const s = document.createElement('span');
        s.textContent = ch;
        group.appendChild(s);
        chars.push(s);
      });
      el.appendChild(group);
    });
    if (reduced) return;
    const setChar = (c, e) => {
      c.style.fontVariationSettings = `"wdth" ${Math.round(88 + 37 * e)}, "wght" ${Math.round(300 + 500 * e)}`;
      c.classList.toggle('is-near', e > 0.02);
    };
    if (finePointer) {
      let px = -1e5;
      let py = -1e5;
      let raf = 0;
      let centres = [];
      const measure = () => { centres = chars.map((c) => { const r = c.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }); };
      const apply = () => {
        raf = 0;
        const maxD = Math.max(160, window.innerWidth * 0.15);
        chars.forEach((c, i) => {
          const d = Math.hypot(px - centres[i][0], py - centres[i][1]);
          const t = Math.max(0, 1 - d / maxD);
          setChar(c, t * t * (3 - 2 * t));
        });
      };
      el.addEventListener('pointerenter', measure);
      el.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; if (!centres.length) measure(); if (!raf) raf = requestAnimationFrame(apply); });
      el.addEventListener('pointerleave', () => { centres = []; chars.forEach((c) => setChar(c, 0)); });
    } else if (motion) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const centre = self.progress * (chars.length + 4) - 2;
          chars.forEach((c, i) => setChar(c, Math.exp(-((i - centre) ** 2) / 5)));
        }
      });
    }
  }

  function enquiryForm() {
    const form = $('[data-enquiry]');
    if (!form) return;
    const status = $('.enquiry__status', form);
    const f = { name: $('#f-name'), phone: $('#f-phone'), email: $('#f-email'), topic: $('#f-topic'), msg: $('#f-msg') };
    let via = 'whatsapp';
    $$('button[type="submit"]', form).forEach((b) => b.addEventListener('click', () => { via = b.value; }));
    const setErr = (input, on) => {
      const field = input.closest('.field');
      const err = $('.field__error', field);
      field.classList.toggle('has-error', on);
      if (err) err.hidden = !on;
      input.setAttribute('aria-invalid', on ? 'true' : 'false');
      if (on && err) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby');
    };
    [f.name, f.phone, f.email].forEach((input) => input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') setErr(input, false); }));
    const phoneOk = (raw) => {
      const v = raw.trim();
      let d = v.replace(/\D/g, '');
      if (v.startsWith('+') && !d.startsWith('60')) return d.length >= 8 && d.length <= 15;
      if (d.startsWith('60')) d = d.slice(1);
      return /^01\d{8,9}$/.test(d) || /^0[3-9]\d{7,8}$/.test(d);
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (e.submitter && e.submitter.value) via = e.submitter.value;
      const name = f.name.value.trim();
      const phone = f.phone.value.trim();
      const email = f.email.value.trim();
      const okName = name.length >= 2;
      const okPhone = phoneOk(phone);
      const okEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      setErr(f.name, !okName);
      setErr(f.phone, !okPhone);
      setErr(f.email, !okEmail);
      if (!okName || !okPhone || !okEmail) {
        (!okName ? f.name : !okPhone ? f.phone : f.email).focus();
        status.textContent = 'Check the highlighted fields, then send again.';
        return;
      }
      const lines = [`Hello V2 Development, I would like to enquire about: ${f.topic.value}.`, '', `Name: ${name}`, `Phone: ${phone}`];
      if (email) lines.push(`Email: ${email}`);
      const msg = f.msg.value.trim();
      if (msg) lines.push('', msg);
      const text = lines.join('\n');
      if (via === 'email') {
        window.location.href = `mailto:marketing@v2-d.com.my?subject=${encodeURIComponent('Website enquiry: ' + f.topic.value)}&body=${encodeURIComponent(text)}`;
        status.textContent = 'Your email app should open with the message filled in. Press send to reach our sales team.';
      } else {
        const a = document.createElement('a');
        a.href = `https://wa.me/60126841812?text=${encodeURIComponent(text)}`;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
        status.textContent = 'WhatsApp should open with your message. Press send to reach our sales team.';
      }
    });
  }

  function lazyMap() {
    const frame = $('.contact__map iframe');
    if (!frame) return;
    const load = () => { if (!frame.src) frame.src = frame.dataset.src; };
    if (!('IntersectionObserver' in window)) { load(); return; }
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { load(); io.disconnect(); } }, { rootMargin: '600px 0px' });
    io.observe(frame);
  }

  /* ---------------------------------------------------------
     Preloader (hairline rule + counter), then the hero intro
     --------------------------------------------------------- */
  function preloader(onDone) {
    const pre = $('.preloader');
    if (!pre) { onDone(); return; }
    if (!motion) { pre.remove(); onDone(); return; }
    if (lenis) lenis.stop();
    window.scrollTo(0, 0);
    const count = $('.js-count', pre);
    let loaded = 0;
    const total = 3;
    const bump = () => { loaded++; };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(bump, bump);
    Stage.ready.then(bump, bump);
    const img = new Image();
    img.onload = img.onerror = bump;
    img.src = Stage.poster;
    const start = performance.now();
    let v = 0;
    let finished = false;
    const loop = () => {
      const el = performance.now() - start;
      let goal = Math.min(loaded / total, el / 1300);
      if (el > 3000) goal = 1;
      v += (goal - v) * 0.09;
      if (goal === 1 && v > 0.985) v = 1;
      count.textContent = Math.round(v * 100);
      pre.style.setProperty('--load', v.toFixed(3));
      if (v >= 1 && !finished) { finished = true; finish(); return; }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    function finish() {
      gsap.timeline({ onComplete: () => { pre.remove(); } })
        .to(['.preloader__count', '.preloader__mark'], { opacity: 0, y: -12, duration: 0.45, ease: 'power2.in' })
        .to('.preloader__rule', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.6, ease: 'power3.inOut' }, '<')
        .fromTo(pre, { clipPath: 'ellipse(140% 140% at 50% 0%)' }, { clipPath: 'ellipse(140% 0% at 50% 0%)', duration: 1.2, ease: 'expo.inOut' }, '-=0.1')
        .add(() => { if (lenis) lenis.start(); onDone(); }, '-=0.95');
    }
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  const year = $('.js-year');
  if (year) year.textContent = String(new Date().getFullYear());
  renderProjects();
  renderPipeline();
  renderCharts();
  chartsReveal();
  enquiryForm();
  lazyMap();

  // ScrollTriggers are created in page order so pinned scenes measure correctly
  if (motion) heroScrollPrep();
  honours();
  marquee();
  projectsMotion();
  progressStack();
  pipelineMotion();
  partnersMotion();
  reveals();
  scrims();
  navBehaviour();
  cursor();
  magnetic();
  tilt();
  pressure();

  if (hasGSAP) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        Stage.setProgress(self.progress);
        const nav = $('[data-nav]');
        if (nav) nav.style.setProperty('--progress', self.progress.toFixed(4));
      }
    });
    gsap.ticker.add((t) => Stage.tick(lenis ? lenis.velocity : 0, t));
  } else {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      Stage.setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const raf = (t) => { Stage.tick(0, t / 1000); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => {
    splitHeadings();
    manifesto();
    if (hasGSAP) ScrollTrigger.refresh();
  });
  window.addEventListener('load', () => { if (hasGSAP) ScrollTrigger.refresh(); });

  preloader(() => {
    heroIntro();
    // only follow hashes that name a real section id (the hash is untrusted input)
    const id = location.hash.slice(1);
    if (/^[a-z][a-z0-9-]*$/i.test(id) && document.getElementById(id)) {
      setTimeout(() => scrollToTarget('#' + id), 600);
    }
  });
})();
