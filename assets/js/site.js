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

/* ---------- Nova : orbe vivante + assistant ---------- */
(function(){
  var bub=document.getElementById('bub'), nova=document.getElementById('nova'), cv=document.getElementById('orb');
  if(!bub||!nova||!cv) return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== ORBE : rendu temps reel, physique d'impulsion =====
     speed monte d'un coup au clic (impulsion) puis redescend en friction
     exponentielle -> acceleration franche, deceleration douce, jamais d'arret sec. */
  var ctx=cv.getContext('2d');
  var DPR=Math.min(window.devicePixelRatio||1,2), S=86;
  cv.width=S*DPR; cv.height=S*DPR; ctx.scale(DPR,DPR);
  var C=S/2, R=S*0.30;
  var phase=0, speed=1, IDLE=1, scale=1, scaleV=0, glow=0;
  var last=performance.now();

  function impulse(){ speed=Math.min(speed+6.5,9); scale=0.84; }

  function blobPath(t,agit){
    ctx.beginPath();
    for(var k=0;k<=64;k++){
      var th=(k/64)*Math.PI*2;
      var r=R*(1
        +(0.050+0.030*agit)*Math.sin(3*th+t*1.35)
        +(0.034+0.026*agit)*Math.sin(5*th-t*0.9)
        +(0.026+0.018*agit)*Math.sin(2*th+t*0.55));
      var x=C+Math.cos(th)*r, y=C+Math.sin(th)*r;
      k?ctx.lineTo(x,y):ctx.moveTo(x,y);
    }
    ctx.closePath();
  }
  function star(x,y,s,rot,alpha){
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.globalAlpha=alpha;
    ctx.beginPath();
    ctx.moveTo(0,-s); ctx.quadraticCurveTo(0,0,s,0); ctx.quadraticCurveTo(0,0,0,s);
    ctx.quadraticCurveTo(0,0,-s,0); ctx.quadraticCurveTo(0,0,0,-s);
    ctx.fillStyle='#fff'; ctx.fill(); ctx.restore(); ctx.globalAlpha=1;
  }
  function frame(now){
    var dt=Math.min((now-last)/1000,0.05); last=now;
    speed+=(IDLE-speed)*(1-Math.exp(-dt*1.9));      // friction douce vers le ralenti
    scaleV+=(1-scale)*dt*38; scaleV*=Math.exp(-dt*7); scale+=scaleV*dt*8;  // ressort squash
    glow+=((speed-1)/8-glow)*(1-Math.exp(-dt*5));
    phase+=dt*(0.55+0.85*speed);
    var agit=Math.min((speed-1)/6,1);

    ctx.clearRect(0,0,S,S);
    ctx.save(); ctx.translate(C,C); ctx.scale(scale,2-scale>1.12?1.12:2-scale); ctx.translate(-C,-C);

    // halo
    ctx.save();
    ctx.shadowColor='rgba(61,77,255,'+(0.35+glow*0.5)+')';
    ctx.shadowBlur=14+glow*26;

    // trois nappes de couleur qui tournent a des vitesses differentes
    var cols=[['#7C5CFF',0.0,0.95],['#3D4DFF',2.1,0.9],['#22D3EE',4.2,0.85]];
    ctx.globalCompositeOperation='source-over';
    blobPath(phase,agit);
    var g0=ctx.createRadialGradient(C,C,R*0.1,C,C,R*1.25);
    g0.addColorStop(0,'#EDEFFB'); g0.addColorStop(1,'#DDE2F5');
    ctx.fillStyle=g0; ctx.fill();
    ctx.restore();

    ctx.globalCompositeOperation='multiply';
    for(var n=0;n<cols.length;n++){
      var off=cols[n][1], al=cols[n][2];
      var gx=C+Math.cos(phase*0.9+off)*R*0.55, gy=C+Math.sin(phase*0.9+off)*R*0.55;
      blobPath(phase+off*0.35,agit);
      var g=ctx.createRadialGradient(gx,gy,0,gx,gy,R*1.5);
      g.addColorStop(0,cols[n][0]); g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.globalAlpha=al; ctx.fillStyle=g; ctx.fill();
    }
    ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';

    // reflet verre
    blobPath(phase,agit); ctx.save(); ctx.clip();
    var hl=ctx.createRadialGradient(C-R*0.5,C-R*0.65,0,C-R*0.5,C-R*0.65,R*1.1);
    hl.addColorStop(0,'rgba(255,255,255,.75)'); hl.addColorStop(0.45,'rgba(255,255,255,.12)'); hl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hl; ctx.fillRect(0,0,S,S); ctx.restore();

    // etoile nova en orbite + poussieres
    var orbR=R*1.45;
    var sx=C+Math.cos(phase*1.6)*orbR, sy=C+Math.sin(phase*1.6)*orbR*0.92;
    star(sx,sy,3.4+agit*1.6,phase*2,0.9);
    for(var q=0;q<3;q++){
      var pp=phase*(1.1+q*0.35)+q*2.1;
      var dx=C+Math.cos(pp)*orbR*0.9, dy=C+Math.sin(pp)*orbR*0.86;
      ctx.beginPath(); ctx.arc(dx,dy,1.1+agit,0,Math.PI*2);
      ctx.fillStyle='rgba(61,77,255,'+(0.35+agit*0.4)+')'; ctx.fill();
    }
    ctx.restore();
    requestAnimationFrame(frame);
  }
  if(reduce){
    // version calme : une seule image douce
    blobPath(0,0);
    var g=ctx.createRadialGradient(C-6,C-8,0,C,C,R*1.4);
    g.addColorStop(0,'#7C5CFF'); g.addColorStop(0.6,'#3D4DFF'); g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g; ctx.fill();
  } else {
    requestAnimationFrame(frame);
  }
  bub.addEventListener('pointerenter',function(){ speed=Math.min(speed+0.9,3.2); });

  /* ===== assistant ===== */
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
    impulse();
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

/* ---------- hero : ralenti + parallaxe du panneau ---------- */
(function(){
  var v=document.getElementById('heroVid');
  if(v){ v.playbackRate=0.7; }
  var panel=document.querySelector('.hpanel');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(panel && !reduce){
    var t=false;
    window.addEventListener('scroll',function(){
      if(t) return; t=true;
      requestAnimationFrame(function(){
        var y=Math.min(window.scrollY,900);
        panel.style.transform='translateY('+(y*0.07)+'px)';
        t=false;
      });
    },{passive:true});
  }
})();

/* ---------- contact : ciel etoile Novalem ----------
   L'histoire de la marque, codee : viser la lune, retomber dans les etoiles.
   Etoiles en profondeur qui derivent et scintillent, constellations qui se
   dessinent, etoiles filantes, et au clic : une nova. */
(function(){
  var cv=document.getElementById('sky'); if(!cv) return;
  var panel=cv.parentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx=cv.getContext('2d');
  var DPR=Math.min(window.devicePixelRatio||1,1.8);
  var W=0,H=0,stars=[],shots=[],novas=[],mouse={x:-9e3,y:-9e3},running=false,t0=performance.now(),assembled=false,assembleT=0,nextShot=2500;

  function size(){
    var r=panel.getBoundingClientRect();
    W=r.width; H=r.height;
    cv.width=W*DPR; cv.height=H*DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  function makeStars(){
    stars=[];
    var count=Math.round(Math.min(140,(W*H)/9000));
    for(var i=0;i<count;i++){
      var depth=Math.random();            // 0 loin, 1 pres
      var edge=Math.floor(Math.random()*4);
      var sx=edge===0?-40:edge===1?W+40:Math.random()*W;
      var sy=edge===2?-40:edge===3?H+40:Math.random()*H;
      stars.push({
        x:Math.random()*W, y:Math.random()*H,      // position cible
        sx:sx, sy:sy,                               // depart (vol d'assemblage)
        vx:(Math.random()-.5)*.06, vy:(Math.random()-.5)*.06,
        r:.6+depth*1.7, d:depth,
        tw:Math.random()*Math.PI*2, tws:.5+Math.random()*1.4,
        hue:Math.random()<.72?'255,255,255':(Math.random()<.5?'160,170,255':'150,230,245')
      });
    }
  }
  function shoot(){
    var fromLeft=Math.random()<.5;
    shots.push({
      x:fromLeft?-30:W+30, y:Math.random()*H*.5,
      vx:(fromLeft?1:-1)*(5.5+Math.random()*3), vy:1.6+Math.random()*1.4,
      life:1
    });
  }
  cv.addEventListener('pointermove',function(e){ var r=cv.getBoundingClientRect(); mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; });
  cv.addEventListener('pointerleave',function(){ mouse.x=-9e3; mouse.y=-9e3; });
  cv.addEventListener('click',function(e){
    var r=cv.getBoundingClientRect();
    novas.push({x:e.clientX-r.left,y:e.clientY-r.top,t:0,parts:Array.from({length:26},function(){
      var a=Math.random()*Math.PI*2, sp=1.4+Math.random()*3.2;
      return {a:a,sp:sp,r:.8+Math.random()*1.6};
    })});
  });

  var last=performance.now();
  function frame(now){
    if(!running) return;
    var dt=Math.min((now-last)/16.7,3); last=now;
    ctx.clearRect(0,0,W,H);

    if(!assembled){ assembleT+=dt/70; if(assembleT>=1){assembled=true;} }
    var ease=assembled?1:(1-Math.pow(1-Math.min(assembleT,1),3));

    // etoiles
    for(var i=0;i<stars.length;i++){
      var s=stars[i];
      if(assembled){
        s.x+=s.vx*dt*(.4+s.d); s.y+=s.vy*dt*(.4+s.d);
        if(s.x<-8)s.x=W+8; if(s.x>W+8)s.x=-8; if(s.y<-8)s.y=H+8; if(s.y>H+8)s.y=-8;
        var dx=s.x-mouse.x, dy=s.y-mouse.y, dd=dx*dx+dy*dy;
        if(dd<6400){ var f=(1-Math.sqrt(dd)/80)*.6*dt; s.x+=dx/Math.sqrt(dd+.1)*f*3; s.y+=dy/Math.sqrt(dd+.1)*f*3; }
      }
      var px=s.sx+(s.x-s.sx)*ease, py=s.sy+(s.y-s.sy)*ease;
      s.px=px; s.py=py;
      s.tw+=dt*.05*s.tws;
      var a=(0.35+0.65*(0.5+0.5*Math.sin(s.tw)))*(0.35+0.65*s.d)*ease;
      ctx.beginPath(); ctx.arc(px,py,s.r,0,Math.PI*2);
      ctx.fillStyle='rgba('+s.hue+','+a.toFixed(3)+')'; ctx.fill();
    }

    // constellations : lignes fines entre voisines + vers le curseur
    ctx.lineWidth=.6;
    for(var i=0;i<stars.length;i++){
      var s=stars[i]; if(s.d<.45) continue;
      for(var j=i+1;j<stars.length;j++){
        var q=stars[j]; if(q.d<.45) continue;
        var dx=s.px-q.px, dy=s.py-q.py, dd=dx*dx+dy*dy;
        if(dd<5200){
          var o=(1-dd/5200)*.16*ease;
          ctx.strokeStyle='rgba(190,200,255,'+o.toFixed(3)+')';
          ctx.beginPath(); ctx.moveTo(s.px,s.py); ctx.lineTo(q.px,q.py); ctx.stroke();
        }
      }
      var mx=s.px-mouse.x, my=s.py-mouse.y, md=mx*mx+my*my;
      if(md<12000){
        var o=(1-md/12000)*.3;
        ctx.strokeStyle='rgba(140,160,255,'+o.toFixed(3)+')';
        ctx.beginPath(); ctx.moveTo(s.px,s.py); ctx.lineTo(mouse.x,mouse.y); ctx.stroke();
      }
    }

    // etoiles filantes
    nextShot-=dt*16.7;
    if(nextShot<=0 && assembled){ shoot(); nextShot=3800+Math.random()*4200; }
    for(var k=shots.length-1;k>=0;k--){
      var sh=shots[k];
      sh.x+=sh.vx*dt; sh.y+=sh.vy*dt; sh.life-=dt*.012;
      var g=ctx.createLinearGradient(sh.x,sh.y,sh.x-sh.vx*9,sh.y-sh.vy*9);
      g.addColorStop(0,'rgba(255,255,255,'+(.85*sh.life)+')'); g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle=g; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.moveTo(sh.x,sh.y); ctx.lineTo(sh.x-sh.vx*9,sh.y-sh.vy*9); ctx.stroke();
      if(sh.life<=0||sh.x<-60||sh.x>W+60||sh.y>H+60) shots.splice(k,1);
    }

    // novas (clic)
    for(var k=novas.length-1;k>=0;k--){
      var n=novas[k]; n.t+=dt*.02;
      var e2=1-Math.pow(1-Math.min(n.t,1),3);
      // flash central
      var fa=Math.max(0,(0.5-n.t))*1.4;
      if(fa>0){ var fg=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,26); fg.addColorStop(0,'rgba(255,255,255,'+fa+')'); fg.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(n.x,n.y,26,0,Math.PI*2); ctx.fill(); }
      for(var q2=0;q2<n.parts.length;q2++){
        var pp=n.parts[q2];
        var dist=e2*46*pp.sp/2.2;
        var px=n.x+Math.cos(pp.a)*dist, py=n.y+Math.sin(pp.a)*dist;
        var pa=(1-n.t)*.9; if(pa<=0) continue;
        ctx.beginPath(); ctx.arc(px,py,pp.r*(1-n.t*.5),0,Math.PI*2);
        ctx.fillStyle='rgba(200,210,255,'+pa.toFixed(3)+')'; ctx.fill();
      }
      if(n.t>=1) novas.splice(k,1);
    }

    requestAnimationFrame(frame);
  }

  function start(){ if(running) return; running=true; last=performance.now(); requestAnimationFrame(frame); }
  function stop(){ running=false; }

  function init(){
    size(); makeStars();
    if(reduce){
      // version calme : ciel fixe deja assemble
      assembled=true;
      for(var i=0;i<stars.length;i++){ var s=stars[i]; s.px=s.x; s.py=s.y;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle='rgba('+s.hue+','+(0.5*(0.35+0.65*s.d)).toFixed(3)+')'; ctx.fill(); }
      return;
    }
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){ es.forEach(function(e){ e.isIntersecting?start():stop(); }); },{threshold:.05});
      io.observe(panel);
    } else start();
  }
  var rT; window.addEventListener('resize',function(){ clearTimeout(rT); rT=setTimeout(function(){ var wasR=running; stop(); init(); if(wasR&&!reduce) start(); },180); });
  window.addEventListener('load',init);
  if(document.readyState==='complete') init();
})();
