# adiabatic.garden

A highly scalable, fast, and minimalist personal website built using **Eleventy (11ty)**, featuring Math/LaTeX support (KaTeX) and beautiful static rendering.

`src/join.html` publishes `/join.html`, a standalone page with the Emergent Mind
compute invitation and connection command with a copy button, using a standard system sans-serif font.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
Starts a local web server with hot-reloading at `http://localhost:8080`:
```bash
npm start
```

### 3. Build Static Site
Compiles your entire site into the `_site/` directory:
```bash
npm run build
```

---

## ✍️ How to Publish a New Post

Writing and publishing is now fully automated. There are no compile scripts or manual index lists to update.

1. Create a new Markdown (`.md`) file in **`src/pages/`** (or **`src/favs/`** if it's a favorite/featured post).
2. At the very top of the file, define your post's metadata using YAML front matter:

```markdown
---
layout: layouts/post.njk
title: "My New Article Title"
date: 2026-06-21
author: "noesis"
category: "lab"       # Choose: "lab", "problems", "stories", "slice-of-life", or "commonplace" (or "favs" for favorites)
---

This is your post content written in **Markdown**.

### KaTeX / Math Formulas
You can write inline math formulas using `$E = mc^2$` or block equations:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

On the standalone homepage, wrap a formula in `<span class="math">...</span>`; its scoped KaTeX renderer avoids interpreting unrelated text as math.

If you ever want to decouple a file's physical name from its compiled web URL, you can define a permalink variable directly in the post's front matter:
---
layout: layouts/post.njk
title: "MRI and ultrasound physics"
date: 2026-04-09
category: "favs"
permalink: "/neuroscience/mri-and-ultrasound/"   # Custom variable URL!


3. Git-commit and push! Your `/writing` page directory will automatically update and sort the post chronologically (newest first).

Each post's source Markdown is also published beside its rendered page: for example,
`/pages/hope/` is available as plain text at `/pages/hope.md`.
The homepage and About page publish shared Person JSON-LD; each post references that
identity in its Article JSON-LD author data. Use only `noesis` for this author’s name
in metadata and bylines; retain coauthor credits.

---

## 🗺️ Map, commonplace, archive

The homepage opens on one card that maps the site (greetings, bookshelf, priors,
maps, quotes, writing, archive); the boxes under it are what is happening now.
The homepage and reading layouts version shared CSS and graph JavaScript by content
hash so cached assets stay in sync with each deployment. Graph canvases sit outside
normal layout flow to keep resizing from expanding the page.

The sleep page transcribes pages 2–10 of `src/pages/sleep-deprivation.pdf` as
Markdown, omitting the PDF title page, and links to the original file at
`/pages/sleep-deprivation.pdf`.
Blockquotes inherit their surrounding prose font and use an italic, indented
pull-quote treatment throughout the site.

`commonplace` notes (`src/pages/quotes.md`, `priors.md`, `maps.md`) are
evergreen: append a heading rather than writing a new post. They compose at
`/writing/commonplace/`.

`/archive/` draws every page as a graph. The `graph` collection in `.eleventy.js`
builds nodes (home, sections, notes) and edges (section membership plus internal
links found in each note's markdown); `src/archive-graph.njk` writes it to
`/archive/graph.json` and `src/js/archive-graph.js` renders it, also in the
homepage `[ archive ]` box.

Each section has a wallpaper in `src/assets/wallpapers/`; a note inherits its
section's image (`lib/note-data.js`) unless its front matter sets `wallpaper`.

## 🌲 Forester-style trees

Writing is rendered the way [forester](https://forest.localcharts.org/lc-0002.xml)
renders a forest: a note is a *tree*, and its own sections are trees in their own
right — numbered, collapsible, and separately addressable.

Every note gets a stable public address (`note-0048`) from `src/_data/noteIds.js`,
shown next to its title as `[note-0048]`. **Never reuse an address** after removing
a note. Headings inside a note are addressed under it (`#note-0048-links`), so the
same anchor works on the note's own page and in a composed view.

Two layouts share one renderer (`src/_includes/forest-tree.njk`):

| Layout | Used by | The note is… |
| --- | --- | --- |
| `layouts/post.njk` | every `.md` note | the root tree, with its own contents sidebar and backmatter |
| `layouts/forest.njk` | `src/writing/*.njk` | one numbered subtree among many, transcluded into a whole collection |

A note's **taxon** (the genre printed before its number — "Note 4", "Story 2")
comes from its `category`; set `taxon: "…"` in front matter to override it. Only
numbered trees carry a label, so a note on its own page shows just its title and
address — the taxon would repeat what the address already says.

To compose a new collection into a single document, add a file to `src/writing/`:

```yaml
---
layout: layouts/forest.njk
title: Lab notebook
description: Experiments, research notes, and technical fragments in one view.
collectionName: lab          # any collection defined in .eleventy.js
permalink: /writing/lab-notebook/index.html
---
```

Following forester, a transcluded note's backmatter is suppressed — related
links appear only on the note's own page, where it is the root.

---

## 📂 Project Structure

```text
├── src/                          # Raw editable source files
│   ├── _includes/
│   │   ├── forest-tree.njk       # Recursive tree + contents macros (forester style)
│   │   └── layouts/
│   │       ├── base.njk          # Global page shell (styles, KaTeX bootstrap)
│   │       ├── forest.njk        # A whole collection composed into one document
│   │       └── post.njk          # One note as the root of its own tree
│   ├── assets/                   # Static images, videos, and fonts
│   ├── css/                      # Site stylesheets
│   ├── js/                       # Client scripts, including Lanyard presence; offline stays literal
│   │   └── forest.js             # Tree collapse/expand and contents tracking
│   ├── favs/                     # Favorite posts (.md)
│   ├── pages/                    # Lab notebooks, problems, & story posts (.md)
│   ├── writing/                  # One forest view per collection (see below)
│   ├── index.html                # Main homepage grid
│   ├── psychosis.html            # Poem with preserved lines and vertically tiled halftone video
│   ├── writing.html              # Dynamic post index at /writing/, links to each forest
│   └── me.html, readlogs.html, etc. # Static pages inheriting from base layout
├── lib/
│   ├── forest.js                 # Turns a note's HTML into a tree of subtrees
│   └── note-data.js              # Computed front matter shared by note directories
├── .eleventy.js                  # Eleventy build & static-copy configuration
├── llms.txt                      # LLM-oriented site guide, published at /llms.txt
├── src/sitemap.xml               # Curated machine-readable site index
├── vercel.json                   # Vercel configuration for clean, extensionless URLs
├── wrangler.toml                 # Cloudflare Pages deployment configuration
└── _site/                        # Generated output directory (ignored by Git)
```

---

## 🌐 Deployment

### Vercel (Recommended)
Every `git push` to your main branch will automatically trigger Vercel to compile and deploy your site from the `_site` directory using clean URLs.

### Cloudflare Pages
To deploy manually to Cloudflare Pages, run:
```bash
npm run deploy
```
Production uses the `adiabatic-garden` project’s `main` branch. To publish a local
build from another branch, pass `--project-name adiabatic-garden --branch main`
to `wrangler pages deploy _site`.
When a development watcher is running, build with `eleventy --output=<temporary-directory>`
and deploy that directory so the published files cannot change during upload.
### Sync curius bookmarks
Fetch all bookmarks from the Curius API into `src/_data/curius.json`:
```
npm run fetch:curius
```

### Related-links recommendations
Each post shows "Related links from Noesis's bookshelf" at the bottom. Two engines:

1. **Build-time TF-IDF** (default, no setup): `.eleventy.js` `relatedBookmarks` filter scores
   bookmarks against each page by keyword cosine similarity. Always works.
2. **Embeddings + HDBSCAN** (better, optional): precomputes semantic matches with OpenAI
   embeddings and clusters bookmarks. When `src/_data/related.json` exists it takes priority
   over the TF-IDF fallback.

To (re)build the embedding matches:
```
pip install -r scripts/requirements.txt
export OPENAI_API_KEY=sk-...
npm run embed:curius          # writes src/_data/related.json + curius-clusters.json
npm run build
```
`embed:curius` caches vectors in `src/_data/.embed-cache.json` (gitignored), so re-runs only
embed new/changed bookmarks and pages. Re-run it after `fetch:curius` or after editing posts.
