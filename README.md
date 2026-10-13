Layout:
- `src/` — only what is published (11ty input): pages, notes, homepage
  sections, styles, scripts and assets; `_site/` is the output
- `templates/` — layouts and includes; `data/` — site data, including the Curius
  bookmark files written by `scripts/`
- `lib/`, `.eleventy.js` — build code and configuration
- `scripts/` — Curius bookmark fetching and embedding
- `examples/` — screenshots and standalone layout studies
- `originals/` — full-size source art; web-sized copies live in `src/assets/desk/`
- `unpublished/` — pages nothing links to, and the scripts only they used; not built

Packages used:
- markdown to html 'marked'
`npm install marked`

How to run this website:
`npm start`

Homepage sketch (`sketch/tiled-garden`): open the local URL printed by `npm start`.
The active homepage is `src/index.html`, built with the original 11ty pipeline
from `homepage-map`. Run `pnpm start` for the preview at http://localhost:3000,
or `pnpm run build` to generate `_site/`. The bookshelf and the blog roll
use the unchanged `src/pages/bookshelf.md` and `src/pages/blog-roll.md`;
homepage-only notes (intro, writing, technologies, places, quotes) live in
`src/sections/`. Every sheet is Markdown; the one template,
`templates/writing-index.njk`, generates the list of notes under Writing.
The homepage is a desk: six sheets of paper (one per section) scattered among
prints and instruments over a frosted `open-world.jpg`. Scrolling down, the frost
breaks up along a watercolour edge and the map itself appears. 11ty renders the Markdown
straight into each sheet in `src/index.html`. A sheet on the desk shows only its
first page, folded by the Paper `paper-texture` shader (`src/js/sheet-shader.js`,
settings at the top of that file); clicking it opens the full note in a paged
reading sheet (`src/js/reader.js`, arrow keys turn pages). The Technologies
sheet is plain Markdown from `src/sections/technologies.md`.
Feathers bob in place and gusts of extra ones drift across (`src/js/drift.js`,
timing constants at the top of that file).
Positions, tilts and hover effects live in `src/css/garden.css`; images are in
`src/assets/desk/`. Below 1100px wide, or in portrait, the sheets become a plain
scrolling column (`src/css/garden-stacked.css`) with no shader. Earlier layout
studies are in `examples/desk-sketch*.html`.
All Markdown articles, Forester layouts, stable note addresses, the archive graph,
and Curius related-bookmark data from `homepage-map` are retained. Writing links
use their existing 11ty URLs, with `.md` sources beside the rendered articles.
To deploy to production (adiabatic.garden), push to GitHub and Cloudflare Pages will auto-deploy.

Notes:
press option + 8 for dot.

To write a new post, create a file in markdown.
Afterwards, run ./generator.sh [filename.md]
