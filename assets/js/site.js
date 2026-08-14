(function(){
  var nav=document.getElementById('nav');
  var onScroll=function(){ nav.classList.toggle('scrolled',window.scrollY>24); };
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});

  var burger=document.getElementById('burger'), menu=document.getElementById('menu');
  function tog(){ menu.classList.toggle('open'); document.body.style.overflow=menu.classList.contains('open')?'hidden':''; }
  burger.addEventListener('click',tog);
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){ if(menu.classList.contains('open')) tog(); });});

  // reveals — robust, with failsafe
  var items=[].slice.call(document.querySelectorAll('.reveal'));
  function showAll(){ items.forEach(function(el){el.classList.add('in');}); }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    items.forEach(function(el){io.observe(el);});
    setTimeout(showAll,2600); // failsafe so nothing ever stays hidden
  } else { showAll(); }

  // sound (off by default, tekiyo spirit, original)
  var AC=null,on=false,snd=document.getElementById('snd');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ac(){ if(AC) return; try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} }
  function tone(f,d,t,v,to){ if(!on||!AC||reduce) return; var o=AC.createOscillator(),g=AC.createGain(),s=AC.currentTime; o.type=t||'sine'; o.frequency.setValueAtTime(f,s); if(to)o.frequency.exponentialRampToValueAtTime(to,s+d); g.gain.setValueAtTime(0,s); g.gain.linearRampToValueAtTime(v||.04,s+.008); g.gain.exponentialRampToValueAtTime(.0001,s+d); o.connect(g); g.connect(AC.destination); o.start(s); o.stop(s+d+.02); }
  snd.addEventListener('click',function(){ ac(); if(AC&&AC.state==='suspended')AC.resume(); on=!on; snd.classList.toggle('off',!on); if(on){tone(520,.05,'sine',.05);setTimeout(function(){tone(780,.07,'sine',.045);},40);} });
  document.querySelectorAll('a,button').forEach(function(el){ el.addEventListener('pointerenter',function(){tone(880,.05,'triangle',.02);}); });
})();

/* --- securite portrait : si le moteur ne demarre pas, image particules fixe --- */
(function(){
  function kick(){ try{ window.dispatchEvent(new Event('resize')); }catch(e){} }
  window.addEventListener('load', function(){
    kick(); setTimeout(kick,600); setTimeout(kick,1800);
    setTimeout(function(){
      var st=document.getElementById('portrait-stage');
      if(st && !window.NOVALEM_PARTICLES_READY){
        st.innerHTML='<img src="assets/img/louis-particles.png" alt="Louis" style="width:100%;height:100%;object-fit:contain">';
      }
    },4000);
  });
})();

/* ---------- Nova : bulle + assistant ---------- */
(function(){
  var bub=document.getElementById('bub'), nova=document.getElementById('nova');
  if(!bub||!nova) return;
  var v=bub.querySelector('video'); if(v){ v.playbackRate=0.45; }
  var msgs=document.getElementById('nmsgs'), chipsBox=document.getElementById('nchips');
  var form=document.getElementById('nform'), input=document.getElementById('ninput');
  var opened=false, greeted=false;

  var REP={
    prix:"Quatre formules, devis ferme :\n• Essentiel — 390 €\n• Vitrine — 790 € (recommandé)\n• Signature — 1 190 €\n• Sur mesure — sur devis\nUne agence facture souvent 3 000 à 6 000 €.",
    delai:"Les délais :\n• Essentiel — 7 jours\n• Vitrine — 10 à 14 jours\n• Signature — 3 semaines\nDevis ferme sous 48 h après l'appel.",
    methode:"Ça se passe en 4 étapes :\n1. Cadrage (30 min au téléphone)\n2. Maquette validée avant le code\n3. Développement + 2 tours de modifs\n4. Mise en ligne et remise des sources.",
    contact:"Le plus simple : un appel de 30 minutes.\n📩 contact@studionovalem.fr\n📞 +590 690 31 79 99\nOu le bouton « Demander un devis » juste au-dessus.",
    hello:"Bonjour ! Je suis Nova, l'assistant du studio. Je peux vous parler des formules, des délais ou de la méthode — ou vous mettre en contact avec Louis."
  };
  var CHIPS=[["Formules & prix","prix"],["Délais","delai"],["La méthode","methode"],["Parler à Louis","contact"]];

  function scrollBottom(){ msgs.scrollTop=msgs.scrollHeight; }
  function add(kind,text){ var d=document.createElement('div'); d.className='m '+kind; d.textContent=text; msgs.appendChild(d); scrollBottom(); }
  function typingOn(){ var t=document.createElement('div'); t.className='m ai typing'; t.id='ntyp'; t.innerHTML='<i></i><i></i><i></i>'; msgs.appendChild(t); scrollBottom(); }
  function typingOff(){ var t=document.getElementById('ntyp'); if(t) t.remove(); }
  function answer(key){ typingOn(); setTimeout(function(){ typingOff(); add('ai',REP[key]||REP.hello); },650); }
  function route(txt){
    var q=txt.toLowerCase();
    if(/prix|tarif|formule|combien|co[uû]t/.test(q)) return 'prix';
    if(/d[ée]lai|temps|livr|rapide|quand/.test(q)) return 'delai';
    if(/m[ée]thode|comment|[ée]tape|passe/.test(q)) return 'methode';
    if(/contact|louis|appel|t[ée]l|mail|devis|rdv|rendez/.test(q)) return 'contact';
    if(/bonjour|salut|hello|bonsoir|hey/.test(q)) return 'hello';
    return null;
  }
  CHIPS.forEach(function(c){ var b=document.createElement('button'); b.type='button'; b.className='chip'; b.textContent=c[0]; b.addEventListener('click',function(){ add('me',c[0]); answer(c[1]); }); chipsBox.appendChild(b); });
  form.addEventListener('submit',function(e){ e.preventDefault(); var t=input.value.trim(); if(!t) return; input.value=''; add('me',t);
    var k=route(t); if(k){ answer(k); } else { typingOn(); setTimeout(function(){ typingOff(); add('ai',"Bonne question — le mieux, c'est d'en parler directement avec Louis :\ncontact@studionovalem.fr · +590 690 31 79 99\nSinon je peux détailler les formules, les délais ou la méthode."); },650); }
  });
  function openNova(){
    opened=!opened; nova.classList.toggle('open',opened);
    if(v){ v.playbackRate=2.2; bub.classList.add('pop'); setTimeout(function(){ bub.classList.remove('pop'); },320); setTimeout(function(){ v.playbackRate=0.45; },1100); }
    if(opened && !greeted){ greeted=true; setTimeout(function(){ answer('hello'); },200); }
  }
  bub.addEventListener('click',openNova);
  bub.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openNova(); } });
})();

/* ---------- explosion vers le contact ---------- */
(function(){
  var cta=document.getElementById('cta-boom'), ov=document.getElementById('boom'), bv=document.getElementById('boomv');
  if(!cta||!ov||!bv) return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var busy=false;
  function go(){ var c=document.getElementById('contact'); if(c) c.scrollIntoView({behavior: reduce?'auto':'smooth'}); }
  cta.addEventListener('click',function(e){
    if(reduce) return; // scroll normal
    e.preventDefault(); if(busy) return; busy=true;
    ov.classList.add('on');
    try{ bv.currentTime=0; }catch(err){}
    var p=bv.play(); if(p&&p.catch) p.catch(function(){});
    var done=false;
    function end(){ if(done) return; done=true; ov.classList.remove('on'); bv.pause(); busy=false; go(); }
    bv.onended=end; setTimeout(end,2600);
  });
})();
