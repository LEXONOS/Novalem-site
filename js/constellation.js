/* ============================================================
   Constellation — section Le studio
   Des particules assemblent l'emblème nova (cercle + étoile),
   flottent, réagissent au curseur. Aucune image nécessaire.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var canvas = document.getElementById('constellation');
    var host = canvas ? canvas.parentElement : null;
    if (!canvas || !host) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, cx = 0, cy = 0;
    var parts = [];
    var mouse = { x: -999, y: -999, on: false };
    var assembled = false, started = false, raf = null, t = 0;

    // échantillonne les pixels opaques d'un tracé
    function sample(drawFn, step) {
      var off = document.createElement('canvas');
      off.width = W; off.height = H;
      var o = off.getContext('2d');
      o.fillStyle = '#000';
      drawFn(o);
      var img;
      try { img = o.getImageData(0, 0, W, H).data; } catch (e) { return []; }
      var pts = [];
      for (var y = 0; y < H; y += step) {
        for (var x = 0; x < W; x += step) {
          var idx = (y * W + x) * 4 + 3;
          if (img[idx] > 128) pts.push({ x: x, y: y });
        }
      }
      return pts;
    }

    function novaStarPath(o, s) {
      // étoile nova centrée, rayon s
      o.beginPath();
      var arms = [
        [0, -1], [0.28, -0.28], [1, 0], [0.28, 0.28],
        [0, 1], [-0.28, 0.28], [-1, 0], [-0.28, -0.28]
      ];
      for (var i = 0; i < arms.length; i++) {
        var px = cx + arms[i][0] * s, py = cy + arms[i][1] * s;
        if (i === 0) o.moveTo(px, py); else o.lineTo(px, py);
      }
      o.closePath();
      o.fill();
    }

    function build() {
      var R = Math.min(W, H) * 0.4;
      var step = Math.max(4, Math.round(Math.min(W, H) / 90));

      // cercle (anneau) -> points encre
      var ringPts = sample(function (o) {
        o.lineWidth = Math.max(3, R * 0.02);
        o.strokeStyle = '#000';
        o.beginPath();
        o.arc(cx, cy, R, 0, Math.PI * 2);
        o.stroke();
      }, step);

      // étoile nova -> points aurora
      var starPts = sample(function (o) {
        novaStarPath(o, R * 0.52);
      }, Math.max(5, step + 1));

      // sous-échantillonnage pour limiter le nombre
      function pick(arr, max) {
        if (arr.length <= max) return arr;
        var out = [], k = arr.length / max;
        for (var i = 0; i < max; i++) out.push(arr[Math.floor(i * k)]);
        return out;
      }
      var small = W < 420;
      ringPts = pick(ringPts, small ? 90 : 150);
      starPts = pick(starPts, small ? 70 : 120);

      parts = [];
      function add(list, kind) {
        for (var i = 0; i < list.length; i++) {
          parts.push({
            tx: list[i].x, ty: list[i].y,
            x: cx + (Math.random() - 0.5) * W * 0.4,
            y: cy + (Math.random() - 0.5) * H * 0.4,
            vx: 0, vy: 0,
            ph: Math.random() * Math.PI * 2,
            kind: kind,
            r: kind === 'star' ? 1.5 + Math.random() * 1.1 : 1.1 + Math.random() * 0.9
          });
        }
      }
      add(ringPts, 'ring');
      add(starPts, 'star');
    }

    function resize() {
      var r = host.getBoundingClientRect();
      W = Math.round(r.width); H = Math.round(r.height); cx = W / 2; cy = H / 2;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function frame() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        // cible + flottement
        var fx = p.tx + Math.cos(t * 0.7 + p.ph) * 2.4;
        var fy = p.ty + Math.sin(t * 0.6 + p.ph) * 2.4;

        if (assembled || reduce) {
          p.vx += (fx - p.x) * 0.02;
          p.vy += (fy - p.y) * 0.02;
        }

        // répulsion curseur
        if (mouse.on) {
          var dx = p.x - mouse.x, dy = p.y - mouse.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 9000 && d2 > 0.01) {
            var f = (1 - d2 / 9000) * 2.6;
            var d = Math.sqrt(d2);
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        p.vx *= 0.86; p.vy *= 0.86;
        p.x += p.vx; p.y += p.vy;

        if (p.kind === 'star') {
          var g = ctx.createLinearGradient(p.x - 3, p.y - 3, p.x + 3, p.y + 3);
          g.addColorStop(0, '#3D4DFF'); g.addColorStop(1, '#22D3EE');
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = 'rgba(24,27,40,0.9)';
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // connexions proches (léger)
      if (parts.length < 340) {
        ctx.lineWidth = 1;
        for (var a = 0; a < parts.length; a++) {
          var pa = parts[a];
          for (var b = a + 1; b < parts.length; b++) {
            var pb = parts[b];
            var ddx = pa.x - pb.x, ddy = pa.y - pb.y;
            var dd2 = ddx * ddx + ddy * ddy;
            if (dd2 < 1100) {
              var al = (1 - dd2 / 1100) * 0.22;
              ctx.strokeStyle = 'rgba(90,96,118,' + al + ')';
              ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
            }
          }
        }
      }

      if (started && !reduce) raf = requestAnimationFrame(frame);
    }

    function start() { if (started) return; started = true; if (!reduce) raf = requestAnimationFrame(frame); }
    function stop() { started = false; if (raf) cancelAnimationFrame(raf); }

    host.addEventListener('pointermove', function (e) {
      var r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    });
    host.addEventListener('pointerleave', function () { mouse.on = false; mouse.x = -999; mouse.y = -999; });

    window.addEventListener('resize', function () {
      clearTimeout(window.__conRz);
      window.__conRz = setTimeout(resize, 180);
    });

    resize();

    if (reduce) { assembled = true; frame(); return; }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { start(); setTimeout(function () { assembled = true; }, 120); }
          else stop();
        });
      }, { threshold: 0.15 }).observe(host);
    } else { start(); assembled = true; }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
