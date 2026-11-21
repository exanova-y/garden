const { readFileSync } = require("node:fs");
const matter = require("gray-matter");
const { marked } = require("marked");

// Every sheet on the homepage is Markdown. Notes written only for the homepage
// live in src/sections; About reuses a page that also stands alone.
const sources = {
  intro: "src/sections/intro.md",
  about: "src/about.md",
  writing: "src/sections/writing.md",
  shelves: "src/sections/bookshelf.md",
  friends: "src/sections/blog-roll.md",
  technologies: "src/sections/technologies.md",
  places: "src/sections/places.md",
};

// Each passage in quotes.md, separated by blank lines, is a sheet of its own.
// Line breaks inside a passage are kept.
function quotes() {
  return readFileSync("src/sections/quotes.md", "utf8").trim().split(/\n\s*\n/)
    .map(passage => marked.parse(passage, { breaks: true }));
}

module.exports = function () {
  const sheets = Object.entries(sources).map(([id, path]) => [
    id, marked.parse(matter(readFileSync(path, "utf8")).content),
  ]);
  return { ...Object.fromEntries(sheets), quotes: quotes() };
};
