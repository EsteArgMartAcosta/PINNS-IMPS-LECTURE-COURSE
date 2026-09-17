window.SCIML_WEEKS = [
  {
    id: 1,
    kicker: 'WEEK 01 · FOUNDATIONS',
    title: 'Physics becomes an optimization problem.',
    question: 'How do we turn a differential equation into a trainable objective without forgetting the mathematical problem we actually want to solve?',
    intuition: 'A PINN replaces an unknown field \\(u\\) with a differentiable neural approximation \\(u_\\theta\\), then asks the optimizer to reduce violations of the governing equation, initial conditions, and boundary conditions at sampled points.',
    equation: String.raw`\[
      \mathcal{L}(\theta)
      = \lambda_r\,\mathcal{L}_{\mathrm{PDE}}
      + \lambda_{\mathrm{IC}}\,\mathcal{L}_{\mathrm{IC}}
      + \lambda_{\mathrm{BC}}\,\mathcal{L}_{\mathrm{BC}}
      + \lambda_d\,\mathcal{L}_{\mathrm{data}}.
    \]`,
    papers: [
      {label: 'Raissi et al. (2019)', role: 'Canonical PINN formulation for forward and inverse PDE problems.'}
    ],
    experiments: [
      'Reproduced a repo-faithful acoustic PINN baseline with a verified fine-grid numerical reference.',
      'Audited source, grid, boundary treatment, initial conditions, and evaluation resolution before interpreting failures.'
    ],
    conclusion: 'The loss is only one layer of the numerical problem. Resolution, constraints, sampling, and the reference solver determine what a low training objective actually means.',
    bridge: 'Once the PDE is in the loss, the next question is whether optimization learns the right scales and the right times in the right order.'
  },
  {
    id: 2,
    kicker: 'WEEK 02 · CAUSALITY & SPECTRAL BIAS',
    title: 'Optimization has a geometry in time and frequency.',
    question: 'Why can a PINN minimize residuals and still miss oscillatory or long-time dynamics?',
    intuition: 'Two distinct biases appear. Neural networks often learn low-frequency structure first, while errors in time-dependent PDEs propagate forward even when the objective treats time slices too independently.',
    equation: String.raw`\[
      u(x,t)=\sum_k \widehat{u}_k(t)\,\phi_k(x),
      \qquad
      \mathcal{L}_{\mathrm{causal}}(\theta)
      = \sum_{i=1}^{N_t} w_i(\theta)\,\mathcal{L}_i(\theta).
    \]`,
    papers: [
      {label: 'Wang et al. · causal PINN training', role: 'Temporal ordering inside the optimization objective.'},
      {label: 'Spectral-bias literature', role: 'Why smooth/low-frequency components are often easier for standard neural networks.'}
    ],
    experiments: [
      'Compared matched and Fourier-feature PINNs across physical frequency and independent seeds.',
      'Tested several causal weighting variants and tracked whether they produced a genuine temporal curriculum.'
    ],
    conclusion: 'Neither “more oscillatory features” nor “causal weights” is automatically a cure. At high frequency we observed regime changes, seed sensitivity, and optimization collapse that simple representation changes did not reliably remove.',
    bridge: 'If optimization only sees physics where and how we query it, spatial sampling and boundary treatment become part of the effective model.'
  },
  {
    id: 3,
    kicker: 'WEEK 03 · WAVE PINNS',
    title: 'The computational domain is part of the learning problem.',
    question: 'Can sampling, oscillatory coordinates, or absorbing boundaries rescue wave PINNs when frequency increases?',
    intuition: 'Wave problems expose numerical design choices brutally: where collocation points are placed, how oscillations are represented, and whether the truncated domain reflects energy all change the effective optimization problem.',
    equation: String.raw`\[
      \begin{aligned}
      \mathcal{R}_\theta(x,t)
      &= \partial_{tt}u_\theta-c^2\Delta u_\theta-s(x,t),\\[2mm]
      (x,t)&\sim q_\theta,\\[1mm]
      \mathcal{B}_{\mathrm{ABC}}[u_\theta]&\approx 0
      \quad\text{on }\partial\Omega.
      \end{aligned}
    \]`,
    papers: [
      {label: 'Ding et al. (2025)', role: 'Oscillatory/Fourier-style representation for wave PINNs.'},
      {label: 'Marques et al. (2025)', role: 'Adaptive residual-driven sampling.'},
      {label: 'Higdon / Majda', role: 'Absorbing boundary conditions for outgoing waves.'}
    ],
    experiments: [
      'Doubling uniform collocation from 8k to 16k did not rescue the high-frequency regime.',
      'A sigma sweep and dispersion-aligned Fourier geometry did not produce a clean high-frequency rescue.',
      'Residual-adaptive sampling concentrated about 98% of points near the source and produced wrong trajectories.'
    ],
    conclusion: 'A failure can survive more points and a different encoding. Adaptive sampling can also amplify the wrong signal when residual magnitude is not the same thing as global information value.',
    bridge: 'This motivates a different question: instead of asking the network to discover every piece of numerical structure, which parts should we build into the architecture?'
  },
  {
    id: 4,
    kicker: 'WEEK 04 · NEURAL ODES & NEUSA',
    title: 'Physics moves from the loss into the architecture.',
    question: 'Can we evolve a structured spectral state and learn only the missing part of the dynamics?',
    intuition: 'NeuSA represents the field in a spectral basis, turns known operators into analytical coefficient dynamics, and learns a correction that is integrated through time as a neural ODE.',
    equation: String.raw`\[
      \begin{aligned}
      u_M(t,x)&=\sum_{k=1}^{M} a_k(t)\,\phi_k(x),\\[1mm]
      \dot a &= b,\\
      \dot b &= F_{\mathrm{known}}(a)+F_\theta(a).
      \end{aligned}
    \]`,
    papers: [
      {label: 'Chen et al. (2018)', role: 'Neural Ordinary Differential Equations.'},
      {label: 'NeuSA', role: 'Neuro-spectral architecture with learned coefficient dynamics.'}
    ],
    experiments: [
      'Reproduced the official sine-Gordon configuration to 0.06104% relative error.',
      'Tested linearized analytical structure, local/odd/cubic priors, compute budgets, robustness, parameterized physics, inverse calibration, optimal sensor design, and uncertainty under extrapolation.'
    ],
    conclusion: 'The strongest transfer came from putting the right structure into what the model is allowed to learn. But structured surrogates can still become confidently wrong outside their support, so model validity must be treated as a first-class uncertainty source.',
    bridge: 'The project therefore ends not with “NeuSA works”, but with a sharper question: when can a learned physical surrogate be trusted?'
  }
];
