/* =====================================================================
   V2 Development — interaction & motion
   Lenis smooth scroll drives GSAP ScrollTrigger; a fixed film is scrubbed
   by scroll inside "window" sections; sections flip the page theme.
   ===================================================================== */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------------------------------------------ */
  /* Project data (drawer). Source: v2-d.com listings, Oct 2026.        */
  /* Add `permit: "..."` to show a developer licence / advertising     */
  /* permit line for a project.                                         */
  /* ------------------------------------------------------------------ */
  const PROJECTS = {
    "harmoni-sepang": {
      name: "Taman Harmoni", area: "Sungai Pelek, Sepang", interest: "Taman Harmoni, Sepang",
      desc: "Twenty-nine bungalows and semi-detached homes on generous 40′ × 85′ freehold lots in Sungai Pelek — the most expansive collection V2 has built to date.",
      specs: [["Home types", "Bungalows & semi-detached"], ["Homes", "29"], ["Land size", "40′ × 85′"], ["Built-up", "From 1,800 sq ft"], ["Tenure", "Freehold · Individual title"], ["Completion", "2028"]],
      units: [["Single-storey semi-D", 18, "RM 688,000"], ["Single-storey bungalow", 1, "RM 888,000"], ["Double-storey semi-D", 8, "RM 938,000"], ["Double-storey bungalow", 2, "RM 1,550,000"]],
      perks: ["Free SPA legal fees"],
      images: ["harmoni-sepang.webp", "harmoni-sepang-aerial.webp", "harmoni-bungalow-2.webp", "harmoni-semid-1.webp"],
      map: "Taman Harmoni Indah 1, Sungai Pelek, Sepang, Selangor",
    },
    "meru-permai": {
      name: "Taman Meru Permai", area: "Jalan Jambu, Meru, Klang", interest: "Taman Meru Permai",
      desc: "Thirty freehold homes in Meru: one double-storey bungalow, six single-storey semi-detached homes and twenty-three single-storey terraces.",
      specs: [["Home types", "Bungalow, semi-D & terrace"], ["Homes", "30"], ["Terrace land", "20′ × 82′"], ["Built-up", "From 1,200 sq ft"], ["Tenure", "Freehold · Malay Reserve · Individual title"], ["Completion", "2028"]],
      units: [["Single-storey terrace", 23, "RM 470,000"], ["Single-storey semi-D", 6, "RM 680,000"], ["Double-storey bungalow", 1, "RM 1,700,000"]],
      perks: ["Free SPA legal fees", "Free MOT"],
      images: ["meru-permai.webp", "meru-permai-aerial.webp", "meru-permai-2.webp"],
      map: "Jalan Jambu, Meru, Klang, Selangor",
    },
    "desa-bukit-permata": {
      name: "Taman Desa Bukit Permata", area: "Jalan Kempas 1, Meru, Klang", interest: "Taman Desa Bukit Permata",
      desc: "Thirty double-storey terrace homes with 1,860 sq ft of built-up space — four bedrooms, three bathrooms and parking for two.",
      specs: [["Home type", "Double-storey terrace"], ["Homes", "30"], ["Land size", "20′ × 80′"], ["Built-up", "1,860 sq ft"], ["Layout", "4 bed · 3 bath · 2 car parks"], ["Tenure", "Freehold · Malay Reserve · Individual title"], ["Completion", "2028"]],
      units: [["Double-storey terrace", 30, "RM 681,000"]],
      perks: ["Free SPA legal fees", "Free MOT"],
      images: ["desa-bukit-permata.webp", "desa-bukit-permata-aerial.webp", "desa-bukit-permata-2.webp", "progress-desa-bukit-permata.webp"],
      map: "Jalan Kempas 1, Meru, Klang, Selangor",
    },
    "khalid-al-walid-3": {
      name: "Taman Khalid Al-Walid 3", area: "Jalan Kebun, Shah Alam", interest: "Taman Khalid Al-Walid 3",
      desc: "Twenty-four double-storey terrace homes at Jalan Tanjung Api-Api (Lorong Universiti), Jalan Kebun — documented from cleared land to finished homes.",
      specs: [["Home type", "Double-storey terrace"], ["Homes", "24"], ["Land size", "20′ × 60′"], ["Built-up", "1,800 sq ft"], ["Layout", "4 bed · 3 bath · 2 car parks"], ["Tenure", "Freehold · Malay Reserve · Individual title"], ["Completion", "2024"]],
      units: [["Double-storey terrace", 24, "Price on request"]],
      perks: ["Free SPA legal fees", "Free MOT"],
      images: ["khalid-al-walid-3.webp", "khalid-al-walid-3-aerial.webp", "khalid-al-walid-3-b.webp", "progress-kaw-2026-02.webp"],
      map: "Lorong Universiti, Jalan Kebun, Shah Alam, Selangor",
    },
    "dato-ahmad-razali-2": {
      name: "Taman Dato Ahmad Razali 2", area: "Jalan Dato Ahmad Razali, Pulau Indah", interest: "Taman Dato Ahmad Razali 2",
      desc: "Twenty-seven single-storey terrace homes in Pulau Indah — four bedrooms on freehold land, at an accessible entry price.",
      specs: [["Home type", "Single-storey terrace"], ["Homes", "27"], ["Land size", "20′ × 73′"], ["Built-up", "1,040 sq ft"], ["Layout", "4 bed · 2 bath · 2 car parks"], ["Tenure", "Freehold · Malay Reserve · Individual title"], ["Completion", "2029"]],
      units: [["Single-storey terrace", 27, "RM 370,000"]],
      perks: ["Free SPA legal fees", "Free MOT"],
      images: ["dato-ahmad-razali-2.webp", "dato-ahmad-razali-2-aerial.webp", "dato-ahmad-razali-2-b.webp", "progress-dato-ahmad-razali-2.webp"],
      map: "Jalan Dato Ahmad Razali, Pulau Indah, Klang, Selangor",
    },
    "dato-harun-5": {
      name: "Taman Dato Harun 5", area: "Jalan Dato Harun, Pulau Indah", interest: "Taman Dato Harun 5",
      desc: "Twenty-seven single-storey terrace homes at Kampung Sungai Kembong, Pulau Indah — four bedrooms and two bathrooms on freehold land.",
      specs: [["Home type", "Single-storey terrace"], ["Homes", "27"], ["Land size", "20′ × 68′"], ["Built-up", "1,020 sq ft"], ["Layout", "4 bed · 2 bath · 2 car parks"], ["Tenure", "Freehold · Malay Reserve · Individual title"], ["Completion", "2028"]],
      units: [["Single-storey terrace", 27, "Price on request"]],
      perks: ["Free SPA legal fees", "Free MOT"],
      images: ["dato-harun-5.webp", "dato-harun-5-aerial.webp", "progress-dato-harun-5.webp"],
      map: "Jalan Dato Harun, Pulau Indah, Selangor 42920",
    },
    "tok-muda-berjaya": {
      name: "Taman Tok Muda Berjaya", area: "Jalan Masjid, Kampung Tok Muda, Kapar", interest: "Taman Tok Muda Berjaya",
      desc: "Forty-six single-storey terrace homes in Kampung Tok Muda, Kapar — four bedrooms, two bathrooms, freehold.",
      specs: [["Home type", "Single-storey terrace"], ["Homes", "46"], ["Land size", "20′ × 66′"], ["Built-up", "1,020 sq ft"], ["Layout", "4 bed · 2 bath · 2 car parks"], ["Tenure", "Freehold · Malay Reserve · Individual title"], ["Completion", "2026"]],
      units: [["Single-storey terrace", 46, "Price on request"]],
      perks: ["Free SPA legal fees", "Free MOT"],
      images: ["tok-muda-berjaya.webp", "tok-muda-berjaya-aerial.webp", "tok-muda-berjaya-2.webp"],
      map: "Jalan Masjid, Kampung Tok Muda, Kapar, Selangor 42200",
    },
    "tok-muda-sejahtera": {
      name: "Taman Tok Muda Sejahtera", area: "Jalan Tok Muda 1, Kapar", interest: "Something else",
      desc: "Sixty-nine single-storey terrace homes in Kapar — completed and fully sold.",
      specs: [["Home type", "Single-storey terrace"], ["Homes", "69"], ["Land size", "20′ × 64′"], ["Built-up", "1,020 sq ft"], ["Layout", "4 bed · 2 bath · 2 car parks"], ["Tenure", "Freehold · Malay Reserve · Individual title"], ["Status", "Completed · Sold out"]],
      units: [["Single-storey terrace", 69, "RM 392,000 (sold out)"]],
      perks: ["Completed 2025"],
      images: ["tok-muda-sejahtera.webp", "tok-muda-sejahtera-aerial.webp"],
      map: "Jalan Tok Muda 1, Kapar, Klang, Selangor",
    },
    "imam-yusof-5": {
      name: "Taman Imam Yusof 5", area: "Jalan Imam Yusof, Pulau Indah", interest: "Taman Imam Yusof 5",
      desc: "Ninety-one single-storey terrace homes at Taman Imam Yusof, Pulau Indah — V2's largest single development.",
      specs: [["Home type", "Single-storey terrace"], ["Homes", "91"], ["Layout", "4 bed · 2 bath · 2 car parks"], ["Tenure", "Freehold · Malay Reserve · Individual title"], ["Completion", "2024"]],
      units: [["Single-storey terrace", 91, "Price on request"]],
      perks: ["Free SPA legal fees", "Free MOT"],
      images: ["imam-yusof-5.webp", "imam-yusof-5-aerial.webp"],
      map: "Jalan Imam Yusof, Pulau Indah, Selangor",
    },
  };

  const WHATSAPP = "60126841812";
  const EMAIL = "marketing@v2-d.com.my";

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ------------------------------------------------------------------ */
  /* Without GSAP (CDN blocked) the page still works as a static site.  */
  /* ------------------------------------------------------------------ */
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const intro = $("[data-intro]");
  if (!hasGSAP || reduceMotion) {
    root.classList.add("no-intro");
    intro && intro.remove();
  }
  if (intro) intro.classList.add("intro--js");

  /* ------------------------------------------------------------------ */
  /* Enquiry form, drawer and menu work with or without GSAP            */
  /* ------------------------------------------------------------------ */
  const form = $("[data-form]");
  const interestSelect = $("[data-interest-select]");

  function setInterest(text) {
    if (!interestSelect || !text) return;
    const opts = Array.from(interestSelect.options);
    const exact = opts.find((o) => o.text === text);
    if (exact) {
      interestSelect.value = exact.value;
      return;
    }
    if (/^upcoming/i.test(text)) {
      interestSelect.value = "Upcoming launches";
      const msg = form.elements.message;
      if (msg && !msg.value) msg.value = `I'd like to register interest in ${text.replace(/^Upcoming:\s*/i, "")}.`;
    }
  }

  if (form) {
    let via = "whatsapp";
    $$("button[type=submit]", form).forEach((b) => b.addEventListener("click", () => (via = b.value)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements;
      const err = $("[data-form-error]");
      const name = f.name.value.trim();
      const phone = f.phone.value.trim();
      if (!name || !phone) {
        err.textContent = "Please add your name and phone number.";
        (!name ? f.name : f.phone).focus();
        return;
      }
      err.textContent = "";
      const lines = [
        "Hello V2 Development,",
        `I'm interested in: ${f.interest.value}`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        f.email.value.trim() ? `Email: ${f.email.value.trim()}` : "",
        f.message.value.trim() ? `Message: ${f.message.value.trim()}` : "",
      ].filter(Boolean);
      const text = lines.join("\n");
      if (via === "email") {
        location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Website enquiry: " + f.interest.value)}&body=${encodeURIComponent(text)}`;
      } else {
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Smooth scroll                                                       */
  /* ------------------------------------------------------------------ */
  let lenis = null;
  if (hasGSAP && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.4 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const expoInOut = (t) => (t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2);

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.8, easing: expoInOut });
    else (typeof target === "string" ? $(target) : target)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"], [data-interest]');
    if (!a) return;
    if (a.dataset.interest) setInterest(a.dataset.interest);
    const href = a.getAttribute("href");
    if (!href || href.length < 2 || !href.startsWith("#")) return;
    const target = $(href);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (drawerOpen) closeDrawer();
    scrollToTarget(href === "#top" ? 0 : target);
  });

  $("[data-to-top]")?.addEventListener("click", () => scrollToTarget(0));

  /* ------------------------------------------------------------------ */
  /* Mobile menu                                                         */
  /* ------------------------------------------------------------------ */
  const menu = $("[data-menu]");
  const menuToggle = $("[data-menu-toggle]");
  let menuOpen = false;

  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    root.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    lenis?.stop();
    if (hasGSAP) {
      gsap.set(menu, { visibility: "visible" });
      gsap.to(menu, { clipPath: "circle(150% at calc(100% - 40px) 40px)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo($$(".menu__links a", menu), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.05, ease: "expo.out", delay: 0.25 });
    } else {
      menu.style.visibility = "visible";
      menu.style.clipPath = "none";
    }
  }
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    root.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    lenis?.start();
    if (hasGSAP) {
      gsap.to(menu, { clipPath: "circle(0% at calc(100% - 40px) 40px)", duration: 0.7, ease: "expo.inOut", onComplete: () => gsap.set(menu, { visibility: "hidden" }) });
    } else {
      menu.style.visibility = "hidden";
    }
  }
  menuToggle?.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));

  /* ------------------------------------------------------------------ */
  /* Project drawer                                                      */
  /* ------------------------------------------------------------------ */
  const drawer = $("[data-drawer]");
  const panel = $(".drawer__panel", drawer);
  let drawerOpen = false;
  let lastFocus = null;

  function fillDrawer(p) {
    $("[data-drawer-area]").textContent = p.area;
    $("[data-drawer-title]").textContent = p.name;
    $("[data-drawer-desc]").textContent = p.desc;
    $("[data-drawer-gallery]").innerHTML = p.images
      .map((src, i) => `<figure><img src="${src}" alt="${p.name} — image ${i + 1}" ${i ? 'loading="lazy"' : ""} />${src.startsWith("progress") ? "" : '<span class="ai mono">Artist\'s impression</span>'}</figure>`)
      .join("");
    const specs = p.permit ? [...p.specs, ["Permit", p.permit]] : p.specs;
    $("[data-drawer-specs]").innerHTML = specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    $("[data-drawer-units]").innerHTML =
      `<table><thead><tr><th>Home type</th><th>Homes</th><th>Price</th></tr></thead><tbody>` +
      p.units.map(([t, n, price]) => `<tr><td>${t}</td><td>${n}</td><td>${price}</td></tr>`).join("") +
      `</tbody></table>`;
    $("[data-drawer-perks]").innerHTML = p.perks.map((x) => `<li>${x}</li>`).join("");
    const enquire = $("[data-drawer-enquire]");
    enquire.dataset.interest = p.interest;
    $("[data-drawer-map]").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.map)}`;
  }

  function openDrawer(slug) {
    const p = PROJECTS[slug];
    if (!p || !drawer) return;
    fillDrawer(p);
    lastFocus = document.activeElement;
    drawerOpen = true;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    panel.scrollTop = 0;
    lenis?.stop();
    if (hasGSAP) {
      gsap.killTweensOf([panel, ".drawer__backdrop"]);
      gsap.to(".drawer__backdrop", { opacity: 1, duration: 0.6, ease: "power2.out" });
      gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 1, ease: "expo.out" });
      gsap.fromTo($$(".drawer__gallery figure, .drawer__body > *", panel), { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, stagger: 0.04, ease: "expo.out", delay: 0.15 });
    } else {
      $(".drawer__backdrop").style.opacity = 1;
    }
    setTimeout(() => $(".drawer__close", panel).focus({ preventScroll: true }), 50);
  }

  function closeDrawer() {
    if (!drawerOpen) return;
    drawerOpen = false;
    drawer.setAttribute("aria-hidden", "true");
    lenis?.start();
    const done = () => drawer.classList.remove("is-open");
    if (hasGSAP) {
      gsap.to(".drawer__backdrop", { opacity: 0, duration: 0.5 });
      gsap.to(panel, { xPercent: 100, duration: 0.7, ease: "expo.in", onComplete: done });
    } else done();
    lastFocus?.focus?.({ preventScroll: true });
  }

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-project], .pcard[data-project]");
    if (opener) {
      openDrawer(opener.dataset.openProject || opener.dataset.project);
      return;
    }
    if (e.target.closest("[data-drawer-close]")) closeDrawer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      closeMenu();
    }
  });

  /* ------------------------------------------------------------------ */
  /* Signature residence — unit rows swap the arch image                 */
  /* ------------------------------------------------------------------ */
  const unitRows = $$("[data-units] .units__row");
  const archImgs = $$(".arch__img");
  function activateUnit(row) {
    const i = unitRows.indexOf(row);
    unitRows.forEach((r) => r.classList.toggle("is-active", r === row));
    archImgs.forEach((img, j) => img.classList.toggle("is-active", j === i));
  }
  unitRows.forEach((row) => {
    row.addEventListener("mouseenter", () => activateUnit(row));
    row.addEventListener("focus", () => activateUnit(row));
    row.addEventListener("click", () => activateUnit(row));
  });

  /* ------------------------------------------------------------------ */
  /* Charts: lazy-load the Bklit bundle as the section approaches        */
  /* ------------------------------------------------------------------ */
  let chartsLoaded = false;
  function loadCharts() {
    if (chartsLoaded) return;
    chartsLoaded = true;
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "v2-charts.css";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = "v2-charts.js";
    js.defer = true;
    document.body.appendChild(js);
  }
  const record = $("#record");
  if (record && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.some((en) => en.isIntersecting) && (loadCharts(), io.disconnect()),
      { rootMargin: "150% 0px" }
    );
    io.observe(record);
  } else loadCharts();

  if (!hasGSAP) return;

  /* ================================================================== */
  /*                       MOTION (GSAP from here)                       */
  /* ================================================================== */
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  gsap.set(panel, { xPercent: 100 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  const nav = $("[data-nav]");
  const bar = $(".scrollbar span");
  lenis?.on("scroll", ({ scroll, direction, progress }) => {
    nav.classList.toggle("is-scrolled", scroll > 40);
    nav.classList.toggle("is-hidden", direction === 1 && scroll > innerHeight * 0.7 && !menuOpen);
    if (bar) bar.style.transform = `scaleY(${progress})`;
  });

  /* ---------- theme flips by section ---------- */
  function setTheme(t) {
    if (root.dataset.theme !== t) root.dataset.theme = t;
  }

  /* ---------- background film ---------- */
  const film = {
    el: $("[data-film]"),
    v: $(".film__video"),
    target: 0,
    cur: 0,
    ready: false,
    windows: new Set(),
  };

  function loadFilm() {
    const v = film.v;
    const src = v.dataset.src;
    if (!src) return;
    const attach = (url) => {
      v.src = url;
      v.load();
    };
    v.addEventListener(
      "loadeddata",
      () => {
        film.ready = true;
        const p = v.play();
        if (p && p.then) p.then(() => v.pause()).catch(() => {});
        else v.pause();
        v.currentTime = film.cur;
      },
      { once: true }
    );
    // Whole file in memory = instant, smooth seeking while scrubbing.
    fetch(src)
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((b) => attach(URL.createObjectURL(b)))
      .catch(() => attach(src));
  }

  function filmWindow(el, t0, t1, getProgress) {
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (s) => {
        s.isActive ? film.windows.add(el) : film.windows.delete(el);
        film.el.classList.toggle("is-off", film.windows.size === 0);
      },
      onUpdate: (s) => {
        const p = getProgress ? getProgress(s) : s.progress;
        film.target = t0 + (t1 - t0) * Math.min(1, Math.max(0, p));
      },
    });
  }

  gsap.ticker.add(() => {
    if (!film.ready || film.windows.size === 0) return;
    film.cur += (film.target - film.cur) * 0.12;
    const v = film.v;
    if (!v.seeking && Math.abs(v.currentTime - film.cur) > 0.035) v.currentTime = film.cur;
  });

  // pointer parallax on the film
  if (finePointer) {
    const fx = gsap.quickTo(film.v, "x", { duration: 1.4, ease: "power3.out" });
    const fy = gsap.quickTo(film.v, "y", { duration: 1.4, ease: "power3.out" });
    addEventListener("mousemove", (e) => {
      fx((e.clientX / innerWidth - 0.5) * -26);
      fy((e.clientY / innerHeight - 0.5) * -18);
    });
  }

  /* ---------- custom cursor ---------- */
  if (finePointer) {
    root.classList.add("has-cursor");
    const cursor = $(".cursor");
    const dot = $(".cursor__dot");
    const ring = $(".cursor__ring");
    const label = $(".cursor__label");
    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });
    addEventListener("mousemove", (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    });
    document.addEventListener("mouseover", (e) => {
      const lab = e.target.closest("[data-cursor]");
      const hov = e.target.closest("a, button, [data-hover], .units__row, select, input, textarea, summary");
      cursor.classList.toggle("is-label", !!lab);
      cursor.classList.toggle("is-hover", !lab && !!hov);
      if (lab) label.textContent = lab.dataset.cursor;
    });
    document.addEventListener("mouseleave", () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 }));
    document.addEventListener("mouseenter", () => gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 }));

    // magnetic buttons
    $$("[data-magnetic]").forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const my = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.28);
        my((e.clientY - r.top - r.height / 2) * 0.38);
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
      });
    });

    // pillars: floating preview image
    const hover = $("[data-hover-follow]");
    if (hover) {
      const himg = $("img", hover);
      const hx = gsap.quickTo(hover, "x", { duration: 0.7, ease: "power3" });
      const hy = gsap.quickTo(hover, "y", { duration: 0.7, ease: "power3" });
      $$("[data-hover-img]").forEach((row) => {
        row.addEventListener("mouseenter", () => {
          himg.src = row.dataset.hoverImg;
          hover.classList.add("is-on");
        });
        row.addEventListener("mouseleave", () => hover.classList.remove("is-on"));
        row.addEventListener("mousemove", (e) => {
          hx(e.clientX + 30);
          hy(e.clientY - 120);
        });
      });
    }
  }

  /* ---------- everything scroll-driven is built once fonts are in ---------- */
  const fontsReady = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]) : Promise.resolve();

  // Hide hero copy until the intro hands over.
  const heroBits = $$(".hero__line > span");
  if (intro && intro.isConnected) {
    gsap.set(heroBits, { yPercent: 115 });
    gsap.set([".hero__eyebrow", ".hero__foot", ".hero__hud", ".hero__scroll", ".nav"], { autoAlpha: 0 });
    gsap.set(film.el, { scale: 1.25 });
  }

  if (!reduceMotion) loadFilm();

  fontsReady.then(() => {
    buildScenes();
    if (intro && intro.isConnected) playIntro();
    ScrollTrigger.refresh();
  });

  /* ---------- intro ---------- */
  function heroIn() {
    const tl = gsap.timeline();
    tl.to(film.el, { scale: 1, duration: 2.2, ease: "expo.out" }, 0)
      .to(heroBits, { yPercent: 0, duration: 1.5, stagger: 0.11, ease: "expo.out" }, 0.05)
      .to([".hero__eyebrow", ".hero__foot"], { autoAlpha: 1, duration: 1.2, stagger: 0.1, ease: "power2.out" }, 0.45)
      .fromTo(".hero__foot", { y: 30 }, { y: 0, duration: 1.4, ease: "expo.out" }, 0.45)
      .to([".nav", ".hero__hud", ".hero__scroll"], { autoAlpha: 1, duration: 1.2, ease: "power2.out" }, 0.7);
    return tl;
  }

  function playIntro() {
    lenis?.stop();
    window.scrollTo(0, 0);
    const counter = { v: 0 };
    const countEl = $("[data-intro-count]", intro);
    gsap.set(".intro__word span", { yPercent: 115 });
    gsap.set(".intro__tag", { autoAlpha: 0, y: 14 });
    gsap.set(".intro__base", { scaleX: 0, transformOrigin: "50% 50%" });
    gsap.set(".intro__sun", { y: 26 });

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      onComplete: () => {
        intro.remove();
        lenis?.start();
      },
    });
    tl.to(".intro__horizon", { scaleX: 1, duration: 1.3, ease: "power3.inOut" }, 0)
      .to(counter, { v: 100, duration: 2.3, ease: "power2.inOut", onUpdate: () => (countEl.textContent = String(Math.round(counter.v)).padStart(3, "0")) }, 0)
      .to(".intro__clip-sun", { attr: { y: 48 }, duration: 1.5, ease: "power3.out" }, 0.25)
      .to(".intro__sun", { y: 0, duration: 1.6, ease: "power3.out" }, 0.25)
      .to(".intro__clip-red", { attr: { y: 48 }, duration: 1.3, ease: "power4.out" }, 0.6)
      .to(".intro__base", { scaleX: 1, duration: 1.1 }, 0.75)
      .to(".intro__word span", { yPercent: 0, duration: 1, stagger: 0.035 }, 0.95)
      .to(".intro__tag", { autoAlpha: 1, y: 0, duration: 1 }, 1.3)
      .to(".intro__stage", { y: -30, autoAlpha: 0, duration: 0.7, ease: "power3.in" }, 2.55)
      .to([".intro__horizon", ".intro__count", ".intro__meta"], { autoAlpha: 0, duration: 0.4, ease: "power1.in" }, 2.55)
      .to(".intro__panel--top", { yPercent: -100, duration: 1.25, ease: "expo.inOut" }, 2.85)
      .to(".intro__panel--bottom", { yPercent: 100, duration: 1.25, ease: "expo.inOut" }, 2.85)
      .add(heroIn(), 3.3);

    // click to skip
    intro.addEventListener("click", () => tl.progress() < 0.75 && tl.seek(2.85), { once: true });
  }

  /* ---------- scenes ---------- */
  function buildScenes() {
    const mm = gsap.matchMedia();

    // theme flips (in document order)
    $$("main [data-theme], footer[data-theme]").forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (s) => s.isActive && setTheme(sec.dataset.theme),
      });
    });

    /* HERO: film window + parallax exit */
    const hero = $(".hero");
    film.windows.add(hero);
    filmWindow(hero, 0, 2.6, (s) => s.scroll() / Math.max(1, hero.offsetHeight));
    if (reduceMotion) return buildStatic();
    gsap.to(film.v, { scale: 1.14, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__inner", { yPercent: -18, autoAlpha: 0.15, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    $$(".hero__line").forEach((line, i) => {
      gsap.to(line, { xPercent: (i % 2 ? 1 : -1) * 6, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    });

    /* Headline line reveals */
    if (window.SplitText) {
      $$("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.3,
              stagger: 0.1,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
        });
      });

      /* Manifesto: words light up as you read */
      const mtext = $("[data-words]");
      if (mtext) {
        const split = SplitText.create(mtext, { type: "words", wordsClass: "w" });
        gsap.to(split.words, {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: mtext, start: "top 78%", end: "bottom 42%", scrub: 0.6 },
        });
      }
    }

    /* Generic fade-up reveals */
    gsap.set("[data-reveal]", { autoAlpha: 0, y: 46 });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 90%",
      once: true,
      onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.09, ease: "expo.out", overwrite: true }),
    });

    /* Counters */
    $$("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const pad = parseInt(el.dataset.pad || "0", 10);
      const fmt = (v) => {
        const s = v.toFixed(dec);
        return pad ? s.padStart(pad, "0") : Number(s).toLocaleString("en-US", { minimumFractionDigits: dec });
      };
      const o = { v: 0 };
      el.textContent = fmt(0);
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => gsap.to(o, { v: end, duration: 2.2, ease: "expo.out", onUpdate: () => (el.textContent = fmt(o.v)) }),
      });
    });

    /* PORTFOLIO: pinned horizontal track on desktop */
    mm.add("(min-width: 768px)", () => {
      const track = $("[data-track]");
      const pin = $(".portfolio__pin");
      const prog = $("[data-track-progress]");
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 0.9,
          invalidateOnRefresh: true,
          refreshPriority: 3,
          onUpdate: (s) => (prog.style.transform = `scaleX(${s.progress})`),
        },
      });
      $$(".pcard__media img", track).forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -7 },
          { xPercent: 7, ease: "none", scrollTrigger: { trigger: img.closest(".pcard"), containerAnimation: tween, start: "left right", end: "right left", scrub: true } }
        );
      });
      $$(".pcard", track).forEach((card, i) => {
        gsap.from(card, {
          y: i % 2 ? 80 : 40,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "left 55%", scrub: true },
        });
      });
    });
    mm.add("(max-width: 767px)", () => {
      $$(".pcard").forEach((card) => {
        gsap.from(card, { autoAlpha: 0, y: 60, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 90%", once: true } });
      });
    });

    /* SIGNATURE: arch opens with scroll */
    gsap.fromTo(
      "[data-arch]",
      { clipPath: "inset(26% 16% 0% 16% round 50vw 50vw 6px 6px)" },
      { clipPath: "inset(0% 0% 0% 0% round 50vw 50vw 6px 6px)", ease: "none", scrollTrigger: { trigger: "[data-arch]", start: "top 95%", end: "top 25%", scrub: true } }
    );
    gsap.fromTo("[data-arch]", { yPercent: 8 }, { yPercent: -6, ease: "none", scrollTrigger: { trigger: ".signature", start: "top bottom", end: "bottom top", scrub: true } });

    /* JOURNEY: the film travels across Selangor while pinned */
    const journey = $(".journey");
    const words = $$("[data-journey-word] span");
    const infos = $$("[data-journey-info] p");
    const listItems = $$("[data-journey-list] li");
    const jIndex = $("[data-journey-index]");
    const jBar = $("[data-journey-bar]");
    const cuts = [0.206, 0.419, 0.633, 0.846]; // shot changes in the film (see README)
    let jActive = -1;
    const setJourney = (i) => {
      if (i === jActive) return;
      jActive = i;
      words.forEach((w, k) => {
        w.classList.toggle("is-active", k === i);
        w.classList.toggle("is-past", k < i);
      });
      infos.forEach((p, k) => p.classList.toggle("is-active", k === i));
      listItems.forEach((li, k) => li.classList.toggle("is-active", k === i));
      jIndex.textContent = String(i + 1).padStart(2, "0");
    };
    setJourney(0);
    ScrollTrigger.create({
      trigger: ".journey__pin",
      start: "top top",
      end: "+=" + (reduceMotion ? 0 : 420) + "%",
      pin: true,
      refreshPriority: 2,
      onUpdate: (s) => {
        const p = s.progress;
        jBar.style.transform = `scaleX(${p})`;
        setJourney(cuts.filter((c) => p >= c).length);
      },
    });
    filmWindow(journey, 2.75, 12.6, (s) => {
      // map the section's full visibility range onto the pinned stretch
      const st = s;
      const vh = innerHeight;
      const pinStart = st.start + vh; // section top reaches viewport top
      const pinEnd = st.end - vh; // pinned stretch ends
      return (st.scroll() - pinStart) / Math.max(1, pinEnd - pinStart);
    });

    /* RECORD: refresh pin positions when charts change height */
    const recordWrap = $("#record .wrap");
    if (recordWrap && "ResizeObserver" in window) {
      let t;
      let lastH = recordWrap.offsetHeight;
      new ResizeObserver(() => {
        const h = recordWrap.offsetHeight;
        if (Math.abs(h - lastH) < 2) return;
        lastH = h;
        clearTimeout(t);
        t = setTimeout(() => ScrollTrigger.refresh(), 200);
      }).observe(recordWrap);
    }

    /* PROGRESS: Khalid Al-Walid 3 build sequence */
    const frames = $$("[data-progress-frames] figure");
    const pDate = $("[data-progress-date]");
    const pStage = $("[data-progress-stage]");
    const pMeter = $("[data-progress-meter]");
    let pIndex = 0;
    const setFrame = (i) => {
      if (i === pIndex) return;
      pIndex = i;
      const f = frames[i];
      gsap.fromTo([pDate, pStage], { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out", overwrite: true });
      pDate.textContent = f.dataset.date;
      pStage.textContent = f.dataset.stage;
    };
    const ptl = gsap.timeline({
      scrollTrigger: {
        trigger: ".progress__pin",
        start: "top top",
        end: "+=" + frames.length * 65 + "%",
        pin: true,
        refreshPriority: 1,
        scrub: 0.6,
        onUpdate: (s) => {
          const i = Math.min(frames.length - 1, Math.round(s.progress * (frames.length - 1)));
          setFrame(i);
          pMeter.style.transform = `scaleX(${0.14 + s.progress * 0.86})`;
        },
      },
    });
    frames.forEach((f, i) => {
      if (!i) return;
      ptl.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" })
        .fromTo($("img", f), { scale: 1.35 }, { scale: 1.08, duration: 1, ease: "none" }, "<")
        .to($("img", frames[i - 1]), { scale: 1.0, yPercent: -6, duration: 1, ease: "none" }, "<");
    });

    /* Latest cards: staggered clip reveal */
    $$(".lcard__media").forEach((m) => {
      gsap.fromTo(m, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: m, start: "top 92%", once: true } });
    });

    /* VOICES: rail drifts sideways with scroll */
    const rail = $(".voices__track");
    if (rail) {
      gsap.fromTo(
        rail,
        { x: () => innerWidth * 0.15 },
        { x: () => -(rail.scrollWidth - innerWidth * 0.85), ease: "none", scrollTrigger: { trigger: ".voices", start: "top bottom", end: "bottom top", scrub: 1, invalidateOnRefresh: true } }
      );
    }

    /* CONTACT: film finale */
    const contact = $(".contact");
    filmWindow(contact, 13.2, 16.2, (s) => (s.scroll() - s.start) / Math.max(1, contact.offsetHeight));
    gsap.fromTo(".form", { y: 80 }, { y: 0, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "center center", scrub: true } });

    /* FOOTER: wordmark rises letter by letter */
    gsap.from("[data-footer-word] span", {
      yPercent: 105,
      duration: 1.4,
      stagger: 0.045,
      ease: "expo.out",
      scrollTrigger: { trigger: "[data-footer-word]", start: "top 96%", once: true },
    });
  }

  /* Reduced motion: no pins, scrubs or parallax — content simply shows. */
  function buildStatic() {
    $$("[data-journey-word] span, [data-journey-info] p").forEach((el, i, all) => el.classList.toggle("is-active", i === 0 || i === all.length / 2));
    $$("[data-count]").forEach((el) => {
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const pad = parseInt(el.dataset.pad || "0", 10);
      const v = parseFloat(el.dataset.count).toFixed(dec);
      el.textContent = pad ? v.padStart(pad, "0") : v;
    });
  }

  /* ---------- keep ScrollTrigger in sync after late layout changes ---------- */
  addEventListener("load", () => ScrollTrigger.refresh());
})();
