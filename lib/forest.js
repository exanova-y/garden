// Forester-style trees.
//
// A forest is a document whose sections are themselves documents. This module
// turns a note's rendered HTML into a tree of nested sections, each one
// separately addressable, numbered and collapsible — the shape that forester
// produces from `.tree` files, and that `forest-tree.njk` renders.
//
// See https://forest.localcharts.org/lc-0002.xml for the reference rendering.

const cheerio = require("cheerio");

const HEADING = /^h([1-6])$/;

// A note's taxon is its genre. Forester prints it ahead of the section number
// ("Definition 1.2"); here the collection a note belongs to supplies it.
const TAXA = {
  lab: "Note",
  problems: "Problem",
  stories: "Story",
  // The section was renamed; the notes still carry the old category.
  favs: "Highlight",
  highlights: "Highlight"
};

function slugify(text, fallback) {
  const slug = String(text || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "");
  return slug || fallback;
}

function taxonFor(data) {
  if (data.taxon) return data.taxon;
  const category = data.category;
  if (!category) return "Note";
  if (TAXA[category]) return TAXA[category];
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// Rewrite every fragment target in a note so that many independently-authored
// notes can be transcluded into one document without colliding.
function namespaceFragments($, prefix) {
  const headings = $("h1,h2,h3,h4,h5,h6").toArray();
  const used = new Set();
  const map = new Map();

  headings.forEach((heading, index) => {
    const $heading = $(heading);
    const original = $heading.attr("id");
    const base = original || slugify($heading.text(), `section-${index + 1}`);
    let local = base;
    let duplicate = 2;
    while (used.has(local)) local = `${base}-${duplicate++}`;
    used.add(local);

    const id = `${prefix}-${local}`;
    map.set(original || base, id);
    $heading.attr("id", id);
  });

  $("[id]").each((_, element) => {
    const $element = $(element);
    const old = $element.attr("id");
    if (!old || old.startsWith(`${prefix}-`)) return;
    const id = `${prefix}-${old}`;
    map.set(old, id);
    $element.attr("id", id);
  });

  $("a[href^='#']").each((_, element) => {
    const $element = $(element);
    const fragment = $element.attr("href").slice(1);
    if (map.has(fragment)) $element.attr("href", `#${map.get(fragment)}`);
  });

  $("img").attr("loading", "lazy").attr("decoding", "async");
  $("iframe").attr("loading", "lazy");
}

// Fold a flat run of headings and content into nested sections. A heading opens
// a subtree that stays open until a heading of the same or shallower level.
function sectionize($) {
  const root = { level: 0, children: [], parts: [] };
  const stack = [root];

  for (const element of $.root().contents().toArray()) {
    const match = element.type === "tag" && HEADING.exec(element.tagName);
    if (match) {
      const level = Number(match[1]);
      while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();
      const $heading = $(element);
      const node = {
        level,
        anchor: $heading.attr("id"),
        title: $heading.html(),
        text: $heading.text().trim(),
        children: [],
        parts: []
      };
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    } else {
      stack[stack.length - 1].parts.push($.html(element));
    }
  }

  return collect(root);
}

function collect(node) {
  return {
    anchor: node.anchor,
    title: node.title,
    text: node.text,
    content: node.parts.join(""),
    children: node.children.map(collect)
  };
}

/**
 * Build the tree for a single note.
 *
 * `data` is the note's front matter plus `noteId`; `html` is its rendered body.
 * The returned node is unnumbered — pass it through `numberForest` (transcluded
 * into a forest page) or `numberRoot` (shown on its own page).
 */
function buildNote(html, data, url) {
  const addr = data.noteId;
  const prefix = addr || slugify(data.title, "note");
  const $ = cheerio.load(html || "", null, false);
  namespaceFragments($, prefix);
  const body = sectionize($);

  return {
    anchor: prefix,
    addr,
    route: url,
    taxon: taxonFor(data),
    title: data.title,
    text: data.title,
    date: data.date,
    author: data.author,
    tags: (data.tags || []).filter((tag) => tag !== "pages" && tag !== "highlights"),
    content: body.content,
    children: body.children,
    showMetadata: true
  };
}

// Forester numbers a transcluded subtree by its position: `1`, then `1.1`.
function number(nodes, prefix) {
  nodes.forEach((node, index) => {
    node.number = prefix ? `${prefix}.${index + 1}` : String(index + 1);
    number(node.children, node.number);
  });
  return nodes;
}

/** Number notes transcluded into a forest page: each note is a numbered tree. */
function numberForest(nodes) {
  return number(nodes, "");
}

/** Number a note shown on its own page: the root is unnumbered, sections are not. */
function numberRoot(node) {
  node.number = "";
  number(node.children, "");
  return node;
}

module.exports = { buildNote, numberForest, numberRoot, taxonFor, slugify };
