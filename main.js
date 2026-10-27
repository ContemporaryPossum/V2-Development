/* ==========================================================================
   V2 DEVELOPMENT — Site script
   1. Builds the shared header, menu, footer and dialogs on every page.
   2. Renders residences and site progress from data.js.
   3. Runs the motion layer: preloader, smooth scroll, reveals, parallax.
   ========================================================================== */
(() => {
  'use strict';

  const SITE = window.V2_SITE;
  const PROJECTS = window.V2_PROJECTS || [];
  const PROGRESS = window.V2_PROGRESS || [];
  const UPCOMING = window.V2_UPCOMING || [];
  const AREAS = window.V2_AREAS || {};

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const body = document.body;
  const page = body.dataset.page || '';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => 'RM ' + Number(n).toLocaleString('en-MY');
  const pad2 = (n) => String(n).padStart(2, '0');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* storage unavailable */ } }
  };
  const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const projectUrl = (p) => `residence.html?p=${encodeURIComponent(p.slug)}`;
  const priceLabel = (p) => (p.status === 'completed' ? 'Sold out' : p.priceFrom ? `From ${money(p.priceFrom)}` : 'Price on request');
  const splitName = (name) => esc(name).replace(/^Taman\s+/, 'Taman<br>');

  const ARROW = '<svg class="ico-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';

  const NAV = [
    { key: 'home', href: 'index.html', label: 'Home' },
    { key: 'residences', href: 'residences.html', label: 'The Collection' },
    { key: 'about', href: 'about.html', label: 'About V2' },
    { key: 'progress', href: 'progress.html', label: 'Site Progress' },
    { key: 'partners', href: 'partners.html', label: 'Landowners & JV' },
    { key: 'contact', href: 'contact.html', label: 'Contact' }
  ];
  const MENU_IMG = {
    home: PROJECTS[0] && PROJECTS[0].cover,
    residences: AREAS.meru && AREAS.meru.img,
    about: AREAS['shah-alam'] && AREAS['shah-alam'].img,
    progress: PROGRESS[0] && PROGRESS[0].photos[0],
    partners: PROJECTS[2] && PROJECTS[2].hero,
    contact: AREAS.sepang && AREAS.sepang.img
  };

  /* ------------------------------------------------------------------------
     Shared building blocks
     ------------------------------------------------------------------------ */
  let uid = 0;
  function ring(text, cls = 'seal') {
    const id = `ring-${++uid}`;
    return `<svg class="${cls}__ring" viewBox="0 0 120 120" aria-hidden="true">
      <defs><path id="${id}" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"/></defs>
      <text><textPath href="#${id}" textLength="292" lengthAdjust="spacing">${esc(text.toUpperCase())}</textPath></text></svg>`;
  }
  const seal = () => `<span class="seal">${ring(`${SITE.name} · Est. ${SITE.established} · Selangor · `)}<span class="seal__mono">V2</span></span>`;

  function card(p, i, total) {
    const count = total ? `${pad2(i + 1)} / ${pad2(total)}` : pad2(i + 1);
    const units = p.units ? ` · ${p.units} homes` : '';
    const when = p.status === 'completed' ? 'Completed' : `Completion ${esc(p.completion)}`;
    return `<a class="card" href="${projectUrl(p)}" data-status="${p.status}" data-area="${p.area}">
      <div class="card__media"><img src="${esc(p.cover)}" alt="${esc(p.name)}, ${esc(p.locality)}" loading="lazy" decoding="async"></div>
      <div class="card__meta">
        <p class="label card__loc"><span>${count}</span><span>${esc(p.locality)}</span></p>
        <h3 class="display d-s card__name">${esc(p.name)}</h3>
        <p class="card__type muted">${esc(p.typeShort)}${units}</p>
        <p class="label card__row"><span>${esc(priceLabel(p))}</span><span>${when}</span></p>
      </div>
    </a>`;
  }

  function enquiryForm(preset = '') {
    const options = PROJECTS.filter((p) => p.status !== 'completed')
      .map((p) => `<option value="${esc(p.name)}"${p.slug === preset ? ' selected' : ''}>${esc(p.name)} — ${esc(p.locality)}</option>`).join('');
    return `<form class="form" data-form="enquiry">
      <div class="form__grid">
        <label class="field"><span class="label">Full name</span><input name="name" autocomplete="name" required></label>
        <label class="field"><span class="label">Phone</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required></label>
        <label class="field field--full"><span class="label">Email</span><input name="email" type="email" autocomplete="email"></label>
        <label class="field field--full"><span class="label">Residence of interest</span>
          <select name="residence"><option value="">Any residence</option>${options}</select></label>
        <label class="field field--full"><span class="label">Message</span><textarea name="message" rows="3"></textarea></label>
      </div>
      ${replyChoice()}
      <button class="btn btn--dark" type="submit"><span>Send enquiry</span>${ARROW}</button>
      ${formDone()}
    </form>`;
  }

  function replyChoice() {
    return `<fieldset class="form__reply"><legend class="label">Reply by</legend>
      <label><input type="radio" name="reply" value="whatsapp" checked><span>WhatsApp</span></label>
      <label><input type="radio" name="reply" value="email"><span>Email</span></label>
    </fieldset>`;
  }

  const formDone = () => `<div class="form__done" hidden role="status">
      <p class="script">Thank you</p>
      <p>Your message has been prepared. Send it from the WhatsApp or email window that just opened, and our team will be in touch.</p>
    </div>`;

  /* ------------------------------------------------------------------------
     Chrome: header, menu, rail, footer, dialogs
     ------------------------------------------------------------------------ */
  function buildChrome() {
    let curtain = $('.curtain');
    if (!curtain) {
      curtain = document.createElement('div');
      curtain.className = 'curtain';
      curtain.setAttribute('aria-hidden', 'true');
      curtain.innerHTML = `<span class="curtain__mark display">V2</span>`;
      body.prepend(curtain);
    }

    const header = document.createElement('header');
    header.className = 'hdr';
    header.innerHTML = `
      <a class="hdr__seal" href="index.html" aria-label="${esc(SITE.name)}, home">${seal()}</a>
      <nav class="hdr__nav" aria-label="Primary">
        <a class="hdr__primary display" href="residences.html">The<br>Collection</a>
        <button class="hdr__link label" type="button" data-open="enquire">Register interest</button>
        <a class="hdr__link label hide-sm" href="contact.html">Contact</a>
        <button class="hdr__menu label" type="button" aria-expanded="false" aria-controls="menu">
          <span class="hdr__burger" aria-hidden="true"><i></i><i></i></span><span class="hdr__menu-txt">Menu</span>
        </button>
      </nav>`;
    curtain.after(header);

    const menu = document.createElement('div');
    menu.className = 'menu t-wine';
    menu.id = 'menu';
    menu.hidden = true;
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Site menu');
    menu.setAttribute('data-lenis-prevent', '');
    menu.innerHTML = `
      <div class="menu__inner">
        <ol class="menu__list">
          ${NAV.map((n, i) => `<li><a href="${n.href}" data-img="${esc(MENU_IMG[n.key] || '')}"${n.key === page ? ' aria-current="page"' : ''}>
            <span class="label">${pad2(i + 1)}</span><span class="display menu__txt">${esc(n.label)}</span></a></li>`).join('')}
        </ol>
        <figure class="menu__preview" aria-hidden="true"><img alt="" src="${esc(MENU_IMG.home || '')}"></figure>
        <div class="menu__foot">
          <div><p class="label muted">Sales &amp; corporate office</p><p>${SITE.address.map(esc).join('<br>')}</p></div>
          <div><p class="label muted">Speak with us</p><p><a href="tel:${SITE.phone.tel}">${esc(SITE.phone.label)}</a><br>${SITE.marketing.map((m) => `<a href="tel:${m.tel}">${esc(m.label)}</a>`).join('<br>')}</p></div>
          <div><p class="label muted">Write &amp; follow</p><p><a href="mailto:${SITE.email}">${esc(SITE.email)}</a><br><a href="${SITE.facebook}" target="_blank" rel="noopener">Facebook</a></p></div>
        </div>
      </div>`;
    body.append(menu);

    const rail = document.createElement('div');
    rail.className = 'rail';
    rail.setAttribute('aria-hidden', 'true');
    rail.innerHTML = `<span class="rail__num label">01</span><span class="rail__line"><i></i></span><span class="rail__label label">Scroll</span>`;
    body.append(rail);

    const footer = document.createElement('footer');
    footer.className = 'ftr t-wine';
    footer.dataset.header = 'light';
    footer.innerHTML = `
      <section class="ftr__cta wrap">
        <p class="label muted" data-reveal>Register your interest</p>
        <h2 class="display d-xl" data-split>Begin your<br>next chapter</h2>
        <p class="script ftr__script" data-reveal>with your precious ones</p>
        <div class="ftr__actions" data-reveal>
          <button class="btn btn--light" type="button" data-open="enquire"><span>Book a private viewing</span>${ARROW}</button>
          <a class="btn btn--ghost" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener"><span>WhatsApp our team</span>${ARROW}</a>
        </div>
      </section>
      <section class="ftr__phone wrap">
        <span class="ftr__emblem display" aria-hidden="true">V2</span>
        <p class="label muted">Sales &amp; corporate office</p>
        <a class="display ftr__tel" href="tel:${SITE.phone.tel}">${esc(SITE.phone.label)}</a>
        <p class="label">${SITE.address.map(esc).join(', ')}</p>
        <p class="label muted">${esc(SITE.hours)}</p>
      </section>
      <div class="ftr__grid wrap">
        <div><p class="label muted">Marketing</p>${SITE.marketing.map((m) => `<p><a href="tel:${m.tel}">${esc(m.label)}</a></p>`).join('')}</div>
        <div><p class="label muted">Email</p><p><a href="mailto:${SITE.email}">${esc(SITE.email)}</a></p></div>
        <div><p class="label muted">Follow</p><p><a href="${SITE.facebook}" target="_blank" rel="noopener">Facebook</a></p>${SITE.instagram ? `<p><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a></p>` : ''}</div>
        <div><p class="label muted">Explore</p><p class="ftr__nav">${NAV.slice(1).map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join('')}</p></div>
      </div>
      <div class="ftr__base wrap">
        <p class="label muted">© <span data-year></span> ${esc(SITE.legal)} · ${esc(SITE.regNo)}</p>
        <p class="label muted">Renderings are artist's impressions. Prices and specifications are subject to change.</p>
        <a class="label" href="#top" data-top>Back to top ↑</a>
      </div>`;
    ($('main') || body.lastElementChild).after(footer);

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'enquire';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'enquire-title');
    modal.innerHTML = `
      <div class="modal__scrim" data-close></div>
      <div class="modal__panel t-ivory" data-lenis-prevent>
        <button class="modal__close label" type="button" data-close>Close ×</button>
        <p class="label muted">Register interest</p>
        <h2 class="display d-l" id="enquire-title">Book a<br>private viewing</h2>
        <p class="modal__intro muted">Leave your details and our sales team will arrange a time that suits you.</p>
        ${enquiryForm()}
      </div>`;
    body.append(modal);

    const lb = document.createElement('div');
    lb.className = 'lb';
    lb.id = 'lightbox';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML = `
      <button class="lb__close label" type="button" data-close>Close ×</button>
      <figure class="lb__fig"><img alt=""><figcaption class="label"></figcaption></figure>
      <button class="lb__nav lb__prev" type="button" aria-label="Previous image">${ARROW}</button>
      <button class="lb__nav lb__next" type="button" aria-label="Next image">${ARROW}</button>
      <span class="lb__count label"></span>`;
    body.append(lb);

    const wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = `https://wa.me/${SITE.whatsapp}`;
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat with V2 Development on WhatsApp');
    wa.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3.2A12.7 12.7 0 0 0 5.1 22.4L3.3 28.8l6.6-1.7A12.8 12.8 0 1 0 16 3.2Zm0 23.3c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.5Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8.9 3.8.8.6-.1 1.9-.8 2.2-1.5s.3-1.3.2-1.5-.3-.2-.7-.4Z"/></svg>`;
    body.append(wa);

    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /* ------------------------------------------------------------------------
     Page renderers
     ------------------------------------------------------------------------ */
  function renderHome() {
    const rail = $('#home-rail');
    if (rail) {
      const list = PROJECTS.filter((p) => p.status === 'current');
      rail.innerHTML = list.map((p, i) => card(p, i, list.length)).join('');
    }
    const marquee = $('#progress-marquee');
    if (marquee) {
      const shots = PROGRESS.flatMap((s) => s.photos.slice(0, 2).map((src) => ({ src, name: s.name, date: s.updated })));
      const strip = shots.map((s) => `<figure class="marquee__item"><img src="${esc(s.src)}" alt="Construction progress at ${esc(s.name)}" loading="lazy" decoding="async">
        <figcaption class="label"><span>${esc(s.name)}</span><span>${esc(fmtDate(s.date))}</span></figcaption></figure>`).join('');
      marquee.innerHTML = strip + strip.replace(/<figure class="marquee__item"/g, '<figure class="marquee__item" aria-hidden="true"');
    }
  }

  function renderResidences() {
    const grid = $('#res-grid');
    if (!grid) return;
    grid.innerHTML = PROJECTS.map((p, i) => card(p, i, PROJECTS.length)).join('');

    const params = new URLSearchParams(location.search);
    const state = { status: params.get('status') || 'all', area: params.get('area') || 'all' };
    const tabs = $$('[data-filter-status]');
    const areaSel = $('#area-filter');
    if (areaSel) {
      areaSel.innerHTML = `<option value="all">All locations</option>` +
        Object.entries(AREAS).map(([k, a]) => `<option value="${k}">${esc(a.name)}</option>`).join('');
      areaSel.value = AREAS[state.area] ? state.area : 'all';
    }
    const count = (status) => PROJECTS.filter((p) => status === 'all' || p.status === status).length;
    tabs.forEach((t) => { const n = $('.filters__n', t); if (n) n.textContent = pad2(count(t.dataset.filterStatus)); });

    const apply = () => {
      let shown = 0;
      $$('.card', grid).forEach((c) => {
        const ok = (state.status === 'all' || c.dataset.status === state.status) && (state.area === 'all' || c.dataset.area === state.area);
        c.hidden = !ok;
        if (ok) shown++;
      });
      tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.filterStatus === state.status)));
      const empty = $('#res-empty');
      if (empty) empty.hidden = shown > 0;
      const url = new URL(location.href);
      ['status', 'area'].forEach((k) => (state[k] === 'all' ? url.searchParams.delete(k) : url.searchParams.set(k, state[k])));
      history.replaceState(null, '', url);
      requestAnimationFrame(measure);
    };
    tabs.forEach((t) => t.addEventListener('click', () => { state.status = t.dataset.filterStatus; apply(); }));
    areaSel && areaSel.addEventListener('change', () => { state.area = areaSel.value; apply(); });
    apply();

    const up = $('#upcoming-body');
    if (up) {
      up.innerHTML = UPCOMING.map((u) => `<tr>
        <td><span class="display d-xs">${esc(u.name)}</span><span class="label muted">${esc(u.lot)}</span></td>
        <td data-th="Location">${esc(u.location)}</td><td data-th="Home type">${esc(u.type)}</td>
        <td data-th="Homes">${esc(u.units)}</td><td data-th="Land size">${esc(u.land)}</td>
        <td data-th="Status"><span class="pill">${esc(u.note)}</span></td></tr>`).join('');
    }
  }

  function renderResidence() {
    const root = $('#residence');
    if (!root) return;
    const slug = new URLSearchParams(location.search).get('p');
    const p = PROJECTS.find((x) => x.slug === slug);
    if (!p) { location.replace('residences.html'); return; }

    document.title = `${p.name}, ${p.locality} | ${SITE.name}`;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', `${p.name}: ${p.units ? p.units + ' ' : ''}${p.type.toLowerCase()} in ${p.locality}, Selangor. ${p.tenure}. ${priceLabel(p)}.`);

    const longName = p.name.replace(/^Taman\s+/, '').length > 12;
    const facts = [
      ['Home type', p.typeShort],
      ['Homes', p.units],
      ['Land size', p.land],
      ['Built-up', p.builtUp],
      ['Bedrooms', p.beds],
      ['Bathrooms', p.baths],
      ['Tenure', p.tenure],
      [p.status === 'completed' ? 'Status' : 'Completion', p.completion]
    ].filter(([, v]) => v);

    const rows = p.unitTypes.length ? p.unitTypes : [{ name: p.typeShort, beds: p.beds, baths: p.baths, units: p.units, price: p.priceFrom }];
    const others = PROJECTS.filter((x) => x.slug !== p.slug && x.status === 'current').slice(0, 6);
    const gallery = p.gallery.map((src, i) => `<a class="gal__item" href="${esc(src)}" data-lb="gallery" data-cap="${esc(p.name)} · ${pad2(i + 1)}">
        <img src="${esc(src)}" alt="${esc(p.name)} artist's impression ${i + 1}" loading="lazy" decoding="async"></a>`).join('');
    const plans = p.plans.map((pl) => `<a class="plan" href="${esc(pl.src)}" data-lb="plans" data-cap="${esc(p.name)} · ${esc(pl.label)}">
        <span class="plan__img"><img src="${esc(pl.src)}" alt="${esc(p.name)} ${esc(pl.label)}" loading="lazy" decoding="async"></span>
        <span class="plan__cap"><span class="display d-xs">${esc(pl.label)}</span><span class="label">View plan ${ARROW}</span></span></a>`).join('');
    const prog = PROGRESS.find((s) => s.slug === p.slug);
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(p.address)}&z=14&output=embed`;

    root.innerHTML = `
      <section class="phero" data-header="light">
        <div class="phero__media"><img src="${esc(p.hero)}" alt="" fetchpriority="high" data-parallax-img></div>
        <div class="phero__inner wrap">
          <p class="label" data-hero>${p.status === 'completed' ? 'Completed residence' : 'Now selling'} · ${esc(p.locality)}</p>
          <h1 class="display ${longName ? 'd-l' : 'd-xl'} phero__title" data-split data-hero>${splitName(p.name)}</h1>
          <p class="script phero__script" data-hero>${esc(AREAS[p.area] ? AREAS[p.area].name : p.locality)}</p>
        </div>
        <div class="phero__foot wrap" data-hero>
          <span class="label">${esc(priceLabel(p))}</span>
          <a class="label link-line" href="#res-enquire">Register interest</a>
        </div>
      </section>

      <section class="facts t-ivory" data-header="dark">
        <dl class="facts__grid wrap">
          ${facts.map(([k, v]) => `<div data-reveal><dt class="label muted">${esc(k)}</dt><dd class="display d-xs">${esc(v)}</dd></div>`).join('')}
        </dl>
      </section>

      <section class="res-intro section t-ivory" data-header="dark">
        <div class="wrap split-grid">
          <p class="label" data-reveal>The residence</p>
          <div>
            <h2 class="display d-m" data-split>${esc(p.intro)}</h2>
            <p class="lede muted" data-reveal>${esc(p.description)}</p>
            <ul class="perks" data-reveal>${p.perks.map((x) => `<li class="label">${esc(x)}</li>`).join('')}</ul>
          </div>
        </div>
      </section>

      <section class="units section t-stone" data-header="dark">
        <div class="wrap">
          <header class="sec-head">
            <p class="label" data-reveal>Homes &amp; pricing</p>
            <h2 class="display d-l" data-split>Choose your<br>residence</h2>
          </header>
          <div class="table-wrap" data-reveal>
            <table class="table">
              <thead><tr><th>Home type</th><th>Bedrooms</th><th>Bathrooms</th><th>Homes</th><th>Price</th></tr></thead>
              <tbody>${rows.map((r) => `<tr>
                <td data-th="Home type"><span class="display d-xs">${esc(r.name)}</span></td>
                <td data-th="Bedrooms">${esc(r.beds)}</td><td data-th="Bathrooms">${esc(r.baths)}</td>
                <td data-th="Homes">${r.units ? esc(r.units) : '—'}</td>
                <td data-th="Price">${p.status === 'completed' ? 'Sold out' : r.price ? money(r.price) : 'On request'}</td></tr>`).join('')}</tbody>
            </table>
          </div>
          <p class="fineprint muted">${esc(p.tenure)} · ${esc(p.title)}. Prices shown are as published by V2 Development and may change without notice.</p>
        </div>
      </section>

      <section class="gal section t-ink" data-header="light">
        <header class="sec-head wrap">
          <p class="label" data-reveal>Gallery · ${pad2(p.gallery.length)} images</p>
          <h2 class="display d-l" data-split>A closer<br>look</h2>
        </header>
        <div class="hscroll" data-drag><div class="hscroll__track">${gallery}</div></div>
        <div class="hscroll__ui wrap"><span class="hscroll__bar"><i></i></span>
          <span class="hscroll__btns"><button type="button" class="hscroll__btn" data-dir="-1" aria-label="Scroll gallery left">${ARROW}</button><button type="button" class="hscroll__btn" data-dir="1" aria-label="Scroll gallery right">${ARROW}</button></span></div>
      </section>

      ${p.plans.length ? `<section class="plans section t-ivory" data-header="dark">
        <div class="wrap">
          <header class="sec-head">
            <p class="label" data-reveal>Floor &amp; layout plans</p>
            <h2 class="display d-l" data-split>Room to<br>live in</h2>
          </header>
          <div class="plans__grid">${plans}</div>
        </div>
      </section>` : ''}

      <section class="loc section t-stone" data-header="dark">
        <div class="wrap loc__grid">
          <div>
            <p class="label" data-reveal>Location</p>
            <h2 class="display d-l" data-split>${esc(AREAS[p.area] ? AREAS[p.area].name : p.locality)}</h2>
            <p class="lede" data-reveal>${esc(p.address)}</p>
            <p class="loc__links" data-reveal>
              <a class="label link-line" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}" target="_blank" rel="noopener">Open in Google Maps</a>
              <a class="label link-line" href="https://waze.com/ul?q=${encodeURIComponent(p.address)}" target="_blank" rel="noopener">Open in Waze</a>
              ${prog ? `<a class="label link-line" href="progress.html#${p.slug}">Site progress · ${esc(fmtDate(prog.updated))}</a>` : ''}
            </p>
          </div>
          <div class="map" data-reveal><iframe title="Map of ${esc(p.name)}" src="${mapSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
        </div>
      </section>

      <section class="res-enquire section t-ivory" id="res-enquire" data-header="dark">
        <div class="wrap split-grid">
          <div>
            <p class="label" data-reveal>Register interest</p>
            <h2 class="display d-l" data-split>Visit<br>${esc(p.name.replace(/^Taman\s+/, ''))}</h2>
            <p class="lede muted" data-reveal>Arrange a private consultation with our sales team, or call <a class="link-line" href="tel:${SITE.phone.tel}">${esc(SITE.phone.label)}</a>.</p>
          </div>
          <div data-reveal>${enquiryForm(p.slug)}</div>
        </div>
      </section>

      ${others.length ? `<section class="more section t-ink" data-header="light">
        <header class="sec-head wrap sec-head--row">
          <h2 class="display d-l" data-split>More<br>residences</h2>
          <a class="label link-line" href="residences.html" data-reveal>View the collection</a>
        </header>
        <div class="hscroll" data-drag><div class="hscroll__track">${others.map((x, i) => card(x, i)).join('')}</div></div>
      </section>` : ''}`;
  }

  function renderProgress() {
    const root = $('#progress-list');
    if (!root) return;
    const INITIAL = 6;
    const index = $('#progress-index');
    if (index) {
      index.innerHTML = PROGRESS.map((s, i) => `<li><a href="#${s.slug || 'site-' + i}"><span class="label">${pad2(i + 1)}</span><span class="display d-xs">${esc(s.name)}</span><span class="label muted">${esc(fmtDate(s.updated))}</span></a></li>`).join('');
    }
    root.innerHTML = PROGRESS.map((s, i) => {
      const id = s.slug || 'site-' + i;
      const proj = PROJECTS.find((p) => p.slug === s.slug);
      const photos = s.photos.map((src, j) => `<a class="prog__ph" href="${esc(src)}" data-lb="${id}" data-cap="${esc(s.name)} · ${pad2(j + 1)}"${j >= INITIAL ? ' hidden' : ''}>
          <img src="${esc(src)}" alt="Construction progress at ${esc(s.name)}, photo ${j + 1}" loading="lazy" decoding="async"></a>`).join('');
      return `<section class="prog section ${i % 2 ? 't-stone' : 't-ivory'}" id="${id}" data-header="dark">
        <div class="wrap prog__grid">
          <aside class="prog__meta">
            <p class="label" data-reveal>${pad2(i + 1)} / ${pad2(PROGRESS.length)}</p>
            <h2 class="display d-m" data-split>${splitName(s.name)}</h2>
            <p class="muted" data-reveal>${esc(s.location)}</p>
            <dl class="prog__dl" data-reveal>
              <div><dt class="label muted">Last update</dt><dd>${esc(fmtDate(s.updated))}</dd></div>
              <div><dt class="label muted">Photographs</dt><dd>${s.photos.length}</dd></div>
            </dl>
            ${proj ? `<a class="label link-line" href="${projectUrl(proj)}" data-reveal>View residence</a>` : ''}
          </aside>
          <div>
            <div class="prog__photos">${photos}</div>
            ${s.photos.length > INITIAL ? `<button class="btn btn--line prog__more" type="button" data-more="${id}"><span>Show all ${s.photos.length} photographs</span></button>` : ''}
          </div>
        </div>
      </section>`;
    }).join('');

    root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-more]');
      if (!btn) return;
      $$('.prog__ph[hidden]', $('#' + btn.dataset.more)).forEach((a) => { a.hidden = false; });
      btn.remove();
      requestAnimationFrame(measure);
    });
  }

  /* ------------------------------------------------------------------------
     Overlays: menu, enquiry dialog, lightbox
     ------------------------------------------------------------------------ */
  let lenis = null;
  let lastFocus = null;
  const openLayers = new Set();

  function lockScroll(on) {
    body.classList.toggle('is-locked', on);
    if (lenis) (on ? lenis.stop() : lenis.start());
  }

  function openLayer(el) {
    if (!el || openLayers.has(el)) return;
    lastFocus = document.activeElement;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('is-open'));
    openLayers.add(el);
    lockScroll(true);
    const focusable = el.querySelector('input, select, textarea, button, a[href]');
    setTimeout(() => focusable && focusable.focus({ preventScroll: true }), 80);
  }

  function closeLayer(el) {
    if (!el || !openLayers.has(el)) return;
    el.classList.remove('is-open');
    openLayers.delete(el);
    setTimeout(() => { if (!el.classList.contains('is-open')) el.hidden = true; }, 600);
    if (!openLayers.size) lockScroll(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function initMenu() {
    const btn = $('.hdr__menu');
    const menu = $('#menu');
    const txt = $('.hdr__menu-txt');
    const preview = $('.menu__preview img');
    const toggle = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      body.classList.toggle('menu-open', open);
      txt.textContent = open ? 'Close' : 'Menu';
      open ? openLayer(menu) : closeLayer(menu);
    };
    btn.addEventListener('click', () => toggle(!openLayers.has(menu)));
    $$('.menu__list a').forEach((a) => {
      a.addEventListener('mouseenter', () => {
        if (!a.dataset.img || preview.getAttribute('src') === a.dataset.img) return;
        preview.classList.add('is-swap');
        setTimeout(() => { preview.src = a.dataset.img; preview.classList.remove('is-swap'); }, 220);
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (openLayers.has($('#lightbox'))) return closeLayer($('#lightbox'));
      if (openLayers.has($('#enquire'))) return closeLayer($('#enquire'));
      if (openLayers.has(menu)) toggle(false);
    });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) toggle(false); });
  }

  function initDialogs() {
    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-open]');
      if (opener) {
        e.preventDefault();
        const target = $('#' + opener.dataset.open);
        if (body.classList.contains('menu-open')) $('.hdr__menu').click();
        openLayer(target);
        return;
      }
      const closer = e.target.closest('[data-close]');
      if (closer) closeLayer(closer.closest('.modal, .lb'));
    });
  }

  const LB = { items: [], i: 0 };
  function initLightbox() {
    const el = $('#lightbox');
    const img = $('img', el);
    const cap = $('figcaption', el);
    const count = $('.lb__count', el);
    const show = (i) => {
      LB.i = (i + LB.items.length) % LB.items.length;
      const it = LB.items[LB.i];
      img.classList.remove('is-in');
      img.onload = () => img.classList.add('is-in');
      img.src = it.src;
      img.alt = it.cap;
      cap.textContent = it.cap;
      count.textContent = `${pad2(LB.i + 1)} / ${pad2(LB.items.length)}`;
    };
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-lb]');
      if (!t || t.dataset.dragged) return;
      e.preventDefault();
      const nodes = $$(`[data-lb="${t.dataset.lb}"]`);
      LB.items = nodes.map((n) => ({ src: n.getAttribute('href'), cap: n.dataset.cap || '' }));
      openLayer(el);
      show(nodes.indexOf(t));
    });
    $('.lb__prev', el).addEventListener('click', () => show(LB.i - 1));
    $('.lb__next', el).addEventListener('click', () => show(LB.i + 1));
    document.addEventListener('keydown', (e) => {
      if (!openLayers.has(el)) return;
      if (e.key === 'ArrowLeft') show(LB.i - 1);
      if (e.key === 'ArrowRight') show(LB.i + 1);
    });
    let sx = null;
    el.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(LB.i + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ------------------------------------------------------------------------
     Forms — compose the enquiry as a WhatsApp message or an email
     ------------------------------------------------------------------------ */
  function initForms() {
    const LABELS = { purpose: 'Enquiry', salutation: 'Salutation', name: 'Name', phone: 'Phone', email: 'Email', residence: 'Residence', land: 'Land location', size: 'Land size', message: 'Message' };
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('form[data-form]');
      if (!form) return;
      e.preventDefault();
      const fd = new FormData(form);
      const subject = form.dataset.form === 'partner' ? 'Landowner & partnership enquiry' : 'Residence enquiry';
      const lines = [`${subject} (via website)`, ''];
      for (const [k, v] of fd.entries()) {
        const val = String(v).trim();
        if (k !== 'reply' && val) lines.push(`${LABELS[k] || k}: ${val}`);
      }
      const text = lines.join('\n');
      if (fd.get('reply') === 'email') {
        location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      } else {
        window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      }
      const done = $('.form__done', form);
      if (done) done.hidden = false;
      form.classList.add('is-sent');
    });
  }

  /* ------------------------------------------------------------------------
     Text splitting & reveal on scroll
     ------------------------------------------------------------------------ */
  function splitWords(el) {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'sw';
            w.innerHTML = `<span class="sw__i" style="--i:${i++}">${esc(part)}</span>`;
            frag.append(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    el.classList.add('is-split');
  }

  function initReveals() {
    $$('[data-split]').forEach(splitWords);
    const targets = $$('[data-reveal], [data-split], .card, .gal__item, .plan, .prog__ph').filter((el) => !el.closest('.hero') && !el.hasAttribute('data-hero'));
    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((el) => io.observe(el));

    const counters = $$('[data-count]');
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        const el = en.target;
        const end = Number(el.dataset.count);
        const t0 = performance.now();
        const step = (t) => {
          const k = clamp((t - t0) / 1800, 0, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => cio.observe(el));
  }

  function revealHero() {
    $$('[data-hero]').forEach((el, i) => setTimeout(() => el.classList.add('is-in'), i * 90));
    const hero = $('.hero');
    if (hero) hero.classList.add('is-ready');
  }

  /* ------------------------------------------------------------------------
     Hero slideshow
     ------------------------------------------------------------------------ */
  function initHeroSlides() {
    const hero = $('.hero');
    if (!hero) return;
    const slides = $$('.hero__slide', hero);
    const tabs = $$('[data-slide]', hero);
    const cap = $('.hero__cap', hero);
    let i = 0;
    let timer = null;
    const DURATION = 6500;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-selected', String(k === i)); });
      if (cap) cap.textContent = slides[i].dataset.caption || '';
      const img = $('img', slides[i]);
      if (img && img.loading === 'lazy') img.loading = 'eager';
    };
    const play = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => go(i + 1), DURATION); };
    tabs.forEach((t, k) => t.addEventListener('click', () => { go(k); play(); }));
    document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(timer) : play()));
    hero.style.setProperty('--slide-ms', DURATION + 'ms');
    go(0);
    play();
  }

  /* ------------------------------------------------------------------------
     Horizontal rails — drag with the mouse, scroll natively on touch
     ------------------------------------------------------------------------ */
  function initRails() {
    $$('[data-drag]').forEach((rail) => {
      let down = false;
      let sx = 0;
      let sl = 0;
      let moved = false;
      const ui = rail.nextElementSibling && rail.nextElementSibling.classList.contains('hscroll__ui') ? rail.nextElementSibling : null;
      const bar = ui && $('.hscroll__bar i', ui);
      const update = () => {
        if (!bar) return;
        const max = rail.scrollWidth - rail.clientWidth;
        const vis = rail.clientWidth / rail.scrollWidth;
        bar.style.width = (vis * 100).toFixed(2) + '%';
        bar.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0}%)`;
      };
      rail.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
      ui && $$('.hscroll__btn', ui).forEach((b) => b.addEventListener('click', () => {
        const item = rail.querySelector('.hscroll__track > *');
        const step = item ? item.getBoundingClientRect().width + 24 : rail.clientWidth * 0.8;
        rail.scrollBy({ left: step * Number(b.dataset.dir), behavior: 'smooth' });
      }));
      rail.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
      });
      window.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - sx;
        if (!moved && Math.abs(dx) > 5) { moved = true; rail.classList.add('is-drag'); }
        if (moved) rail.scrollLeft = sl - dx;
      });
      window.addEventListener('pointerup', () => {
        if (!down) return;
        down = false;
        rail.classList.remove('is-drag');
        if (moved) {
          rail.querySelectorAll('a').forEach((a) => { a.dataset.dragged = '1'; });
          setTimeout(() => rail.querySelectorAll('a').forEach((a) => { delete a.dataset.dragged; }), 50);
        }
      });
      rail.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (a && a.dataset.dragged) { e.preventDefault(); e.stopPropagation(); }
      }, true);
      rail.addEventListener('dragstart', (e) => e.preventDefault());
    });
  }

  /* ------------------------------------------------------------------------
     Cursor label & floating image on the locations list
     ------------------------------------------------------------------------ */
  function initCursor() {
    if (!finePointer) return;
    const cur = document.createElement('div');
    cur.className = 'cursor';
    cur.innerHTML = '<span class="label">Drag</span>';
    body.append(cur);
    const float = $('.places__float');
    const fimg = float && $('img', float);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, fx = x, fy = y;
    window.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      fx += (x - fx) * 0.1; fy += (y - fy) * 0.1;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (float) float.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$('[data-drag]').forEach((r) => {
      r.addEventListener('mouseenter', () => cur.classList.add('is-on'));
      r.addEventListener('mouseleave', () => cur.classList.remove('is-on'));
    });
    if (float) {
      $$('.places__list a').forEach((a) => {
        a.addEventListener('mouseenter', () => { fimg.src = a.dataset.img; float.classList.add('is-on'); });
        a.addEventListener('mouseleave', () => float.classList.remove('is-on'));
      });
    }
  }

  /* ------------------------------------------------------------------------
     Scroll-driven layer: header theme, rail, parallax, orb reveal
     ------------------------------------------------------------------------ */
  let sections = [];
  let parallax = [];
  let parallaxImgs = [];
  let orb = null;
  let rail = null;
  let railNum = null;
  let vh = innerHeight;
  let lastY = -1;
  let dirty = true;

  function measure() {
    vh = innerHeight;
    sections = $$('[data-header]:not(body)');
    parallax = $$('[data-parallax]');
    parallaxImgs = $$('[data-parallax-img]');
    rail = $('.rail');
    railNum = rail && $('.rail__num', rail);
    orb = $('.orb');
    if (orb) {
      orb._d = $('.orb__disc', orb).offsetWidth || 1;
      orb._max = (Math.hypot(innerWidth, innerHeight) / orb._d) * 1.08;
    }
    dirty = true;
  }

  function tick() {
    const y = window.scrollY;
    if (y === lastY && !dirty) return;
    lastY = y;
    dirty = false;
    const docH = document.documentElement.scrollHeight - vh;
    body.classList.toggle('is-scrolled', y > 60);

    if (orb) {
      const r = orb.getBoundingClientRect();
      const p = reduceMotion ? 1 : clamp(-r.top / (r.height - vh), 0, 1);
      const e = easeInOut(clamp(p / 0.78, 0, 1));
      const s = 1 + (orb._max - 1) * e;
      orb.style.setProperty('--s', s.toFixed(4));
      orb.style.setProperty('--y', ((1 - e) * 46).toFixed(2) + 'vh');
      orb.style.setProperty('--o', clamp((p - 0.3) / 0.3, 0, 1).toFixed(3));
      // Header turns dark once the disc covers both top corners where it sits.
      const cy = vh / 2 + (1 - e) * 0.46 * vh;
      const reach = Math.hypot(innerWidth / 2 - 40, cy - 60);
      orb.dataset.header = (orb._d / 2) * s > reach ? 'dark' : 'light';
    }

    const probe = 44;
    let theme = 'light';
    let num = 1;
    for (let k = 0; k < sections.length; k++) {
      const r = sections[k].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) { theme = sections[k].dataset.header; num = k + 1; break; }
    }
    if (body.dataset.header !== theme) body.dataset.header = theme;

    if (rail) {
      rail.style.setProperty('--p', docH > 0 ? (y / docH).toFixed(4) : 0);
      const label = pad2(num);
      if (railNum.textContent !== label) railNum.textContent = label;
    }

    if (reduceMotion) return;

    for (const el of parallax) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const speed = Number(el.dataset.parallax) || 0.1;
      const off = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
    }
    for (const img of parallaxImgs) {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const k = clamp((vh - r.top) / (vh + r.height), 0, 1);
      img.style.transform = `translate3d(0, ${((k - 0.5) * 16).toFixed(2)}%, 0)`;
    }
  }

  function initScroll() {
    if (!reduceMotion && typeof window.Lenis === 'function') {
      lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
      document.documentElement.classList.add('has-lenis');
    }
    const loop = (t) => {
      if (lenis) lenis.raf(t);
      tick();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', () => {
      measure();
      const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) setTimeout(() => (lenis ? lenis.scrollTo(target, { immediate: true }) : target.scrollIntoView()), 60);
    });

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
      else window.scrollTo({ top: target === 0 ? 0 : target.getBoundingClientRect().top + scrollY, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     Preloader (home, first visit) and page transitions
     ------------------------------------------------------------------------ */
  function initTransitions() {
    const curtain = $('.curtain');
    const loader = $('#loader');
    const firstVisit = !session.get('v2-seen');
    session.set('v2-seen', '1');

    if (loader && firstVisit && !reduceMotion) {
      curtain.classList.add('is-gone');
      if (lenis) lenis.stop();
      const count = $('.loader__count', loader);
      const img = $('.loader__img img', loader);
      const imgReady = new Promise((res) => {
        if (img.complete) res();
        else { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); }
        setTimeout(res, 3500);
      });
      const t0 = performance.now();
      let ready = false;
      imgReady.then(() => { ready = true; });
      const step = (t) => {
        const k = clamp((t - t0) / 1900, 0, ready ? 1 : 0.92);
        count.textContent = Math.round(easeInOut(k) * 100);
        if (k < 1) return requestAnimationFrame(step);
        loader.classList.add('is-open');
        setTimeout(() => {
          loader.classList.add('is-done');
          revealHero();
          if (lenis) lenis.start();
        }, 1350);
        setTimeout(() => loader.remove(), 2300);
      };
      requestAnimationFrame(step);
    } else {
      if (loader) loader.remove();
      setTimeout(() => {
        curtain.classList.add('is-gone');
        setTimeout(revealHero, 250);
      }, 40);
    }

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === '_blank' || a.hasAttribute('download') || a.dataset.lb !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      e.preventDefault();
      curtain.classList.remove('is-gone');
      curtain.classList.add('is-leaving');
      setTimeout(() => { location.href = url.href; }, reduceMotion ? 0 : 620);
    });
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) { curtain.classList.remove('is-leaving'); curtain.classList.add('is-gone'); }
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  buildChrome();
  if (page === 'home') renderHome();
  if (page === 'residences') renderResidences();
  if (page === 'residence') renderResidence();
  if (page === 'progress') renderProgress();
  $$('[data-enquiry-form]').forEach((el) => { el.innerHTML = enquiryForm(el.dataset.enquiryForm); });
  $$('[data-reply-choice]').forEach((el) => { el.outerHTML = replyChoice() + formDone(); });

  initScroll();
  initMenu();
  initDialogs();
  initLightbox();
  initForms();
  initReveals();
  initHeroSlides();
  initRails();
  initCursor();
  initTransitions();
})();
