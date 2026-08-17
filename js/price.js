/* Le prix : le tarif d'agence se dégonfle vers 990 €, puis un comparateur
   mensuel montre le point de remboursement face à une agence et au no-code. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;
  var BEFORE = 4500, AFTER = 990;
  var CAP_BEFORE = "Le tarif moyen d'une agence pour ce site.";
  var CAP_AFTER = "Formule Vitrine. Tout compris. Une fois.";
  var fmt = function (n) { return Math.round(n).toLocaleString('fr-FR'); };
  var el = {};

  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(init);

  function init() {
    var rp = document.getElementById('rp');
    if (!rp) return;
    el.rp = rp;
    el.num = document.getElementById('rpNum');
    el.cap = document.getElementById('rpCaption');
    el.amount = document.getElementById('rpAmount');
    el.chips = document.getElementById('rpChips');
    el.trigger = document.getElementById('rpTrigger');
    el.after = document.getElementById('rpAfter');
    el.glow = document.getElementById('rpGlow');
    el.shock = document.getElementById('rpShock');
    el.seg = document.getElementById('rpSeg');
    el.us = document.getElementById('rpUs'); el.wp = document.getElementById('rpWp'); el.nc = document.getElementById('rpNc');
    el.usf = document.getElementById('rpUsFill'); el.wpf = document.getElementById('rpWpFill'); el.ncf = document.getElementById('rpNcFill');
    el.paid = document.getElementById('rpPaid');
    el.replay = document.getElementById('rpReplay');

    if (reduce || !gsap) { showFinal(); return; }

    reset();
    el.trigger.addEventListener('click', reveal);
    if (el.replay) el.replay.addEventListener('click', reset);
    if (el.seg) el.seg.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { setBreakeven(parseInt(b.dataset.m, 10), true); });
    });
    gsap.from('.rp-inner', { opacity: 0, y: 26, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: rp, start: 'top 80%' } });
  }

  function showFinal() {
    el.rp.setAttribute('data-state', 'after');
    el.num.textContent = fmt(AFTER);
    el.cap.textContent = CAP_AFTER;
    el.amount.classList.add('is-value');
    el.chips.style.opacity = '0';
    el.trigger.style.display = 'none';
    el.after.style.height = 'auto'; el.after.style.opacity = '1'; el.after.style.overflow = 'visible';
    setBreakeven(36, false);
  }

  function reset() {
    el.rp.setAttribute('data-state', 'before');
    el.num.textContent = fmt(BEFORE);
    el.cap.textContent = CAP_BEFORE; el.cap.style.opacity = '1';
    el.amount.classList.remove('is-value');
    gsap.set(el.chips, { opacity: 1 });
    gsap.set(el.chips.querySelectorAll('li'), { opacity: 1, x: 0 });
    el.chips.querySelectorAll('li').forEach(function (li) { li.classList.remove('struck'); });
    gsap.set(el.trigger, { opacity: 1, y: 0, pointerEvents: 'auto', display: 'inline-flex' });
    gsap.set(el.after, { height: 0, opacity: 0, overflow: 'hidden' });
    gsap.set(el.glow, { opacity: 0 }); gsap.set(el.shock, { opacity: 0, scale: 0.2 });
    el.usf.style.width = '0'; el.wpf.style.width = '0'; el.ncf.style.width = '0';
    markSeg(36);
  }

  function reveal() {
    if (el.rp.getAttribute('data-state') === 'after') return;
    el.rp.setAttribute('data-state', 'after');
    gsap.to(el.trigger, { opacity: 0, y: 14, duration: 0.4, ease: 'power2.out', pointerEvents: 'none' });
    var lis = el.chips.querySelectorAll('li');
    lis.forEach(function (li) { li.classList.add('struck'); });
    gsap.to(lis, { opacity: 0, x: 26, duration: 0.5, stagger: 0.06, ease: 'power2.in', delay: 0.2 });
    var o = { v: BEFORE };
    gsap.to(o, { v: AFTER, duration: 1.15, ease: 'power3.inOut', onUpdate: function () { el.num.textContent = fmt(o.v); } });
    gsap.to(el.cap, { opacity: 0, duration: 0.25, onComplete: function () { el.cap.textContent = CAP_AFTER; gsap.to(el.cap, { opacity: 1, duration: 0.4 }); } });
    gsap.timeline({ delay: 0.9 })
      .to(el.amount, { scale: 1.08, duration: 0.28, ease: 'back.out(3)' })
      .to(el.amount, { scale: 1, duration: 0.5, ease: 'power2.out' })
      .add(function () { el.amount.classList.add('is-value'); }, 0)
      .fromTo(el.shock, { opacity: 0.5, scale: 0.2 }, { opacity: 0, scale: 3, duration: 0.9, ease: 'power2.out' }, 0)
      .to(el.glow, { opacity: 1, duration: 0.6 }, 0);
    openAfter();
    setBreakeven(36, true);
  }

  function openAfter() {
    gsap.set(el.after, { height: 'auto' });
    var h = el.after.offsetHeight;
    gsap.fromTo(el.after, { height: 0, opacity: 0 }, {
      height: h, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.5,
      onComplete: function () { el.after.style.height = 'auto'; el.after.style.overflow = 'visible'; }
    });
  }

  function nov(m) { return AFTER + 2 * m; }
  function wp(m) { return 50 * m; }
  function nc(m) { return 39 * m; }

  function markSeg(m) {
    if (!el.seg) return;
    el.seg.querySelectorAll('button').forEach(function (b) {
      var on = parseInt(b.dataset.m, 10) === m;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function setBreakeven(m, animate) {
    markSeg(m);
    var a = nov(m), b = wp(m), c = nc(m);
    var max = Math.max(a, b, c);
    el.us.textContent = fmt(a) + '\u00A0\u20AC';
    el.wp.textContent = fmt(b) + '\u00A0\u20AC';
    el.nc.textContent = fmt(c) + '\u00A0\u20AC';
    var pa = (a / max * 100) + '%', pb = (b / max * 100) + '%', pc = (c / max * 100) + '%';
    if (animate && gsap) {
      gsap.to(el.usf, { width: pa, duration: 0.7, ease: 'power3.out' });
      gsap.to(el.wpf, { width: pb, duration: 0.7, ease: 'power3.out' });
      gsap.to(el.ncf, { width: pc, duration: 0.7, ease: 'power3.out' });
    } else {
      el.usf.style.width = pa; el.wpf.style.width = pb; el.ncf.style.width = pc;
    }
    if (el.paid) el.paid.style.display = (a <= b) ? 'inline-block' : 'none';
  }
})();
