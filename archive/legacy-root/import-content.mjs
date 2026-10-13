import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const reference = process.argv[2] || "origin/homepage-map";
const git = args => execFileSync("git", args, { maxBuffer: 32 * 1024 * 1024 });
const files = git(["ls-tree", "-r", "--name-only", reference]).toString().trim().split("\n");
const paneSources = {
  "src/about.md": "sections/intro.md",
  "src/pages/bookshelf.md": "sections/shelves.md",
  "src/pages/blog-roll.md": "sections/friends.md",
};

function metadata(markdown, key, fallback = "") {
  const header = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const match = header?.[1].match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, "") : fallback;
}

function writeFile(path, bytes) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, bytes);
}

function importNote(path) {
  const bytes = git(["show", `${reference}:${path}`]);
  const markdown = bytes.toString();
  const relative = path.slice(4);
  const destination = paneSources[path] || `content/${relative}`;
  writeFile(destination, bytes);
  return {
    id: relative.replace(/\.md$/, ""),
    source: destination,
    original: path,
    title: metadata(markdown, "title", relative.split("/").at(-1).replace(/\.md$/, "")),
    category: metadata(markdown, "category", relative.startsWith("highlights/") ? "highlights" : "unfiled"),
    date: metadata(markdown, "date"),
  };
}

const notes = files.filter(path => path.startsWith("src/") && path.endsWith(".md")).map(importNote);
let restoredAssets = 0;
const required = new Set(["src/assets/fonts/Fira_Code_v6.2/woff2/FiraCode-Regular.woff2"]);
for (const note of notes) {
  const markdown = git(["show", `${reference}:${note.original}`]).toString();
  for (const match of markdown.matchAll(/\/(?:assets|pages)\/[^\s"'<>]+/g)) {
    const asset = `src${decodeURIComponent(match[0].replace(/[)\],;]+$/, ""))}`;
    if (files.includes(asset) && !asset.endsWith(".md")) required.add(asset);
  }
}
for (const path of required) {
  const destination = path.slice(4);
  if (existsSync(destination)) continue;
  writeFile(destination, git(["show", `${reference}:${path}`]));
  restoredAssets++;
}
const commit = git(["rev-parse", reference]).toString().trim();
writeFile("content/index.json", JSON.stringify({ reference, commit, notes }, null, 2) + "\n");
console.log(`Imported ${notes.length} unchanged Markdown sources and ${restoredAssets} missing article assets from ${reference} (${commit.slice(0, 7)}).`);
