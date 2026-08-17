/* ============================================================
   Ciel étoilé — section Contact
   Étoiles en profondeur, constellations, étoiles filantes,
   éclat "nova" au clic. Storytelling : viser la lune.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var canvas = document.getElementById('sky');
    var section = document.getElementById('contact');
    if (!canvas || !section) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    var stars = [], shooters = [], bursts = [];
    var mouse = { x: -999, y: -999, on: false };
    var running = false, raf = null;

    function resize() {
      var r = section.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      stars = [];
      var count = Math.min(130, Math.floor((W * H) / 9000));
      for (var i = 0; i < count; i++) {
        var depth = Math.random();
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: depth,
          r: 0.4 + depth * 1.7,
          tw: Math.random() * Math.PI * 2,
          tws: 0.6 + Math.random() * 1.4,
          vx: (Math.random() - 0.5) * 0.06 * (0.3 + depth),
          vy: (Math.random() - 0.5) * 0.06 * (0.3 + depth),
          a0: 0, tx: 0, ty: 0
        });
        // point de départ pour l'assemblage
        var s = stars[i];
        s.tx = s.x; s.ty = s.y;
        s.x = W / 2 + (Math.random() - 0.5) * 60;
        s.y = H / 2 + (Math.random() - 0.5) * 60;
      }
      assembleT = 0;
    }

    var assembleT = 0;
    var shootTimer = 0;

    function spawnShooter() {
      var fromLeft = Math.random() > 0.5;
      shooters.push({
        x: fromLeft ? -40 : W + 40,
        y: Math.random() * H * 0.5,
        vx: (fromLeft ? 1 : -1) * (5 + Math.random() * 4),
        vy: 2 + Math.random() * 2,
        life: 1
      });
    }

    function burst(x, y) {
      var parts = [];
      for (var i = 0; i < 26; i++) {
        var a = (i / 26) * Math.PI * 2 + Math.random() * 0.3;
        var sp = 1.5 + Math.random() * 3.5;
        parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1 });
      }
      bursts.push({ parts: parts, star: { x: x, y: y, s: 0 } });
      if (window.NovaSound) window.NovaSound.play('star');
    }

    function drawStarShape(x, y, s, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      for (var i = 0; i <= 8; i++) {
        var a = (i / 8) * Math.PI * 2;
        var r = (i % 2 === 0) ? s : s * 0.34;
        var px = Math.cos(a) * r, py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      if (assembleT < 1) assembleT += 0.02;
      var ease = 1 - Math.pow(1 - Math.min(assembleT, 1), 3);

      // étoiles
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (assembleT < 1) {
          s.x = s.x + (s.tx - s.x) * 0.06;
          s.y = s.y + (s.ty - s.y) * 0.06;
        } else {
          s.x += s.vx; s.y += s.vy;
          if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
          if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
        }
        s.tw += 0.02 * s.tws;
        var tw = 0.55 + Math.sin(s.tw) * 0.45;
        var alpha = (0.25 + s.z * 0.75) * tw * ease;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        // léger halo pour les grosses
        if (s.z > 0.75) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(124,92,255,' + (alpha * 0.25) + ')';
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // constellations (voisins proches)
      ctx.lineWidth = 1;
      for (var a = 0; a < stars.length; a++) {
        var sa = stars[a];
        for (var b = a + 1; b < stars.length; b++) {
          var sb = stars[b];
          var dx = sa.x - sb.x, dy = sa.y - sb.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 12000) {
            var al = (1 - d2 / 12000) * 0.18 * ease;
            ctx.strokeStyle = 'rgba(160,175,255,' + al + ')';
            ctx.beginPath(); ctx.moveTo(sa.x, sa.y); ctx.lineTo(sb.x, sb.y); ctx.stroke();
          }
        }
        // lien vers le curseur
        if (mouse.on) {
          var mdx = sa.x - mouse.x, mdy = sa.y - mouse.y;
          var md2 = mdx * mdx + mdy * mdy;
          if (md2 < 26000) {
            var mal = (1 - md2 / 26000) * 0.4;
            ctx.strokeStyle = 'rgba(124,92,255,' + mal + ')';
            ctx.beginPath(); ctx.moveTo(sa.x, sa.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }

      // étoiles filantes
      shootTimer++;
      if (shootTimer > 180 && Math.random() > 0.985) { spawnShooter(); shootTimer = 0; }
      for (var sh = shooters.length - 1; sh >= 0; sh--) {
        var o = shooters[sh];
        o.x += o.vx; o.y += o.vy; o.life -= 0.012;
        var grad = ctx.createLinearGradient(o.x, o.y, o.x - o.vx * 6, o.y - o.vy * 6);
        grad.addColorStop(0, 'rgba(255,255,255,' + (o.life * 0.9) + ')');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x - o.vx * 6, o.y - o.vy * 6); ctx.stroke();
        if (o.life <= 0 || o.x < -60 || o.x > W + 60) shooters.splice(sh, 1);
      }
      ctx.lineWidth = 1;

      // éclats nova
      for (var bu = bursts.length - 1; bu >= 0; bu--) {
        var B = bursts[bu];
        B.star.s += (14 - B.star.s) * 0.2;
        drawStarShape(B.star.x, B.star.y, B.star.s, 0.9);
        var alive = false;
        for (var p = 0; p < B.parts.length; p++) {
          var pt = B.parts[p];
          pt.x += pt.vx; pt.y += pt.vy; pt.vx *= 0.96; pt.vy *= 0.96; pt.life -= 0.02;
          if (pt.life > 0) {
            alive = true;
            ctx.beginPath();
            ctx.fillStyle = 'rgba(200,210,255,' + pt.life + ')';
            ctx.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2); ctx.fill();
          }
        }
        if (!alive && B.star.s > 13) bursts.splice(bu, 1);
      }

      if (running && !reduce) raf = requestAnimationFrame(frame);
    }

    function start() { if (running) return; running = true; if (!reduce) raf = requestAnimationFrame(frame); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    // interactions
    section.addEventListener('pointermove', function (e) {
      var r = section.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    });
    section.addEventListener('pointerleave', function () { mouse.on = false; mouse.x = -999; mouse.y = -999; });
    section.addEventListener('click', function (e) {
      if (e.target.closest('a,button,input,textarea,label,form')) return;
      var r = section.getBoundingClientRect();
      burst(e.clientX - r.left, e.clientY - r.top);
    });

    window.addEventListener('resize', function () {
      clearTimeout(window.__skyRz);
      window.__skyRz = setTimeout(resize, 180);
    });

    resize();

    if (reduce) { frame(); return; }

    // ne tourne que si visible
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) start(); else stop(); });
      }, { threshold: 0.05 }).observe(section);
    } else { start(); }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
