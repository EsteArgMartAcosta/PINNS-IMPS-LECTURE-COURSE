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
    "runtime": "78.6 min for the full 30,000-update reproduction (0.157 s/update) + post-training audits.",
    "evaluation": "Fine common reference; global relative L2/L1, cosine similarity, prediction/reference norm ratio, peak ratio, and early/middle/late errors.",
    "achieved": [
      "Validated the repository-faithful acoustic numerical contract before interpreting failures.",
      "Established the trusted evaluation harness reused by later PINN ablations."
    ],
    "math": "\\[\n\\mathcal L(\theta)=\\lambda_r\\,\\mathcal L_r+\\lambda_{IC}\\,\\mathcal L_{IC}+\\lambda_{BC}\\,\\mathcal L_{BC}+\\lambda_d\\,\\mathcal L_{data}.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Convergence of relative L2 error",
        "src": "./assets/evidence/pinn_checkpoint_relative_l2.png",
        "caption": "Recorded checkpoint trajectory from the frozen PINN study."
      },
      {
        "kind": "image",
        "title": "Checkpoint cosine similarity",
        "src": "./assets/evidence/pinn_checkpoint_cosine.png",
        "caption": "Alignment with the numerical reference across checkpoints."
      },
      {
        "kind": "table",
        "title": "Development baseline snapshot",
        "subtitle": "",
        "columns": [
          "metric",
          "value"
        ],
        "rows": [
          [
            "fine rL2",
            "5.57%"
          ],
          [
            "cosine",
            "0.9986"
          ],
          [
            "norm ratio",
            "1.00018"
          ],
          [
            "peak ratio",
            "0.9940"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Baseline metrics",
        "href": "./assets/evidence/raw/pinn_baseline_metrics.json"
      },
      {
        "label": "Development matrix",
        "href": "./assets/evidence/raw/pinn_development_matrix.json"
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
    "runtime": "≈15.44 h of training across the 12 held-out-seed runs (4 cells × 3 seeds, 30k updates each).",
    "evaluation": "Fine common reference; seed-level final relative L2, cosine similarity, amplitude/norm diagnostics, and post-hoc optimization-regime labels.",
    "achieved": [
      "Showed that stability is a regime question, not just an architecture question.",
      "Motivated mechanism-driven follow-up experiments instead of single-seed claims."
    ],
    "math": "\\[\nA_f = \\log\\!\\left(\frac{E_{\\mathrm{matched}}(f)}{E_{\\mathrm{FF}}(f)}\right),\\qquad I=A_{20}-A_{10}.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Seed-level final relative L2",
        "src": "./assets/evidence/pinn_seed_level_relative_l2.png",
        "caption": "Every held-out seed remains visible; means are not allowed to hide regime changes."
      },
      {
        "kind": "image",
        "title": "Alignment vs amplitude",
        "src": "./assets/evidence/pinn_alignment_vs_amplitude.png",
        "caption": "Cosine alignment and amplitude behavior distinguish near-zero collapse from high-energy wrong solutions."
      },
      {
        "kind": "image",
        "title": "Early / middle / late error",
        "src": "./assets/evidence/pinn_early_middle_late.png",
        "caption": "Temporal thirds reveal when the learned field departs from the reference."
      },
      {
        "kind": "table",
        "title": "Held-out seed relative L2",
        "subtitle": "",
        "columns": [
          "cell",
          "seed 43",
          "seed 44",
          "seed 45"
        ],
        "rows": [
          [
            "matched / 10 Hz",
            "0.1250",
            "1.0001",
            "1.0000"
          ],
          [
            "FF / 10 Hz",
            "0.9996",
            "0.8704",
            "0.1021"
          ],
          [
            "matched / 20 Hz",
            "0.9997",
            "0.9999",
            "1.0091"
          ],
          [
            "FF / 20 Hz",
            "0.9835",
            "1.0003",
            "4.3284"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Confirmatory summary",
        "href": "./assets/evidence/raw/pinn_confirmatory_summary.json"
      },
      {
        "label": "Optimization regimes",
        "href": "./assets/evidence/raw/pinn_optimization_regimes.json"
      }
    ]
  },
  {
    "id": "pinn-sigma-sweep",
    "phase": "PINNs",
    "category": "representation",
    "tone": "blue",
    "title": "Fourier bandwidth sweep did not rescue 20 Hz",
    "question": "Was the 20 Hz failure simply caused by a Fourier feature bandwidth that was too narrow?",
    "design": "At 20 Hz and seed 5555, keep the validated FF-PINN protocol fixed and sweep σ∈{1,5,10,20}; evaluate all models after 30,000 updates on the fine common reference.",
    "result": "Fine-grid relative L2 remained near one for every σ: 1.004, 1.014, 1.026, and 1.008. Larger bandwidth changed the encoder spectrum but did not produce a physical solution.",
    "answer": "No. Merely exposing higher raw Fourier frequencies was not sufficient to rescue the wavefield.",
    "rulesOut": "A simple “σ is too small” explanation for the 20 Hz failure.",
    "limitation": "Development seed only; this is a mechanism probe, not a confirmatory architecture ranking.",
    "metrics": [
      "σ=1,5,10,20",
      "30k updates each",
      "no rescue"
    ],
    "tags": [
      "PINN",
      "Fourier features",
      "frequency"
    ],
    "runtime": "≈4.08 h of new training for σ=5,10,20; σ=1 reused the existing baseline.",
    "evaluation": "Fine-grid relative L2, cosine similarity, amplitude ratios, temporal-third errors, and encoder frequency statistics.",
    "achieved": [
      "Tested the bandwidth hypothesis directly.",
      "Motivated moving from bandwidth to source visibility and feature geometry."
    ],
    "math": "\\[\\gamma_\\sigma(z)=\\big[\\sin(2\\pi zB),\\cos(2\\pi zB)\\big],\\qquad B_{ij}\\sim\\mathcal N(0,\\sigma^2).\\]",
    "figures": [
      {
        "kind": "table",
        "title": "20 Hz Fourier bandwidth sweep",
        "subtitle": "",
        "columns": [
          "σ",
          "rL2",
          "cosine"
        ],
        "rows": [
          [
            "1",
            "1.0042",
            "0.1756"
          ],
          [
            "5",
            "1.0145",
            "0.2882"
          ],
          [
            "10",
            "1.0255",
            "0.2113"
          ],
          [
            "20",
            "1.0084",
            "0.0020"
          ]
        ]
      },
      {
        "kind": "note",
        "title": "Selection rule outcome",
        "text": "The preregistered development rule selected σ=1 because none of the wider bandwidths materially rescued the target."
      }
    ],
    "sources": [
      {
        "label": "σ=20 sweep summary",
        "href": "./assets/evidence/raw/pinn_sigma20_summary.json"
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
    "runtime": "134.3 min for the 16k-point 20 Hz run (30,000 updates); the 8k baseline was reused.",
    "evaluation": "Fine-grid relative L2, cosine similarity, norm/peak ratios, temporal-third errors, plus source-core visibility probability.",
    "achieved": [
      "Separated point-count scarcity from deeper representation/optimization issues.",
      "Justified moving from quantity-of-points to geometry-of-points questions."
    ],
    "math": "\\[\nN_{\\mathrm{int}}: 8000 \\;\\longrightarrow\\; 16000.\n\\]",
    "figures": [
      {
        "kind": "table",
        "title": "Doubling uniform collocation",
        "subtitle": "",
        "columns": [
          "quantity",
          "8k baseline",
          "16k run"
        ],
        "rows": [
          [
            "relative L2",
            "1.0042",
            "1.0555"
          ],
          [
            "cosine",
            "0.1756",
            "0.1368"
          ],
          [
            "late-third error",
            "1.5901",
            "2.9289"
          ],
          [
            "expected source-core pts/update",
            "0.785",
            "1.571"
          ],
          [
            "P(≥1 source-core point)",
            "0.544",
            "0.792"
          ]
        ]
      },
      {
        "kind": "note",
        "title": "Decision",
        "text": "The intervention increased source visibility but did not improve the physical solution: the stored decision is no_simple_visibility_rescue."
      }
    ],
    "sources": [
      {
        "label": "Source-visibility summary",
        "href": "./assets/evidence/raw/pinn_source_visibility_summary.json"
      }
    ]
  },
  {
    "id": "pinn-dispersion",
    "phase": "PINNs",
    "category": "representation",
    "tone": "cyan",
    "title": "Wave-cone aligned Fourier features still did not give a clean rescue",
    "question": "If Fourier directions are aligned with the acoustic dispersion relation, does the 20 Hz PINN recover the correct wavefield?",
    "design": "Starting from the same σ=10 spatial draw, preserve spatial features and replace only the temporal row so that |b_t|/(c k_r) is fixed to 0.5, 1.0, or 2.0.",
    "result": "On-cone ratio 1.0 produced rL2≈0.998, only a ~2.7% gain over isotropic σ=10 and ~0.5% over the best off-cone control. No clean geometry signal emerged.",
    "answer": "Encoder-level dispersion alignment was not enough to resolve the optimization/representation failure.",
    "rulesOut": "A clean claim that random Fourier orientation relative to the wave cone is the dominant cause.",
    "limitation": "The nonlinear MLP and hard t² factor mean the full network is not an exact wave basis.",
    "metrics": [
      "ratios 0.5 / 1 / 2",
      "30k updates",
      "no clean signal"
    ],
    "tags": [
      "PINN",
      "dispersion",
      "Fourier geometry"
    ],
    "runtime": "≈4.07 h for the three 30k-update geometry runs.",
    "evaluation": "Fine-grid rL2/cosine/amplitude diagnostics plus explicit wave-cone defect statistics in the frozen encoder.",
    "achieved": [
      "Tested a physics-aligned representation hypothesis.",
      "Showed that even exact encoder-level cone alignment did not create robust wave learning."
    ],
    "math": "\\[|b_t|=c\\sqrt{b_x^2+b_y^2}\\qquad\\text{(wave-cone alignment)}.\\]",
    "figures": [
      {
        "kind": "table",
        "title": "Dispersion geometry sweep",
        "subtitle": "",
        "columns": [
          "geometry",
          "rL2",
          "cosine"
        ],
        "rows": [
          [
            "isotropic σ=10",
            "1.0255",
            "0.2113"
          ],
          [
            "ratio 0.5",
            "1.0034",
            "0.2067"
          ],
          [
            "ratio 1.0",
            "0.9979",
            "0.1747"
          ],
          [
            "ratio 2.0",
            "1.1360",
            "0.0101"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Dispersion-aligned summary",
        "href": "./assets/evidence/raw/pinn_dispersion20_summary.json"
      }
    ]
  },
  {
    "id": "pinn-causal",
    "phase": "PINNs",
    "category": "optimization",
    "tone": "purple",
    "title": "Causal weighting did not produce a stable temporal curriculum",
    "question": "Can dimensionless causal weighting force the model to learn early-time dynamics before later-time residuals?",
    "design": "Normalize residual slices by a baseline scale and apply exponentially decaying causal weights; probe matched and FF-PINN variants under the same short diagnostic budget.",
    "result": "Weights rapidly collapsed onto very few early slices while normalized residual ratios exploded later in training. The desired smooth temporal curriculum did not emerge robustly.",
    "answer": "Causal weighting changed the objective, but it did not by itself repair the underlying optimization instability.",
    "rulesOut": "The assumption that temporal reweighting automatically recovers causal physical propagation.",
    "limitation": "These were diagnostic probes, not a full hyperparameter search over every causal schedule.",
    "metrics": [
      "dimensionless weighting",
      "matched + FF probes",
      "unstable slice weights"
    ],
    "tags": [
      "PINN",
      "causality",
      "optimization"
    ],
    "runtime": "Dimensionless diagnostic: 78.3 s total for two short runs (37.3 s matched, 41.0 s FF).",
    "evaluation": "Active-slice counts, first/last slice weights, early/late normalized residual ratios, and training-time behavior.",
    "achieved": [
      "Separated temporal reweighting from true dynamical integration.",
      "Closed the causal-weighting branch as a negative result rather than tuning indefinitely."
    ],
    "math": "\\[\\mathcal L=\\sum_i w_i(\\theta)\\,\\mathcal L_i,\\qquad w_i\\downarrow\\text{ when preceding residuals remain large}.\\]",
    "figures": [
      {
        "kind": "table",
        "title": "Dimensionless causal diagnostic",
        "subtitle": "",
        "columns": [
          "model",
          "first active >0.5",
          "last active >0.5",
          "final last-slice weight",
          "train s"
        ],
        "rows": [
          [
            "matched",
            "5",
            "4",
            "0",
            "37.3"
          ],
          [
            "FF-PINN",
            "7",
            "1",
            "0",
            "41.0"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Causal diagnostic summary",
        "href": "./assets/evidence/raw/pinn_causal_summary.json"
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
    "runtime": "Development pilot: 250 updates per strategy; adaptive 32.1 s, source-importance 23.5 s, uniform 23.0 s.",
    "evaluation": "Relative L2, amplitude/norm diagnostics, cosine similarity, GPU memory, and the final probability mass assigned to the source box.",
    "achieved": [
      "Exposed a concrete failure mode of naive residual-adaptive sampling.",
      "Connected the diagnosis to a geometric notion of information rather than error alone."
    ],
    "math": "\\[\n\text{adaptive score} \\propto |R_\theta(x,t)|.\n\\]",
    "figures": [
      {
        "kind": "table",
        "title": "Source-starvation rescue pilot",
        "subtitle": "",
        "columns": [
          "strategy",
          "rL2",
          "source-box mass",
          "enrichment",
          "train s"
        ],
        "rows": [
          [
            "repo adaptive",
            "4.349",
            "98.0%",
            "≈490×",
            "32.1"
          ],
          [
            "source importance",
            "0.9999",
            "—",
            "—",
            "23.5"
          ],
          [
            "uniform",
            "0.9999",
            "—",
            "—",
            "23.0"
          ]
        ]
      },
      {
        "kind": "bars",
        "title": "Where adaptive sampling concentrated",
        "subtitle": "Final adaptive probability mass",
        "labels": [
          "source box",
          "rest of domain"
        ],
        "values": [
          98.005,
          1.995
        ],
        "suffix": "%",
        "colors": [
          "#ff7285",
          "#4ce1b6"
        ]
      }
    ],
    "sources": [
      {
        "label": "Adaptive-rescue summary",
        "href": "./assets/evidence/raw/pinn_adaptive_summary.json"
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
    "runtime": "≈22.5 min for the full official 1000-step reproduction; refinement checks reused the trained checkpoint.",
    "evaluation": "Relative L2 against refined spectral references, then temporal/spatial refinement to separate integrator/reference error from model error.",
    "achieved": [
      "Reproduced the official sine-Gordon configuration before changing the architecture.",
      "Created a trusted reference point for later structural adaptations."
    ],
    "math": "\\[\n\text{relative error}=\frac{\\|u_{\theta}-u_{\\mathrm{ref}}\\|_2}{\\|u_{\\mathrm{ref}}\\|_2}.\n\\]",
    "figures": [
      {
        "kind": "stats",
        "title": "Official reproduction",
        "items": [
          [
            "relative L2",
            "0.06104%"
          ],
          [
            "modes",
            "201"
          ],
          [
            "time horizon",
            "T=3"
          ],
          [
            "updates",
            "1000"
          ]
        ]
      },
      {
        "kind": "note",
        "title": "Refinement logic",
        "text": "Temporal refinement improved the result until model error dominated, so the benchmark was not being driven by a coarse integration step."
      }
    ],
    "sources": []
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
    "runtime": "≈10.5 min of new training for the three linearized seeds; matched base checkpoints were reused. Evaluation/refinement added ≈19 s before plotting.",
    "evaluation": "Matched-seed relative L2 at h/2, h/4 verification, temporal extrapolation to T=3, and energy-drift diagnostics.",
    "achieved": [
      "Turned known linear physics into a measurable reduction of neural burden.",
      "Motivated the larger claim that structure can matter more than flexibility."
    ],
    "math": "\\[\na^{\\prime}=b,\\qquad b^{\\prime}=-(\\Omega^2+10I)a+0.1\\,N(a).\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Base model temporal error",
        "src": "./assets/evidence/neusa_linearized_error_base.png",
        "caption": "Recorded error-versus-time curve for the base dynamics."
      },
      {
        "kind": "image",
        "title": "Structured model temporal error",
        "src": "./assets/evidence/neusa_linearized_error_structured.png",
        "caption": "Recorded error-versus-time curve after analytic linearization."
      },
      {
        "kind": "image",
        "title": "Energy drift: base",
        "src": "./assets/evidence/neusa_linearized_energy_base.png",
        "caption": "Global energy diagnostic for the base model."
      },
      {
        "kind": "image",
        "title": "Energy drift: structured",
        "src": "./assets/evidence/neusa_linearized_energy_structured.png",
        "caption": "Global energy diagnostic for the analytically structured model."
      }
    ],
    "sources": [
      {
        "label": "Linearization summary",
        "href": "./assets/evidence/raw/neusa_linearized_summary.json"
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
    "runtime": "≈25.4 min total training for the six free/cubic local runs across seeds 42–44, followed by transfer evaluation.",
    "evaluation": "Relative L2 on [0,1], (1,3], and (3,5] for multiple held-out ICs; energy drift; global and occupancy-weighted force diagnostics.",
    "achieved": [
      "Made transfer, not in-window fit, the central model-selection criterion.",
      "Showed that the right prior can dominate raw model size by orders of magnitude."
    ],
    "math": "\\[\nr_{\\mathrm{cubic}}(u)=\frac{10}{6}u^3\\,(1+z)^{-1}q\\!\\left(\frac{z}{1+z}\right),\\qquad z=(u/4)^2.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Shifted-trajectory transfer",
        "src": "./assets/evidence/neusa_locality_shifted.png",
        "caption": "Recorded error-vs-time comparison on a shifted held-out pulse."
      },
      {
        "kind": "image",
        "title": "Double-pulse transfer",
        "src": "./assets/evidence/neusa_locality_double.png",
        "caption": "Recorded error-vs-time comparison on a multi-pulse trajectory."
      },
      {
        "kind": "image",
        "title": "Learned cubic local force",
        "src": "./assets/evidence/neusa_force_cubic.png",
        "caption": "Learned local cubic correction evaluated as a scalar force law."
      },
      {
        "kind": "image",
        "title": "Learned free local force",
        "src": "./assets/evidence/neusa_force_free.png",
        "caption": "Free local correction for comparison."
      }
    ],
    "sources": [
      {
        "label": "Locality / generalization summary",
        "href": "./assets/evidence/raw/neusa_locality_summary.json"
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
    "runtime": "≈15.2 min of new training for the three odd-symmetry runs; free/cubic checkpoints were reused.",
    "evaluation": "Primary relative L2 on (1,3] across three new held-out ICs and three seeds; secondary late error, step-halving, energy, and force diagnostics.",
    "achieved": [
      "Isolated what odd symmetry explains and what it does not.",
      "Identified cubic near-zero behavior as the key structural ingredient."
    ],
    "math": "\\[\nr_{\\mathrm{odd}}(u)=5\\,[q(u/4)-q(-u/4)],\\qquad r_{\\mathrm{cubic}}(u)\\sim c\\,u^3\\;\text{near }0.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Odd-symmetry training trajectory (seed 42)",
        "src": "./assets/evidence/neusa_odd_seed42_error.png",
        "caption": "Stored temporal-error diagnostic for the newly trained odd model."
      },
      {
        "kind": "bars",
        "title": "Mean held-out (1,3] error",
        "subtitle": "Exact structural-ladder summary",
        "labels": [
          "free",
          "odd",
          "cubic"
        ],
        "values": [
          8.079,
          5.579,
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
        "kind": "table",
        "title": "Paired dominance",
        "subtitle": "",
        "columns": [
          "comparison",
          "wins"
        ],
        "rows": [
          [
            "cubic vs free",
            "9/9"
          ],
          [
            "cubic vs odd",
            "9/9"
          ],
          [
            "odd vs free",
            "7/9"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Odd-ablation summary",
        "href": "./assets/evidence/raw/neusa_odd_summary.json"
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
    "runtime": "Checkpoint continuation from 500 to 1000/1500 updates across 9 multi-trajectory models; consolidated wall time was not stored.",
    "evaluation": "Held-out (1,3] and (3,5] relative error at each budget, paired 500→1500 comparisons, and force-error diagnostics.",
    "achieved": [
      "Showed that structure and compute are not interchangeable resources.",
      "Converted the discussion into a sample/compute-efficiency argument."
    ],
    "math": "\\[\n\text{equal-budget comparison: }500\text{ updates total},\\qquad \text{frontier comparison: }500\to1500.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Trajectory error vs compute budget",
        "src": "./assets/evidence/neusa_budget_trajectory.png",
        "caption": "Stored compute-frontier plot."
      },
      {
        "kind": "image",
        "title": "Occupancy-weighted force error vs budget",
        "src": "./assets/evidence/neusa_budget_occupancy_force.png",
        "caption": "Mechanistic diagnostic on states actually occupied by the trajectories."
      },
      {
        "kind": "image",
        "title": "Transfer vs occupancy-force error",
        "src": "./assets/evidence/neusa_budget_transfer_force.png",
        "caption": "Links transfer quality to local force accuracy on occupied states."
      },
      {
        "kind": "table",
        "title": "Compute frontier mean error (1,3]",
        "subtitle": "",
        "columns": [
          "model",
          "500",
          "1000",
          "1500"
        ],
        "rows": [
          [
            "free",
            "8.310%",
            "7.501%",
            "7.282%"
          ],
          [
            "odd",
            "6.153%",
            "3.062%",
            "2.381%"
          ],
          [
            "cubic",
            "0.580%",
            "0.576%",
            "0.567%"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Compute-frontier summary",
        "href": "./assets/evidence/raw/neusa_budget_summary.json"
      },
      {
        "label": "Force-budget summary",
        "href": "./assets/evidence/raw/neusa_force_budget_summary.json"
      }
    ]
  },
  {
    "id": "neusa-operator-recovery",
    "phase": "NeuSA",
    "category": "mechanism",
    "tone": "cyan",
    "title": "Occupancy-weighted force recovery explained transfer better than global force fit",
    "question": "What physical law did the structured correction actually learn, and which notion of force error tracks transfer?",
    "design": "Project learned total forces onto −μ sin(u), fit local odd-polynomial surrogates, and compare global force error against force error weighted by states occupied by held-out trajectories.",
    "result": "Single-cubic recovered μ≈9.966 with mean |μ̂−10|≈0.0339 and sine-projection residual ≈0.00376. For odd models, transfer improvements tracked occupancy-weighted force error far more strongly than global force error.",
    "answer": "Transfer quality is governed by force accuracy on the part of state space the trajectories actually visit, not uniform global identification.",
    "rulesOut": "Equating low global force error with the most predictive notion of learned physics.",
    "limitation": "Finite-window polynomial coefficients are not Taylor coefficients; local derivative audits must be interpreted separately.",
    "metrics": [
      "μ̂≈9.966",
      "|μ̂−10|≈0.0339",
      "occupancy-weighted mechanism"
    ],
    "tags": [
      "NeuSA",
      "operator recovery",
      "force law"
    ],
    "runtime": "Post-hoc analysis of frozen checkpoints; no neural retraining.",
    "evaluation": "Sine projection, odd-polynomial fits, global force error, occupancy-weighted force error, and descriptive transfer correlations.",
    "achieved": [
      "Connected empirical transfer to a concrete learned-force mechanism.",
      "Clarified why global operator accuracy can be a misleading diagnostic."
    ],
    "math": "\\[F_\\theta(u)\\approx-\\hat\\mu\\sin u,\\qquad \\hat\\mu=\\arg\\min_\\mu\\,\\mathbb E_{u\\sim\\rho}[F_\\theta(u)+\\mu\\sin u]^2.\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Recovered cubic coefficient",
        "src": "./assets/evidence/neusa_symbolic_u3.png",
        "caption": "Stored symbolic-discovery diagnostic for the local cubic law."
      },
      {
        "kind": "image",
        "title": "Transfer vs occupancy-weighted force error",
        "src": "./assets/evidence/neusa_budget_transfer_force.png",
        "caption": "Mechanism plot linking transfer to force accuracy on occupied states."
      },
      {
        "kind": "table",
        "title": "Force-law recovery",
        "subtitle": "",
        "columns": [
          "model",
          "mean μ̂",
          "mean |μ̂−10|",
          "sine residual"
        ],
        "rows": [
          [
            "single free",
            "9.893",
            "0.1068",
            "0.0930"
          ],
          [
            "single odd",
            "9.730",
            "0.2701",
            "0.0234"
          ],
          [
            "single cubic",
            "9.966",
            "0.0339",
            "0.00376"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Symbolic discovery summary",
        "href": "./assets/evidence/raw/neusa_symbolic_summary.json"
      },
      {
        "label": "Force-budget summary",
        "href": "./assets/evidence/raw/neusa_force_budget_summary.json"
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
    "runtime": "64-case screen followed by 216 fine-confirmation rows (12 stress cases × 6 model configurations × 3 seeds); consolidated wall time was not stored.",
    "evaluation": "Distributional screen statistics plus long-horizon mean/q90/max error, time-to-10%-error, integrator refinement, and reference refinement.",
    "achieved": [
      "Made tail behavior visible instead of hiding it in means.",
      "Connected robustness to long-horizon failure modes."
    ],
    "math": "\\[\n\text{tail diagnostics: }\\{\text{mean},\\;q_{90},\\;\\max\\}.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Random-IC screen error CDF",
        "src": "./assets/evidence/neusa_robustness_cdf.png",
        "caption": "Empirical distribution of transfer errors across the frozen 64-case screen."
      },
      {
        "kind": "image",
        "title": "Long-horizon adversarial stress",
        "src": "./assets/evidence/neusa_robustness_long_horizon.png",
        "caption": "Fine confirmation through T=10 on the selected stress cases."
      },
      {
        "kind": "table",
        "title": "Fine stress: mean error on (5,10]",
        "subtitle": "",
        "columns": [
          "model",
          "mean",
          "q90",
          "max"
        ],
        "rows": [
          [
            "single free",
            "40.93%",
            "44.42%",
            "161.19%"
          ],
          [
            "single odd",
            "21.13%",
            "39.58%",
            "44.80%"
          ],
          [
            "single cubic",
            "2.98%",
            "4.21%",
            "6.30%"
          ],
          [
            "multi cubic",
            "2.93%",
            "4.15%",
            "6.20%"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Robustness summary",
        "href": "./assets/evidence/raw/neusa_robustness_summary.json"
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
    "runtime": "≈4.42 h total training for 9 parameterized models (3 structures × 3 seeds), followed by family-wide evaluation.",
    "evaluation": "Forward error across train/interpolation/extrapolation μ, force-law projection, recovered μ, and refined-reference diagnostics.",
    "achieved": [
      "Showed the surrogate can encode a family of PDEs, not just one coefficient.",
      "Created the foundation for inverse calibration and UQ experiments."
    ],
    "math": "\\[\n\\mu \\in \\{5,7.5,10,12.5,15\\}\\;\text{train},\\qquad \\mu_{\\mathrm{test}}\\in\\{6.25,8.75,11.25,13.75,3.75,16.25\\}.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Error across physical parameter μ",
        "src": "./assets/evidence/neusa_parametric_error_vs_mu.png",
        "caption": "Forward generalization across train, interpolation, and extrapolation values."
      },
      {
        "kind": "image",
        "title": "Recovered μ",
        "src": "./assets/evidence/neusa_parametric_recovered_mu.png",
        "caption": "Force-projection recovery of the hidden physical coefficient."
      },
      {
        "kind": "table",
        "title": "Cubic aggregate",
        "subtitle": "",
        "columns": [
          "regime",
          "mean (1,3]",
          "mean (3,5]",
          "mean |μ̂−μ|"
        ],
        "rows": [
          [
            "interpolation",
            "0.753%",
            "1.327%",
            "0.0444"
          ],
          [
            "extrapolation",
            "2.348%",
            "3.005%",
            "0.0914"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Parameterized μ summary",
        "href": "./assets/evidence/raw/neusa_parametric_summary.json"
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
    "runtime": "6119.998 s total ≈ 102.0 min for 108 inverse problems.",
    "evaluation": "Mean / q90 parameter error and future (3,5] forecast error for clean/noisy sparse and rich noisy observation regimes; baseline μ=10 comparison.",
    "achieved": [
      "Connected forward generalization to inverse calibration.",
      "Showed that very sparse data can materially improve downstream prediction."
    ],
    "math": "\\[\n\\hat\\mu = \u0007rg\\min_{\\mu}\\,\\sum_{(x_i,t_i)}\big(u_\theta(x_i,t_i;\\mu)-y_i\big)^2.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "True vs inferred μ",
        "src": "./assets/evidence/inverse_true_vs_inferred_mu.png",
        "caption": "Recovered hidden coefficient across interpolation and extrapolation tasks."
      },
      {
        "kind": "image",
        "title": "Calibrated vs baseline forecast",
        "src": "./assets/evidence/inverse_forecast.png",
        "caption": "Downstream forecast error after calibration versus the same surrogate fixed at μ=10."
      },
      {
        "kind": "table",
        "title": "Interpolation summary",
        "subtitle": "",
        "columns": [
          "observation regime",
          "mean |μ̂−μ|",
          "mean forecast (3,5]"
        ],
        "rows": [
          [
            "sparse clean",
            "0.0362",
            "0.864%"
          ],
          [
            "sparse noisy",
            "0.0752",
            "2.353%"
          ],
          [
            "rich noisy",
            "0.0551",
            "1.773%"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Inverse-calibration summary",
        "href": "./assets/evidence/raw/inverse_calibration_summary.json"
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
    "runtime": "5414.976 s ≈ 90.25 min for the 108 inverse-design evaluation tasks.",
    "evaluation": "Mean / q90 parameter error, forecast error, local 90% interval coverage/width, plus paired Fisher-vs-fixed/random wins.",
    "achieved": [
      "Showed that model-based experiment design can improve inference without more data.",
      "Created the setup later used to study UQ failure under extrapolation."
    ],
    "math": "\\[\n\\mathcal I(\\mu) = J(\\mu)^\top \\Sigma^{-1}J(\\mu),\\qquad \text{maximize a scalar summary of }\\mathcal I.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "μ error by measurement layout",
        "src": "./assets/evidence/uq_mu_error_layout.png",
        "caption": "Fixed, Fisher-optimal, and frozen-random layouts with the same number of observations."
      },
      {
        "kind": "image",
        "title": "Coverage vs interval width",
        "src": "./assets/evidence/uq_coverage_vs_width.png",
        "caption": "Shows the trade-off between interval width and empirical coverage."
      },
      {
        "kind": "table",
        "title": "Interpolation layout comparison",
        "subtitle": "",
        "columns": [
          "layout",
          "mean |μ̂−μ|",
          "forecast (3,5]",
          "90% coverage"
        ],
        "rows": [
          [
            "fixed",
            "0.0738",
            "2.594%",
            "94.4%"
          ],
          [
            "Fisher",
            "0.0495",
            "2.130%",
            "83.3%"
          ],
          [
            "random",
            "0.1567",
            "4.803%",
            "88.9%"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Sensor design",
        "href": "./assets/evidence/raw/uq_sensor_design.json"
      },
      {
        "label": "Sensor/UQ summary",
        "href": "./assets/evidence/raw/uq_sensor_summary.json"
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
    "runtime": "Reuses the 90.25-min sensor-design campaign; no additional neural training.",
    "evaluation": "Empirical coverage and interval width of local Fisher/Laplace uncertainty, separated by interpolation vs extrapolation and by layout.",
    "achieved": [
      "Drew a sharp line between data-information and model-validity uncertainty.",
      "Created the motivation for discrepancy-aware repair."
    ],
    "math": "\\[\n\\mu\\mid y \u0007pprox \\mathcal N\\!\\left(\\hat\\mu,\\,\\mathcal I(\\hat\\mu)^{-1}\right).\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Coverage vs width",
        "src": "./assets/evidence/uq_coverage_vs_width.png",
        "caption": "The extrapolation failure appears as narrow intervals with zero empirical coverage."
      },
      {
        "kind": "table",
        "title": "Extrapolation local UQ",
        "subtitle": "",
        "columns": [
          "layout",
          "mean CI width",
          "90% coverage"
        ],
        "rows": [
          [
            "fixed",
            "0.2771",
            "0%"
          ],
          [
            "Fisher",
            "0.2039",
            "0%"
          ],
          [
            "random",
            "0.3928",
            "44.4%"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Sensor/UQ summary",
        "href": "./assets/evidence/raw/uq_sensor_summary.json"
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
    "runtime": "6333.572 s ≈ 105.56 min for 108 fresh extrapolation inverse problems.",
    "evaluation": "Fresh-μ parameter error, forecast error, interval width, and empirical 90% coverage under naive vs discrepancy-aware calibration.",
    "achieved": [
      "Converted a qualitative UQ failure into a quantitatively repairable one.",
      "Demonstrated out-of-sample value of explicit discrepancy modeling."
    ],
    "math": "\\[\n\tilde\\mu = a_\\pm\\,\\hat\\mu + b_\\pm,\\qquad \text{with side-specific discrepancy calibration}.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Coverage vs interval width after discrepancy modeling",
        "src": "./assets/evidence/discrepancy_coverage_vs_width.png",
        "caption": "Fresh extrapolation comparison of naive and discrepancy-aware intervals."
      },
      {
        "kind": "image",
        "title": "Parameter error after discrepancy correction",
        "src": "./assets/evidence/discrepancy_parameter_error.png",
        "caption": "Naive vs corrected parameter recovery on fresh μ values."
      },
      {
        "kind": "table",
        "title": "Far extrapolation, Fisher layout",
        "subtitle": "",
        "columns": [
          "quantity",
          "naive",
          "corrected"
        ],
        "rows": [
          [
            "mean |μ̂−μ|",
            "0.6168",
            "0.1977"
          ],
          [
            "forecast (3,5]",
            "19.875%",
            "7.885%"
          ],
          [
            "90% coverage",
            "0%",
            "77.8%"
          ],
          [
            "mean interval width",
            "0.1996",
            "0.9199"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Discrepancy-UQ summary",
        "href": "./assets/evidence/raw/discrepancy_uq_summary.json"
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
    "runtime": "4298.635 s ≈ 71.64 min for the 36 dense diagnostic μ sweeps.",
    "evaluation": "Physical μ vs clean-observation optimum vs forecast pseudo-true μ; downstream error at each candidate and explicit compensation flags.",
    "achieved": [
      "Explained why “better parameter fit” and “better forecast” can disagree.",
      "Added a mechanistic language for compensation under misspecification."
    ],
    "math": "\\[\n\\mu^{\\dagger}_{\\mathrm{obs}}\neq \\mu^{\\dagger}_{\\mathrm{forecast}}\neq \\mu_{\\mathrm{true}}\\quad\text{is possible under model misspecification}.\n\\]",
    "figures": [
      {
        "kind": "image",
        "title": "Physical μ vs forecast pseudo-true μ",
        "src": "./assets/evidence/pseudotrue_physical_vs_predictive.png",
        "caption": "Separation is concentrated on the upper extrapolation side."
      },
      {
        "kind": "image",
        "title": "Parameter improvement vs forecast improvement",
        "src": "./assets/evidence/pseudotrue_tradeoff.png",
        "caption": "Shows that improved parameter recovery need not imply improved prediction."
      },
      {
        "kind": "image",
        "title": "Near-domain compensation case",
        "src": "./assets/evidence/pseudotrue_paradox_case.png",
        "caption": "One of the two full mechanism cases where a biased parameter compensates for surrogate error."
      },
      {
        "kind": "image",
        "title": "Far-extrapolation correction success",
        "src": "./assets/evidence/pseudotrue_far_success.png",
        "caption": "A far-side case where correction improves both identification and forecast."
      },
      {
        "kind": "table",
        "title": "By μ",
        "subtitle": "",
        "columns": [
          "μ true",
          "mean μ† forecast",
          "forecast @ μtrue",
          "forecast @ μ†"
        ],
        "rows": [
          [
            "4.25",
            "4.250",
            "0.435%",
            "0.435%"
          ],
          [
            "15.75",
            "15.633",
            "3.626%",
            "1.618%"
          ],
          [
            "3.25",
            "3.244",
            "0.490%",
            "0.460%"
          ],
          [
            "16.75",
            "16.567",
            "6.403%",
            "2.596%"
          ]
        ]
      }
    ],
    "sources": [
      {
        "label": "Pseudo-true summary",
        "href": "./assets/evidence/raw/pseudotrue_summary.json"
      }
    ]
  }
];
