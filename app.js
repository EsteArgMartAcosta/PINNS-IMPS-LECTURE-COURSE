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
  // Concept map
  // -------------------------------------------------------------
  const conceptData = window.SCIML_CONCEPTS;
  const svg = qs('#concept-map');
  const transformGroup = qs('#map-transform');
  const edgesG = qs('#map-edges'), nodesG=qs('#map-nodes');
  const nodeById = new Map(conceptData.nodes.map(n=>[n.id,n]));
  const ns='http://www.w3.org/2000/svg';
  const toneColors={core:'#58d9ff',w1:'#7ca7ff',w2:'#a892ff',w3:'#ffb25b',w4:'#4ce1b6',cross:'#ff7285'};
  function sEl(name,attrs={}){const e=document.createElementNS(ns,name);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  conceptData.edges.forEach(([a,b,label])=>{
    const A=nodeById.get(a),B=nodeById.get(b); if(!A||!B)return;
    const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d;
    const p1={x:A.x+ux*(A.size*.52),y:A.y+uy*(A.size*.52)},p2={x:B.x-ux*(B.size*.56),y:B.y-uy*(B.size*.56)};
    const path=sEl('path',{d:`M${p1.x},${p1.y} L${p2.x},${p2.y}`,class:'map-edge','data-a':a,'data-b':b,'data-label':label});edgesG.appendChild(path);
  });
  function buildNodes(){
    nodesG.innerHTML='';
    conceptData.nodes.forEach(n=>{
      const g=sEl('g',{class:'concept-node',transform:`translate(${n.x} ${n.y})`,'data-id':n.id,tabindex:'0',role:'button'});
      const c=sEl('circle',{r:n.size/2,fill:`${toneColors[n.tone]}22`,stroke:toneColors[n.tone]});
      const t=sEl('text',{y:'-2'}); t.textContent=lang(n.label);
      const w=sEl('text',{y:(n.size/2-8),class:'week-label'}); w.textContent=n.week?`W${n.week}`:'LINK';
      g.append(c,t,w); nodesG.appendChild(g);
      g.addEventListener('click',()=>openConcept(n.id));
      g.addEventListener('keydown',e=>{if(e.key==='Enter')openConcept(n.id)});
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
  function redrawEdges(){qsa('.map-edge',edgesG).forEach(path=>{const A=nodeById.get(path.dataset.a),B=nodeById.get(path.dataset.b),dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;path.setAttribute('d',`M${A.x+ux*A.size*.52},${A.y+uy*A.size*.52} L${B.x-ux*B.size*.56},${B.y-uy*B.size*.56}`)})}
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
    qs('#panel-week').textContent=`WEEK ${n.week}`;qs('#panel-eyebrow').textContent=lang(n.eyebrow);qs('#panel-title').textContent=lang(n.label);qs('#panel-tags').innerHTML=(n.tags||[]).map(t=>`<span>${t}</span>`).join('');
    updatePanelBody();highlightConcept(id); if(scroll&&innerWidth<1080)qs('#concept-panel').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function updatePanelBody(){const n=nodeById.get(state.activeConcept);if(!n)return;const body=qs('#panel-body');body.classList.toggle('math',state.activeTab==='math');body.textContent=state.activeTab==='math'?n.math:lang(n[state.activeTab])}
  function highlightConcept(id){qsa('.map-edge').forEach(e=>{e.classList.toggle('active',e.dataset.a===id||e.dataset.b===id)});qsa('.concept-node').forEach(g=>g.classList.toggle('hit',g.dataset.id===id))}
  qsa('.panel-tab').forEach(b=>b.onclick=()=>{qsa('.panel-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.activeTab=b.dataset.tab;updatePanelBody()});
  qs('#panel-close').onclick=()=>{state.activeConcept=null;qs('#panel-content').classList.add('hidden');qs('#panel-empty').classList.remove('hidden');qsa('.map-edge').forEach(e=>e.classList.remove('active'));qsa('.concept-node').forEach(g=>g.classList.remove('hit'))};
  function adjacentConcept(step){const idx=conceptData.nodes.findIndex(n=>n.id===state.activeConcept);const n=conceptData.nodes[(idx+step+conceptData.nodes.length)%conceptData.nodes.length];openConcept(n.id,false)}
  qs('#concept-prev').onclick=()=>adjacentConcept(-1);qs('#concept-next').onclick=()=>adjacentConcept(1);
  buildNodes();

  const story=['pde','pinn','causality','spectralbias','fourier','sampling','abc','neuralode','integrator','spectralbasis','neusa','transfer'];
  qs('#storyline-track').innerHTML=story.map((id,i)=>`<span class="story-step"><button data-id="${id}">${lang(nodeById.get(id).label)}</button>${i<story.length-1?'<span class="story-arrow">→</span>':''}</span>`).join('');
  qsa('.story-step button').forEach(b=>b.onclick=()=>{openConcept(b.dataset.id,false);qs(`.concept-node[data-id="${b.dataset.id}"]`)?.scrollIntoView?.({behavior:'smooth',block:'center'})});

  // -------------------------------------------------------------
  // Protocol drawer
  // -------------------------------------------------------------
  const protocols={
    A:{k:'EXPERIMENT A · REPRESENTATION',t:'Representation × frequency',q:'Does exposing oscillatory coordinates help a coordinate PINN as physical frequency increases?',c:'same PDE, boundary treatment, training budget and evaluation grid',ch:'coordinate encoding + physical frequency',r:'field error · receiver traces · cost',n:'Planned. Fourier features change representation, but not necessarily parameter count or derivative scale. The first pilot must verify the numerical reference at both frequencies.'},
    B:{k:'EXPERIMENT B · DOMAIN DESIGN',t:'Boundary × adaptive sampling',q:'Does adaptive training still help when the treatment of outgoing waves changes?',c:'same architecture, source, reference and optimization budget',ch:'absorbing BC strategy + adaptive training strategy',r:'field error · boundary/receiver diagnostics · extra sampling cost',n:'Planned. In the current codebase, adaptive training may alter both point allocation and residual weighting, so the first study is not automatically a pure sampling ablation.'},
    C:{k:'EXPERIMENT C · LEARNED DYNAMICS',t:'Structured correction & transfer',q:'Can a much smaller structured local correction transfer better than an expressive global coefficient map?',c:'same PDE residual, spectral resolution, train interval and seeds',ch:'global vs local free vs local odd+cubic correction',r:'transfer error · energy drift · learned force',n:'Recorded. The structured model transferred dramatically better in the tested protocol, but it did not identify the force uniformly at large amplitudes and it was not faster to train.'}
  };
  qsa('.exp-open').forEach(b=>b.onclick=()=>{const p=protocols[b.dataset.exp];qs('#drawer-kicker').textContent=p.k;qs('#drawer-title').textContent=p.t;qs('#drawer-question').textContent=p.q;qs('#drawer-control').textContent=p.c;qs('#drawer-change').textContent=p.ch;qs('#drawer-readout').textContent=p.r;qs('#drawer-note').textContent=p.n;qs('#protocol-drawer').classList.add('open');qs('#protocol-drawer').setAttribute('aria-hidden','false')});
  function closeDrawer(){qs('#protocol-drawer').classList.remove('open');qs('#protocol-drawer').setAttribute('aria-hidden','true')}
  qs('#protocol-close').onclick=closeDrawer;qs('#protocol-scrim').onclick=closeDrawer;

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
  const stageTitles=['Opening','Theory map','Experiments','Results','Four-week synthesis'];
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
