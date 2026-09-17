(() => {
  const qs = (s, c=document) => c.querySelector(s);
  const qsa = (s, c=document) => [...c.querySelectorAll(s)];
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const state = { lang:'en', activeConcept:null, activeTab:'intuition', week:'all', search:'', map:{scale:1,tx:0,ty:0}, stage:false, stageIndex:0, interval:'1_3', metric:'error', resultCase:'shifted' };
  const lang = (obj) => typeof obj === 'string' ? obj : (obj?.[state.lang] ?? obj?.en ?? '');

  // -------------------------------------------------------------
  // Ambient canvas background
  // -------------------------------------------------------------
  const canvas = qs('#ambient-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [], mouse = {x:-9999,y:-9999};
  function resizeCanvas(){
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth*dpr; canvas.height = innerHeight*dpr;
    canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = clamp(Math.floor(innerWidth*innerHeight/22000), 28, 90);
    particles = Array.from({length:count}, (_,i)=>({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      vx:(Math.random()-.5)*.18, vy:(Math.random()-.5)*.18,
      r:.7+Math.random()*1.5, a:.12+Math.random()*.25
    }));
  }
  function drawAmbient(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(let i=0;i<particles.length;i++){
      const p=particles[i];
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<-20)p.x=innerWidth+20; if(p.x>innerWidth+20)p.x=-20;
      if(p.y<-20)p.y=innerHeight+20; if(p.y>innerHeight+20)p.y=-20;
      const dx=p.x-mouse.x, dy=p.y-mouse.y, d=Math.hypot(dx,dy);
      if(d<130 && d>0){p.x += dx/d*.12; p.y += dy/d*.12;}
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(115,202,255,${p.a})`; ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const q=particles[j], dist=Math.hypot(p.x-q.x,p.y-q.y);
        if(dist<110){ctx.strokeStyle=`rgba(104,194,220,${.055*(1-dist/110)})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
      }
    }
    requestAnimationFrame(drawAmbient);
  }
  addEventListener('resize', resizeCanvas);
  addEventListener('pointermove', e=>{mouse={x:e.clientX,y:e.clientY}; qs('.aurora-a').style.transform=`translate(${e.clientX*.015}px,${e.clientY*.01}px)`; qs('.aurora-b').style.transform=`translate(${-e.clientX*.012}px,${-e.clientY*.01}px)`;});
  resizeCanvas(); drawAmbient();


  // -------------------------------------------------------------
  // Cinematic hero motion — pulse the approved neural artwork
  // -------------------------------------------------------------
  const hero = qs('.hero-cinematic');
  const heroImg = qs('.hero-art-image');
  const heroCanvas = qs('#hero-flow-canvas');
  let heroCtx = null, heroDpr = 1, heroW = 0, heroH = 0, heroRaf = 0;
  const heroNodes = [
    [.434,.202],[.434,.264],[.434,.327],[.434,.391],
    [.533,.198],[.533,.267],[.533,.337],[.533,.402],
    [.627,.202],[.627,.269],[.627,.337],[.627,.404]
  ];
  const heroEdges = [];
  for(let a=0;a<4;a++) for(let b=4;b<8;b++) heroEdges.push([a,b]);
  for(let a=4;a<8;a++) for(let b=8;b<12;b++) heroEdges.push([a,b]);
  const heroPulseParticles = Array.from({length:28},(_,i)=>({edge:i%heroEdges.length,t:(i/28)%1,speed:.035+(i%7)*.004,phase:i*.73}));

  function resizeHeroCanvas(){
    if(!heroCanvas || !hero) return;
    const r=hero.getBoundingClientRect(); heroW=Math.max(1,r.width);heroH=Math.max(1,r.height);
    heroDpr=Math.min(devicePixelRatio||1,2);
    heroCanvas.width=Math.floor(heroW*heroDpr);heroCanvas.height=Math.floor(heroH*heroDpr);
    heroCanvas.style.width=heroW+'px';heroCanvas.style.height=heroH+'px';
    heroCtx=heroCanvas.getContext('2d');heroCtx.setTransform(heroDpr,0,0,heroDpr,0,0);
  }
  function bezierPoint(p0,p1,t){
    const bend=(p1[0]-p0[0])*.28;
    const c1=[p0[0]+bend,p0[1]],c2=[p1[0]-bend,p1[1]];
    const u=1-t;
    return [u*u*u*p0[0]+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t*t*t*p1[0],u*u*u*p0[1]+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t*t*t*p1[1]];
  }
  function drawHeroMotion(ms){
    if(!heroCtx || !heroCanvas) return;
    const t=ms*.001; heroCtx.clearRect(0,0,heroW,heroH);
    // soft breathing around the static neural nodes in the artwork
    heroNodes.forEach((n,i)=>{
      const x=n[0]*heroW,y=n[1]*heroH;
      const breath=.5+.5*Math.sin(t*2.1+i*.81);
      const r=5+breath*7;
      const g=heroCtx.createRadialGradient(x,y,0,x,y,r*3.2);
      g.addColorStop(0,`rgba(180,232,255,${.14+.12*breath})`);
      g.addColorStop(.28,`rgba(74,178,255,${.10+.08*breath})`);
      g.addColorStop(1,'rgba(52,145,255,0)');
      heroCtx.fillStyle=g;heroCtx.beginPath();heroCtx.arc(x,y,r*3.2,0,Math.PI*2);heroCtx.fill();
    });
    // tiny packets of information flowing through the fixed connections
    heroPulseParticles.forEach((p,i)=>{
      p.t=(p.t+p.speed*.0105)%1;
      const [a,b]=heroEdges[p.edge];
      const p0=heroNodes[a],p1=heroNodes[b];
      const pt=bezierPoint(p0,p1,p.t);
      const x=pt[0]*heroW,y=pt[1]*heroH;
      const alpha=.22+.38*(.5+.5*Math.sin(t*3+p.phase));
      heroCtx.shadowBlur=12;heroCtx.shadowColor='rgba(106,207,255,.75)';
      heroCtx.fillStyle=`rgba(183,235,255,${alpha})`;heroCtx.beginPath();heroCtx.arc(x,y,1.1+(i%3)*.35,0,Math.PI*2);heroCtx.fill();
    });
    heroCtx.shadowBlur=0;
    // faint traveling spark from the final layer toward the wavefield
    for(let i=0;i<7;i++){
      const u=(t*.055+i/7)%1;
      const x=(.65+.15*u)*heroW;
      const y=(.24+.055*Math.sin(u*Math.PI*2+i))*heroH;
      heroCtx.fillStyle=`rgba(130,218,255,${.08+.16*(1-u)})`;
      heroCtx.beginPath();heroCtx.arc(x,y,1.2,0,Math.PI*2);heroCtx.fill();
    }
    heroRaf=requestAnimationFrame(drawHeroMotion);
  }
  if(heroCanvas && hero){
    resizeHeroCanvas();
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches) heroRaf=requestAnimationFrame(drawHeroMotion);
    addEventListener('resize',resizeHeroCanvas);
    hero.addEventListener('pointermove',e=>{
      if(!heroImg || innerWidth<900) return;
      const r=hero.getBoundingClientRect();const nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;
      heroImg.style.transform=`scale(1.018) translate(${-nx*7}px,${-ny*5}px)`;
    });
    hero.addEventListener('pointerleave',()=>{if(heroImg)heroImg.style.transform='scale(1.012)'});
  }

  // -------------------------------------------------------------
  // Reveal + scroll + nav
  // -------------------------------------------------------------
  const io = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
  qsa('.reveal').forEach(el=>io.observe(el));
  const sections = qsa('.section');
  function onScroll(){
    const max=document.documentElement.scrollHeight-innerHeight;
    qs('#scroll-progress-fill').style.width=((scrollY/max)*100)+'%';
    let current=''; sections.forEach(s=>{if(scrollY>=s.offsetTop-180) current=s.id});
    qsa('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));
    document.body.classList.toggle('hero-at-top', scrollY < Math.max(160, innerHeight*.54) && !state.stage);
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // -------------------------------------------------------------
  // Language toggle
  // -------------------------------------------------------------
  const translations = {
    es:{
      'hero.lede':'Un atlas de investigación interactivo que conecta matemática, código, experimentos y modos de fallo detrás de PINNs, causalidad, fronteras para ondas, Neural ODEs y NeuSA.',
      'hero.thesis':'La física no entra solamente en la pérdida. También puede entrar en cómo representamos, muestreamos, restringimos y evolucionamos la solución.',
      'theory.sub':'Haz clic en un nodo para pasar de intuición a matemática, evidencia y limitaciones. Arrastra nodos. Usa la rueda para zoom y arrastra el fondo para mover el mapa.'
    }
  };
  function applyLanguage(){
    qsa('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(state.lang==='es'&&translations.es[key])el.textContent=translations.es[key];else if(el.dataset.original)el.textContent=el.dataset.original;});
    qs('#lang-toggle').textContent=state.lang==='en'?'ES':'EN';
    if(state.activeConcept) openConcept(state.activeConcept, false);
  }
  qsa('[data-i18n]').forEach(el=>el.dataset.original=el.textContent.trim());
  qs('#lang-toggle').onclick=()=>{state.lang=state.lang==='en'?'es':'en';applyLanguage();};

  // -------------------------------------------------------------
  // Theory-map ambient field — decorative only; all controls stay live.
  // -------------------------------------------------------------
  const theoryCanvas = qs('#theory-bg-canvas');
  if(theoryCanvas){
    const tctx=theoryCanvas.getContext('2d');
    const theorySection=qs('#theory');
    const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let theoryDpr=1, theoryW=1, theoryH=1, theoryRAF=0;
    const sparks=Array.from({length:54},(_,i)=>({
      x:Math.random(),y:Math.random(),
      r:.45+Math.random()*1.45,
      speed:.035+Math.random()*.08,
      phase:Math.random()*Math.PI*2,
      lane:i%3
    }));

    function resizeTheoryCanvas(){
      const rect=theorySection.getBoundingClientRect();
      theoryDpr=Math.min(devicePixelRatio||1,2);
      theoryW=Math.max(1,rect.width);
      theoryH=Math.max(1,theorySection.scrollHeight);
      theoryCanvas.width=Math.round(theoryW*theoryDpr);
      theoryCanvas.height=Math.round(theoryH*theoryDpr);
      theoryCanvas.style.width=theoryW+'px';
      theoryCanvas.style.height=theoryH+'px';
      tctx.setTransform(theoryDpr,0,0,theoryDpr,0,0);
    }
    function waveY(x,t,lane){
      const base=[.20,.53,.82][lane] * theoryH;
      return base
        + Math.sin(x*.009 + t*.00034 + lane*1.8)*34
        + Math.sin(x*.0038 - t*.00017 + lane)*21;
    }
    function drawTheoryField(t=0){
      tctx.clearRect(0,0,theoryW,theoryH);

      // luminous flow lines
      for(let lane=0; lane<3; lane++){
        for(let band=-2; band<=2; band++){
          tctx.beginPath();
          for(let x=-20;x<=theoryW+20;x+=18){
            const y=waveY(x,t,lane)+band*10;
            if(x===-20)tctx.moveTo(x,y); else tctx.lineTo(x,y);
          }
          const alpha=.045 + (2-Math.abs(band))*.014;
          tctx.strokeStyle=`rgba(${lane===2?'90,235,201':'95,176,255'},${alpha})`;
          tctx.lineWidth=band===0?1.05:.62;
          tctx.stroke();
        }
      }

      // drifting particles constrained near the wave lanes
      sparks.forEach((p,i)=>{
        const px=((p.x + t*.00001*p.speed*8)%1.08-.04)*theoryW;
        const py=waveY(px,t,p.lane) + Math.sin(t*.0012+p.phase)*48;
        const pulse=.45+.55*Math.sin(t*.0018+p.phase)**2;
        tctx.beginPath();
        tctx.arc(px,py,p.r*(.8+pulse*.45),0,Math.PI*2);
        tctx.fillStyle=`rgba(${p.lane===2?'112,247,208':'126,193,255'},${.10+.22*pulse})`;
        tctx.fill();
      });

      // tiny constellation links in the map band
      for(let i=0;i<sparks.length-1;i+=3){
        const a=sparks[i],b=sparks[i+1];
        const ax=((a.x + t*.00001*a.speed*8)%1.08-.04)*theoryW;
        const bx=((b.x + t*.00001*b.speed*8)%1.08-.04)*theoryW;
        const ay=waveY(ax,t,a.lane)+Math.sin(t*.0012+a.phase)*48;
        const by=waveY(bx,t,b.lane)+Math.sin(t*.0012+b.phase)*48;
        const d=Math.hypot(ax-bx,ay-by);
        if(d<150){
          tctx.strokeStyle=`rgba(110,184,248,${.035*(1-d/150)})`;
          tctx.lineWidth=.6;
          tctx.beginPath();tctx.moveTo(ax,ay);tctx.lineTo(bx,by);tctx.stroke();
        }
      }
      if(!reduceMotion) theoryRAF=requestAnimationFrame(drawTheoryField);
    }
    resizeTheoryCanvas();
    if('ResizeObserver' in window) new ResizeObserver(resizeTheoryCanvas).observe(theorySection);
    else addEventListener('resize',resizeTheoryCanvas);
    drawTheoryField(0);
  }

  // -------------------------------------------------------------
  // Concept map
  // -------------------------------------------------------------
  const conceptData = window.SCIML_CONCEPTS;
  const svg = qs('#concept-map');
  const transformGroup = qs('#map-transform');
  const edgesG = qs('#map-edges'), nodesG=qs('#map-nodes');
  const nodeById = new Map(conceptData.nodes.map(n=>[n.id,n]));
  const ns='http://www.w3.org/2000/svg';
  const toneColors={core:'#58d9ff',w1:'#7ca7ff',w2:'#a892ff',w3:'#ffb25b',w4:'#4ce1b6',cross:'#ff7285'};
  const conceptGlyphs={
    pde:'∂²', nn:'✦', pinn:'∇', residual:'∂', icbc:'□',
    causality:'↝', spectralbias:'∿', fourier:'≋', sampling:'⋯',
    abc:'◎', neuralode:'∿', integrator:'∫', spectralbasis:'Σ',
    neusa:'✦', transfer:'◇'
  };
  const escapeHtml = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  function sEl(name,attrs={}){const e=document.createElementNS(ns,name);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function edgePath(A,B){
    const dx=B.x-A.x, dy=B.y-A.y, d=Math.hypot(dx,dy)||1, ux=dx/d, uy=dy/d;
    const p1={x:A.x+ux*(A.size*.54), y:A.y+uy*(A.size*.54)};
    const p2={x:B.x-ux*(B.size*.58), y:B.y-uy*(B.size*.58)};
    const cx=(p1.x+p2.x)/2 - dy*.10;
    const cy=(p1.y+p2.y)/2 + dx*.10;
    return `M${p1.x},${p1.y} Q${cx},${cy} ${p2.x},${p2.y}`;
  }
  conceptData.edges.forEach(([a,b,label])=>{
    const A=nodeById.get(a),B=nodeById.get(b); if(!A||!B)return;
    const path=sEl('path',{d:edgePath(A,B),class:'map-edge','data-a':a,'data-b':b,'data-label':label});edgesG.appendChild(path);
  });
  function buildNodes(){
    nodesG.innerHTML='';
    conceptData.nodes.forEach((n,index)=>{
      const g=sEl('g',{
        class:'concept-node',
        transform:`translate(${n.x} ${n.y})`,
        'data-id':n.id,
        tabindex:'0',
        role:'button',
        'aria-label':`${lang(n.label)}, week ${n.week}`
      });
      g.style.setProperty('--node-delay', `${(index%7)*.18}s`);

      const halo=sEl('circle',{r:n.size*.72,class:'node-halo'});
      const orbit=sEl('circle',{r:n.size*.62,class:'node-orbit'});
      const core=sEl('circle',{
        r:n.size*.46,
        class:'node-core',
        fill:`${toneColors[n.tone]}18`,
        stroke:toneColors[n.tone]
      });
      const shine=sEl('circle',{
        cx:-n.size*.15,cy:-n.size*.17,r:n.size*.12,class:'node-shine'
      });

      const glyph=sEl('text',{y:'0',class:'node-glyph'});
      glyph.textContent=conceptGlyphs[n.id] || '•';

      const label=sEl('text',{y:(n.size*.67),class:'node-label'});
      label.textContent=lang(n.label);

      const week=sEl('text',{y:(n.size*.67+15),class:'week-label'});
      week.textContent=n.week?`W${n.week}`:'LINK';

      g.append(halo,orbit,core,shine,glyph,label,week);
      nodesG.appendChild(g);

      g.addEventListener('click',()=>openConcept(n.id));
      g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openConcept(n.id)}});
      enableNodeDrag(g,n);
    });
    applyMapFilter();
  }
  function enableNodeDrag(g,n){
    let dragging=false,start;
    g.addEventListener('pointerdown',e=>{e.stopPropagation();dragging=true;start={x:e.clientX,y:e.clientY,nx:n.x,ny:n.y};g.setPointerCapture(e.pointerId)});
    g.addEventListener('pointermove',e=>{if(!dragging)return;const k=1/state.map.scale;n.x=start.nx+(e.clientX-start.x)*k;n.y=start.ny+(e.clientY-start.y)*k;g.setAttribute('transform',`translate(${n.x} ${n.y})`); redrawEdges();});
    g.addEventListener('pointerup',()=>dragging=false);
  }
  function redrawEdges(){qsa('.map-edge',edgesG).forEach(path=>{const A=nodeById.get(path.dataset.a),B=nodeById.get(path.dataset.b);path.setAttribute('d',edgePath(A,B))})}
  function setMapTransform(){transformGroup.setAttribute('transform',`translate(${state.map.tx} ${state.map.ty}) scale(${state.map.scale})`)}
  function zoomMap(factor,cx=600,cy=350){const old=state.map.scale,next=clamp(old*factor,.55,2.1);state.map.tx=cx-(cx-state.map.tx)*(next/old);state.map.ty=cy-(cy-state.map.ty)*(next/old);state.map.scale=next;setMapTransform();}
  svg.addEventListener('wheel',e=>{e.preventDefault();const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const m=svg.getScreenCTM().inverse(),p=pt.matrixTransform(m);zoomMap(e.deltaY<0?1.1:.91,p.x,p.y)},{passive:false});
  let panning=false,panStart;
  svg.addEventListener('pointerdown',e=>{if(e.target.closest?.('.concept-node'))return;panning=true;panStart={x:e.clientX,y:e.clientY,tx:state.map.tx,ty:state.map.ty};qs('#map-shell').classList.add('grabbing')});
  svg.addEventListener('pointermove',e=>{if(!panning)return;state.map.tx=panStart.tx+(e.clientX-panStart.x);state.map.ty=panStart.ty+(e.clientY-panStart.y);setMapTransform()});
  addEventListener('pointerup',()=>{panning=false;qs('#map-shell')?.classList.remove('grabbing')});
  qs('#map-plus').onclick=()=>zoomMap(1.15);qs('#map-minus').onclick=()=>zoomMap(.87);qs('#map-reset').onclick=()=>{state.map={scale:1,tx:0,ty:0};setMapTransform()};
  qsa('.filter-chip').forEach(b=>b.onclick=()=>{qsa('.filter-chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.week=b.dataset.week;applyMapFilter()});
  qs('#concept-search').addEventListener('input',e=>{state.search=e.target.value.toLowerCase().trim();applyMapFilter()});
  function applyMapFilter(){
    qsa('.concept-node').forEach(g=>{const n=nodeById.get(g.dataset.id),weekOK=state.week==='all'||String(n.week)===state.week,searchOK=!state.search||[lang(n.label),lang(n.eyebrow),...(n.tags||[])].join(' ').toLowerCase().includes(state.search);g.classList.toggle('dim',!(weekOK&&searchOK));g.classList.toggle('hit',!!state.search&&searchOK)});
    qsa('.map-edge').forEach(e=>{const A=qs(`.concept-node[data-id="${e.dataset.a}"]`),B=qs(`.concept-node[data-id="${e.dataset.b}"]`);e.classList.toggle('dim',A?.classList.contains('dim')||B?.classList.contains('dim'))});
  }
  function openConcept(id,scroll=true){
    state.activeConcept=id;const n=nodeById.get(id);if(!n)return;
    qs('#panel-empty').classList.add('hidden');qs('#panel-content').classList.remove('hidden');
    qs('#panel-week').textContent=`WEEK ${n.week}`;
    qs('#panel-eyebrow').textContent=lang(n.eyebrow);
    qs('#panel-title').textContent=lang(n.label);
    qs('#panel-tags').innerHTML=(n.tags||[]).map(t=>`<span>${t}</span>`).join('');
    const panel=qs('#concept-panel');
    panel.style.setProperty('--panel-accent', toneColors[n.tone] || toneColors.core);
    qs('#panel-concept-icon').textContent=conceptGlyphs[n.id] || '•';
    updatePanelBody();highlightConcept(id); if(scroll&&innerWidth<1080)qs('#concept-panel').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function updatePanelBody(){const n=nodeById.get(state.activeConcept);if(!n)return;const body=qs('#panel-body');body.classList.toggle('math',state.activeTab==='math');
    if(state.activeTab==='math'){
      const expr = n.math || '';
      body.innerHTML = `<div class="panel-math-wrap">\\[${escapeHtml(expr)}\\]</div><span class="math-caption">mathematical statement</span>`;
      typesetMath(body);
    } else {
      body.innerHTML = `<p>${escapeHtml(lang(n[state.activeTab]||''))}</p>`;
    }
  }
  function highlightConcept(id){qsa('.map-edge').forEach(e=>{e.classList.toggle('active',e.dataset.a===id||e.dataset.b===id)});qsa('.concept-node').forEach(g=>g.classList.toggle('hit',g.dataset.id===id))}
  qsa('.panel-tab').forEach(b=>b.onclick=()=>{qsa('.panel-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.activeTab=b.dataset.tab;updatePanelBody()});
  qs('#panel-close').onclick=()=>{state.activeConcept=null;qs('#panel-content').classList.add('hidden');qs('#panel-empty').classList.remove('hidden');qsa('.map-edge').forEach(e=>e.classList.remove('active'));qsa('.concept-node').forEach(g=>g.classList.remove('hit'))};
  function adjacentConcept(step){const idx=conceptData.nodes.findIndex(n=>n.id===state.activeConcept);const n=conceptData.nodes[(idx+step+conceptData.nodes.length)%conceptData.nodes.length];openConcept(n.id,false)}
  qs('#concept-prev').onclick=()=>adjacentConcept(-1);qs('#concept-next').onclick=()=>adjacentConcept(1);
  buildNodes();
  // Premium-map default: open a representative W4 concept so the mathematical
  // drawer is immediately populated. This is still a live selection and can
  // be changed by clicking any node.
  state.activeTab='intuition';
  openConcept('neuralode', false);

  const story=['pde','pinn','causality','spectralbias','fourier','sampling','abc','neuralode','integrator','spectralbasis','neusa','transfer'];
  qs('#storyline-track').innerHTML=story.map((id,i)=>`<span class="story-step"><button data-id="${id}">${lang(nodeById.get(id).label)}</button>${i<story.length-1?'<span class="story-arrow">→</span>':''}</span>`).join('');
  qsa('.story-step button').forEach(b=>b.onclick=()=>{openConcept(b.dataset.id,false);qs(`.concept-node[data-id="${b.dataset.id}"]`)?.scrollIntoView?.({behavior:'smooth',block:'center'})});


  // -------------------------------------------------------------
  // PINN explainer
  // -------------------------------------------------------------
  const typesetMath = (root=document) => {
    if(window.MathJax?.typesetPromise){
      window.MathJax.typesetClear?.([root]);
      window.MathJax.typesetPromise([root]).catch(()=>{});
    }
  };
  const pinnSteps = {
    input: {
      kicker:'STEP 1 · INPUT',
      title:'Coordinates are the query.',
      copy:'The network receives points in space-time. A classical PINN represents the field as a function over the whole domain rather than marching one discrete state at a time.',
      math:'\\[z=(x,t)\\quad\\longmapsto\\quad u_{\\theta}(z)\\]'
    },
    network: {
      kicker:'STEP 2 · PARAMETRIZATION',
      title:'The neural network is a function class, not the physics.',
      copy:'Architecture, activation, initialization, and coordinate representation determine which functions are easy or hard for optimization to reach.',
      math:'\\[u_{\\theta}(z)=\\mathcal{N}_{\\theta}(z)\\]'
    },
    field: {
      kicker:'STEP 3 · FIELD',
      title:'The output is a differentiable approximation to the physical field.',
      copy:'Once uθ is differentiable with respect to its coordinates, the PDE can interrogate the network through spatial and temporal derivatives.',
      math:'\\[u_{\\theta}:\\Omega\\times[0,T]\\longrightarrow\\mathbb{R}\\]'
    },
    autodiff: {
      kicker:'STEP 4 · AUTOMATIC DIFFERENTIATION',
      title:'Derivatives become exact derivatives of the neural representation.',
      copy:'Autodiff computes quantities such as ut, utt, ∇u, and Δu without finite-difference stencils on the collocation set.',
      math:'\\[\\partial_t u_{\\theta},\\quad \\partial_{tt}u_{\\theta},\\quad \\nabla u_{\\theta},\\quad \\Delta u_{\\theta}\\]'
    },
    residual: {
      kicker:'STEP 5 · PHYSICS RESIDUAL',
      title:'The PDE becomes a measurable violation.',
      copy:'The optimizer sees the governing equation through Rθ. Small sampled residual is useful evidence, but it is not automatically a certificate of small field error everywhere.',
      math:'\\[\\mathcal{R}_{\\theta}=\\partial_{tt}u_{\\theta}-c^2\\Delta u_{\\theta}-s\\]'
    }
  };

  function setPinnStep(id){
    const item=pinnSteps[id]; if(!item)return;
    qsa('.pipeline-node').forEach(b=>b.classList.toggle('active',b.dataset.pinnStep===id));
    const panel=qs('#pinn-step-panel'); if(!panel)return;
    panel.innerHTML=`<span class="panel-step-kicker">${item.kicker}</span><h3>${item.title}</h3><p>${item.copy}</p><div class="math-card tex-card">${item.math}</div>`;
    typesetMath(panel);
  }
  qsa('.pipeline-node').forEach(b=>b.addEventListener('click',()=>setPinnStep(b.dataset.pinnStep)));

  const lossCopy = {
    pde:['PDE residual','Collocation points interrogate the governing equation throughout the interior of the space-time domain.','\\[\\mathcal{L}_{\\mathrm{PDE}}=\\frac{1}{N_r}\\sum_{i=1}^{N_r}\\left|\\mathcal{R}_{\\theta}(x_i,t_i)\\right|^2\\]'],
    ic:['Initial condition','The initial condition selects the intended temporal trajectory; it may be imposed softly or built into the ansatz.','\\[\\mathcal{L}_{\\mathrm{IC}}=\\frac{1}{N_0}\\sum_{i=1}^{N_0}\\left|u_{\\theta}(x_i,0)-u_0(x_i)\\right|^2\\]'],
    bc:['Boundary condition','The boundary operator constrains the admissible solution at the edge of the computational domain.','\\[\\mathcal{L}_{\\mathrm{BC}}=\\frac{1}{N_b}\\sum_{i=1}^{N_b}\\left|\\mathcal{B}[u_{\\theta}](x_i,t_i)-g_i\\right|^2\\]'],
    data:['Optional observations','Measurements can constrain the same differentiable field alongside the governing physics.','\\[\\mathcal{L}_{\\mathrm{data}}=\\frac{1}{N_d}\\sum_{i=1}^{N_d}\\left|u_{\\theta}(x_i,t_i)-y_i\\right|^2\\]']
  };
  qsa('.loss-term').forEach(b=>b.addEventListener('click',()=>{
    const key=b.dataset.loss;
    b.classList.toggle('active');
    const [title,copy,formula]=lossCopy[key];
    const detail=qs('#loss-detail');
    detail.innerHTML=`<strong>${title}</strong><div class="loss-formula">${formula}</div><p>${copy}</p>`;
    typesetMath(detail);
    updatePinnPointMode();
  }));

  function updatePinnPointMode(){
    const active=new Set(qsa('.loss-term.active').map(b=>b.dataset.loss));
    pinnViz.active=active;
  }

  const pinnCanvas=qs('#pinn-wave-canvas');
  const pinnCtx=pinnCanvas?.getContext('2d');
  const pinnViz={running:true,t:0,active:new Set(['pde','ic','bc'])};
  const pinnPoints = Array.from({length:58},()=>({
    x:.04+Math.random()*.92,
    y:.12+Math.random()*.76,
    phase:Math.random()*Math.PI*2
  }));
  const dataPts=[.18,.37,.58,.79].map((x,i)=>({x,y:.26+.13*(i%2)}));

  function resizePinnCanvas(){
    if(!pinnCanvas||!pinnCtx)return;
    const box=pinnCanvas.getBoundingClientRect();
    const dpr=Math.min(devicePixelRatio||1,2);
    const w=Math.max(520,Math.floor(box.width||860));
    const h=Math.max(280,Math.floor((box.width||860)*.45));
    pinnCanvas.width=w*dpr; pinnCanvas.height=h*dpr;
    pinnCanvas.style.height=h+'px';
    pinnCtx.setTransform(dpr,0,0,dpr,0,0);
    pinnCanvas._logical={w,h};
  }
  function drawPinn(){
    if(!pinnCanvas||!pinnCtx){requestAnimationFrame(drawPinn);return;}
    const {w,h}=pinnCanvas._logical||{w:860,h:390};
    if(pinnViz.running)pinnViz.t+=.018;
    pinnCtx.clearRect(0,0,w,h);
    const pad=34, plotW=w-2*pad, plotH=h-2*pad;

    pinnCtx.strokeStyle='rgba(160,190,221,.09)'; pinnCtx.lineWidth=1;
    for(let i=0;i<=8;i++){const x=pad+plotW*i/8;pinnCtx.beginPath();pinnCtx.moveTo(x,pad);pinnCtx.lineTo(x,h-pad);pinnCtx.stroke();}
    for(let j=0;j<=5;j++){const y=pad+plotH*j/5;pinnCtx.beginPath();pinnCtx.moveTo(pad,y);pinnCtx.lineTo(w-pad,y);pinnCtx.stroke();}

    pinnCtx.beginPath();
    for(let i=0;i<=240;i++){
      const xx=i/240, amp=Math.sin(2*Math.PI*(xx-.16*pinnViz.t))*Math.exp(-2.1*(xx-.52)*(xx-.52));
      const X=pad+xx*plotW, Y=h*.5-amp*plotH*.23;
      i?pinnCtx.lineTo(X,Y):pinnCtx.moveTo(X,Y);
    }
    const grad=pinnCtx.createLinearGradient(pad,0,w-pad,0);
    grad.addColorStop(0,'rgba(88,217,255,.28)');grad.addColorStop(.5,'rgba(76,225,182,.95)');grad.addColorStop(1,'rgba(168,146,255,.32)');
    pinnCtx.strokeStyle=grad;pinnCtx.lineWidth=3;pinnCtx.stroke();

    if(pinnViz.active.has('pde')) pinnPoints.forEach(pt=>{
      const pulse=.75+.25*Math.sin(pinnViz.t*2+pt.phase);
      pinnCtx.beginPath();pinnCtx.arc(pad+pt.x*plotW,pad+pt.y*plotH,2.2+pulse*.6,0,Math.PI*2);
      pinnCtx.fillStyle=`rgba(88,217,255,${.34+.32*pulse})`;pinnCtx.fill();
    });

    if(pinnViz.active.has('ic')) for(let i=0;i<22;i++){
      const x=pad+plotW*i/21;pinnCtx.beginPath();pinnCtx.arc(x,h-pad,3,0,Math.PI*2);pinnCtx.fillStyle='rgba(76,225,182,.82)';pinnCtx.fill();
    }

    if(pinnViz.active.has('bc')) for(let i=0;i<13;i++){
      const y=pad+plotH*i/12;
      for(const x of [pad,w-pad]){pinnCtx.beginPath();pinnCtx.arc(x,y,3,0,Math.PI*2);pinnCtx.fillStyle='rgba(255,178,91,.82)';pinnCtx.fill();}
    }

    if(pinnViz.active.has('data')) dataPts.forEach(pt=>{
      pinnCtx.beginPath();pinnCtx.arc(pad+pt.x*plotW,pad+pt.y*plotH,4.2,0,Math.PI*2);pinnCtx.fillStyle='rgba(255,114,133,.95)';pinnCtx.fill();
    });

    requestAnimationFrame(drawPinn);
  }
  if(pinnCanvas){
    resizePinnCanvas();
    addEventListener('resize',resizePinnCanvas);
    drawPinn();
  }
  if(document.readyState==='complete') typesetMath(qs('#pinn'));
  else addEventListener('load',()=>typesetMath(qs('#pinn')),{once:true});
  qs('#pinn-play')?.addEventListener('click',e=>{
    pinnViz.running=!pinnViz.running;
    e.currentTarget.textContent=pinnViz.running?'Pause animation':'Resume animation';
  });

  // -------------------------------------------------------------
  // Week timeline
  // -------------------------------------------------------------
  const weeks=window.SCIML_WEEKS||[];
  let activeWeek=1;
  function renderTimeline(){
    const rail=qs('#timeline-rail'), stage=qs('#timeline-stage'); if(!rail||!stage)return;
    rail.innerHTML=weeks.map(w=>`<button class="timeline-dot ${w.id===activeWeek?'active':''}" data-week-id="${w.id}"><span>W0${w.id}</span><strong>${w.title}</strong></button>`).join('');
    qsa('.timeline-dot',rail).forEach(b=>b.onclick=()=>{activeWeek=Number(b.dataset.weekId);renderTimeline();});
    const w=weeks.find(x=>x.id===activeWeek)||weeks[0]; if(!w)return;
    const timelineSection=qs('.timeline-section');
    if(timelineSection) timelineSection.dataset.activeWeek=String(w.id);
    stage.innerHTML=`
      <div class="week-stage-head">
        <div><span class="timeline-kicker">${w.kicker}</span><h3>${w.title}</h3></div>
        <div class="week-index">0${w.id}</div>
      </div>
      <div class="week-question"><span>THE QUESTION</span><strong>${w.question}</strong></div>
      <div class="week-columns">
        <div class="week-block intuition"><span>INTUITION</span><p>${w.intuition}</p><div class="week-equation">${w.equation}</div></div>
        <div class="week-block papers"><span>PAPERS / IDEAS</span>${w.papers.map(p=>`<article><strong>${p.label}</strong><small>${p.role}</small></article>`).join('')}</div>
        <div class="week-block experiments"><span>WHAT I TESTED</span><ul>${w.experiments.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      </div>
      <div class="week-conclusion"><span>WHAT CHANGED</span><strong>${w.conclusion}</strong><p>${w.bridge}</p></div>`;
    typesetMath(stage);
  }
  renderTimeline();

  // -------------------------------------------------------------
  // Timeline atmosphere — dynamic research currents
  // -------------------------------------------------------------
  const timelineSection=qs('.timeline-section');
  if(timelineSection){
    const timelineCanvas=document.createElement('canvas');
    timelineCanvas.id='timeline-bg-canvas';
    timelineCanvas.setAttribute('aria-hidden','true');
    timelineSection.prepend(timelineCanvas);
    const tctx=timelineCanvas.getContext('2d');
    let tw=1,th=1,tdpr=1,tparticles=[];
    const timelineColors={
      1:[92,164,255],
      2:[166,126,255],
      3:[255,190,86],
      4:[84,236,190]
    };
    function resizeTimelineCanvas(){
      const r=timelineSection.getBoundingClientRect();
      tw=Math.max(1,r.width); th=Math.max(1,r.height); tdpr=Math.min(devicePixelRatio||1,2);
      timelineCanvas.width=Math.floor(tw*tdpr); timelineCanvas.height=Math.floor(th*tdpr);
      timelineCanvas.style.width=tw+'px'; timelineCanvas.style.height=th+'px';
      tctx.setTransform(tdpr,0,0,tdpr,0,0);
      const n=clamp(Math.floor(tw*th/26000),42,110);
      tparticles=Array.from({length:n},(_,i)=>({
        x:Math.random()*tw,y:Math.random()*th,
        vx:.05+Math.random()*.13,vy:(Math.random()-.5)*.035,
        r:.5+Math.random()*1.25,a:.08+Math.random()*.18,phase:Math.random()*Math.PI*2
      }));
    }
    function timelineWave(yBase,amp,freq,phase,color,alpha,width){
      tctx.beginPath();
      for(let x=-30;x<=tw+30;x+=8){
        const y=yBase+Math.sin(x*freq+phase)*amp+Math.sin(x*freq*.37-phase*.7)*amp*.36;
        if(x===-30)tctx.moveTo(x,y);else tctx.lineTo(x,y);
      }
      tctx.strokeStyle=`rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
      tctx.lineWidth=width;tctx.stroke();
    }
    function drawTimelineAtmosphere(ms){
      const t=ms*.001;
      tctx.clearRect(0,0,tw,th);
      const c=timelineColors[activeWeek]||timelineColors[1];
      const fade=tctx.createLinearGradient(0,0,tw,th);
      fade.addColorStop(0,`rgba(${c[0]},${c[1]},${c[2]},.055)`);
      fade.addColorStop(.42,'rgba(5,15,29,.01)');
      fade.addColorStop(1,`rgba(${c[0]},${c[1]},${c[2]},.035)`);
      tctx.fillStyle=fade;tctx.fillRect(0,0,tw,th);

      // travelling spectral / temporal traces
      timelineWave(th*.17,24,0.0075,t*.34,c,.16,1.15);
      timelineWave(th*.43,34,0.0052,-t*.25,[112,198,255],.10,1);
      timelineWave(th*.78,26,0.0081,t*.19,[96,238,201],.095,1);
      for(let j=0;j<3;j++){
        timelineWave(th*(.24+j*.22),10+j*7,0.014-j*.002,t*(.42-j*.08)+j,c,.045,.6);
      }

      // moving particles that read like information flow
      for(const p of tparticles){
        p.x+=p.vx; p.y+=p.vy+Math.sin(t*.7+p.phase)*.015;
        if(p.x>tw+20){p.x=-20;p.y=Math.random()*th;}
        if(p.y<-20)p.y=th+20;if(p.y>th+20)p.y=-20;
        const pulse=.55+.45*Math.sin(t*1.4+p.phase);
        tctx.beginPath();tctx.arc(p.x,p.y,p.r*(.8+.35*pulse),0,Math.PI*2);
        tctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${p.a*(.65+.35*pulse)})`;tctx.fill();
      }

      // faint vertical time markers
      tctx.save();tctx.setLineDash([2,14]);tctx.lineWidth=.55;
      for(let x=tw*.18;x<tw;x+=tw*.16){
        tctx.strokeStyle=`rgba(${c[0]},${c[1]},${c[2]},.035)`;
        tctx.beginPath();tctx.moveTo(x,th*.08);tctx.lineTo(x,th*.92);tctx.stroke();
      }
      tctx.restore();
      requestAnimationFrame(drawTimelineAtmosphere);
    }
    const trObserver=new ResizeObserver(resizeTimelineCanvas);trObserver.observe(timelineSection);
    resizeTimelineCanvas();
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(drawTimelineAtmosphere);
  }

  // -------------------------------------------------------------
  // Experiment atlas
  // -------------------------------------------------------------
  const atlasData=window.SCIML_EXPERIMENTS||[];
  let atlasPhase='all', atlasSearch='';
  const toneToColor={blue:'var(--blue)',purple:'var(--purple)',amber:'var(--amber)',green:'var(--green)',cyan:'var(--cyan)',red:'var(--red)'};

  // -----------------------------------------------------------------
  // Correct LaTeX strings for experiment dossiers.
  // Some formulas in the generated evidence dataset were serialized as
  // normal JS strings, which corrupted commands such as \text, \theta,
  // \argmin, \approx, and \tilde. We repair them here with raw strings
  // so MathJax receives valid LaTeX.
  // -----------------------------------------------------------------
  const atlasMathById = {
    'pinn-reproduction': String.raw`\[
\mathcal L(\theta)=\lambda_r\,\mathcal L_r+\lambda_{IC}\,\mathcal L_{IC}+\lambda_{BC}\,\mathcal L_{BC}+\lambda_d\,\mathcal L_{\mathrm{data}}.
\]`,
    'pinn-seeds-frequency': String.raw`\[
A_f = \log\!\left(\frac{E_{\mathrm{matched}}(f)}{E_{\mathrm{FF}}(f)}\right),\qquad I=A_{20}-A_{10}.
\]`,
    'pinn-sigma-sweep': String.raw`\[
\gamma_{\sigma}(z)=\big[\sin(2\pi zB),\cos(2\pi zB)\big],\qquad B_{ij}\sim\mathcal N(0,\sigma^2).
\]`,
    'pinn-more-points': String.raw`\[
N_{\mathrm{int}}: 8000\;\longrightarrow\;16000.
\]`,
    'pinn-dispersion': String.raw`\[
|b_t| = c\sqrt{b_x^2+b_y^2}\qquad\text{(wave-cone alignment)}.
\]`,
    'pinn-causal': String.raw`\[
\mathcal L = \sum_i w_i(\theta)\,\mathcal L_i,\qquad w_i\downarrow\ \text{when preceding residuals remain large}.
\]`,
    'pinn-adaptive': String.raw`\[
\text{adaptive score} \propto |R_{\theta}(x,t)|.
\]`,
    'neusa-official': String.raw`\[
\text{relative error}=\frac{\|u_{\theta}-u_{\mathrm{ref}}\|_2}{\|u_{\mathrm{ref}}\|_2}.
\]`,
    'neusa-linearized': String.raw`\[
a^{\prime}=b,\qquad b^{\prime}=-(\Omega^2+10I)a+0.1\,N(a).
\]`,
    'neusa-local-cubic': String.raw`\[
r_{\mathrm{cubic}}(u)=\frac{10}{6}u^3\,(1+z)^{-1}q\!\left(\frac{z}{1+z}\right),\qquad z=(u/4)^2.
\]`,
    'neusa-odd': String.raw`\[
r_{\mathrm{odd}}(u)=5\,[q(u/4)-q(-u/4)],\qquad r_{\mathrm{cubic}}(u)\sim c\,u^3\;\text{near }0.
\]`,
    'neusa-compute': String.raw`\[
\text{equal-budget comparison: }500\text{ updates total},\qquad \text{frontier comparison: }500\to1500.
\]`,
    'neusa-operator-recovery': String.raw`\[
F_{\theta}(u)\approx-\hat\mu\sin u,\qquad \hat\mu=\arg\min_{\mu}\,\mathbb E_{u\sim\rho}\big[F_{\theta}(u)+\mu\sin u\big]^2.
\]`,
    'neusa-robustness': String.raw`\[
\text{tail diagnostics: }\{\text{mean},\;q_{90},\;\max\}.
\]`,
    'parametric-neusa': String.raw`\[
\mu \in \{5,7.5,10,12.5,15\}\;\text{train},\qquad \mu_{\mathrm{test}}\in\{6.25,8.75,11.25,13.75,3.75,16.25\}.
\]`,
    'inverse-calibration': String.raw`\[
\hat\mu = \arg\min_{\mu}\,\sum_{(x_i,t_i)}\big(u_{\theta}(x_i,t_i;\mu)-y_i\big)^2.
\]`,
    'sensor-design': String.raw`\[
\mathcal I(\mu) = J(\mu)^\top \Sigma^{-1}J(\mu),\qquad \text{maximize a scalar summary of }\mathcal I.
\]`,
    'uq-failure': String.raw`\[
\mu\mid y \approx \mathcal N\!\left(\hat\mu,\,\mathcal I(\hat\mu)^{-1}\right).
\]`,
    'discrepancy-repair': String.raw`\[
\tilde\mu = a_{\pm}\,\hat\mu + b_{\pm},\qquad \text{with side-specific discrepancy calibration}.
\]`,
    'pseudo-true': String.raw`\[
\mu^{\dagger}_{\mathrm{obs}}\neq \mu^{\dagger}_{\mathrm{forecast}}\neq \mu_{\mathrm{true}}\quad\text{is possible under model misspecification}.
\]`
  };

  function filteredAtlas(){
    return atlasData.filter(e=>{
      const phaseOK=atlasPhase==='all'||e.phase===atlasPhase;
      const q=[e.title,e.question,e.answer,...(e.tags||[])].join(' ').toLowerCase();
      return phaseOK&&(!atlasSearch||q.includes(atlasSearch));
    });
  }
  function renderMiniFigure(fig){
    if(!fig) return '';
    if(fig.kind==='image'){
      return `<figure class="mini-figure mini-figure-image"><div class="mini-figure-head"><strong>${fig.title||''}</strong></div><button class="evidence-image-button" data-image-src="${fig.src}" data-image-title="${escapeHtml(fig.title||'Evidence figure')}"><img src="${fig.src}" alt="${escapeHtml(fig.title||'Evidence figure')}" loading="lazy"/></button>${fig.caption?`<figcaption>${fig.caption}</figcaption>`:''}</figure>`;
    }
    if(fig.kind==='table'){
      return `<div class="mini-figure mini-figure-table"><div class="mini-figure-head"><strong>${fig.title||''}</strong>${fig.subtitle?`<small>${fig.subtitle}</small>`:''}</div><div class="evidence-table-wrap"><table class="evidence-table"><thead><tr>${(fig.columns||[]).map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${(fig.rows||[]).map(row=>`<tr>${row.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
    }
    if(fig.kind==='stats'){
      return `<div class="mini-figure mini-figure-stats"><div class="mini-figure-head"><strong>${fig.title||''}</strong>${fig.subtitle?`<small>${fig.subtitle}</small>`:''}</div><div class="mini-stats-grid">${(fig.items||[]).map(([k,v])=>`<div class="mini-stat"><span>${k}</span><strong>${v}</strong></div>`).join('')}</div></div>`;
    }
    if(fig.kind==='bars'){
      const vals=(fig.values||[]).map(Number); const max=Math.max(...vals,1);
      return `<div class="mini-figure"><div class="mini-figure-head"><strong>${fig.title||''}</strong>${fig.subtitle?`<small>${fig.subtitle}</small>`:''}</div><div class="mini-bars">${(fig.labels||[]).map((label,i)=>{const v=vals[i]??0; const h=12+Math.round((v/max)*84); const color=(fig.colors&&fig.colors[i])||'#7ca7ff'; return `<div class="mini-bar-item"><div class="mini-bar-wrap"><div class="mini-bar" style="height:${h}px;background:${color}"></div></div><strong>${v}${fig.suffix||''}</strong><span>${label}</span></div>`}).join('')}</div></div>`;
    }
    if(fig.kind==='note'){
      return `<div class="mini-figure mini-figure-note"><div class="mini-figure-head"><strong>${fig.title||''}</strong></div><p>${fig.text||''}</p></div>`;
    }
    return '';
  }

  function renderAtlas(){
    const grid=qs('#experiment-atlas-grid'); if(!grid)return;
    const rows=filteredAtlas(); qs('#atlas-count').textContent=rows.length;
    grid.innerHTML=rows.map(e=>`
      <article class="atlas-card" style="--atlas-tone:${toneToColor[e.tone]||'var(--green)'}">
        <div class="atlas-card-top"><span>${e.phase}</span><small>${e.category}</small></div>
        <h3>${e.title}</h3>
        <p class="atlas-question">${e.question}</p>
        <div class="atlas-meta-row">
          <div><span>runtime</span><strong>${e.runtime||'controlled run'}</strong></div>
          <div><span>evaluation</span><strong>${e.evaluation||'comparative audit'}</strong></div>
        </div>
        ${e.figures?.[0] ? `<div class="atlas-figure-preview">${renderMiniFigure(e.figures[0])}</div>` : ''}
        <div class="atlas-answer"><span>ANSWER</span><strong>${e.answer}</strong></div>
        <div class="atlas-metrics">${e.metrics.slice(0,3).map(m=>`<span>${m}</span>`).join('')}</div>
        <button class="atlas-open" data-atlas-id="${e.id}">Open full evidence ↗</button>
      </article>`).join('');
    qsa('.atlas-open',grid).forEach(b=>b.onclick=()=>openExperiment(b.dataset.atlasId));
    qsa('.evidence-image-button',grid).forEach(b=>b.addEventListener('click',()=>openImageLightbox(b.dataset.imageSrc,b.dataset.imageTitle)));
  }
  qsa('[data-atlas]').forEach(b=>b.onclick=()=>{
    qsa('[data-atlas]').forEach(x=>x.classList.remove('active')); b.classList.add('active');
    atlasPhase=b.dataset.atlas; renderAtlas();
  });

  // Hero project navigator — real buttons mapped to the live site sections.
  qsa('[data-story-action]').forEach(btn=>btn.addEventListener('click',()=>{
    const action=btn.dataset.storyAction;
    qsa('.hero-story-row').forEach(x=>x.classList.toggle('active',x===btn));
    if(action==='pinn'){
      qs('#pinn')?.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    const filterBtn=qs(`[data-atlas="${action}"]`);
    if(filterBtn){
      qsa('[data-atlas]').forEach(x=>x.classList.remove('active'));
      filterBtn.classList.add('active');
      atlasPhase=action;
      renderAtlas();
    }
    qs('#experiments')?.scrollIntoView({behavior:'smooth',block:'start'});
  }));
  qs('#atlas-search')?.addEventListener('input',e=>{atlasSearch=e.target.value.toLowerCase().trim();renderAtlas();});
  renderAtlas();

  // Robust delegated handler: atlas cards are re-rendered by filters/search,
  // so opening evidence should not depend on per-render listeners. Capture
  // the click at the grid level and open the matching global drawer.
  qs('#experiment-atlas-grid')?.addEventListener('click', e => {
    const btn = e.target.closest?.('.atlas-open');
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();
    openExperiment(btn.dataset.atlasId);
  });

  function openExperiment(id){
    const e=atlasData.find(x=>x.id===id); if(!e)return;
    qs('#drawer-kicker').textContent=`${e.phase.toUpperCase()} · ${e.category.toUpperCase()}`;
    qs('#drawer-title').textContent=e.title;
    qs('#drawer-question').textContent=e.question;
    qs('#drawer-control').textContent=e.design;
    qs('#drawer-change').textContent=e.result;
    qs('#drawer-readout').textContent=e.answer;
    qs('#drawer-runtime').textContent=e.runtime || 'Controlled run';
    qs('#drawer-evaluation').textContent=e.evaluation || 'Comparative evaluation';
    qs('#drawer-achieved').innerHTML=(e.achieved||[]).map(x=>`<li>${x}</li>`).join('');
    qs('#drawer-rulesout').textContent=e.rulesOut;
    qs('#drawer-math').innerHTML=atlasMathById[e.id] || e.math || ''; // repaired valid LaTeX
    qs('#drawer-figures').innerHTML=(e.figures||[]).map(renderMiniFigure).join('');
    qs('#drawer-sources').innerHTML=(e.sources||[]).length ? (e.sources||[]).map(s=>`<a class="evidence-source-link" href="${s.href}" target="_blank" rel="noopener">${s.label} ↗</a>`).join('') : '<span class="source-empty">No separate raw summary was included for this benchmark.</span>';
    qs('#drawer-note').textContent=`LIMITATION · ${e.limitation}`;
    qs('#drawer-metrics').innerHTML=e.metrics.map(m=>`<span>${m}</span>`).join('');
    qs('#protocol-drawer').classList.add('open');
    qs('#protocol-drawer').setAttribute('aria-hidden','false');
    qsa('.evidence-image-button',qs('#protocol-drawer')).forEach(b=>b.addEventListener('click',()=>openImageLightbox(b.dataset.imageSrc,b.dataset.imageTitle)));
    if(window.MathJax?.typesetPromise){
      window.MathJax.typesetPromise([qs('#protocol-drawer')]).catch(()=>{});
    }
  }

  function openImageLightbox(src,title='Evidence figure'){
    const box=qs('#evidence-lightbox'); if(!box)return;
    qs('#evidence-lightbox-img').src=src;
    qs('#evidence-lightbox-img').alt=title;
    qs('#evidence-lightbox-title').textContent=title;
    box.classList.add('open');
    box.setAttribute('aria-hidden','false');
  }
  function closeImageLightbox(){
    const box=qs('#evidence-lightbox'); if(!box)return;
    box.classList.remove('open');
    box.setAttribute('aria-hidden','true');
  }
  qs('#evidence-lightbox-close')?.addEventListener('click',closeImageLightbox);
  qs('#evidence-lightbox-scrim')?.addEventListener('click',closeImageLightbox);

  // -------------------------------------------------------------
  // Evidence-backed synthesis
  // -------------------------------------------------------------
  const beliefEvidence={
    representation:{
      kicker:'EVIDENCE CHAIN',
      title:'Representation is one piece of a larger numerical system.',
      copy:'Frequency/seed experiments, the failed point-doubling rescue, causal-weighting failures, and adaptive-sampling pathology all point in the same direction: changing one ingredient does not repair a coupled optimization problem.',
      pills:['frequency × seeds','8k→16k no rescue','adaptive ≈98% source concentration']
    },
    transfer:{
      kicker:'EVIDENCE CHAIN',
      title:'In-window accuracy did not rank models by transfer.',
      copy:'The global NeuSA correction fit the training interval extremely well, yet the small local cubic law dominated later-time and shifted-trajectory tests. Robustness experiments extended that gap into the tails through T=10.',
      pills:['global fit ≠ transfer','cubic wins 9/9 vs odd','T=10 stress test']
    },
    structure:{
      kicker:'EVIDENCE CHAIN',
      title:'The correct prior changed compute efficiency.',
      copy:'At equal 500-update budget, trajectory diversity worsened all paired comparisons. Extra compute later helped the partially structured odd model strongly, while the cubic model was already close to saturation.',
      pills:['500-update fairness','odd improves with compute','cubic near saturation']
    },
    trust:{
      kicker:'EVIDENCE CHAIN',
      title:'High local information did not certify the surrogate.',
      copy:'Fisher sensor design improved identification, yet extrapolative 90% local intervals reached 0% coverage. Adding model discrepancy repaired much of that failure on fresh coefficients.',
      pills:['same 12 observations','0% naive coverage','far Fisher: 0%→77.8%']
    }
  };
  qsa('.belief').forEach(b=>b.onclick=()=>{
    qsa('.belief').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    const e=beliefEvidence[b.dataset.belief],box=qs('#belief-evidence');
    box.innerHTML=`<span class="evidence-kicker">${e.kicker}</span><h3>${e.title}</h3><p>${e.copy}</p><div class="evidence-pills">${e.pills.map(x=>`<span>${x}</span>`).join('')}</div>`;
  });
  qs('#slide-focus')?.addEventListener('click',()=>{
    const s=qs('#synthesis');
    if(!document.body.classList.contains('stage-mode')) toggleStage(true);
    const idx=sections.findIndex(x=>x===s); if(idx>=0)setStage(idx);
  });

  // -------------------------------------------------------------
  // Protocol drawer
  // -------------------------------------------------------------
  function closeDrawer(){
    qs('#protocol-drawer')?.classList.remove('open');
    qs('#protocol-drawer')?.setAttribute('aria-hidden','true');
  }
  qs('#protocol-close')?.addEventListener('click',closeDrawer);
  qs('#protocol-scrim')?.addEventListener('click',closeDrawer);

  // -------------------------------------------------------------
  // Results dashboard
  // -------------------------------------------------------------
  const results=window.SCIML_RESULTS;
  const caseSelect=qs('#result-case');
  results.cases.forEach(([id,label])=>{const o=document.createElement('option');o.value=id;o.textContent=label;caseSelect.appendChild(o)});caseSelect.value=state.resultCase;
  qs('#interval-buttons').innerHTML=results.intervals.map(i=>`<button data-interval="${i}" class="${i===state.interval?'active':''}">${results.intervalLabels[i]}</button>`).join('');
  qs('#result-note').textContent=results.meta.note;
  caseSelect.onchange=e=>{state.resultCase=e.target.value;renderResults()};
  qsa('#interval-buttons button').forEach(b=>b.onclick=()=>{qsa('#interval-buttons button').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.interval=b.dataset.interval;renderResults()});
  qsa('[data-metric]').forEach(b=>b.onclick=()=>{qsa('[data-metric]').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.metric=b.dataset.metric;renderResults()});
  const modelMap=Object.fromEntries(results.models.map(x=>[x[0],{label:x[1],color:x[2]}]));
  function modelRows(){return results.rows.filter(r=>r[0]===state.resultCase).map(r=>({case:r[0],model:r[1],seed:r[2],v:{'0_1':r[3],'1_3':r[4],'3_5':r[5]}[state.interval],energy:r[6]}))}
  function fmt(v){if(v<.01)return v.toFixed(4)+'%';if(v<1)return v.toFixed(3)+'%';return v.toFixed(2)+'%'}
  function renderResults(){
    const rows=modelRows(), values=rows.map(r=>state.metric==='error'?r.v:r.energy);const positive=values.filter(v=>v>0),min=Math.max(Math.min(...positive)*.62,.0003),max=Math.max(...values)*1.55;
    qs('#viz-title').textContent=state.metric==='error'?`${caseSelect.selectedOptions[0].text} · ${results.intervalLabels[state.interval]}`:`Energy drift · ${caseSelect.selectedOptions[0].text}`;
    qs('#viz-legend').innerHTML=results.models.map(([id,label,color])=>`<span><i style="background:${color}"></i>${label}</span>`).join('');
    const svg=qs('#result-chart');svg.innerHTML='';const W=900,H=500,L=170,R=45,T=55,B=65,plotW=W-L-R,plotH=H-T-B;
    const useLog=state.metric==='error' && max/min>30; const sx=v=>useLog?L+(Math.log10(v)-Math.log10(min))/(Math.log10(max)-Math.log10(min))*plotW:L+(v-min)/(max-min)*plotW;
    const yBase={global:T+plotH*.2,free:T+plotH*.5,cubic:T+plotH*.8};
    const gridVals=useLog?[.001,.01,.1,1,10,100].filter(v=>v>=min&&v<=max):Array.from({length:5},(_,i)=>min+(max-min)*i/4);
    gridVals.forEach(v=>{const x=sx(v),line=sEl('line',{x1:x,y1:T,x2:x,y2:T+plotH,class:'chart-grid'});svg.appendChild(line);const tx=sEl('text',{x,y:H-33,class:'chart-label','text-anchor':'middle'});tx.textContent=fmt(v);svg.appendChild(tx)});
    results.models.forEach(([id,label,color])=>{const y=yBase[id],lab=sEl('text',{x:L-18,y:y+4,class:'chart-label','text-anchor':'end'});lab.textContent=label;svg.appendChild(lab);const modelVals=rows.filter(r=>r.model===id).map(r=>state.metric==='error'?r.v:r.energy),mean=modelVals.reduce((a,b)=>a+b,0)/modelVals.length;const m=sEl('line',{x1:sx(mean),y1:y-28,x2:sx(mean),y2:y+28,stroke:color,class:'chart-mean'});svg.appendChild(m)});
    rows.forEach((r,i)=>{const val=state.metric==='error'?r.v:r.energy,y=yBase[r.model]+(r.seed-43)*16,c=sEl('circle',{cx:sx(val),cy:y,r:7,fill:modelMap[r.model].color,class:'chart-point',stroke:'#07111d','stroke-width':'2','data-value':val,'data-seed':r.seed,'data-model':modelMap[r.model].label});c.style.color=modelMap[r.model].color;c.addEventListener('pointerenter',ev=>showTooltip(ev,`${modelMap[r.model].label}<br>seed ${r.seed} · <b>${fmt(val)}</b>`));c.addEventListener('pointerleave',hideTooltip);svg.appendChild(c)});
    const axis=sEl('line',{x1:L,y1:T+plotH,x2:W-R,y2:T+plotH,class:'chart-axis'});svg.appendChild(axis);
    const summary=results.models.map(([id,label])=>{const v=rows.filter(r=>r.model===id).map(r=>state.metric==='error'?r.v:r.energy),mean=v.reduce((a,b)=>a+b,0)/v.length;return [label,mean]}).sort((a,b)=>a[1]-b[1]);
    qs('#result-summary').innerHTML=summary.map(([l,m],i)=>`<div class="summary-row"><span>${i===0?'best · ':''}${l}</span><strong>${fmt(m)}</strong></div>`).join('');
    if(state.resultCase==='original'&&state.interval==='3_5'&&state.metric==='error'){qs('#callout-number').textContent='30×';qs('#callout-title').textContent='The best fit did not transfer best.';qs('#callout-copy').textContent='The global model fit [0,1] far more accurately, yet the structured local model had about thirty times lower mean error on (3,5].';}
    else if(state.metric==='error'){const ratio=summary[summary.length-1][1]/summary[0][1];qs('#callout-number').textContent=`${ratio.toFixed(ratio>10?0:1)}×`;qs('#callout-title').textContent='Structure changes the ranking.';qs('#callout-copy').textContent=`For this view, ${summary[0][0]} has the lowest mean error across the three recorded seeds.`;}
    else{qs('#callout-number').textContent=fmt(summary[0][1]);qs('#callout-title').textContent='Energy is a diagnostic, not a certificate.';qs('#callout-copy').textContent='A trajectory may conserve a global quantity reasonably well and still have substantial phase or field error.';}
  }
  function showTooltip(e,html){const t=qs('#tooltip');t.innerHTML=html;t.style.left=e.clientX+'px';t.style.top=e.clientY+'px';t.classList.add('visible')};function hideTooltip(){qs('#tooltip').classList.remove('visible')};renderResults();

  // -------------------------------------------------------------
  // Presenter mode
  // -------------------------------------------------------------
  const stageTitles=sections.map(s=>s.dataset.stageTitle||s.id);
  function setStage(i){state.stageIndex=(i+sections.length)%sections.length;sections.forEach((s,j)=>s.classList.toggle('stage-active',j===state.stageIndex));qs('#present-index').textContent=`${state.stageIndex+1} / ${sections.length}`;qs('#present-title').textContent=stageTitles[state.stageIndex];sections[state.stageIndex].scrollTop=0;}
  function toggleStage(force){state.stage=typeof force==='boolean'?force:!state.stage;document.body.classList.toggle('stage-mode',state.stage);qs('#presenter-dock').classList.toggle('visible',state.stage);qs('#presenter-dock').setAttribute('aria-hidden',String(!state.stage));if(state.stage){setStage(Math.max(0,sections.findIndex(s=>s.id===(location.hash||'#home').slice(1))))}else{sections.forEach(s=>s.classList.remove('stage-active'));sections[state.stageIndex].scrollIntoView({behavior:'instant'})}}
  qs('#stage-toggle').onclick=()=>toggleStage();qs('#hero-present').onclick=()=>toggleStage(true);qs('#present-exit').onclick=()=>toggleStage(false);qs('#present-prev').onclick=()=>setStage(state.stageIndex-1);qs('#present-next').onclick=()=>setStage(state.stageIndex+1);
  addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea'))return;if(e.key.toLowerCase()==='p')toggleStage();if(state.stage&&(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' ')){e.preventDefault();setStage(state.stageIndex+1)}if(state.stage&&(e.key==='ArrowLeft'||e.key==='PageUp')){e.preventDefault();setStage(state.stageIndex-1)}if(e.key==='Escape'&&state.stage)toggleStage(false)});

  // -------------------------------------------------------------
  // Accessibility / startup
  // -------------------------------------------------------------
  qsa('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{if(state.stage){const id=a.getAttribute('href').slice(1),idx=sections.findIndex(s=>s.id===id);if(idx>=0)setStage(idx)}}));
  applyLanguage();
})();

// -------------------------------------------------------------
// PINN section ambient field — decorative only, all controls remain live
// -------------------------------------------------------------
(() => {
  const bgCanvas = document.querySelector('#pinn-bg-canvas');
  const section = document.querySelector('#pinn');
  if(!bgCanvas || !section) return;
  const g = bgCanvas.getContext('2d');
  let logical = {w:0,h:0};
  let visible = true;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const streams = [
    {y:.18,amp:34,freq:1.35,speed:.00018,phase:.4,color:[88,217,255]},
    {y:.49,amp:54,freq:1.05,speed:.00012,phase:2.2,color:[76,225,182]},
    {y:.78,amp:43,freq:1.55,speed:.00015,phase:4.0,color:[124,167,255]}
  ];
  const motes = Array.from({length:42},(_,i)=>( {
    stream:i%streams.length,
    u:Math.random(),
    size:.7+Math.random()*1.7,
    alpha:.12+Math.random()*.28,
    speed:.000025+Math.random()*.000055,
    offset:(Math.random()-.5)*42
  }));

  function resize(){
    const r=section.getBoundingClientRect();
    const w=Math.max(1,Math.floor(r.width));
    const h=Math.max(1,Math.floor(section.offsetHeight));
    const dpr=Math.min(devicePixelRatio||1,1.6);
    bgCanvas.width=Math.floor(w*dpr);
    bgCanvas.height=Math.floor(h*dpr);
    bgCanvas.style.width=w+'px';
    bgCanvas.style.height=h+'px';
    g.setTransform(dpr,0,0,dpr,0,0);
    logical={w,h};
  }

  function curvePoint(stream,u,time){
    const x=u*logical.w;
    const drift=time*stream.speed;
    const y=logical.h*stream.y
      +Math.sin((u*stream.freq+drift)*Math.PI*2+stream.phase)*stream.amp
      +Math.sin((u*2.35-drift*.45)*Math.PI*2)*stream.amp*.23;
    return {x,y};
  }

  function draw(time=0){
    const {w,h}=logical;
    if(!w||!h) return;
    g.clearRect(0,0,w,h);

    // soft luminous regions
    const halo=g.createRadialGradient(w*.73,h*.18,0,w*.73,h*.18,w*.34);
    halo.addColorStop(0,'rgba(88,217,255,.055)');
    halo.addColorStop(1,'rgba(88,217,255,0)');
    g.fillStyle=halo;g.fillRect(0,0,w,h);

    streams.forEach((s,si)=>{
      for(let band=-2;band<=2;band++){
        g.beginPath();
        for(let i=0;i<=180;i++){
          const u=i/180;
          const p=curvePoint(s,u,time);
          const y=p.y+band*8+Math.sin(u*18+time*.00035+band)*3;
          i?g.lineTo(p.x,y):g.moveTo(p.x,y);
        }
        const [r,gg,b]=s.color;
        g.strokeStyle=`rgba(${r},${gg},${b},${band===0?.10:.035})`;
        g.lineWidth=band===0?1.05:.65;
        g.stroke();
      }
    });

    // moving photons along the field lines
    motes.forEach(m=>{
      const s=streams[m.stream];
      const u=(m.u+time*m.speed)%1;
      const p=curvePoint(s,u,time);
      const y=p.y+m.offset;
      const [r,gg,b]=s.color;
      const glow=g.createRadialGradient(p.x,y,0,p.x,y,8+m.size*4);
      glow.addColorStop(0,`rgba(${r},${gg},${b},${m.alpha})`);
      glow.addColorStop(.25,`rgba(${r},${gg},${b},${m.alpha*.35})`);
      glow.addColorStop(1,`rgba(${r},${gg},${b},0)`);
      g.fillStyle=glow;
      g.beginPath();g.arc(p.x,y,8+m.size*4,0,Math.PI*2);g.fill();
      g.fillStyle=`rgba(${r},${gg},${b},${Math.min(.75,m.alpha*1.8)})`;
      g.beginPath();g.arc(p.x,y,m.size,0,Math.PI*2);g.fill();
    });

    // sparse network-like links in the upper-right background
    const nodes=[];
    for(let j=0;j<4;j++){
      for(let i=0;i<5;i++){
        const x=w*(.58+i*.075);
        const y=h*(.055+j*.045)+Math.sin(time*.00045+i+j)*5;
        nodes.push({x,y});
      }
    }
    g.lineWidth=.6;
    g.strokeStyle='rgba(105,177,226,.045)';
    for(let j=0;j<3;j++){
      for(let a=0;a<5;a++) for(let b=0;b<5;b+=2){
        const A=nodes[j*5+a],B=nodes[(j+1)*5+b];
        g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke();
      }
    }
    nodes.forEach((n,i)=>{
      const pulse=.5+.5*Math.sin(time*.0012+i*.7);
      g.fillStyle=`rgba(88,217,255,${.045+.035*pulse})`;
      g.beginPath();g.arc(n.x,n.y,1.4+1.1*pulse,0,Math.PI*2);g.fill();
    });
  }

  function frame(t){
    if(visible) draw(reduceMotion?0:t);
    if(!reduceMotion) requestAnimationFrame(frame);
  }

  const ro=new ResizeObserver(()=>{resize();draw(0)});
  ro.observe(section);
  const io=new IntersectionObserver(entries=>{
    visible=entries.some(e=>e.isIntersecting);
  },{rootMargin:'200px 0px'});
  io.observe(section);
  resize();
  draw(0);
  if(!reduceMotion) requestAnimationFrame(frame);
})();


// -------------------------------------------------------------
// Experiment atlas ambient background — interactive only as decoration
// -------------------------------------------------------------
(() => {
  const canvas = document.querySelector('#atlas-bg-canvas');
  const section = document.querySelector('#experiments');
  if(!canvas || !section) return;
  const g = canvas.getContext('2d');
  let W=0,H=0,dpr=1,raf=0;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouse = {x:-9999,y:-9999,inside:false};
  let t0 = 0;

  const nodes = Array.from({length:26}, (_,i)=>( {
    x:.08 + Math.random()*.84,
    y:.08 + Math.random()*.84,
    vx:(Math.random()-.5)*.00012,
    vy:(Math.random()-.5)*.00012,
    r:1.8 + Math.random()*3.6,
    tone:i%3===0 ? [88,217,255] : i%3===1 ? [124,167,255] : [76,225,182],
    phase:Math.random()*Math.PI*2
  }));
  const pulses = Array.from({length:18}, (_,i)=>({
    edge:[Math.floor(Math.random()*nodes.length), Math.floor(Math.random()*nodes.length)],
    u:Math.random(),
    speed:.00008 + Math.random()*.00009,
    phase:i*.41
  })).filter(p=>p.edge[0]!==p.edge[1]);

  function resize(){
    const r = section.getBoundingClientRect();
    W = Math.max(1, Math.floor(r.width));
    H = Math.max(1, Math.floor(section.offsetHeight));
    dpr = Math.min(devicePixelRatio || 1, 1.8);
    canvas.width = Math.floor(W*dpr); canvas.height = Math.floor(H*dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    g.setTransform(dpr,0,0,dpr,0,0);
  }

  function sectionCoords(evt){
    const r = section.getBoundingClientRect();
    mouse.x = evt.clientX - r.left; mouse.y = evt.clientY - r.top;
  }

  section.addEventListener('pointermove', evt => { mouse.inside = true; sectionCoords(evt); });
  section.addEventListener('pointerenter', evt => { mouse.inside = true; sectionCoords(evt); });
  section.addEventListener('pointerleave', () => { mouse.inside = false; mouse.x = -9999; mouse.y = -9999; });
  addEventListener('resize', resize);

  function lerp(a,b,t){ return a + (b-a)*t; }

  function draw(ms){
    if(!t0) t0 = ms;
    const time = ms - t0;
    g.clearRect(0,0,W,H);

    const sky = g.createLinearGradient(0,0,W,H);
    sky.addColorStop(0,'rgba(11,24,40,0.14)');
    sky.addColorStop(.55,'rgba(11,24,40,0.03)');
    sky.addColorStop(1,'rgba(11,24,40,0.16)');
    g.fillStyle = sky; g.fillRect(0,0,W,H);

    // slow flowing wave ribbons
    for(let band=0; band<4; band++){
      g.beginPath();
      for(let i=0;i<=140;i++){
        const u = i/140;
        const x = u*W;
        const y = H*(.18 + band*.18) + Math.sin(u*7.8 + time*.00028 + band)*18 + Math.cos(u*4.4 - time*.00019)*8;
        i ? g.lineTo(x,y) : g.moveTo(x,y);
      }
      g.strokeStyle = band%2===0 ? 'rgba(88,217,255,.08)' : 'rgba(124,167,255,.06)';
      g.lineWidth = band===2 ? 1.2 : .9;
      g.stroke();
    }

    // update and render premium node field
    const pts = nodes.map(n => {
      n.x += n.vx * time * .015; n.y += n.vy * time * .015;
      if(n.x < .04 || n.x > .96) n.vx *= -1;
      if(n.y < .05 || n.y > .95) n.vy *= -1;
      const x = n.x * W, y = n.y * H;
      return {n,x,y};
    });

    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if(d < 180){
          const mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
          const mouseBoost = mouse.inside ? Math.max(0, 1 - Math.hypot(mx-mouse.x, my-mouse.y)/220) : 0;
          const alpha = (.11*(1-d/180)) + mouseBoost*.12;
          g.strokeStyle = `rgba(122,176,225,${alpha})`;
          g.lineWidth = mouseBoost > 0 ? 1.15 : .75;
          g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
        }
      }
    }

    pulses.forEach((p,k)=>{
      const a = pts[p.edge[0]], b = pts[p.edge[1]]; if(!a||!b) return;
      p.u = (p.u + p.speed * (reduceMotion ? .12 : 1.0) * time * .06) % 1;
      const x = lerp(a.x,b.x,p.u), y = lerp(a.y,b.y,p.u);
      const alpha = .22 + .28 * (.5 + .5*Math.sin(time*.004 + p.phase));
      const grad = g.createRadialGradient(x,y,0,x,y,12);
      grad.addColorStop(0, `rgba(190,236,255,${alpha})`);
      grad.addColorStop(.35, `rgba(88,217,255,${alpha*.45})`);
      grad.addColorStop(1, 'rgba(88,217,255,0)');
      g.fillStyle = grad; g.beginPath(); g.arc(x,y,12,0,Math.PI*2); g.fill();
    });

    pts.forEach(({n,x,y},i)=>{
      const [r,gg,b] = n.tone;
      const hover = mouse.inside ? Math.max(0, 1 - Math.hypot(x-mouse.x,y-mouse.y)/180) : 0;
      const pulse = .5 + .5*Math.sin(time*.0022 + n.phase);
      const rad = n.r + pulse*1.4 + hover*1.2;
      const glow = g.createRadialGradient(x,y,0,x,y,rad*5);
      glow.addColorStop(0, `rgba(${r},${gg},${b},${.18 + hover*.10})`);
      glow.addColorStop(.22, `rgba(${r},${gg},${b},${.08 + hover*.05})`);
      glow.addColorStop(1, `rgba(${r},${gg},${b},0)`);
      g.fillStyle = glow; g.beginPath(); g.arc(x,y,rad*5,0,Math.PI*2); g.fill();
      g.fillStyle = `rgba(${r},${gg},${b},${.68 + hover*.18})`;
      g.beginPath(); g.arc(x,y,rad,0,Math.PI*2); g.fill();
      g.fillStyle = 'rgba(245,250,255,.95)'; g.beginPath(); g.arc(x,y,Math.max(0.8,rad*.22),0,Math.PI*2); g.fill();
    });

    // subtle focus halo under the cards area
    const halo = g.createRadialGradient(W*.5,H*.58,0,W*.5,H*.58,Math.max(W,H)*.42);
    halo.addColorStop(0,'rgba(90,160,255,.06)');
    halo.addColorStop(.45,'rgba(88,217,255,.03)');
    halo.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle = halo; g.fillRect(0,0,W,H);

    raf = requestAnimationFrame(draw);
  }

  resize();
  if(!reduceMotion) raf = requestAnimationFrame(draw); else draw(0);
})();
