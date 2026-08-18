/* =========================================================
   STUDIO NOVALEM · interactions
   Aurora nova + reveals + compteurs + slider + tilt + FAQ
   Scroll natif, aucune dépendance externe.
   ========================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(pointer:fine)").matches;

  function debounce(fn, wait) {
    var t; return function () { clearTimeout(t); var a = arguments, c = this; t = setTimeout(function () { fn.apply(c, a); }, wait); };
  }

  /* ---------- AURORA NOVA (canvas) ---------- */
  function makeAurora(canvas, blobs, starDensity) {
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 1.6);
    var stars = [], t = 0, raf = null, running = false;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      if (W < 1 || H < 1) return;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      stars.length = 0;
      var n = Math.round((W * H) / (starDensity || 26000));
      for (var i = 0; i < n; i++) {
        stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.4, ph: Math.random() * Math.PI * 2, sp: Math.random() * 0.7 + 0.3 });
      }
    }

    function frame() {
      t += 0.005;
      ctx.clearRect(0, 0, W, H);
      var i, b, x, y, rad, g;
      for (i = 0; i < blobs.length; i++) {
        b = blobs[i];
        x = b.bx * W + Math.sin(t * b.sx + b.ph) * b.ax * W;
        y = b.by * H + Math.cos(t * b.sy + b.ph) * b.ay * H;
        rad = b.r * Math.min(W, H);
        g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, "rgba(" + b.c + "," + b.a + ")");
        g.addColorStop(1, "rgba(" + b.c + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
      }
      for (i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = 0.18 + 0.32 * Math.abs(Math.sin(t * 5 * s.sp + s.ph));
        ctx.fillStyle = "rgba(61,77,255," + a + ")";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!running && !reduce) { running = true; frame(); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    resize();
    window.addEventListener("resize", debounce(resize, 200));
    return { start: start, stop: stop, el: canvas };
  }

  var heroBlobs = [
    { c: "124,92,255", a: 0.5, bx: 0.28, by: 0.34, r: 0.52, ax: 0.06, ay: 0.05, sx: 1.0, sy: 0.8, ph: 0 },
    { c: "34,211,238", a: 0.45, bx: 0.74, by: 0.62, r: 0.55, ax: 0.05, ay: 0.06, sx: 0.8, sy: 1.1, ph: 2.1 },
    { c: "61,77,255", a: 0.42, bx: 0.6, by: 0.3, r: 0.48, ax: 0.07, ay: 0.05, sx: 1.2, sy: 0.7, ph: 4.2 },
    { c: "124,92,255", a: 0.3, bx: 0.15, by: 0.8, r: 0.4, ax: 0.05, ay: 0.05, sx: 0.9, sy: 0.9, ph: 1.0 }
  ];
  var contactBlobs = [
    { c: "124,92,255", a: 0.42, bx: 0.8, by: 0.2, r: 0.6, ax: 0.06, ay: 0.06, sx: 1.0, sy: 0.8, ph: 0 },
    { c: "34,211,238", a: 0.4, bx: 0.9, by: 0.7, r: 0.55, ax: 0.05, ay: 0.06, sx: 0.8, sy: 1.1, ph: 2.5 },
    { c: "61,77,255", a: 0.34, bx: 0.6, by: 0.5, r: 0.5, ax: 0.06, ay: 0.05, sx: 1.1, sy: 0.7, ph: 4.0 }
  ];

  var auroraInstances = [];
  var heroCanvas = document.getElementById("aurora");
  var contactCanvas = document.getElementById("contactAurora");
  if (heroCanvas && !reduce) auroraInstances.push({ a: makeAurora(heroCanvas, heroBlobs, 22000), root: document.querySelector(".hero") });
  if (contactCanvas && !reduce) auroraInstances.push({ a: makeAurora(contactCanvas, contactBlobs, 30000), root: document.querySelector(".contact-card") });

  // pause aurora when off-screen for perf
  if ("IntersectionObserver" in window) {
    auroraInstances.forEach(function (inst) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) inst.a.start(); else inst.a.stop(); });
      }, { threshold: 0.02 });
      if (inst.root) io.observe(inst.root);
    });
  } else {
    auroraInstances.forEach(function (inst) { inst.a.start(); });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) auroraInstances.forEach(function (i) { i.a.stop(); });
    else auroraInstances.forEach(function (i) { i.a.start(); });
  });

  /* ---------- HEADER + PROGRESS ---------- */
  var header = document.getElementById("header");
  var prog = document.getElementById("progress");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (y > 40) header.classList.add("scrolled"); else header.classList.remove("scrolled");
    if (prog) {
      var d = document.documentElement;
      var max = d.scrollHeight - d.clientHeight;
      prog.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
  }
  onScroll();
  window.addEventListener("scroll", function () { window.requestAnimationFrame(onScroll); }, { passive: true });

  /* ---------- MOBILE MENU ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  function closeMenu() { menu.classList.remove("open"); burger.classList.remove("on"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.classList.toggle("on", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- MARQUEE (double le contenu pour boucler) ---------- */
  document.querySelectorAll("[data-marquee]").forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* ---------- REVEAL ON SCROLL ---------- */
  var revs = document.querySelectorAll(".reveal, [data-stagger]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revs.forEach(function (el) { io.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- COUNTERS ---------- */
  function formatNum(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    if (reduce) { el.textContent = prefix + formatNum(target) + suffix; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + formatNum(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = prefix + formatNum(target) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else { counters.forEach(animateCount); }

  /* ---------- MÉTHODE : activation en séquence ---------- */
  var steps = document.querySelectorAll("#steps .step");
  if ("IntersectionObserver" in window && !reduce) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var idx = Array.prototype.indexOf.call(steps, en.target);
          setTimeout(function () { en.target.classList.add("on"); }, idx * 160);
          sio.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    steps.forEach(function (el) { sio.observe(el); });
  } else { steps.forEach(function (el) { el.classList.add("on"); }); }

  /* ---------- SLIDER RÉALISATIONS ---------- */
  var vp = document.getElementById("worksViewport");
  var track = document.getElementById("worksTrack");
  var prevB = document.getElementById("prevWork");
  var nextB = document.getElementById("nextWork");
  var nowEl = document.getElementById("workNow");
  var cards = track ? track.children : [];
  function cardStep() {
    if (cards.length > 1) return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    return cards[0] ? cards[0].offsetWidth + 22 : 0;
  }
  function updateCount() {
    var step = cardStep(); if (!step) return;
    var i = Math.round(vp.scrollLeft / step) + 1;
    i = Math.max(1, Math.min(cards.length, i));
    if (nowEl) nowEl.textContent = i;
    if (prevB) prevB.disabled = vp.scrollLeft <= 4;
    if (nextB) nextB.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth - 4);
  }
  if (vp && track) {
    nextB.addEventListener("click", function () { vp.scrollBy({ left: cardStep(), behavior: reduce ? "auto" : "smooth" }); });
    prevB.addEventListener("click", function () { vp.scrollBy({ left: -cardStep(), behavior: reduce ? "auto" : "smooth" }); });
    vp.addEventListener("scroll", function () { window.requestAnimationFrame(updateCount); }, { passive: true });
    window.addEventListener("resize", debounce(updateCount, 150));
    updateCount();
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var ans = item.querySelector(".faq-a");
      var open = item.classList.toggle("open");
      ans.style.maxHeight = open ? (ans.scrollHeight + "px") : "0px";
    });
  });

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (!reduce && fine) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + (mx * 0.18) + "px," + (my * 0.28) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- TILT 3D ---------- */
  if (!reduce && fine) {
    document.querySelectorAll(".tilt").forEach(function (el) {
      var strength = 6;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(820px) rotateX(" + (-py * strength).toFixed(2) + "deg) rotateY(" + (px * strength).toFixed(2) + "deg) translateY(-4px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- CONTACT FORM -> mailto ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = document.getElementById("cf-name").value.trim();
      var m = document.getElementById("cf-mail").value.trim();
      var msg = document.getElementById("cf-msg").value.trim();
      var subject = encodeURIComponent("Demande de projet - " + (n || "site web"));
      var body = encodeURIComponent("Nom : " + n + "\nE-mail : " + m + "\n\n" + msg);
      window.location.href = "mailto:contact@studionovalem.fr?subject=" + subject + "&body=" + body;
    });
  }
})();
