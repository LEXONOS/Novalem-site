/* =========================================================
   Studio Novalem — Chantier D (réalisations en direct)
   Aperçus des vrais sites en iframe, mis à l'échelle,
   qui défilent doucement au survol.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var hasGSAP = !!(gsap && ST);
  var VW = 1440, VH = 2000;

  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(boot);

  function boot() {
    sizeShots();
    window.addEventListener('load', sizeShots);
    document.querySelectorAll('.shot-view iframe').forEach(function (f) {
      f.addEventListener('load', function () { sizeShots(); });
    });
    var rz;
    window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(sizeShots, 180); });

    if (hasGSAP) { gsap.registerPlugin(ST); }
    setupHover();
    setupReveal();
  }

  function sizeShots() {
    document.querySelectorAll('.shot-view').forEach(function (view) {
      var iframe = view.querySelector('iframe');
      if (!iframe) return;
      var w = view.clientWidth, h = view.clientHeight;
      if (!w || !h) return;
      var scale = w / VW;
      iframe.style.width = VW + 'px';
      iframe.style.height = VH + 'px';
      iframe.style.transformOrigin = 'top left';
      iframe.style.transform = 'translateY(0px) scale(' + scale + ')';
      iframe.__scale = scale;
      iframe.__reveal = -Math.max(0, (VH * scale - h)) * 0.85;
    });
  }

  function setupHover() {
    if (!fine || !hasGSAP || reduce) return;
    document.querySelectorAll('.work').forEach(function (work) {
      var iframe = work.querySelector('.shot-view iframe');
      if (!iframe) return;
      work.addEventListener('pointerenter', function () {
        gsap.to(iframe, { y: iframe.__reveal || -220, duration: 4.2, ease: 'sine.inOut' });
      });
      work.addEventListener('pointerleave', function () {
        gsap.to(iframe, { y: 0, duration: 1.2, ease: 'power2.out' });
      });
    });
  }

  function setupReveal() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.reveal-card'));
    if (!hasGSAP || reduce) return;
    gsap.set(cards, { opacity: 0, y: 30 });
    ST.batch(cards, {
      start: 'top 88%',
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', overwrite: true }); }
    });
  }
})();
