# Changelog

## 2026-10-13

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
