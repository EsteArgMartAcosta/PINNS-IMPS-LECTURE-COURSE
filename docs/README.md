# SciML Atlas V2 — PINNs → trustworthy learned physics

A zero-build static research site for the IMPA Scientific Machine Learning project.

The V2 narrative is no longer organized as a collection of weekly notes. It is built around one scientific question:

> **Can a neural network learn physics — and when should we trust what it learns?**

## Current information architecture

1. **Opening** — the scientific arc of the project.
2. **What is a PINN?** — animated pipeline, mathematical residual, interactive loss builder, and use/caution map.
3. **Interactive concept map** — theory links across the first four weeks.
4. **Weeks 1–4 timeline** — question → papers/ideas → intuition → experiment → conclusion.
5. **Experiment Atlas** — evidence cards with question, design, result, answer, what is ruled out, and limitations.
6. **Structure vs transfer deep-dive** — seed-level interactive dashboard.
7. **What I believe now** — evidence-backed scaffold for the professor's two requested questions.
8. **Next project** — intentionally reserved for the applied project once its scientific contract is frozen.

## V2 scientific content already loaded

The Experiment Atlas currently includes the major experimental blocks completed so far:

- acoustic PINN validation;
- frequency × seed instability;
- uniform collocation doubling;
- adaptive-sampling failure;
- official NeuSA reproduction;
- structured linearization;
- local cubic transfer;
- odd-symmetry ablation;
- trajectory diversity / compute frontier;
- robustness atlas;
- parameterized NeuSA family;
- inverse calibration;
- Fisher sensor design;
- extrapolative UQ failure;
- discrepancy-aware UQ repair;
- physical vs predictive pseudo-true parameter diagnostic.

## Files

```text
docs/
├── index.html
├── styles.css
├── app.js
├── .nojekyll
├── data/
│   ├── concepts.js
│   ├── results.js
│   ├── weeks.js
│   └── experiments.js
└── assets/
```

All paths are relative and the page has no build step or external runtime dependency.

## Preview locally

```bash
cd docs
python -m http.server 8000
```

Open `http://localhost:8000`.

## Presentation mode

Press **P** or click **Present**. Use arrow keys / PageUp / PageDown to move among major sections.

## Next content pass

The structural V2 is now in place. The next pass should focus on scientific presentation rather than architecture:

- exact paper bibliography + links;
- final evidence-backed wording for the professor's two questions;
- selected dynamic plots for the parameterized / inverse / UQ phases;
- final figure hierarchy (main vs supporting evidence);
- applied-project section;
- final mobile/presentation polish.
