/* ============================================================
   Nova — orbe organique (canvas temps réel) + assistant
   Physique d'impulsion : au clic, l'orbe accélère puis
   décélère en douceur, sans jamais s'arrêter net.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- ORBE ---------------- */
  function initOrb() {
    var canvas = document.getElementById('novaCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;
    var R = W * 0.30;

    var angle = 0;
    var speed = 0.006;          // vitesse de base (lente)
    var baseSpeed = 0.006;
    var squash = 0;             // déformation ressort au clic
    var squashV = 0;
    var t = 0;
    var hovering = false;

    // poussières en orbite
    var dust = [];
    for (var i = 0; i < 14; i++) {
      dust.push({ a: Math.random() * Math.PI * 2, r: R * (1.15 + Math.random() * 0.6), s: 0.2 + Math.random() * 0.5, size: 0.6 + Math.random() * 1.4 });
    }

    function blob(cxx, cyy, base, energy, col1, col2) {
      ctx.beginPath();
      var pts = 42;
      for (var k = 0; k <= pts; k++) {
        var a = (k / pts) * Math.PI * 2;
        var wob = Math.sin(a * 3 + t * 1.6) * 0.06 + Math.sin(a * 5 - t * 1.1) * 0.04 + Math.cos(a * 2 + t) * 0.05;
        var sq = 1 + squash * Math.cos(a * 2);
        var rr = base * (1 + wob * (1 + energy)) * sq;
        var x = cxx + Math.cos(a) * rr;
        var y = cyy + Math.sin(a) * rr;
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      var g = ctx.createLinearGradient(cxx - base, cyy - base, cxx + base, cyy + base);
      g.addColorStop(0, col1); g.addColorStop(1, col2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    function frame() {
      t += 0.016;
      // physique
      speed += (baseSpeed - speed) * 0.04;        // retour progressif à la base
      if (hovering) speed += (baseSpeed * 2.4 - speed) * 0.06;
      angle += speed;
      // ressort du squash
      squashV += (-squash) * 0.18; squashV *= 0.82; squash += squashV;

      var energy = Math.min((speed - baseSpeed) / 0.09, 1);

      ctx.clearRect(0, 0, W, H);

      // halo
      var halo = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * (1.7 + energy));
      halo.addColorStop(0, 'rgba(124,92,255,' + (0.16 + energy * 0.25) + ')');
      halo.addColorStop(1, 'rgba(124,92,255,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'source-over';

      // trois couches de blob (multiply pour le mélange aurora)
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.translate(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5);
      blob(cx, cy, R * 1.02, energy, 'rgba(61,77,255,0.95)', 'rgba(124,92,255,0.9)');
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.translate(Math.cos(angle + 2.1) * 2, Math.sin(angle + 2.1) * 2);
      blob(cx, cy, R * 0.96, energy, 'rgba(124,92,255,0.9)', 'rgba(34,211,238,0.85)');
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.translate(Math.cos(angle - 1.3) * 2, Math.sin(angle - 1.3) * 2);
      blob(cx, cy, R * 0.9, energy, 'rgba(34,211,238,0.85)', 'rgba(61,77,255,0.9)');
      ctx.restore();

      ctx.globalCompositeOperation = 'source-over';

      // reflet verre
      var gl = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.5, 0, cx - R * 0.4, cy - R * 0.5, R * 0.9);
      gl.addColorStop(0, 'rgba(255,255,255,0.55)');
      gl.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      gl.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gl;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2); ctx.fill();

      // poussières
      for (var d = 0; d < dust.length; d++) {
        var p = dust[d];
        p.a += p.s * (speed * 10 + 0.002);
        var x = cx + Math.cos(p.a) * p.r;
        var y = cy + Math.sin(p.a) * p.r * 0.9;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(124,92,255,' + (0.25 + energy * 0.4) + ')';
        ctx.arc(x, y, p.size, 0, Math.PI * 2); ctx.fill();
      }

      // étoile nova en orbite
      var sa = angle * 2.2;
      var sx = cx + Math.cos(sa) * R * 1.28;
      var sy = cy + Math.sin(sa) * R * 1.28;
      drawStar(sx, sy, 4 + energy * 3, 'rgba(255,255,255,0.95)');

      if (!reduce) requestAnimationFrame(frame);
    }

    function drawStar(x, y, s, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.beginPath();
      for (var i = 0; i <= 8; i++) {
        var a = (i / 8) * Math.PI * 2;
        var r = (i % 2 === 0) ? s : s * 0.32;
        var px = Math.cos(a) * r, py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    var orb = document.getElementById('novaOrb');
    if (orb) {
      orb.addEventListener('pointerenter', function () { hovering = true; });
      orb.addEventListener('pointerleave', function () { hovering = false; });
    }

    // impulsion (utilisée au clic)
    window.__novaImpulse = function () {
      speed += 0.085;
      squashV += 0.5;
    };

    if (reduce) { frame(); } else { requestAnimationFrame(frame); }
  }

  /* ---------------- ASSISTANT ---------------- */
  var answers = {
    hello: "Bonjour, je suis Nova. Une idée de site à concrétiser ? Je peux vous parler des <strong>formules</strong>, des <strong>délais</strong> ou de la <strong>méthode</strong>.",
    formules: "Trois formules claires : <strong>Essentiel 490 €</strong> (une page), <strong>Vitrine 990 €</strong> (jusqu'à 5 pages, la plus demandée) et <strong>Signature 1390 €</strong> (le grand jeu). Boutique ou outil sur mesure, on chiffre après un échange.",
    delais: "Comptez <strong>deux à quatre semaines</strong> selon l'ampleur. Vous voyez une première version en ligne très vite, puis on affine ensemble.",
    abonnement: "Aucun abonnement. Un site codé n'a pas de mensualité comme un WordPress. Le seul coût qui reste, c'est <strong>environ 5 € par an</strong> d'hébergement, à votre nom.",
    methode: "Quatre étapes : on échange, je conçois une première version en ligne, on affine, puis mise en ligne et remise des fichiers. Le site est <strong>100 % à vous</strong>.",
    proprio: "Le site vous appartient entièrement. Je remets tous les fichiers et les accès sont créés à votre nom. Propriété totale, pour toujours.",
    zone: "Basé en Guadeloupe, je travaille sur les quatre îles des Antilles françaises et partout à distance.",
    contact: "Avec plaisir. Écrivez à <a href='mailto:contact@studionovalem.fr'>contact@studionovalem.fr</a> ou appelez le <a href='tel:+590691253449'>+590 691 25 34 49</a>. Réponse sous 24 h.",
    default: "Bonne question. Le plus simple, c'est d'en parler directement : <a href='mailto:contact@studionovalem.fr'>contact@studionovalem.fr</a>. En attendant, je peux détailler les formules, les délais ou la méthode."
  };

  function detect(text) {
    var s = text.toLowerCase();
    if (/bonjour|salut|hello|coucou|hey/.test(s)) return 'hello';
    if (/prix|tarif|coût|cout|combien|budget|formule|essentiel|vitrine|signature/.test(s)) return 'formules';
    if (/délai|delai|temps|quand|rapide|semaine|durée|duree/.test(s)) return 'delais';
    if (/abonnement|mensuel|wordpress|maintenance|récurrent|recurrent|par mois/.test(s)) return 'abonnement';
    if (/méthode|methode|étape|etape|process|comment ça|comment ca|déroul|deroul/.test(s)) return 'methode';
    if (/propriétaire|proprietaire|appartient|à moi|a moi|fichier|code source/.test(s)) return 'proprio';
    if (/où|ou travaill|zone|guadeloupe|martinique|antilles|distance|déplac|deplac/.test(s)) return 'zone';
    if (/contact|joindre|mail|email|téléphone|telephone|appeler|rendez|rdv|devis/.test(s)) return 'contact';
    return 'default';
  }

  function initAssistant() {
    var orb = document.getElementById('novaOrb');
    var panel = document.getElementById('novaPanel');
    var closeBtn = document.getElementById('novaClose');
    var log = document.getElementById('novaLog');
    var chips = document.getElementById('novaChips');
    var form = document.getElementById('novaForm');
    var input = document.getElementById('novaText');
    if (!orb || !panel || !log) return;

    var greeted = false;

    function push(html, who) {
      var el = document.createElement('div');
      el.className = 'nova-msg nova-msg--' + (who === 'me' ? 'me' : 'bot');
      el.innerHTML = html;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
    }

    function botReply(key) {
      setTimeout(function () {
        push(answers[key] || answers.default, 'bot');
        if (window.NovaSound) window.NovaSound.play('tick');
      }, 380);
    }

    function open() {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      if (!greeted) { push(answers.hello, 'bot'); greeted = true; }
      if (window.NovaSound) window.NovaSound.play('open');
      setTimeout(function () { if (input) input.focus(); }, 420);
    }
    function close() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      orb.style.opacity = '1';
      orb.style.pointerEvents = 'auto';
      if (window.NovaSound) window.NovaSound.play('close');
    }

    orb.addEventListener('click', function () {
      if (window.__novaImpulse) window.__novaImpulse();
      if (window.NovaSound) window.NovaSound.play('pop');
      open();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });

    if (chips) {
      chips.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-q]');
        if (!b) return;
        var map = { formules: 'formules', delais: 'delais', abonnement: 'abonnement', methode: 'methode', contact: 'contact' };
        var labels = { formules: 'Les formules ?', delais: 'Les délais ?', abonnement: 'Les abonnements ?', methode: 'La méthode ?', contact: 'Comment vous joindre ?' };
        var q = b.getAttribute('data-q');
        push(labels[q] || b.textContent, 'me');
        botReply(map[q] || 'default');
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = (input.value || '').trim();
        if (!v) return;
        push(v.replace(/</g, '&lt;'), 'me');
        input.value = '';
        botReply(detect(v));
      });
    }
  }

  function boot() { initOrb(); initAssistant(); }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
