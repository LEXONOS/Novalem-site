/* =========================================================
   Studio Novalem — Chantier B (séquence prix)
   Un prix d'agence qui se dégonfle vers le nôtre, au clic.
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('has-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;
  var hasGSAP = !!gsap;

  var BEFORE = 4500, AFTER = 990;
  var CAP_BEFORE = "Le tarif moyen d'une agence pour ce site.";
  var CAP_AFTER = "Formule Vitrine. Tout compris. Une fois.";
  var currentY = 5, revealed = false;

  function fmt(n) { return n.toLocaleString('fr-FR'); }
  function THEM(y) { return 4500 + 480 * y; }   // agence + maintenance ~40/mois
  function US(y) { return 990 + 25 * y; }        // une fois + hébergement 25/an

  var $ = function (id) { return document.getElementById(id); };
  var rp, numEl, amountEl, caption, chipsEl, trigger, after, glow, shock;
  var themB, usB, themFill, usFill, segBtns, replay;

  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(boot);

  function boot() {
    rp = $('rp'); numEl = $('rpNum'); amountEl = $('rpAmount'); caption = $('rpCaption');
    chipsEl = $('rpChips'); trigger = $('rpTrigger'); after = $('rpAfter');
    glow = $('rpGlow'); shock = $('rpShock');
    themB = $('rpThem'); usB = $('rpUs'); themFill = $('rpThemFill'); usFill = $('rpUsFill');
    segBtns = Array.prototype.slice.call(document.querySelectorAll('#rpSeg button'));
    replay = $('rpReplay');

    if (reduce || !hasGSAP) {
      // repli : on montre directement le prix honnête et la comparaison
      document.documentElement.classList.remove('has-js');
      setYears(5, false);
      return;
    }

    wire();
    reset();
    gsap.from('.rp-inner', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' });
  }

  function wire() {
    if (trigger) trigger.addEventListener('click', reveal);
    if (replay) replay.addEventListener('click', reset);
    segBtns.forEach(function (b) {
      b.addEventListener('click', function () { setYears(parseInt(b.getAttribute('data-y'), 10), true); });
    });
  }

  function reset() {
    revealed = false;
    rp.setAttribute('data-state', 'before');
    numEl.textContent = fmt(BEFORE);
    caption.textContent = CAP_BEFORE;
    amountEl.classList.remove('is-value');
    gsap.set(amountEl, { clearProps: 'transform' });
    gsap.set(glow, { opacity: 0, scale: 0.6 });
    gsap.set(shock, { opacity: 0, scale: 0.2 });

    var chips = Array.prototype.slice.call(chipsEl.querySelectorAll('li'));
    chips.forEach(function (li) { li.classList.remove('struck'); });
    gsap.set(chipsEl, { height: 'auto', marginTop: '' });
    gsap.set(chips, { opacity: 1, clearProps: 'transform' });

    trigger.style.display = '';
    trigger.disabled = false;
    gsap.set(trigger, { opacity: 1, clearProps: 'transform' });

    gsap.set(after, { height: 0, opacity: 0, overflow: 'hidden' });
  }

  function reveal() {
    if (revealed) return; revealed = true;
    trigger.disabled = true;
    rp.setAttribute('data-state', 'after');

    var chips = Array.prototype.slice.call(chipsEl.querySelectorAll('li'));
    var tl = gsap.timeline();

    // trigger sort
    tl.to(trigger, { opacity: 0, y: -8, scale: 0.96, duration: 0.3, ease: 'power2.in',
      onComplete: function () { trigger.style.display = 'none'; } }, 0);

    // chips : barrées puis envolées
    chips.forEach(function (li, i) { tl.add(function () { li.classList.add('struck'); }, 0.15 + i * 0.08); });
    tl.to(chips, {
      opacity: 0,
      y: function () { return -30 - Math.random() * 44; },
      x: function () { return (Math.random() - 0.5) * 130; },
      rotate: function () { return (Math.random() - 0.5) * 22; },
      duration: 0.5, stagger: 0.06, ease: 'power2.in'
    }, 0.55);
    tl.to(chipsEl, { height: 0, marginTop: 0, duration: 0.4, ease: 'power2.inOut' }, 0.95);

    // le nombre se dégonfle
    var o = { v: BEFORE };
    tl.to(o, { v: AFTER, duration: 1.1, ease: 'power2.out',
      onUpdate: function () { numEl.textContent = fmt(Math.round(o.v)); } }, 0.35);

    // caption crossfade
    tl.to(caption, { opacity: 0, duration: 0.25, ease: 'power1.in',
      onComplete: function () { caption.textContent = CAP_AFTER; } }, 1.0);
    tl.to(caption, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 1.42);

    // impact
    tl.add(function () { amountEl.classList.add('is-value'); }, 1.4);
    tl.to(amountEl, { keyframes: [
      { scale: 1.09, duration: 0.16, ease: 'power2.out' },
      { scale: 1, duration: 0.55, ease: 'elastic.out(1,0.5)' }
    ] }, 1.4);
    tl.fromTo(shock, { scale: 0.2, opacity: 0.75 }, { scale: 3, opacity: 0, duration: 0.8, ease: 'power2.out' }, 1.42);
    tl.to(glow, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 1.4);

    // bloc après
    tl.to(after, { height: 'auto', opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.6);
    tl.add(function () { gsap.set(after, { height: 'auto' }); setYears(currentY, true); }, 2.2);
  }

  function setYears(y, animate) {
    currentY = y;
    var them = THEM(y), us = US(y);
    if (themB) themB.textContent = fmt(them) + ' €';
    if (usB) usB.textContent = fmt(us) + ' €';
    var usPct = Math.max(4, Math.round(us / them * 100));
    if (animate && hasGSAP) {
      gsap.to(themFill, { width: '100%', duration: 0.9, ease: 'power3.out' });
      gsap.to(usFill, { width: usPct + '%', duration: 1.1, ease: 'power3.out' });
    } else {
      if (themFill) themFill.style.width = '100%';
      if (usFill) usFill.style.width = usPct + '%';
    }
    segBtns.forEach(function (b) {
      var on = parseInt(b.getAttribute('data-y'), 10) === y;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }
})();
