window.SCIML_EXPERIMENTS = [
  {
    id:'pinn-reproduction', phase:'PINNs', category:'baseline', tone:'blue',
    title:'Validated acoustic PINN baseline',
    question:'Before diagnosing a failure, is the numerical harness itself trustworthy?',
    design:'Repo-faithful acoustic protocol: 8,000 uniform interior points per update, 200 boundary/face points, Higdon-2 boundary, Adam 0.003, 30k updates, fine numerical reference.',
    result:'Reference, source, grid, IC, and evaluation audits were consistent. One development FF-PINN at frequency 10 reached 5.56% fine-grid relative L2 error, while many other seeds collapsed.',
    answer:'The evaluation harness was not the dominant failure. Instability persisted after the numerical contract was checked.',
    rulesOut:'A simple reference-grid or source-definition bug as the explanation for the observed high-frequency failures.',
    limitation:'A validated harness does not make the optimization problem easy, and one successful seed is not evidence of robust training.',
    metrics:['30k updates','fine reference verified','seed-dependent regimes'], tags:['PINN','validation','failure']
  },
  {
    id:'pinn-seeds-frequency', phase:'PINNs', category:'failure', tone:'purple',
    title:'Frequency × seed regime map',
    question:'Is the apparent representation advantage stable across independent seeds?',
    design:'Matched and Fourier-feature PINNs at frequencies 10 and 20, seeds 43–45, same 30k-update budget and evaluation.',
    result:'At frequency 10 both architectures could succeed or collapse depending on seed. At frequency 20, matched PINNs consistently failed while FF-PINNs ranged from near-zero solutions to high-energy wrong solutions.',
    answer:'The development representation×frequency interaction did not replicate cleanly. Optimization regime and seed mattered as much as architecture.',
    rulesOut:'A simple claim that Fourier features alone robustly solve the higher-frequency problem.',
    limitation:'Only a small seed ensemble was used; the result diagnoses instability rather than estimating a universal success probability.',
    metrics:['4 cells × 3 seeds','frequency 10 / 20','multiple optimization regimes'], tags:['PINN','frequency','seeds','failure']
  },
  {
    id:'pinn-more-points', phase:'PINNs', category:'sampling', tone:'amber',
    title:'More collocation did not rescue frequency 20',
    question:'Is the high-frequency failure mainly a shortage of uniformly sampled residual points?',
    design:'Increase uniform interior collocation from 8k to 16k at frequency 20 while keeping the rest of the protocol controlled.',
    result:'No clean rescue was observed.',
    answer:'Simple uniform point scarcity is unlikely to be the main bottleneck in the tested regime.',
    rulesOut:'“Just double the collocation set” as a sufficient explanation or remedy.',
    limitation:'Does not rule out better nonuniform designs, curriculum strategies, or different optimization budgets.',
    metrics:['8k → 16k','same high-frequency target','no clean rescue'], tags:['PINN','sampling','negative result']
  },
  {
    id:'pinn-adaptive', phase:'PINNs', category:'sampling', tone:'red',
    title:'Adaptive sampling over-focused on the source',
    question:'Does residual-driven adaptive sampling place points where they are globally most informative?',
    design:'Residual-adaptive wave PINN with the same physical problem and numerical reference.',
    result:'About 98% of the adaptive points concentrated in the source box, roughly 490× enrichment, while the learned trajectory was wrong.',
    answer:'Large residual is not equivalent to global information value. The sampler can amplify a local difficulty and starve the rest of the domain.',
    rulesOut:'The assumption that residual-based concentration is automatically a useful curriculum for this wave problem.',
    limitation:'This diagnoses one adaptive mechanism; it does not rule out diversity constraints, importance correction, or alternative acquisition functions.',
    metrics:['≈98% in source box','≈490× enrichment','wrong trajectory'], tags:['PINN','adaptive sampling','failure']
  },
  {
    id:'neusa-official', phase:'NeuSA', category:'reproduction', tone:'green',
    title:'Official NeuSA reproduction',
    question:'Can the official sine-Gordon configuration be reproduced before modifying the architecture?',
    design:'201 spectral modes/time samples, T=3, width 804, 1000 Adam steps at lr 0.02, TorchDyn RK4.',
    result:'Relative L2 error 0.06104% in about 22.5 minutes. Temporal refinement reduced discretization error until model error dominated.',
    answer:'Yes. This became the reference point for every later adaptation.',
    rulesOut:'Building conclusions on an unverified reimplementation.',
    limitation:'A successful official configuration does not imply robustness to new trajectories or physical parameters.',
    metrics:['0.06104% rL2','201 modes','1000 steps'], tags:['NeuSA','reproduction','reference']
  },
  {
    id:'neusa-linearized', phase:'NeuSA', category:'structure', tone:'green',
    title:'Analytical linearization improved the learned dynamics',
    question:'What happens if the known linear part of the sine-Gordon dynamics is removed from the neural correction?',
    design:'Compare base learned dynamics with a structured system a′=b, b′=−(Ω²+10I)a+0.1N(a), seeds 42–44.',
    result:'Mean training-interval relative error improved from 0.01254% to 0.004787%, about a 61.8% reduction, for roughly 4.5% extra training time.',
    answer:'Known physics can reduce the burden placed on the neural component.',
    rulesOut:'The idea that maximum neural flexibility is necessarily the best use of capacity.',
    limitation:'Training fit alone still did not predict transfer, which motivated the locality study.',
    metrics:['61.8% lower mean error','3 seeds','≈4.5% time overhead'], tags:['NeuSA','structure','ablation']
  },
  {
    id:'neusa-local-cubic', phase:'NeuSA', category:'structure', tone:'cyan',
    title:'A 1,153-parameter cubic local law transferred dramatically better',
    question:'Can a much smaller local correction with odd+cubic structure beat an expressive global coefficient map out of trajectory distribution?',
    design:'Global linearized model (474,921 NN parameters) vs local free and local cubic corrections (1,153 parameters), trained on [0,1], tested through T=5 on original, shifted, sign-flipped, wider, higher-amplitude, and double-pulse ICs.',
    result:'Mean (1,3] errors for the cubic model stayed roughly 0.57–1.35% across the six tests, while the global model ranged about 19.9–44.4%.',
    answer:'The right structural prior bought far more transfer than raw expressivity.',
    rulesOut:'Using training fit or parameter count as a proxy for transferable dynamics.',
    limitation:'The cubic law was not globally accurate at large |u|; its success was concentrated on the states occupied by the tested trajectories.',
    metrics:['1,153 NN params','≈412× smaller','late error <~1.8%'], tags:['NeuSA','structure','transfer']
  },
  {
    id:'neusa-odd', phase:'NeuSA', category:'structure', tone:'purple',
    title:'Odd symmetry helped; cubic near-zero structure helped much more',
    question:'Is odd symmetry alone enough to explain the transfer advantage?',
    design:'New held-out ICs; compare local free, exact-odd, and cubic corrections across seeds 42–44.',
    result:'Cubic beat free 9/9 and odd 9/9. Odd beat free 7/9. Mean (1,3] errors were about 8.08% free, 5.58% odd, and 0.575% cubic.',
    answer:'Symmetry is useful but insufficient; the near-zero cubic prior was the dominant structural ingredient.',
    rulesOut:'Attributing the transfer gain to odd symmetry alone.',
    limitation:'The prior is problem-informed and should not be assumed appropriate for unrelated nonlinearities.',
    metrics:['cubic wins 18/18 key comparisons','odd helps 7/9','held-out ICs'], tags:['NeuSA','symmetry','ablation']
  },
  {
    id:'neusa-compute', phase:'NeuSA', category:'compute', tone:'amber',
    title:'More trajectories and compute did not substitute for structure',
    question:'Can diversity plus a larger optimization budget erase the advantage of the cubic prior?',
    design:'Single-trajectory 500-update models vs multi-trajectory 500/1000/1500 update continuations for free, odd, and cubic structures.',
    result:'At equal 500-update total budget, multi-trajectory training worsened all 9 paired comparisons for every prior. By 1500 updates, odd improved strongly, free modestly, while cubic was already near saturation.',
    answer:'Compute helped partially structured models, but the structural prior remained far more compute-efficient.',
    rulesOut:'The idea that the cubic result was merely an unfair consequence of seeing an easier trajectory.',
    limitation:'The comparison is tied to the chosen deterministic trajectory cycle and optimizer schedule.',
    metrics:['500→1500 updates','odd: ~61% improvement','cubic near saturation'], tags:['NeuSA','compute','data diversity']
  },
  {
    id:'neusa-robustness', phase:'NeuSA', category:'robustness', tone:'cyan',
    title:'Robustness atlas exposed tail risk',
    question:'Do mean errors hide catastrophic trajectories?',
    design:'64 random IC screen, then 12 adversarial/stress cases through T=10, multiple seeds, refined numerical references and integration audits.',
    result:'In (5,10], cubic models had q90 around 4.2% and max about 6.3%, while free models had much larger mean/tail errors and odd models sat between them.',
    answer:'The structural prior controlled not only the mean but the long-horizon tail of the error distribution.',
    rulesOut:'Averages alone as sufficient evidence of robust learned dynamics.',
    limitation:'Stress cases were selected after a screen and therefore are adversarial diagnostics, not independent held-out population estimates.',
    metrics:['64-case screen','12 stress cases','T=10'], tags:['NeuSA','robustness','tail risk']
  },
  {
    id:'parametric-neusa', phase:'NeuSA', category:'generalization', tone:'green',
    title:'One surrogate learned a family of physical coefficients',
    question:'Can a single structured model generalize simultaneously across unseen initial conditions and an unseen PDE coefficient μ?',
    design:'Train μ∈{5,7.5,10,12.5,15}; test unseen interpolation μ∈{6.25,8.75,11.25,13.75} and extrapolation μ∈{3.75,16.25}; three ICs and three seeds.',
    result:'Cubic mean late error was about 1.33% on unseen interpolation and 3.00% on extrapolation. Mean μ-recovery error from force projection was about 0.044 in interpolation and 0.091 in extrapolation.',
    answer:'The structured surrogate learned a useful parametric family, with a clear asymmetry at the upper extrapolation edge.',
    rulesOut:'The transfer result being limited to a single fixed PDE coefficient.',
    limitation:'Upper extrapolation was substantially harder, foreshadowing later model-discrepancy failures.',
    metrics:['5 training μ values','4 unseen interpolation μ','2 extrapolation μ'], tags:['NeuSA','parameterized PDE','generalization']
  },
  {
    id:'inverse-calibration', phase:'Inverse', category:'inverse', tone:'blue',
    title:'Sparse early measurements recovered hidden physics',
    question:'Can we infer μ from sparse observations at t≤1 and then improve future prediction with the frozen surrogate?',
    design:'4 hidden μ values × 3 held-out ICs × 3 observation regimes × 3 seeds = 108 inverse problems; only scalar μ optimized, all NN weights frozen.',
    result:'For unseen interpolation, sparse noisy observations gave mean |μ̂−μ|≈0.075 and mean (3,5] forecast error 2.35%, versus 78.89% for the same surrogate fixed at μ=10. Calibration improved the baseline in 108/108 problems.',
    answer:'A structured parametric surrogate can turn a handful of early observations into useful physical calibration and downstream forecasting.',
    rulesOut:'The parametric model being useful only as a forward interpolator.',
    limitation:'Observations are synthetic and generated by a numerical reference; this is controlled system identification, not real-data inference.',
    metrics:['108 inverse problems','2% noise scenarios','108/108 beat baseline'], tags:['inverse problem','calibration','forecast']
  },
  {
    id:'sensor-design', phase:'UQ', category:'design', tone:'cyan',
    title:'Fisher information moved the sensors',
    question:'Can the surrogate itself tell us where 12 measurements should be taken to identify μ more efficiently?',
    design:'Search 3-sensor × 4-time Cartesian layouts using only training μ values and training ICs. Compare fixed, Fisher-optimal, and frozen random layouts on hidden test μ/ICs.',
    result:'Fisher chose x={−0.6,0,0.6} and later times {0.625,0.75,0.875,1}. In interpolation, mean |μ̂−μ| fell from 0.0738 fixed to 0.0495 Fisher, with the same 12 observations.',
    answer:'Physics-aware sensor placement improved identification and forecast without collecting more data.',
    rulesOut:'Treating measurement placement as irrelevant once the observation count is fixed.',
    limitation:'The design criterion is local and model-based; it can be overconfident when the surrogate itself is wrong.',
    metrics:['same 12 observations','~33% lower mean μ error vs fixed','design uses training support only'], tags:['sensor design','Fisher information','inverse']
  },
  {
    id:'uq-failure', phase:'UQ', category:'failure', tone:'red',
    title:'Local Fisher UQ became confidently wrong in extrapolation',
    question:'Does high measurement information imply trustworthy parameter uncertainty outside the surrogate training range?',
    design:'Use the same inverse problems with local Fisher/Laplace intervals and compare interpolation vs extrapolation.',
    result:'In extrapolation, nominal 90% intervals had 0% empirical coverage for both fixed and Fisher layouts, even though Fisher intervals were the narrowest.',
    answer:'No. Measurement uncertainty and model-form uncertainty are different objects.',
    rulesOut:'Using local sensitivity alone as a certificate of surrogate validity.',
    limitation:'The intervals were intentionally local Gaussian approximations, not exact Bayesian posteriors.',
    metrics:['90% nominal','0% coverage','narrow but invalid intervals'], tags:['UQ','model discrepancy','failure']
  },
  {
    id:'discrepancy-repair', phase:'UQ', category:'uq', tone:'green',
    title:'Discrepancy-aware UQ repaired much of the extrapolation failure',
    question:'Can a simple model-discrepancy correction learned at old extrapolation points transfer to completely fresh coefficients?',
    design:'Fit side-specific shrinkage/discrepancy only at μ=3.75 and 16.25; freeze; test fresh μ={4.25,15.75,3.25,16.75} over 108 inverse problems.',
    result:'Correction won 81/108 parameter-error comparisons and 76/108 forecasts. For far-extrapolation Fisher cases, mean forecast error fell 19.87%→7.89% and coverage rose 0%→77.8%; seed-ensemble coverage reached 83.3%.',
    answer:'Explicit surrogate discrepancy can repair catastrophic undercoverage and improve downstream prediction, though not uniformly.',
    rulesOut:'The original 0% coverage being inevitable once the surrogate extrapolates.',
    limitation:'Coverage remained below nominal in some regimes and the discrepancy law is deliberately simple.',
    metrics:['81/108 μ wins','76/108 forecast wins','0%→77.8% coverage'], tags:['UQ','fresh test','model discrepancy']
  },
  {
    id:'pseudo-true', phase:'UQ', category:'mechanism', tone:'purple',
    title:'Physical truth and predictive truth can separate',
    question:'Why can a parameter estimate move closer to μtrue while the forecast gets worse?',
    design:'For all 36 fresh Fisher-layout tasks, sweep candidate μ over [2.5,17.5] and separately locate the clean-observation optimum and future-forecast pseudo-true μ.',
    result:'The separation was concentrated on upper extrapolation. At μtrue=16.75, mean forecast error was 6.40% at the physical μ but 2.60% at μ†forecast≈16.57. Two near-extrapolation tasks showed the full compensation mechanism explicitly.',
    answer:'Under surrogate misspecification, μobs†, μforecast†, and μtrue need not coincide. A biased parameter can partially compensate for model error.',
    rulesOut:'Interpreting every predictive improvement as better physical parameter recovery.',
    limitation:'Phase 8 is a mechanistic diagnostic motivated by Phase 7, not a new blinded confirmatory test.',
    metrics:['36 diagnostic sweeps','upper-side asymmetry','2 full mechanism cases'], tags:['pseudo-true parameter','misspecification','mechanism']
  }
];
