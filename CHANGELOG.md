# Changelog

## 2026-10-13

- The intro card opens in the reader like the other sheets, showing all of
  `src/about.md`. The card keeps its short text; the full page rides along in
  a hidden `.sheet-full`, which `openSheet` prefers over `.sheet-body`.
- Quotes: each blank-line-separated passage in `src/sections/quotes.md` (moved
  from `src/quotes.md`, where 11ty would have published it as `/quotes/`) is a
  sheet on the map that opens in the reader. `garden.css` has places for three
  (`.quote-1` to `.quote-3`). A `meme` print and a `crow` object join them.
- Three more prints (`train`, `friendship`, `desk`) lie on the lower half of
  the map below the desk. Their offsets are `80vh + N vw` so they follow the
  map, which is sized by width, on any landscape screen.
- Cleanup: every homepage sheet is now Markdown. The intro and the hand-written
  part of Writing moved to `src/sections/intro.md` and `src/sections/writing.md`;
  `writing-index.njk` keeps only the generated list of notes. Section files are
  no longer also published as pages under `/sections/`.
- `src/_includes` moved to `templates/` and `src/_data` to `data/`, so `src`
  holds only what is published.
- Six pages nothing linked to (accelerando, vibes, psychosis, join, gallery,
  pages/readlog) moved to `unpublished/` with the eleven scripts and one
  stylesheet only they and the old archive pages used. The root `archive/` and
  `src/archive/` were removed.
- `eleventy.home.cjs` merged into `.eleventy.js`; `open-world.jpg` moved to
  `src/assets/desk/`.
- Feathers bob on a 2 second sine cycle, and gusts of one to five extra
  feathers blow from the top left corner to the lower right about every 15
  seconds (`src/js/drift.js`).
- Hover groups: the quill lifts with Writing, and the compass and spyglass with
  Places traversed; a grouped object also opens its sheet. Other loose objects
  no longer react to hover; sheets and prints still do.
- The intro sheet is now a small calling card (name, Discord, email, a link to
  the about page); it no longer renders
  `src/about.md` and its links work in place instead of opening the reader.
- Writing, Technologies, Shelves, Friends and Places sit lower on the desk, with
  Friends and the spyglass running past the bottom of the first screen.
- Each feather has a `--phase` offset into the bob cycle.
- The page scrolls. The blurred wash under the desk thins to bare paper and
  breaks up along a watercolour bleed (`src/assets/desk/wash-edge.svg`), below
  which `open-world.jpg` appears sharp at full width.
- Homepage replaced: the BSP tiling workspace and icon rail gave way to a desk
  of scattered paper sheets, prints and instruments (`src/index.html`,
  `src/css/garden.css`).
- Section Markdown is rendered by 11ty directly into the sheets instead of into
  `<template>` elements.
- Sheets on the desk are redrawn through the Paper `paper-texture` shader
  (`src/js/sheet-shader.js`). The seven modules it needs from
  `@paper-design/shaders` 0.0.81 (Apache-2.0) are checked in under
  `src/js/vendor/paper-shaders/`; copying them from `node_modules` at build time
  did not survive the Cloudflare Pages build.
- Added a paged reading sheet (`src/js/reader.js`, `src/css/reader.css`) and a
  stacked layout for narrow screens (`src/css/garden-stacked.css`).
- Removed `src/js/icons.js` and `src/js/tiling.js`, which nothing uses now.
- Desk images exported at web size to `src/assets/desk/` (about 810 KB in total).
- Added a butterfly case, a bottle and to the desk objects.
- Project root tidied: the old pre-11ty site (root `index.html`, `css/`, `js/`,
  `sections/`, `content/`, `assets/`, old rendered posts) moved to
  `archive/legacy-root/`; source art moved to `originals/`.
- Technologies sheet shows plain Markdown; the tree renderer was removed.
