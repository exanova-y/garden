Packages used:
- markdown to html 'marked'
`npm install marked`

How to run this website:
`npm start`

Homepage sketch (`sketch/tiled-garden`): open the local URL printed by `npm start`.
The active homepage is `src/index.html`, built with the original 11ty pipeline
from `homepage-map`. Run `pnpm start` for the preview at http://localhost:3000,
or `pnpm run build` to generate `_site/`. About, the bookshelf, and the blog roll
use the unchanged `src/about.md`, `src/pages/bookshelf.md`, and
`src/pages/blog-roll.md`; homepage-only notes live in `src/sections/`.
Layout and controls live in `src/css/garden.css` and `src/js/garden.js`.
The first pass uses `open-world.jpg`, with
no AMV or additional illustrations. Sections open from the icon rail on the left
(icons live in `js/icons.js`; hover for the name). Pane visibility persists in this browser;
use Reset layout to reopen everything. Panes use alternating BSP splits: one
fills the container, two split left/right, and four form an equal 2×2 layout.
Closing all panes reveals the scenery; Return to notes reopens the last pane(s).
On phones, panes stack for readability. The research cladogram is generated from
the nested lists in `src/sections/research.md`; its renderer and theme live in
`src/js/research.js` and `src/css/research.css`. Numbers indicate recency, not prerequisites.
All Markdown articles, Forester layouts, stable note addresses, the archive graph,
and Curius related-bookmark data from `homepage-map` are retained. Writing links
use their existing 11ty URLs, with `.md` sources beside the rendered articles.
The previous homepage is available at `archive/index-before-tiles.html`.
To deploy to production (adiabatic.garden), push to GitHub and Cloudflare Pages will auto-deploy.

Notes:
press option + 8 for dot.

To write a new post, create a file in markdown.
Afterwards, run ./generator.sh [filename.md]
