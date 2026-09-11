# SciML Atlas — interactive presentation site

A zero-build, static research presentation site designed for GitHub Pages.

## Why this architecture

- **No framework and no build step**: `index.html`, `styles.css`, `app.js`, and data files are enough.
- **GitHub Pages friendly**: all paths are relative.
- **Presentation-safe**: no runtime backend, database, or GPU is needed.
- **Offline-friendly**: there are no CDN dependencies in the current version.
- **Data-driven**: future experiments are added in `data/results.js`; theory nodes live in `data/concepts.js`.

## Features already implemented

- interactive particle / connection background;
- four-week conceptual orbit on the opening page;
- custom SVG concept map with zoom, pan, draggable nodes, search, week filters, and concept detail panel;
- English / Spanish toggle for the core explanations;
- guided conceptual path;
- experiment protocol drawer;
- interactive recorded NeuSA result dashboard with case, interval, metric, seeds, means, and tooltips;
- presentation mode (`P`) with arrow-key navigation;
- responsive layout.

## Open locally

The easiest option is to double-click `index.html`.

For a local web server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a repository, for example `sciml-atlas`.
2. Put these files at the repository root.
3. Push to the `main` branch.
4. On GitHub: **Settings → Pages → Deploy from a branch → main / root**.
5. The site has no build step.

A `.nojekyll` file is included so GitHub serves the static assets directly.

## File layout

```text
sciml_atlas/
├── index.html
├── styles.css
├── app.js
├── .nojekyll
├── data/
│   ├── concepts.js
│   └── results.js
└── README.md
```

## Next build phase

The foundation is intentionally separated from the future scientific content. Next we can add:

1. paper-specific theory layers and citations;
2. SIPINN wavefield experiment data;
3. receiver-trace / field-snapshot widgets;
4. an experiment provenance panel linking configurations to code paths;
5. exported presentation routes for a 5-slide weekly deck.
