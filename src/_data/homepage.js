const { readFileSync } = require("node:fs");
const matter = require("gray-matter");
const { marked } = require("marked");

const sources = {
  intro: "src/about.md",
  shelves: "src/pages/bookshelf.md",
  friends: "src/pages/blog-roll.md",
  research: "src/sections/research.md",
  places: "src/sections/places.md",
};

module.exports = function () {
  return Object.fromEntries(Object.entries(sources).map(([id, path]) => [
    id, marked.parse(matter(readFileSync(path, "utf8")).content),
  ]));
};
