// Computed front matter shared by every note directory (`src/pages`,
// `src/highlights`).
//
// A note's taxon is derived at render time from its `category` (see
// `lib/forest.js`), so only the stable public address needs computing here.
const noteIds = require("../src/_data/noteIds");

// One image per section: a note wears its section's wallpaper unless its own
// front matter names another.
const WALLPAPERS = {
  lab: "lab",
  problems: "problems",
  stories: "stories",
  commonplace: "commonplace",
  favs: "highlights",
  highlights: "highlights"
};

module.exports = {
  eleventyComputed: {
    noteId: (data) => noteIds[data.page.fileSlug],
    wallpaper: (data) =>
      data.wallpaper || `/assets/wallpapers/${WALLPAPERS[data.category] || "home"}.webp`
  }
};
