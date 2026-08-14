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
