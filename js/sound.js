/* ============================================================
   NovaSound — sons d'interface synthétisés (Web Audio)
   Désactivé par défaut, mémorisé dans localStorage.
   Aucun fichier audio : tout est généré à la volée.
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'novalem_sound';
  var ctx = null;
  var master = null;
  var enabled = false;

  try { enabled = localStorage.getItem(KEY) === 'on'; } catch (e) {}

  function ensureCtx() {
    if (ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.10;      // volume global volontairement discret
    master.connect(ctx.destination);
  }

  function now() { return ctx ? ctx.currentTime : 0; }

  // enveloppe simple sur un oscillateur
  function blip(freq, dur, type, peak, glideTo) {
    if (!enabled || !ctx) return;
    var t = now();
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak || 0.5, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  function noiseSweep(dur, peak) {
    if (!enabled || !ctx) return;
    var t = now();
    var len = Math.floor(ctx.sampleRate * dur);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = ctx.createBufferSource(); src.buffer = buf;
    var filt = ctx.createBiquadFilter(); filt.type = 'bandpass';
    filt.frequency.setValueAtTime(500, t);
    filt.frequency.exponentialRampToValueAtTime(2600, t + dur);
    filt.Q.value = 0.8;
    var g = ctx.createGain();
    g.gain.setValueAtTime(peak || 0.16, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt); filt.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur);
  }

  var sounds = {
    tick:  function () { blip(1180, 0.05, 'sine', 0.28); },
    hover: function () { blip(880, 0.045, 'sine', 0.20); },
    pop:   function () { blip(560, 0.14, 'sine', 0.5, 1040); },
    open:  function () { noiseSweep(0.28, 0.14); blip(420, 0.22, 'sine', 0.28, 720); },
    close: function () { blip(700, 0.16, 'sine', 0.32, 360); },
    chime: function () { blip(660, 0.5, 'sine', 0.35, 990); setTimeout(function(){ blip(990, 0.5, 'sine', 0.3, 1320); }, 90); },
    star:  function () { blip(1320, 0.3, 'triangle', 0.3, 2200); }
  };

  window.NovaSound = {
    isEnabled: function () { return enabled; },
    setEnabled: function (v) {
      enabled = !!v;
      try { localStorage.setItem(KEY, enabled ? 'on' : 'off'); } catch (e) {}
      if (enabled) { ensureCtx(); if (ctx && ctx.state === 'suspended') ctx.resume(); sounds.pop(); }
    },
    toggle: function () { this.setEnabled(!enabled); return enabled; },
    play: function (name) {
      if (!enabled) return;
      ensureCtx();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      if (sounds[name]) sounds[name]();
    }
  };
})();
