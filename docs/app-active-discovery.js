(() => {
  const qs=(s,c=document)=>c.querySelector(s);
  const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
  const section=qs('#discovery');
  if(!section) return;

  const stages=[
    {
      index:'01', short:'Compensation', sub:'wrong model, plausible fit', kicker:'MODEL MISSPECIFICATION',
      title:'A wrong equation can look right locally.',
      copy:'We deliberately hid a conservative correction and damping term, then calibrated only the nominal physical parameter. The misspecified model compensated for missing physics by moving μ away from its true value. That improved the early fit dramatically, but the apparent success collapsed under long-horizon falsification.',
      math:String.raw`\[\mu_{\mathrm{true}}=10,\qquad \widehat\mu=8.538,\qquad R^\star=0.65\sin(2u)-0.08u_t.\]`,
      metrics:[['PARAMETER SHIFT','−14.6%','10 → 8.538'],['EARLY rL²','2.29%','after calibration'],['LATE rL²','110.2%','last quarter, T≤20']],
      insightTitle:'Calibration can hide missing physics.',
      insightCopy:'For small amplitudes, sin(2u) behaves approximately like 2u. The missing restoring force can therefore be partially absorbed by a biased μ. The pseudo-true parameter was not an optimizer accident; it had a physical mechanism.',
      claim:'A useful short-window calibration is not automatically a physically identified model.',
      boundary:'DEV mechanism result. This isolates parameter compensation; it is not yet a multi-world confirmatory claim.',
      viz:'compensation'
    },
    {
      index:'02', short:'Identifiability', sub:'fit ≠ law recovery', kicker:'EXCITATION GEOMETRY',
      title:'Excellent trajectory fit did not identify the correct law.',
      copy:'With only weak trajectories, the structured learner reproduced the observed dynamics extremely well, yet its symbolic decomposition was wrong because sin(u) and sin(2u) were almost collinear on the occupied state region. One high-amplitude trajectory changed the geometry of the inverse problem far more than it changed the training loss.',
      math:String.raw`\[\text{weak: }\kappa(G)=8.36\times10^4\quad\longrightarrow\quad\text{informative: }\kappa(G)=1.27\times10^3.\]`,
      metrics:[['TRAIN MSE','1.69e−6','weak'],['GRAM CONDITION','66× better','with one trajectory'],['COEFF. ERROR','1.558 → 0.169','89% reduction']],
      insightTitle:'Prediction data are not necessarily discovery data.',
      insightCopy:'The weak model learned the correct local effect without uniquely identifying the correct force law. The informative trajectory moved the system into a region where competing explanations became distinguishable.',
      claim:'The useful experiment is the one that separates competing physical explanations, not necessarily the one that lowers training loss.',
      boundary:'The informative run uses the same model family and only one additional trajectory.',
      viz:'identifiability'
    },
    {
      index:'03', short:'Structure × data', sub:'capacity and compute controlled', kicker:'INDUCTIVE STRUCTURE',
      title:'Informative data only became scientific information when the learner had the right structure.',
      copy:'We matched model capacity and tripled the optimization budget to test whether the structured advantage was just a parameter-count or under-training artifact. It was not. At 3600 updates, the structured learner remained clearly separated from free and odd alternatives in both operator recovery and symbolic law recovery.',
      math:String.raw`\[\text{law recovery}\;\approx\;\text{excitation geometry}\;\times\;\text{inductive structure}.\]`,
      metrics:[['PARAMETERS','1477 vs 1490','capacity matched'],['COMMON ERROR','0.35','structured mean'],['COEFF. ERROR','0.13','structured mean']],
      insightTitle:'Structure and experiment design are complementary resources.',
      insightCopy:'A high-amplitude experiment exposes nonlinear information, but an unstructured learner can still fail to convert that information into a stable law. More compute reduced some optimization error without erasing the architectural separation.',
      claim:'Informative excitation is necessary for identifiability here, but not sufficient by itself.',
      boundary:'DEV ablation across free, odd and structured learners; seeds 42–44; matched capacity and 3600 updates.',
      viz:'structure'
    },
    {
      index:'04', short:'Choose evidence', sub:'54 candidate experiments', kicker:'ACTIVE EXPERIMENT DESIGN',
      title:'NeuSA was asked which experiment it wanted next.',
      copy:'Starting from the weak-data ensemble, we froze 54 admissible experiments and compared four acquisition rules. Fisher information for μ preferred a low-amplitude experiment. Ensemble disagreement and discovery-aware selection independently moved to the high-amplitude, wide-pulse region that breaks the law degeneracy.',
      math:String.raw`\[A_{\mathrm{discovery}}(a)=\tfrac12\,\mathrm{rank}(A_{\mathrm{ensemble}})+\tfrac12\,\mathrm{rank}(\Delta\log\det G).\]`,
      metrics:[['CANDIDATES','54','frozen before scoring'],['DISCOVERY A','2.20','selected peak'],['LOGDET GAIN','4.1×','vs original random']],
      insightTitle:'Parameter information and law information are different.',
      insightCopy:'Fisher-μ selected A=0.70, while both active law-discovery criteria selected A=2.20. The top ten discovery-aware candidates all had peak 1.9 or 2.2.',
      claim:'The system learned which region of experiment space was needed to distinguish candidate laws.',
      boundary:'Selection used no oracle outcome from the chosen experiment. Outcome evaluation was performed only after selection was frozen.',
      viz:'selection'
    },
    {
      index:'05', short:'Outcome', sub:'one oracle trajectory', kicker:'ONE-STEP ACTIVE DISCOVERY',
      title:'The chosen experiment converted predictive success into identifiable physics.',
      copy:'With exactly one additional oracle trajectory, discovery-aware selection sharply improved law recovery over the weak baseline, Fisher-μ, and the average random experiment. It ranked first against all eight frozen random candidates on symbolic recovery, common-domain operator recovery, and challenging transfer.',
      math:String.raw`\[\text{weak}\rightarrow\text{select}\rightarrow\text{one experiment}\rightarrow\text{retrain}\rightarrow\text{recover the law}.\]`,
      metrics:[['SYMBOLIC ERROR','0.0705','17.4× lower vs weak'],['COMMON ERROR','0.2199','7.0× lower vs weak'],['RANDOM RANK','1st / 9','all 3 frozen metrics']],
      insightTitle:'Active selection mattered more for the law than for the loss.',
      insightCopy:'Discovery-aware and ensemble were nearly tied in this one-step DEV test, so the evidence does not support claiming a unique acquisition winner. The robust result is that both active criteria found the same informative high-excitation region, while Fisher optimized a different objective.',
      claim:'The experiment that is best for estimating a known parameter need not be the experiment that is best for discovering missing physics.',
      boundary:'DEV result. The blinded 12-world confirmatory campaign and commitments are frozen, but its full outcomes are not complete for this presentation.',
      viz:'outcome'
    }
  ];

  let active=0;
  const rail=qs('#discovery-rail');
  const fmt=x=>Number(x).toLocaleString(undefined,{maximumFractionDigits:4});
  const bar=(label,sub,value,max,valueText)=>`<div class="discovery-bar-row"><div class="discovery-bar-label"><strong>${label}</strong><small>${sub||''}</small></div><div class="discovery-bar-track"><div class="discovery-bar-fill" style="width:${Math.max(2,100*value/max)}%"></div></div><div class="discovery-bar-value">${valueText??fmt(value)}</div></div>`;

  function compensationViz(){
    return `<div class="discovery-bar-chart">
      ${bar('Early error','wrong equation, μ=10',8.22,110.2,'8.22%')}
      ${bar('Early error','calibrated μ=8.538',2.29,110.2,'2.29%')}
      ${bar('Full horizon','T ≤ 20',53.5,110.2,'53.5%')}
      ${bar('Late quarter','final 25% of horizon',110.2,110.2,'110.2%')}
      <div class="discovery-law-card law-truth" style="margin-top:8px"><span>MECHANISM</span><h4>Why did μ move?</h4><code>sin(u) ≈ u &nbsp;&nbsp; and &nbsp;&nbsp; sin(2u) ≈ 2u &nbsp; for small u<br/>−10u + 0.65·2u ≈ −8.7u</code></div>
    </div>`;
  }
  function identifiabilityViz(){
    return `<div class="discovery-law-grid">
      <article class="discovery-law-card"><span>WEAK EXCITATION</span><h4>Excellent fit, ambiguous law</h4><code>learned ≈ −1.385 sin(u)<br/>+ 1.364 sin(2u)<br/>− 0.0807 u_t</code><div style="margin-top:10px;font-size:.7rem;color:#9fb9c3">κ(G) = 83,638 &nbsp; · &nbsp; coefficient error = 1.558</div></article>
      <article class="discovery-law-card law-truth"><span>+ ONE INFORMATIVE TRAJECTORY</span><h4>Law becomes distinguishable</h4><code>learned ≈ 0.141 sin(u)<br/>+ 0.557 sin(2u)<br/>− 0.0828 u_t</code><div style="margin-top:10px;font-size:.7rem;color:#87e0cb">κ(G) = 1,271 &nbsp; · &nbsp; coefficient error = 0.169</div></article>
      <article class="discovery-law-card law-truth" style="grid-column:1/-1"><span>HIDDEN DEV LAW</span><h4>Ground truth used only for DEV evaluation</h4><code>R*(u,u_t) = 0.65 sin(2u) − 0.08 u_t</code></article>
    </div>`;
  }
  function structureViz(){
    return `<div class="discovery-matrix">
      <div></div><div class="mh">FREE</div><div class="mh">ODD</div><div class="mh">STRUCTURED</div>
      <div class="ml">Common-grid rL²</div><div class="cell">2.25</div><div class="cell">1.78</div><div class="cell best">0.35</div>
      <div class="ml">Symbolic coeff. error</div><div class="cell">0.77</div><div class="cell">0.64</div><div class="cell best">0.13</div>
      <div class="ml">Parameters</div><div class="cell">1477</div><div class="cell">1477</div><div class="cell best">1490</div>
      <div class="ml">Optimization</div><div class="cell">3600</div><div class="cell">3600</div><div class="cell best">3600</div>
    </div><div style="margin-top:12px;font-size:.7rem;color:rgba(202,221,228,.58)">Mean over seeds 42–44. Capacity matched before the comparison.</div>`;
  }
  function selectionViz(){
    const pts=[];
    const amps=[.7,1,1.3,1.6,1.9,2.2], widths=[.08,.10,.12];
    let c=1;
    amps.forEach((a,ai)=>[-.5,0,.5].forEach((shift,si)=>widths.forEach((w,wi)=>{
      const x=48+ai*82+si*16; const y=220-wi*68-shift*16;
      let cls='rgba(116,170,190,.30)',r=4;
      if(c===9){cls='#9cc0ff';r=7} if(c===51){cls='#f7c66b';r=8} if(c===48){cls='#5df0c9';r=9}
      pts.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${cls}" ${c===48?'filter="url(#glow)"':''}/>`);c++;
    })));
    return `<svg class="candidate-map" viewBox="0 0 520 270" role="img" aria-label="Candidate experiment map"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><line x1="38" y1="230" x2="500" y2="230" stroke="rgba(255,255,255,.12)"/><text x="40" y="250" fill="rgba(205,225,232,.55)" font-size="10">A=.7</text><text x="455" y="250" fill="rgba(205,225,232,.55)" font-size="10">A=2.2</text>${pts.join('')}<text x="330" y="33" fill="#5df0c9" font-size="11">Discovery C048 · A=2.2</text><text x="330" y="50" fill="#f7c66b" font-size="11">Ensemble C051 · A=2.2</text><text x="45" y="70" fill="#9cc0ff" font-size="11">Fisher C009 · A=.7</text></svg><div class="candidate-legend"><span><i style="background:#5df0c9"></i> discovery-aware</span><span><i style="background:#f7c66b"></i> ensemble</span><span><i style="background:#9cc0ff"></i> Fisher-μ</span><span><i style="background:rgba(116,170,190,.5)"></i> candidate bank</span></div>`;
  }
  function outcomeViz(){
    const rows=[
      ['Weak baseline',1.2272,1.5334,.013667],['Fisher-μ',.3225,1.7379,.009622],['Random mean',.1911,.6554,.005502],['Ensemble',.07104,.22490,.004956],['Discovery-aware',.07051,.21991,.004952]
    ];
    return `<div class="discovery-strategy-chart"><div class="strategy-row head"><span></span><span>SYMBOLIC ERROR</span><span>COMMON OPERATOR</span><span>CHALLENGING TRANSFER</span></div>${rows.map(r=>`<div class="strategy-row ${r[0]==='Discovery-aware'?'discovery-win':''}"><div class="strategy-name">${r[0]}</div><div class="strategy-cell">${r[1].toFixed(4)}</div><div class="strategy-cell">${r[2].toFixed(4)}</div><div class="strategy-cell">${r[3].toFixed(4)}</div></div>`).join('')}<div style="margin-top:8px;font-size:.68rem;color:rgba(202,221,228,.58)">Discovery-aware ranked 1st against all 8 frozen random candidates on all three pre-selected metrics. Ensemble was nearly tied.</div></div>`;
  }
  const vizFns={compensation:compensationViz,identifiability:identifiabilityViz,structure:structureViz,selection:selectionViz,outcome:outcomeViz};

  function render(){
    const d=stages[active];
    rail.innerHTML=stages.map((s,i)=>`<button class="discovery-rail-item ${i===active?'active':''}" data-discovery-index="${i}"><span>${s.index}</span><div><strong>${s.short}</strong><small>${s.sub}</small></div></button>`).join('');
    qsa('[data-discovery-index]',rail).forEach(b=>b.onclick=()=>{active=Number(b.dataset.discoveryIndex);render();});
    qs('#discovery-kicker').textContent=d.kicker;
    qs('#discovery-title').textContent=d.title;
    qs('#discovery-step-index').textContent=d.index;
    qs('#discovery-copy').textContent=d.copy;
    qs('#discovery-math').innerHTML=d.math;
    qs('#discovery-metrics').innerHTML=d.metrics.map(m=>`<div class="discovery-metric"><span>${m[0]}</span><strong>${m[1]}</strong><small>${m[2]}</small></div>`).join('');
    qs('#discovery-viz').innerHTML=vizFns[d.viz]();
    qs('#discovery-insight-title').textContent=d.insightTitle;
    qs('#discovery-insight-copy').textContent=d.insightCopy;
    qs('#discovery-claim').textContent=d.claim;
    qs('#discovery-boundary').textContent=d.boundary;
    if(window.MathJax?.typesetPromise) window.MathJax.typesetPromise([section]).catch(()=>{});
  }
  render();

  // Interactive scientific field: softly moving trajectories and evidence pulses.
  const canvas=qs('#discovery-bg-canvas');
  const ctx=canvas?.getContext('2d');
  if(canvas&&ctx){
    let w=1,h=1,dpr=1,last=0;
    const particles=Array.from({length:44},(_,i)=>({x:Math.random(),y:Math.random(),s:.000018+Math.random()*.000035,r:.6+Math.random()*1.4,p:i*.73}));
    function resize(){const r=section.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
    function frame(t){ctx.clearRect(0,0,w,h);const dt=Math.min(40,t-last||16);last=t;for(let k=0;k<3;k++){ctx.beginPath();for(let x=0;x<=w;x+=16){const y=h*(.18+k*.28)+Math.sin(x*.009+t*.00035+k)*18+Math.sin(x*.0021-t*.00017+k*2)*25;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.strokeStyle=`rgba(${k===1?'83,230,196':'91,147,226'},${k===1?.055:.035})`;ctx.lineWidth=1;ctx.stroke()}particles.forEach(p=>{p.x=(p.x+p.s*dt)%1;const x=p.x*w,y=p.y*h+Math.sin(t*.0006+p.p)*8;ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(113,226,209,.20)';ctx.fill()});requestAnimationFrame(frame)}
    new ResizeObserver(resize).observe(section);resize();requestAnimationFrame(frame);
  }
})();
