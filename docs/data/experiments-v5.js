window.SCIML_EXPERIMENTS = [
  {
    "id": "pinn-reproduction",
    "phase": "PINNs",
    "category": "baseline",
    "tone": "blue",
    "title": "Validated acoustic PINN baseline",
    "question": "Before diagnosing a failure, is the numerical harness itself trustworthy?",
    "design": "Repository-faithful acoustic protocol: 8,000 uniform interior points per update, 200 boundary points per spatial face, Higdon-2 boundary, Adam 0.003, 30k updates, and fine-grid numerical reference evaluation.",
    "result": "Reference, source, grid, IC, and evaluation audits were consistent. A development FF-PINN at frequency 10 reached fine-grid relative L2 error ≈ 5.56%, while other seeds still showed instability.",
    "answer": "The harness was not the dominant failure. After the numerical contract was checked, instability remained.",
    "rulesOut": "A simple ground-truth, source-definition, or evaluation-grid bug as the main explanation for the later failures.",
    "limitation": "A validated harness does not make the optimization easy. One successful seed does not certify robust training.",
    "metrics": [
      "30k updates",
      "fine reference verified",
      "seed-dependent regimes"
    ],
    "tags": [
      "PINN",
      "validation",
      "failure"
    ],
    "runtime": "~30,000 optimizer updates + post-training audit.",
    "evaluation": "Global relative L2/L1, prediction/reference norm ratio, cosine similarity, and peak ratio on a fine numerical reference.",
    "achieved": [
      "Validated the numerical contract before interpreting failures.",
      "Established a trusted baseline for all later PINN ablations."
    ],
    "math": "\\[\n\\mathcal L(\theta)=\\lambda_r\\,\\mathcal L_r+\\lambda_{IC}\\,\\mathcal L_{IC}+\\lambda_{BC}\\,\\mathcal L_{BC}+\\lambda_d\\,\\mathcal L_{data}.\n\\]",
    "figures": [
      {
        "kind": "stats",
        "title": "Audit readout",
        "subtitle": "Repository-faithful baseline, frequency 10",
        "items": [
          [
            "Fine rL2",
            "5.56%"
          ],
          [
            "Norm ratio",
            "1.0002"
          ],
          [
            "Cosine",
            "0.9986"
          ],
          [
            "Peak ratio",
            "0.994"
          ]
        ]
      },
      {
        "kind": "note",
        "title": "What this unlocked",
        "text": "Because the numerical harness checked out, later failures could be analyzed as optimization / representation / sampling phenomena rather than bookkeeping bugs."
      }
    ]
  },
  {
    "id": "pinn-seeds-frequency",
    "phase": "PINNs",
    "category": "failure",
    "tone": "purple",
    "title": "Frequency × seed regime map",
    "question": "Is the apparent representation advantage stable across independent seeds?",
    "design": "Matched and Fourier-feature PINNs at frequencies 10 and 20, across seeds 43–45, with the same 30k-update budget and the same evaluation protocol.",
    "result": "At frequency 10 both architectures could either succeed or collapse depending on seed. At frequency 20, matched PINNs consistently failed while FF-PINNs ranged from near-zero solutions to high-energy wrong solutions.",
    "answer": "The development interaction did not replicate cleanly. Optimization regime and seed mattered as much as architecture.",
    "rulesOut": "A simple narrative that Fourier features alone robustly solve the higher-frequency problem.",
    "limitation": "The seed ensemble is still small. This diagnoses instability; it does not estimate a universal success probability.",
    "metrics": [
      "4 cells × 3 seeds",
      "frequency 10 / 20",
      "multiple optimization regimes"
    ],
    "tags": [
      "PINN",
      "frequency",
      "seeds",
      "failure"
    ],
    "runtime": "12 controlled long runs (4 representation/frequency cells × 3 seeds) at 30k updates each.",
    "evaluation": "Fine-grid relative error, qualitative field behavior, and comparison across the full representation × frequency matrix.",
    "achieved": [
      "Showed that stability is a regime question, not just an architecture question.",
      "Motivated mechanism-driven follow-up experiments instead of single-seed claims."
    ],
    "math": "\\[\nA_f = \\log\\!\\left(\frac{E_{\\mathrm{matched}}(f)}{E_{\\mathrm{FF}}(f)}\right),\\qquad I=A_{20}-A_{10}.\n\\]",
    "figures": [
      {
        "kind": "stats",
        "title": "Controlled matrix",
        "subtitle": "Same budget, only representation and physical frequency vary",
        "items": [
          [
            "Cells",
            "4"
          ],
          [
            "Seeds / cell",
            "3"
          ],
          [
            "Low freq",
            "10 Hz"
          ],
          [
            "High freq",
            "20 Hz"
          ]
        ]
      },
      {
        "kind": "bars",
        "title": "Interpretation",
        "subtitle": "Conceptual readout of the matrix",
        "labels": [
          "clean robust gain",
          "seed-sensitive gain",
          "collapse / wrong regime"
        ],
        "values": [
          0,
          2,
          2
        ],
        "suffix": " cells",
        "colors": [
          "#4ce1b6",
          "#a892ff",
          "#ff7285"
        ]
      }
    ]
  },
  {
    "id": "pinn-more-points",
    "phase": "PINNs",
    "category": "sampling",
    "tone": "amber",
    "title": "More collocation did not rescue frequency 20",
    "question": "Is the high-frequency failure mainly a shortage of uniformly sampled residual points?",
    "design": "Increase uniform interior collocation from 8k to 16k at frequency 20 while keeping the rest of the protocol fixed.",
    "result": "No clean rescue was observed after doubling the interior collocation count.",
    "answer": "Simple uniform point scarcity is unlikely to be the dominant bottleneck in the tested regime.",
    "rulesOut": "“Just double the collocation set” as a sufficient explanation or remedy.",
    "limitation": "This does not rule out smarter nonuniform designs, curriculum schedules, or larger optimization budgets.",
    "metrics": [
      "8k → 16k",
      "same target frequency",
      "no clean rescue"
    ],
    "tags": [
      "PINN",
      "sampling",
      "negative result"
    ],
    "runtime": "A controlled rerun of the 20 Hz protocol with doubled interior points.",
    "evaluation": "Same fine-grid metrics as the baseline, compared under a single-factor intervention.",
    "achieved": [
      "Separated point-count scarcity from deeper representation/optimization issues.",
      "Justified moving from quantity-of-points to geometry-of-points questions."
    ],
    "math": "\\[\nN_{\\mathrm{int}}: 8000 \\;\\longrightarrow\\; 16000.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Single-factor intervention",
        "subtitle": "Only the interior collocation count changed",
        "labels": [
          "baseline",
          "point-doubled"
        ],
        "values": [
          8000,
          16000
        ],
        "suffix": " pts",
        "colors": [
          "#7ca7ff",
          "#ffb25b"
        ]
      },
      {
        "kind": "note",
        "title": "Takeaway",
        "text": "The failure survived a 2× increase in uniform interior sampling, so the bottleneck is not well explained by simple residual-point scarcity."
      }
    ]
  },
  {
    "id": "pinn-adaptive",
    "phase": "PINNs",
    "category": "sampling",
    "tone": "red",
    "title": "Adaptive sampling over-focused on the source",
    "question": "Does residual-driven adaptive sampling place points where they are globally most informative?",
    "design": "Residual-adaptive wave PINN under the same physical problem and numerical reference, inspecting where the adaptive sampler actually spends its budget.",
    "result": "About 98% of the adaptive points concentrated in the source box (roughly 490× enrichment), while the learned trajectory remained wrong.",
    "answer": "Large residual is not the same thing as global information value. The sampler can amplify a local difficulty and starve the rest of the domain.",
    "rulesOut": "The assumption that residual-based concentration automatically provides a useful curriculum for this wave problem.",
    "limitation": "This diagnoses one adaptive mechanism; it does not rule out diversity constraints, importance correction, or alternative acquisition functions.",
    "metrics": [
      "≈98% in source box",
      "≈490× enrichment",
      "wrong trajectory"
    ],
    "tags": [
      "PINN",
      "adaptive sampling",
      "failure"
    ],
    "runtime": "Adaptive training run + spatial audit of the learned sampling distribution.",
    "evaluation": "Spatial concentration of samples, qualitative trajectory behavior, and comparison between local residual magnitude and global predictive value.",
    "achieved": [
      "Exposed a concrete failure mode of naive residual-adaptive sampling.",
      "Connected the diagnosis to a geometric notion of information rather than error alone."
    ],
    "math": "\\[\n\text{adaptive score} \\propto |R_\theta(x,t)|.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Where the sampler spent its budget",
        "subtitle": "Spatial concentration of adaptive residual points",
        "labels": [
          "source box",
          "rest of domain"
        ],
        "values": [
          98,
          2
        ],
        "suffix": "%",
        "colors": [
          "#ff7285",
          "#4ce1b6"
        ]
      },
      {
        "kind": "stats",
        "title": "Consequence",
        "items": [
          [
            "Enrichment",
            "≈490×"
          ],
          [
            "Trajectory",
            "wrong"
          ],
          [
            "Mechanism",
            "local over-focus"
          ],
          [
            "Diagnosis",
            "negative result"
          ]
        ]
      }
    ]
  },
  {
    "id": "neusa-official",
    "phase": "NeuSA",
    "category": "reproduction",
    "tone": "green",
    "title": "Official NeuSA reproduction",
    "question": "Can the official sine-Gordon configuration be reproduced before modifying the architecture?",
    "design": "201 spectral modes/time samples, T=3, width 804, 1000 Adam steps at lr 0.02, and TorchDyn RK4 exactly following the official configuration.",
    "result": "Relative L2 error reached 0.06104% in about 22.5 minutes. Temporal refinement reduced discretization error until model error dominated.",
    "answer": "Yes. This became the trusted reference point for every later architectural or scientific adaptation.",
    "rulesOut": "Building conclusions on an unverified or non-faithful reimplementation.",
    "limitation": "A successful official configuration does not imply robustness to new trajectories, new physics, or inverse tasks.",
    "metrics": [
      "0.06104% rL2",
      "201 modes",
      "1000 steps"
    ],
    "tags": [
      "NeuSA",
      "reproduction",
      "reference"
    ],
    "runtime": "≈22.5 minutes for the reproduced training run, plus refinement checks.",
    "evaluation": "Relative L2 error against refined spectral references together with temporal and spatial refinement checks.",
    "achieved": [
      "Anchored the rest of the NeuSA work on a reproducible reference implementation.",
      "Separated reproduction from later scientific modifications."
    ],
    "math": "\\[\n\text{relative error}=\frac{\\|u_{\theta}-u_{\\mathrm{ref}}\\|_2}{\\|u_{\\mathrm{ref}}\\|_2}.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Official reproduction snapshot",
        "subtitle": "Stored summary statistics",
        "labels": [
          "relative L2 error",
          "modes",
          "training steps"
        ],
        "values": [
          0.06104,
          201,
          1000
        ],
        "colors": [
          "#4ce1b6",
          "#7ca7ff",
          "#a892ff"
        ]
      },
      {
        "kind": "stats",
        "title": "Run metadata",
        "items": [
          [
            "Wall time",
            "≈22.5 min"
          ],
          [
            "Integrator",
            "TorchDyn RK4"
          ],
          [
            "Domain",
            "sine-Gordon"
          ],
          [
            "Status",
            "reproduced"
          ]
        ]
      }
    ]
  },
  {
    "id": "neusa-linearized",
    "phase": "NeuSA",
    "category": "structure",
    "tone": "green",
    "title": "Analytical linearization improved the learned dynamics",
    "question": "What happens if the known linear part of the sine-Gordon dynamics is removed from the neural correction?",
    "design": "Compare the base learned dynamics with a structured system a′=b, b′=−(Ω²+10I)a+0.1N(a), over seeds 42–44.",
    "result": "Mean training-interval relative error improved from 0.01254% to 0.004787%, about a 61.8% reduction, for roughly 4.5% extra training time.",
    "answer": "Known physics can reduce the burden placed on the neural component.",
    "rulesOut": "The idea that maximum neural flexibility is necessarily the best use of model capacity.",
    "limitation": "Better in-window fit still did not predict transfer, which is why the locality study became necessary.",
    "metrics": [
      "61.8% lower mean error",
      "3 seeds",
      "≈4.5% time overhead"
    ],
    "tags": [
      "NeuSA",
      "structure",
      "ablation"
    ],
    "runtime": "Three matched-seed trainings; structured model cost ≈4.5% more wall time.",
    "evaluation": "Relative error on the training interval, matched seed comparison, and time-cost accounting.",
    "achieved": [
      "Turned known linear physics into a measurable reduction of neural burden.",
      "Motivated the larger claim that structure can matter more than flexibility."
    ],
    "math": "\\[\na^{\\prime}=b,\\qquad b^{\\prime}=-(\\Omega^2+10I)a+0.1\\,N(a).\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Mean training-interval error",
        "subtitle": "Matched seed comparison",
        "labels": [
          "base model",
          "linearized structure"
        ],
        "values": [
          0.01254,
          0.004787
        ],
        "suffix": "%",
        "colors": [
          "#7ca7ff",
          "#4ce1b6"
        ]
      },
      {
        "kind": "stats",
        "title": "Trade-off",
        "items": [
          [
            "Error reduction",
            "61.8%"
          ],
          [
            "Seeds",
            "3"
          ],
          [
            "Time overhead",
            "≈4.5%"
          ],
          [
            "Interpretation",
            "physics helps"
          ]
        ]
      }
    ]
  },
  {
    "id": "neusa-local-cubic",
    "phase": "NeuSA",
    "category": "structure",
    "tone": "cyan",
    "title": "A 1,153-parameter cubic local law transferred dramatically better",
    "question": "Can a much smaller local correction with odd+cubic structure beat an expressive global coefficient map out of trajectory distribution?",
    "design": "Global linearized model (474,921 NN parameters) vs local free and local cubic corrections (1,153 parameters), trained on [0,1] and tested through T=5 on multiple shifted, wider, sign-flipped, higher-amplitude, and double-pulse initial conditions.",
    "result": "Mean late-interval errors for the cubic model stayed around 0.57–1.35% across the six tests, while the global model ranged around 19.9–44.4%.",
    "answer": "The right structural prior bought far more transfer than raw expressivity.",
    "rulesOut": "Using training fit or parameter count as a proxy for transferable dynamics.",
    "limitation": "The cubic law was not globally correct for large |u|; its success was concentrated on the states actually visited by the test trajectories.",
    "metrics": [
      "1,153 NN params",
      "≈412× smaller",
      "late error <~1.8%"
    ],
    "tags": [
      "NeuSA",
      "structure",
      "transfer"
    ],
    "runtime": "Matched training/evaluation suite across multiple held-out trajectories and seeds.",
    "evaluation": "Relative error on [0,1], (1,3], and (3,5], with explicit out-of-trajectory transfer tests.",
    "achieved": [
      "Made transfer, not in-window fit, the central model-selection criterion.",
      "Showed that the right prior can dominate raw model size by orders of magnitude."
    ],
    "math": "\\[\nr_{\\mathrm{cubic}}(u)=\frac{10}{6}u^3\\,(1+z)^{-1}q\\!\\left(\frac{z}{1+z}\right),\\qquad z=(u/4)^2.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Parameter economy",
        "subtitle": "Model size comparison",
        "labels": [
          "global model",
          "local cubic"
        ],
        "values": [
          474921,
          1153
        ],
        "colors": [
          "#ff7285",
          "#4ce1b6"
        ]
      },
      {
        "kind": "stats",
        "title": "Transfer snapshot",
        "items": [
          [
            "Cubic late error",
            "0.57–1.35%"
          ],
          [
            "Global late error",
            "19.9–44.4%"
          ],
          [
            "Compression",
            "≈412× smaller"
          ],
          [
            "Claim",
            "structure > size"
          ]
        ]
      }
    ]
  },
  {
    "id": "neusa-odd",
    "phase": "NeuSA",
    "category": "structure",
    "tone": "purple",
    "title": "Odd symmetry helped; cubic near-zero structure helped much more",
    "question": "Is odd symmetry alone enough to explain the transfer advantage?",
    "design": "Compare local free, exact-odd, and cubic corrections on new held-out initial conditions, across seeds 42–44.",
    "result": "Cubic beat free 9/9 and odd 9/9. Odd beat free 7/9. Mean (1,3] errors were about 8.08% free, 5.58% odd, and 0.575% cubic.",
    "answer": "Symmetry is useful but insufficient; the near-zero cubic prior was the dominant structural ingredient.",
    "rulesOut": "Attributing the transfer gain to odd symmetry alone.",
    "limitation": "The prior is problem-informed and should not be assumed appropriate for unrelated nonlinearities.",
    "metrics": [
      "cubic wins 18/18 key comparisons",
      "odd helps 7/9",
      "held-out ICs"
    ],
    "tags": [
      "NeuSA",
      "symmetry",
      "ablation"
    ],
    "runtime": "Three new local-odd trainings (≈4 minutes each on CPU) plus evaluation against reused free/cubic baselines.",
    "evaluation": "Primary metric: relative L2 on (1,3], with auxiliary checks on [0,1], (3,5], energy drift, and force-error diagnostics.",
    "achieved": [
      "Isolated what odd symmetry explains and what it does not.",
      "Identified cubic near-zero behavior as the key structural ingredient."
    ],
    "math": "\\[\nr_{\\mathrm{odd}}(u)=5\\,[q(u/4)-q(-u/4)],\\qquad r_{\\mathrm{cubic}}(u)\\sim c\\,u^3\\;\text{near }0.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Mean late error on held-out ICs",
        "subtitle": "Primary metric: relative L2 on (1,3]",
        "labels": [
          "free",
          "odd",
          "cubic"
        ],
        "values": [
          8.08,
          5.58,
          0.575
        ],
        "suffix": "%",
        "colors": [
          "#ff7285",
          "#a892ff",
          "#4ce1b6"
        ]
      },
      {
        "kind": "stats",
        "title": "Paired wins",
        "items": [
          [
            "Cubic vs free",
            "9/9"
          ],
          [
            "Cubic vs odd",
            "9/9"
          ],
          [
            "Odd vs free",
            "7/9"
          ],
          [
            "Conclusion",
            "symmetry helps, cubic dominates"
          ]
        ]
      }
    ]
  },
  {
    "id": "neusa-compute",
    "phase": "NeuSA",
    "category": "compute",
    "tone": "amber",
    "title": "More trajectories and compute did not substitute for structure",
    "question": "Can diversity plus a larger optimization budget erase the advantage of the cubic prior?",
    "design": "Single-trajectory 500-update models vs multi-trajectory 500/1000/1500-update continuations for free, odd, and cubic structures.",
    "result": "At equal 500-update total budget, multi-trajectory training worsened all 9 paired comparisons for every prior. By 1500 updates, odd improved strongly, free modestly, while cubic was already near saturation.",
    "answer": "Extra compute helped partially structured models, but the structural prior remained far more compute-efficient.",
    "rulesOut": "The idea that the cubic result was simply an unfair consequence of seeing an easier training trajectory.",
    "limitation": "The comparison is tied to the chosen deterministic trajectory cycle and optimizer schedule.",
    "metrics": [
      "500→1500 updates",
      "odd: ~61% improvement",
      "cubic near saturation"
    ],
    "tags": [
      "NeuSA",
      "compute",
      "data diversity"
    ],
    "runtime": "Continuation experiment reusing existing checkpoints at 500 updates and extending them to 1000 and 1500.",
    "evaluation": "Held-out error comparisons at fixed compute budgets and along a compute frontier.",
    "achieved": [
      "Showed that structure and compute are not interchangeable resources.",
      "Converted the discussion into a sample/compute-efficiency argument."
    ],
    "math": "\\[\n\text{equal-budget comparison: }500\text{ updates total},\\qquad \text{frontier comparison: }500\to1500.\n\\]",
    "figures": [
      {
        "kind": "stats",
        "title": "Budget frontier",
        "items": [
          [
            "Equal-budget verdict",
            "multi loses 9/9"
          ],
          [
            "Extended budgets",
            "1000, 1500"
          ],
          [
            "Odd",
            "improves with compute"
          ],
          [
            "Cubic",
            "near saturation"
          ]
        ]
      },
      {
        "kind": "bars",
        "title": "Compute ladder",
        "subtitle": "Total update budgets compared",
        "labels": [
          "500",
          "1000",
          "1500"
        ],
        "values": [
          500,
          1000,
          1500
        ],
        "suffix": " upd",
        "colors": [
          "#ffb25b",
          "#a892ff",
          "#4ce1b6"
        ]
      }
    ]
  },
  {
    "id": "neusa-robustness",
    "phase": "NeuSA",
    "category": "robustness",
    "tone": "cyan",
    "title": "Robustness atlas exposed tail risk",
    "question": "Do mean errors hide catastrophic trajectories?",
    "design": "A 64-random-IC screen followed by 12 adversarial/stress cases through T=10, with multiple seeds, refined references, and integration audits.",
    "result": "In (5,10], cubic models had q90 around 4.2% and max around 6.3%, while free models had much larger mean/tail errors and odd models sat between them.",
    "answer": "The structural prior controlled not only the mean but also the long-horizon tail of the error distribution.",
    "rulesOut": "Averages alone as sufficient evidence of robust learned dynamics.",
    "limitation": "Stress cases were selected after a screen, so they are adversarial diagnostics rather than independent population estimates.",
    "metrics": [
      "64-case screen",
      "12 stress cases",
      "T=10"
    ],
    "tags": [
      "NeuSA",
      "robustness",
      "tail risk"
    ],
    "runtime": "Screening stage plus long-horizon evaluation through T=10 on curated stress trajectories.",
    "evaluation": "Mean, q90, and max relative errors under long-horizon stress testing.",
    "achieved": [
      "Made tail behavior visible instead of hiding it in means.",
      "Connected robustness to long-horizon failure modes."
    ],
    "math": "\\[\n\text{tail diagnostics: }\\{\text{mean},\\;q_{90},\\;\\max\\}.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Cubic tail summary on (5,10]",
        "subtitle": "Stress-test distribution summary",
        "labels": [
          "mean-ish",
          "q90",
          "max"
        ],
        "values": [
          3.1,
          4.2,
          6.3
        ],
        "suffix": "%",
        "colors": [
          "#7ca7ff",
          "#4ce1b6",
          "#ff7285"
        ]
      },
      {
        "kind": "stats",
        "title": "Test breadth",
        "items": [
          [
            "Random screen",
            "64 ICs"
          ],
          [
            "Stress suite",
            "12 cases"
          ],
          [
            "Horizon",
            "T=10"
          ],
          [
            "Use",
            "tail-risk diagnosis"
          ]
        ]
      }
    ]
  },
  {
    "id": "parametric-neusa",
    "phase": "NeuSA",
    "category": "generalization",
    "tone": "green",
    "title": "One surrogate learned a family of physical coefficients",
    "question": "Can a single structured model generalize simultaneously across unseen initial conditions and an unseen PDE coefficient μ?",
    "design": "Train on μ∈{5, 7.5, 10, 12.5, 15}; test unseen interpolation μ∈{6.25, 8.75, 11.25, 13.75} and extrapolation μ∈{3.75, 16.25}, across three initial conditions and three seeds.",
    "result": "Cubic mean late error was about 1.33% on unseen interpolation and 3.00% on extrapolation. Mean μ-recovery error from force projection was about 0.044 in interpolation and 0.091 in extrapolation.",
    "answer": "The structured surrogate learned a useful parametric family, with a clear asymmetry at the upper extrapolation edge.",
    "rulesOut": "The transfer result being limited to a single fixed PDE coefficient.",
    "limitation": "Upper extrapolation was substantially harder, foreshadowing later model-discrepancy failures.",
    "metrics": [
      "5 training μ values",
      "4 unseen interpolation μ",
      "2 extrapolation μ"
    ],
    "tags": [
      "NeuSA",
      "parameterized PDE",
      "generalization"
    ],
    "runtime": "Parametric training across five μ values, followed by held-out interpolation and extrapolation evaluation.",
    "evaluation": "Late-interval forward error and μ-recovery error, separated into interpolation and extrapolation regimes.",
    "achieved": [
      "Showed the surrogate can encode a family of PDEs, not just one coefficient.",
      "Created the foundation for inverse calibration and UQ experiments."
    ],
    "math": "\\[\n\\mu \\in \\{5,7.5,10,12.5,15\\}\\;\text{train},\\qquad \\mu_{\\mathrm{test}}\\in\\{6.25,8.75,11.25,13.75,3.75,16.25\\}.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Forward generalization",
        "subtitle": "Mean late error",
        "labels": [
          "interpolation",
          "extrapolation"
        ],
        "values": [
          1.33,
          3.0
        ],
        "suffix": "%",
        "colors": [
          "#4ce1b6",
          "#ffb25b"
        ]
      },
      {
        "kind": "bars",
        "title": "Parameter recovery",
        "subtitle": "Mean |μ̂−μ| from force projection",
        "labels": [
          "interpolation",
          "extrapolation"
        ],
        "values": [
          0.044,
          0.091
        ],
        "colors": [
          "#7ca7ff",
          "#a892ff"
        ]
      }
    ]
  },
  {
    "id": "inverse-calibration",
    "phase": "Inverse",
    "category": "inverse",
    "tone": "blue",
    "title": "Sparse early measurements recovered hidden physics",
    "question": "Can we infer μ from sparse observations at t≤1 and then improve future prediction with the frozen surrogate?",
    "design": "4 hidden μ values × 3 held-out ICs × 3 observation regimes × 3 seeds = 108 inverse problems. Only the scalar μ is optimized; all neural weights stay frozen.",
    "result": "For unseen interpolation, sparse noisy observations gave mean |μ̂−μ|≈0.075 and mean (3,5] forecast error 2.35%, versus 78.89% for the same surrogate fixed at μ=10. Calibration improved the baseline in 108/108 problems.",
    "answer": "A structured parametric surrogate can turn a handful of early observations into useful physical calibration and downstream forecasting.",
    "rulesOut": "The parametric surrogate being useful only as a forward interpolator.",
    "limitation": "Observations are synthetic and generated by a numerical reference; this is controlled system identification, not real-data inference.",
    "metrics": [
      "108 inverse problems",
      "2% noise scenarios",
      "108/108 beat baseline"
    ],
    "tags": [
      "inverse problem",
      "calibration",
      "forecast"
    ],
    "runtime": "108 inverse solves with frozen NN weights and scalar-only calibration.",
    "evaluation": "Parameter recovery |μ̂−μ|, future forecast error on (3,5], and baseline comparison against a frozen μ=10 surrogate.",
    "achieved": [
      "Connected forward generalization to inverse calibration.",
      "Showed that very sparse data can materially improve downstream prediction."
    ],
    "math": "\\[\n\\hat\\mu = \u0007rg\\min_{\\mu}\\,\\sum_{(x_i,t_i)}\big(u_\theta(x_i,t_i;\\mu)-y_i\big)^2.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Forecast after calibration",
        "subtitle": "Mean (3,5] forecast error",
        "labels": [
          "calibrated μ",
          "fixed μ=10"
        ],
        "values": [
          2.35,
          78.89
        ],
        "suffix": "%",
        "colors": [
          "#4ce1b6",
          "#ff7285"
        ]
      },
      {
        "kind": "stats",
        "title": "Inverse summary",
        "items": [
          [
            "Inverse problems",
            "108"
          ],
          [
            "Mean |μ̂−μ|",
            "0.075"
          ],
          [
            "Noise",
            "2% scenarios"
          ],
          [
            "Win rate",
            "108/108"
          ]
        ]
      }
    ]
  },
  {
    "id": "sensor-design",
    "phase": "UQ",
    "category": "design",
    "tone": "cyan",
    "title": "Fisher information moved the sensors",
    "question": "Can the surrogate itself tell us where 12 measurements should be taken to identify μ more efficiently?",
    "design": "Search 3-sensor × 4-time Cartesian layouts using only training μ values and training ICs. Compare fixed, Fisher-optimal, and frozen random layouts on hidden test μ/ICs.",
    "result": "Fisher chose x={−0.6,0,0.6} and later times {0.625,0.75,0.875,1}. In interpolation, mean |μ̂−μ| fell from 0.0738 fixed to 0.0495 Fisher with the same 12 observations.",
    "answer": "Physics-aware sensor placement improved identification and forecast without collecting more data.",
    "rulesOut": "Treating measurement placement as irrelevant once the observation count is fixed.",
    "limitation": "The design criterion is local and model-based, so it can become overconfident when the surrogate itself is wrong.",
    "metrics": [
      "same 12 observations",
      "~33% lower mean μ error vs fixed",
      "design uses training support only"
    ],
    "tags": [
      "sensor design",
      "Fisher information",
      "inverse"
    ],
    "runtime": "Grid search over 3×4 sensor-time layouts on training support, followed by hidden-set evaluation.",
    "evaluation": "Mean |μ̂−μ| and downstream forecast accuracy under fixed, random, and Fisher-optimal layouts.",
    "achieved": [
      "Showed that model-based experiment design can improve inference without more data.",
      "Created the setup later used to study UQ failure under extrapolation."
    ],
    "math": "\\[\n\\mathcal I(\\mu) = J(\\mu)^\top \\Sigma^{-1}J(\\mu),\\qquad \text{maximize a scalar summary of }\\mathcal I.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Identification error by layout",
        "subtitle": "Mean |μ̂−μ| in interpolation",
        "labels": [
          "fixed",
          "Fisher"
        ],
        "values": [
          0.0738,
          0.0495
        ],
        "colors": [
          "#7ca7ff",
          "#4ce1b6"
        ]
      },
      {
        "kind": "stats",
        "title": "Designed layout",
        "items": [
          [
            "Sensors",
            "x={−0.6,0,0.6}"
          ],
          [
            "Times",
            "0.625,0.75,0.875,1"
          ],
          [
            "Observation count",
            "12"
          ],
          [
            "Gain",
            "≈33% lower μ error"
          ]
        ]
      }
    ]
  },
  {
    "id": "uq-failure",
    "phase": "UQ",
    "category": "failure",
    "tone": "red",
    "title": "Local Fisher UQ became confidently wrong in extrapolation",
    "question": "Does high measurement information imply trustworthy parameter uncertainty outside the surrogate training range?",
    "design": "Use the same inverse problems with local Fisher/Laplace intervals and compare interpolation against extrapolation.",
    "result": "In extrapolation, nominal 90% intervals had 0% empirical coverage for both fixed and Fisher layouts, even though Fisher intervals were the narrowest.",
    "answer": "No. Measurement uncertainty and model-form uncertainty are different objects.",
    "rulesOut": "Using local sensitivity alone as a certificate of surrogate validity.",
    "limitation": "The intervals were intentionally local Gaussian approximations, not exact Bayesian posteriors.",
    "metrics": [
      "90% nominal",
      "0% coverage",
      "narrow but invalid intervals"
    ],
    "tags": [
      "UQ",
      "model discrepancy",
      "failure"
    ],
    "runtime": "Post-calibration uncertainty study using local Fisher/Laplace approximations on the existing inverse suite.",
    "evaluation": "Empirical coverage of nominal 90% intervals, compared across interpolation and extrapolation regimes.",
    "achieved": [
      "Drew a sharp line between data-information and model-validity uncertainty.",
      "Created the motivation for discrepancy-aware repair."
    ],
    "math": "\\[\n\\mu\\mid y \u0007pprox \\mathcal N\\!\\left(\\hat\\mu,\\,\\mathcal I(\\hat\\mu)^{-1}\right).\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Nominal 90% coverage in extrapolation",
        "subtitle": "Empirical coverage of local intervals",
        "labels": [
          "fixed layout",
          "Fisher layout"
        ],
        "values": [
          0,
          0
        ],
        "suffix": "%",
        "colors": [
          "#7ca7ff",
          "#ff7285"
        ]
      },
      {
        "kind": "note",
        "title": "Why it matters",
        "text": "The intervals were informative about local curvature of the surrogate likelihood, but not about whether the surrogate itself was still a faithful model in extrapolation."
      }
    ]
  },
  {
    "id": "discrepancy-repair",
    "phase": "UQ",
    "category": "uq",
    "tone": "green",
    "title": "Discrepancy-aware UQ repaired much of the extrapolation failure",
    "question": "Can a simple model-discrepancy correction learned at old extrapolation points transfer to completely fresh coefficients?",
    "design": "Fit side-specific shrinkage/discrepancy only at μ=3.75 and 16.25, freeze it, and test on fresh μ={4.25,15.75,3.25,16.75} over 108 inverse problems.",
    "result": "Correction won 81/108 parameter-error comparisons and 76/108 forecasts. For far-extrapolation Fisher cases, mean forecast error fell 19.87%→7.89% and coverage rose 0%→77.8%; seed-ensemble coverage reached 83.3%.",
    "answer": "Explicit surrogate discrepancy can repair catastrophic undercoverage and improve downstream prediction, though not uniformly.",
    "rulesOut": "The original 0% coverage being inevitable once the surrogate extrapolates.",
    "limitation": "Coverage remained below nominal in some regimes and the discrepancy law is deliberately simple.",
    "metrics": [
      "81/108 μ wins",
      "76/108 forecast wins",
      "0%→77.8% coverage"
    ],
    "tags": [
      "UQ",
      "fresh test",
      "model discrepancy"
    ],
    "runtime": "Train discrepancy correction only on old extrapolation points, then evaluate 108 fresh inverse problems.",
    "evaluation": "Parameter error, forecast error, and empirical coverage, all computed on fresh μ values outside the correction-fitting set.",
    "achieved": [
      "Converted a qualitative UQ failure into a quantitatively repairable one.",
      "Demonstrated out-of-sample value of explicit discrepancy modeling."
    ],
    "math": "\\[\n\tilde\\mu = a_\\pm\\,\\hat\\mu + b_\\pm,\\qquad \text{with side-specific discrepancy calibration}.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Far-extrapolation forecast error",
        "subtitle": "Fisher layout, mean (3,5] error",
        "labels": [
          "naive UQ",
          "discrepancy-aware"
        ],
        "values": [
          19.87,
          7.89
        ],
        "suffix": "%",
        "colors": [
          "#ff7285",
          "#4ce1b6"
        ]
      },
      {
        "kind": "bars",
        "title": "Far-extrapolation 90% coverage",
        "subtitle": "Empirical coverage",
        "labels": [
          "naive UQ",
          "corrected UQ"
        ],
        "values": [
          0,
          77.8
        ],
        "suffix": "%",
        "colors": [
          "#ff7285",
          "#4ce1b6"
        ]
      }
    ]
  },
  {
    "id": "pseudo-true",
    "phase": "UQ",
    "category": "mechanism",
    "tone": "purple",
    "title": "Physical truth and predictive truth can separate",
    "question": "Why can a parameter estimate move closer to μtrue while the forecast gets worse?",
    "design": "For all 36 fresh Fisher-layout tasks, sweep candidate μ over [2.5,17.5] and separately locate the clean-observation optimum and the future-forecast pseudo-true μ.",
    "result": "The separation was concentrated on upper extrapolation. At μtrue=16.75, mean forecast error was 6.40% at the physical μ but 2.60% at the forecast pseudo-true μ≈16.57. Two near-extrapolation tasks displayed the full compensation mechanism explicitly.",
    "answer": "Under surrogate misspecification, μ^†_{obs}, μ^†_{forecast}, and μtrue need not coincide. A biased parameter can partially compensate for model error.",
    "rulesOut": "Interpreting every predictive improvement as better physical parameter recovery.",
    "limitation": "Phase 8 is a mechanistic diagnostic motivated by Phase 7, not a new blinded confirmatory test.",
    "metrics": [
      "36 diagnostic sweeps",
      "upper-side asymmetry",
      "2 full mechanism cases"
    ],
    "tags": [
      "pseudo-true parameter",
      "misspecification",
      "mechanism"
    ],
    "runtime": "36 dense diagnostic sweeps of candidate μ values on the fresh Fisher-layout tasks.",
    "evaluation": "Comparison of μtrue, observation-optimal μ, and forecast-optimal pseudo-true μ, with explicit mechanism flags.",
    "achieved": [
      "Explained why “better parameter fit” and “better forecast” can disagree.",
      "Added a mechanistic language for compensation under misspecification."
    ],
    "math": "\\[\n\\mu^{\\dagger}_{\\mathrm{obs}}\neq \\mu^{\\dagger}_{\\mathrm{forecast}}\neq \\mu_{\\mathrm{true}}\\quad\text{is possible under model misspecification}.\n\\]",
    "figures": [
      {
        "kind": "bars",
        "title": "Upper extrapolation example",
        "subtitle": "Mean forecast error at μtrue vs forecast pseudo-true μ",
        "labels": [
          "at μtrue=16.75",
          "at μ^†_{forecast}≈16.57"
        ],
        "values": [
          6.403,
          2.596
        ],
        "suffix": "%",
        "colors": [
          "#ff7285",
          "#4ce1b6"
        ]
      },
      {
        "kind": "stats",
        "title": "Diagnostic summary",
        "items": [
          [
            "Tasks",
            "36"
          ],
          [
            "Near-side mechanism cases",
            "2"
          ],
          [
            "Far-side parameter wins",
            "18/18"
          ],
          [
            "Interpretation",
            "compensation is real"
          ]
        ]
      }
    ]
  }
];
