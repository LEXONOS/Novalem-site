/* Réalisations : aperçus des vrais sites en iframe, mis à l'échelle,
   qui défilent doucement au survol. Le reveal d'entrée est géré par main.js. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var gsap = window.gsap;
  var VW = 1440, VH = 2000;

  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    sizeShots();
    window.addEventListener('load', sizeShots);
    document.querySelectorAll('.lp-view iframe').forEach(function (f) { f.addEventListener('load', sizeShots); });
    var rz;
    window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(sizeShots, 180); });
    setupHover();
  });

  function sizeShots() {
    document.querySelectorAll('.lp-view').forEach(function (view) {
      var iframe = view.querySelector('iframe');
      if (!iframe) return;
      var w = view.clientWidth, h = view.clientHeight;
      if (!w || !h) return;
      var scale = w / VW;
      iframe.style.width = VW + 'px';
      iframe.style.height = VH + 'px';
      iframe.style.transformOrigin = 'top left';
      iframe.style.transform = 'translateY(0px) scale(' + scale + ')';
      iframe.__reveal = -Math.max(0, (VH * scale - h)) * 0.85;
    });
  }

  function setupHover() {
    if (!fine || !gsap || reduce) return;
    document.querySelectorAll('.lp-work').forEach(function (work) {
      var iframe = work.querySelector('.lp-view iframe');
      if (!iframe) return;
      work.addEventListener('pointerenter', function () {
        gsap.to(iframe, { y: iframe.__reveal || -220, duration: 4.2, ease: 'sine.inOut' });
      });
      work.addEventListener('pointerleave', function () {
        gsap.to(iframe, { y: 0, duration: 1.2, ease: 'power2.out' });
      });
    });
  }
})();
