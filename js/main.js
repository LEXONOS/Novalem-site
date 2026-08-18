/* ============================================================
   Studio Novalem — orchestration
   Scroll natif + GSAP/ScrollTrigger. Pas de Lenis.
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.add('has-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var SEEN = 'novalem_intro_seen';
  var EXPO = 'expo.out';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(boot);

  function boot() {
    setYear();
    setupSoundToggle();
    setupMenu();
    setupHeader();
    setupActiveNav();
    setupForm();
    setupVideo();
    setupHoverSounds();

    var hasGSAP = !!(window.gsap && window.ScrollTrigger);

    if (reduce || !hasGSAP) {
      // pas d'animation : on montre tout et on retire le préchargeur
      document.documentElement.classList.remove('has-js');
      var pl = document.getElementById('preloader');
      if (pl) pl.style.display = 'none';
      document.body.classList.remove('is-loading');
      fillCountersStatic();
      if (hasGSAP) window.gsap.registerPlugin(window.ScrollTrigger);
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.set('.hero-visual', { opacity: 0, y: 30, scale: 0.985 });
    window.gsap.set(['#heroCta', '#heroTrust'], { opacity: 0, y: 22 });
    setupReveals();
    setupManifeste();
    setupSeparators();
    setupCounters();
    setupNever();
    setupMethode();
    setupMagnetic();
    setupDock();
    setupFAQ();
    setupPreloader();

    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
  }

  /* ---------------- PRELOADER ---------------- */
  var done = false, plTl = null;

  function setupPreloader() {
    var gsap = window.gsap;
    var pl = document.getElementById('preloader');
    var num = document.getElementById('plNum');
    var seen = false;
    try { seen = sessionStorage.getItem(SEEN) === '1'; } catch (e) {}

    if (seen || !pl) {
      if (pl) pl.style.display = 'none';
      finishPreloader();
      return;
    }

    var counter = { v: 0 };
    plTl = gsap.timeline({ onComplete: finishPreloader });
    plTl.to('.pl-word span', { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: EXPO }, 0.3)
        .to('.pl-line i', { scaleX: 1, duration: 1.5, ease: EXPO }, 0)
        .to(counter, { v: 100, duration: 1.5, ease: 'power2.out', onUpdate: function () { if (num) num.textContent = Math.round(counter.v); } }, 0)
        .to('.pl-count, .pl-line', { opacity: 0, duration: 0.4 }, 1.6)
        .to('.pl-inner', { y: -16, opacity: 0, duration: 0.6, ease: EXPO }, 1.65)
        .to('#preloader', { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, 1.95);

    function skip() { if (done || !plTl) return; plTl.progress(1); }
    pl.addEventListener('click', skip);
    document.addEventListener('keydown', function onk(e) {
      if (e.key === 'Escape' || e.key === ' ' || e.code === 'Space') { skip(); document.removeEventListener('keydown', onk); }
    });
    // sécurité : jamais coincé
    setTimeout(finishPreloader, 3200);
  }

  function finishPreloader() {
    if (done) return; done = true;
    try { sessionStorage.setItem(SEEN, '1'); } catch (e) {}
    document.body.classList.remove('is-loading');
    var pl = document.getElementById('preloader');
    if (pl) { pl.style.pointerEvents = 'none'; }
    runHero();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function runHero() {
    if (reduce || !window.gsap) return;
    var gsap = window.gsap;
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero .eyebrow > span', { y: 0, duration: 0.8 }, 0.1)
      .to('.hero-title .w', { y: 0, duration: 1, stagger: 0.06 }, 0.2)
      .to('.hero-sub > span', { y: 0, duration: 0.9 }, '-=0.6')
      .to('#heroCta', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to('#heroTrust', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
      .to('.hero-visual', { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power4.out' }, '-=1.1')
      .to('#brandEmblem', { opacity: 1, duration: 0.6 }, '-=0.8');
  }

  /* ---------------- HEADER ---------------- */
  function setupHeader() {
    var header = document.getElementById('siteHeader');
    if (!header) return;
    var lastY = window.scrollY, ticking = false;

    function update() {
      var y = window.scrollY;
      var state = header.getAttribute('data-state');
      if (y > 80 && state !== 'compact') header.setAttribute('data-state', 'compact');
      else if (y < 40 && state !== 'top') header.setAttribute('data-state', 'top');

      if (y > 240 && y > lastY + 4) header.setAttribute('data-hidden', 'true');
      else if (y < lastY - 4 || y < 120) header.setAttribute('data-hidden', 'false');

      lastY = y; ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------------- ACTIVE NAV ---------------- */
  function setupActiveNav() {
    var links = document.querySelectorAll('.nav a[data-nav]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (l) { map[l.getAttribute('href')] = l; });
    var ids = ['#realisations', '#offre', '#methode', '#studio', '#faq'];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('data-active'); });
          var link = map['#' + en.target.id];
          if (link) link.setAttribute('data-active', '');
        }
      });
    }, { rootMargin: '-46% 0px -46% 0px', threshold: 0 });
    ids.forEach(function (id) { var s = document.querySelector(id); if (s) io.observe(s); });
  }

  /* ---------------- MENU ---------------- */
  function setupMenu() {
    var burger = document.getElementById('burger');
    var menu = document.getElementById('menu');
    if (!burger || !menu) return;

    function open() {
      menu.classList.add('open'); menu.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Fermer le menu');
      document.body.classList.add('no-scroll');
      if (window.NovaSound) window.NovaSound.play('open');
    }
    function close() {
      menu.classList.remove('open'); menu.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Ouvrir le menu');
      document.body.classList.remove('no-scroll');
    }
    burger.addEventListener('click', function () {
      menu.classList.contains('open') ? close() : open();
    });
    menu.querySelectorAll('[data-menu-link]').forEach(function (l) {
      l.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) close(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900 && menu.classList.contains('open')) close(); });
  }

  /* ---------------- REVEALS ---------------- */
  function outsideHero(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function (el) { return !el.closest('#hero'); });
  }

  function setupReveals() {
    var gsap = window.gsap, ST = window.ScrollTrigger;

    ST.batch(outsideHero('.reveal'), {
      start: 'top 86%',
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: EXPO, overwrite: true }); }
    });
    ST.batch(outsideHero('.reveal-card'), {
      start: 'top 88%',
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: EXPO, overwrite: true }); }
    });
    outsideHero('.reveal-line').forEach(function (el) {
      var span = el.querySelector(':scope > span');
      if (!span) return;
      ST.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () { gsap.to(span, { y: 0, duration: 1, ease: EXPO }); }
      });
    });
  }

  /* ---------------- MANIFESTE (scrub mots) ---------------- */
  function setupManifeste() {
    var line = document.querySelector('.manifeste-line');
    if (!line) return;
    var gsap = window.gsap;
    var words = [];

    // reconstruit en conservant l'<em>
    var nodes = Array.prototype.slice.call(line.childNodes);
    line.innerHTML = '';
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (tok) {
          if (tok.trim() === '') { line.appendChild(document.createTextNode(tok)); return; }
          var s = document.createElement('span'); s.className = 'word'; s.textContent = tok;
          line.appendChild(s); words.push(s);
        });
      } else if (node.nodeName === 'EM') {
        var em = document.createElement('em');
        node.textContent.split(/(\s+)/).forEach(function (tok) {
          if (tok.trim() === '') { em.appendChild(document.createTextNode(tok)); return; }
          var s = document.createElement('span'); s.className = 'word is-em'; s.textContent = tok;
          em.appendChild(s); words.push(s);
        });
        line.appendChild(em);
      } else {
        line.appendChild(node);
      }
    });

    var tl = gsap.timeline({ scrollTrigger: { trigger: '.manifeste', start: 'top 72%', end: 'bottom 62%', scrub: 0.6 } });
    words.forEach(function (w, i) {
      if (w.classList.contains('is-em')) tl.fromTo(w, { opacity: 0.3 }, { opacity: 1 }, i * 0.03);
      else tl.fromTo(w, { color: '#C2C7D4' }, { color: '#0B0D18' }, i * 0.03);
    });
  }

  /* ---------------- SEPARATORS ---------------- */
  function setupSeparators() {
    var gsap = window.gsap;
    gsap.utils.toArray('.sep').forEach(function (sep) {
      var star = sep.querySelector('.sep-star');
      var lines = sep.querySelectorAll('.sep-line');
      var tl = gsap.timeline({ scrollTrigger: { trigger: sep, start: 'top 88%' } });
      tl.to(lines, { scaleX: 1, duration: 1.1, ease: EXPO })
        .to(star, {
          opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.8)',
          onComplete: function () { gsap.to(star, { rotation: '+=360', duration: 26, ease: 'none', repeat: -1 }); }
        }, '-=0.6');
    });
  }

  /* ---------------- COUNTERS ---------------- */
  function setupCounters() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.utils.toArray('.plan-price .num').forEach(function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10) || 0;
      ST.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: function () {
          var o = { v: 0 };
          gsap.to(o, {
            v: end, duration: 1.6, ease: 'power2.out',
            onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString('fr-FR'); }
          });
        }
      });
    });
  }

  /* ---------------- NEVER (pastilles 0€) ---------------- */
  function setupNever() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    var block = document.querySelector('.never');
    if (!block) return;
    ST.create({
      trigger: block, start: 'top 72%', once: true,
      onEnter: function () {
        gsap.to('.never-now', { opacity: 1, scale: 1, duration: 0.6, stagger: 0.14, ease: 'back.out(2.2)' });
      }
    });
  }

  /* ---------------- METHODE ---------------- */
  function setupMethode() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    var progress = document.getElementById('stepsProgress');
    if (progress) {
      gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 68%', end: 'bottom 72%', scrub: true } });
    }
    gsap.utils.toArray('.step').forEach(function (st) {
      ST.create({
        trigger: st, start: 'top 80%',
        onEnter: function () { st.setAttribute('data-lit', ''); },
        onLeaveBack: function () { st.removeAttribute('data-lit'); }
      });
    });
  }

  /* ---------------- MAGNETIC ---------------- */
  function setupMagnetic() {
    if (!finePointer) return;
    var gsap = window.gsap;
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: mx * 0.3, y: my * 0.42, duration: 0.5, ease: EXPO });
      });
      btn.addEventListener('pointerleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  /* ---------------- HERO PARALLAX ---------------- */
  function setupDock() {
    if (reduce || !window.gsap || window.innerWidth < 900) return;
    var gsap = window.gsap;
    var panel = document.querySelector('.hero-panel');
    if (!panel) return;
    gsap.to(panel, {
      yPercent: -7, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------------- VIDEO ---------------- */
  function setupVideo() {
    var v = document.getElementById('heroVideo');
    if (!v) return;
    var src = v.querySelector('source');
    var conn = navigator.connection || {};
    var slow = conn.saveData || /2g/.test(conn.effectiveType || '');
    if ((window.innerWidth < 760 || slow) && src) {
      src.src = 'video/nova-mobile.mp4';
      v.load();
    }
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* ---------------- FORM ---------------- */
  function setupForm() {
    var form = document.getElementById('contactForm');
    var hint = document.getElementById('formHint');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cf-name');
      var email = document.getElementById('cf-email');
      var msg = document.getElementById('cf-msg');
      var company = document.getElementById('cf-company');
      hint.classList.remove('ok', 'err');

      if (!name.value.trim() || !email.value.trim() || !msg.value.trim() || !/.+@.+\..+/.test(email.value)) {
        hint.textContent = 'Merci de renseigner votre nom, un email valide et un message.';
        hint.classList.add('err');
        return;
      }
      // sans backend : on ouvre la messagerie pré-remplie (fonctionne partout, zéro dépendance)
      var subject = encodeURIComponent('Nouveau projet — ' + (company.value.trim() || name.value.trim()));
      var body = encodeURIComponent(
        'Nom : ' + name.value.trim() + '\n' +
        'Entreprise : ' + (company.value.trim() || '—') + '\n' +
        'Email : ' + email.value.trim() + '\n\n' +
        'Projet :\n' + msg.value.trim()
      );
      hint.textContent = 'Merci ! Votre messagerie s\'ouvre pour finaliser l\'envoi.';
      hint.classList.add('ok');
      if (window.NovaSound) window.NovaSound.play('chime');
      setTimeout(function () {
        window.location.href = 'mailto:contact@studionovalem.fr?subject=' + subject + '&body=' + body;
      }, 500);
    });
  }

  /* ---------------- SOUND ---------------- */
  function setupSoundToggle() {
    var btn = document.getElementById('soundToggle');
    if (!btn || !window.NovaSound) return;
    btn.setAttribute('aria-pressed', window.NovaSound.isEnabled() ? 'true' : 'false');
    btn.addEventListener('click', function () {
      var on = window.NovaSound.toggle();
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Couper le son de l\'interface' : 'Activer le son de l\'interface');
    });
  }

  function setupHoverSounds() {
    if (!finePointer || !window.NovaSound) return;
    var last = 0;
    function tick() { var t = Date.now(); if (t - last > 60) { window.NovaSound.play('hover'); last = t; } }
    document.querySelectorAll('.nav a, .btn, .work-cta, .footer-nav a').forEach(function (el) {
      el.addEventListener('pointerenter', tick);
    });
  }

  /* ---------------- FAQ (accordéon animé) ---------------- */
  function setupFAQ() {
    var gsap = window.gsap;
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));

    function openItem(item, wrap) {
      item.open = true;
      gsap.set(wrap, { height: 'auto' });
      gsap.from(wrap, { height: 0, duration: 0.5, ease: EXPO });
      if (window.NovaSound) window.NovaSound.play('tick');
    }
    function closeItem(item, wrap) {
      gsap.to(wrap, { height: 0, duration: 0.4, ease: EXPO, onComplete: function () { item.open = false; gsap.set(wrap, { height: 'auto' }); } });
    }

    items.forEach(function (item) {
      var summary = item.querySelector('summary');
      var wrap = item.querySelector('.faq-a');
      if (!summary || !wrap) return;
      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (item.open) { closeItem(item, wrap); return; }
        items.forEach(function (o) { if (o !== item && o.open) closeItem(o, o.querySelector('.faq-a')); });
        openItem(item, wrap);
      });
    });
  }

  function fillCountersStatic() {
    document.querySelectorAll('.plan-price .num').forEach(function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10) || 0;
      el.textContent = end.toLocaleString('fr-FR');
    });
  }

  /* ---------------- MISC ---------------- */
  function setYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }
})();
