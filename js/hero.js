/* =========================================================
   Studio Novalem — Chantier A (hero)
   Préchargeur qui se fond, ouverture cinématique plein écran,
   titre qui se compose, puis la vidéo se range en cadre au scroll.
   Scroll natif, GSAP + ScrollTrigger.
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('has-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var hasGSAP = !!(gsap && ST);
  var introTl = null, introDone = false;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(boot);

  function boot() {
    setupHeader();
    setupCue();
    playVideo();
    setupMagnetic();

    if (reduce || !hasGSAP) {
      document.documentElement.classList.remove('has-js');
      var pl = document.getElementById('preloader');
      if (pl) pl.style.display = 'none';
      document.body.classList.remove('is-loading');
      return;
    }

    gsap.registerPlugin(ST);
    setupDock();
    setupAfterReveal();
    setupPreloader();
    window.addEventListener('load', function () { ST.refresh(); });
  }

  /* ---------- PRELOADER + REVEAL ---------- */
  function setupPreloader() {
    gsap.set('#heroFrame', { clipPath: 'inset(48% 0% 48% 0%)' });
    gsap.set('#heroMedia', { scale: 1.12 });
    gsap.set(['#heroCta', '#heroTrust'], { opacity: 0, y: 24 });

    introTl = gsap.timeline({ onComplete: revealHero });
    introTl.to('.pl-word span', { y: 0, opacity: 1, duration: 0.6, stagger: 0.035, ease: 'power3.out' }, 0.25)
           .to('#preloader', { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, 1.4);

    var pl = document.getElementById('preloader');
    if (pl) pl.addEventListener('click', skip);
    document.addEventListener('keydown', function onk(e) {
      if (e.key === 'Escape' || e.key === ' ' || e.code === 'Space') { skip(); document.removeEventListener('keydown', onk); }
    });
    setTimeout(function () { if (!introDone && introTl) introTl.progress(1); }, 3200);
  }

  function skip() { if (introDone || !introTl) return; introTl.progress(1); }

  function revealHero() {
    if (introDone) return; introDone = true;
    document.body.classList.remove('is-loading');

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('#heroFrame', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power4.inOut' }, 0)
      .to('#heroMedia', { scale: 1, duration: 1.5, ease: 'power3.out' }, 0)
      .to('.hero .eyebrow > span', { y: 0, duration: 0.8 }, 0.4)
      .to('.hero-title .w', { y: 0, duration: 1, stagger: 0.06 }, 0.5)
      .to('.hero-sub > span', { y: 0, duration: 0.9 }, '-=0.6')
      .to('#heroCta', { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
      .to('#heroTrust', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
      .to('#brandEmblem', { opacity: 1, duration: 0.6 }, '-=0.7')
      .to('#heroCue', { opacity: 1, duration: 0.6 }, '-=0.4');

    if (ST) ST.refresh();
  }

  /* ---------- SCROLL DOCK (la vidéo se range en cadre) ---------- */
  function setupDock() {
    var frame = document.getElementById('heroFrame');
    var veil = document.getElementById('heroVeil');
    var copy = document.getElementById('heroCopy');
    var label = document.getElementById('heroCardLabel');
    var cue = document.getElementById('heroCue');
    if (!frame) return;

    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 }
    });
    tl.to(copy, { opacity: 0, y: -50, duration: 0.4 }, 0);
    tl.to(cue, { opacity: 0, duration: 0.25 }, 0);
    tl.to(veil, { opacity: 0, duration: 0.6 }, 0);
    tl.to(frame, { scale: 0.86, borderRadius: 30, duration: 1 }, 0);
    tl.fromTo(frame,
      { boxShadow: '0 40px 90px -30px rgba(16,20,40,0)' },
      { boxShadow: '0 40px 90px -30px rgba(16,20,40,0.45)', duration: 1 }, 0);
    tl.to(label, { opacity: 1, duration: 0.35 }, 0.6);
  }

  /* ---------- HEADER ---------- */
  function setupHeader() {
    var h = document.getElementById('siteHeader');
    if (!h) return;
    function upd() { h.setAttribute('data-state', window.scrollY > 40 ? 'compact' : 'top'); }
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ---------- MAGNETIC ---------- */
  function setupMagnetic() {
    if (!fine || !hasGSAP) return;
    document.querySelectorAll('.magnetic').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.42, duration: 0.5, ease: 'power3.out' });
      });
      b.addEventListener('pointerleave', function () { gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' }); });
    });
  }

  /* ---------- CUE ---------- */
  function setupCue() {
    var c = document.getElementById('heroCue');
    if (!c) return;
    c.addEventListener('click', function () {
      var t = document.querySelector('.after');
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- AFTER (petit reveal) ---------- */
  function setupAfterReveal() {
    gsap.from('#afterLine', { opacity: 0, y: 40, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.after', start: 'top 75%' } });
  }

  /* ---------- VIDEO ---------- */
  function playVideo() {
    var v = document.getElementById('heroVideo');
    if (!v) return;
    var s = v.querySelector('source');
    if (window.innerWidth < 760 && s) { s.src = 'video/hero-mobile.mp4'; v.load(); }
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
})();
