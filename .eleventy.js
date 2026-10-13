const forest = require("./lib/forest");
const { createHash } = require("node:crypto");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const bookmarkIndexCache = new WeakMap();

// The categories that have a section of their own under `/writing/`. Anything
// else lands in `unfiled`, which the writing index lists as "Everything else".
const SECTION_CATEGORIES = new Set([
  "lab",
  "problems",
  "stories",
  "slice-of-life",
  "commonplace"
]);

// The sections as the archive graph names them. `favs` is the old name of
// `highlights`; notes still carry it.
const SECTIONS = {
  highlights:  { title: "Highlights",        url: "/writing/highlights/" },
  lab:         { title: "Lab notebook",      url: "/writing/lab-notebook/" },
  problems:    { title: "Big social problems!", url: "/writing/problems/" },
  stories:     { title: "Stories",           url: "/writing/stories/" },
  "slice-of-life": { title: "Slice of life", url: "/writing/slice-of-life/" },
  commonplace: { title: "Commonplace",       url: "/writing/commonplace/" },
  unfiled:     { title: "Everything else",   url: "/writing/other/" }
};

function sectionOf(item) {
  const category = item.data.category;
  if (category === "favs" || category === "highlights") return "highlights";
  return SECTION_CATEGORIES.has(category) ? category : "unfiled";
}

// Internal links in a note's markdown, as site-absolute note URLs.
const NOTE_LINK = /(?:https?:\/\/adiabatic\.garden)?(\/(?:pages|highlights|favs)\/[a-z0-9-]+)\/?(?=[\s)"'#>]|$)/g;
function linkedNotes(raw) {
  const found = new Set();
  for (const match of String(raw || "").matchAll(NOTE_LINK)) {
    found.add(match[1].replace(/^\/favs\//, "/highlights/") + "/");
  }
  return found;
}

const STOPWORDS = new Set([
  "the","and","for","are","but","not","you","all","can","had","her","was",
  "one","our","out","has","have","been","some","them","than","its","over",
  "such","that","this","with","will","which","what","when","where","how",
  "about","into","through","during","before","after","above","below",
  "between","under","because","just","also","very","more","most","few",
  "then","own","same","here","there","please","etc","via","from","they",
  "their","would","could","should","may","might","these","those",
  "each","every","both","any","http","https","www","com","org","net","edu"
]);

function tokenize(text, weight) {
  const tokens = [];
  const cleaned = String(text || "").replace(/<[^>]*>/g, " ")
    .toLowerCase()
    .replace(/[#_\-/\[\](){}"'.,!?;:«»]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const token of cleaned.split(/\s+/)) {
    if (token.length >= 3 && !STOPWORDS.has(token)) {
      for (let index = 0; index < weight; index++) tokens.push(token);
    }
  }
  return tokens;
}

module.exports = function(eleventyConfig) {
  // A new asset URL prevents cached CSS/JS from mismatching newly built pages.
  eleventyConfig.addFilter("assetUrl", function(assetPath) {
    const content = readFileSync(path.join(__dirname, "src", assetPath));
    const version = createHash("sha256").update(content).digest("hex").slice(0, 12);
    return `${assetPath}?v=${version}`;
  });

  // Pass-through copy of static folders
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/archive");
  eleventyConfig.addPassthroughCopy({
    "node_modules/computer-modern/fonts/cmu-typewriter-text-200-roman.woff2":
      "assets/fonts/cmu-typewriter-text-200-roman.woff2"
  });
  
  // Pass-through copy of media files at the root level of src
  eleventyConfig.addPassthroughCopy("src/*.png");
  eleventyConfig.addPassthroughCopy("src/*.jpg");
  eleventyConfig.addPassthroughCopy("src/*.webp");
  eleventyConfig.addPassthroughCopy("src/*.mp4");
  eleventyConfig.addPassthroughCopy("src/pages/*.md");
  eleventyConfig.addPassthroughCopy({
    "src/pages/sleep-deprivation.pdf": "pages/sleep-deprivation.pdf"
  });
  eleventyConfig.addPassthroughCopy("src/highlights/*.md");
  eleventyConfig.addPassthroughCopy("src/sitemap.xml");
  eleventyConfig.addPassthroughCopy({"03. Deep Space Travels.mp3": "03. Deep Space Travels.mp3"});
  eleventyConfig.addPassthroughCopy({"llms.txt": "llms.txt"});

  // YouTube embed shortcode
  eleventyConfig.addShortcode("youtube", function(id) {
    return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0; border: 1px solid #bcc0cc; border-radius: 4px;">
  <iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
</div>`;
  });

  // Date formatting filter matching MM-DD-YYYY
  eleventyConfig.addFilter("formatDate", function(dateObj) {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${month}-${day}-${year}`;
  });

  eleventyConfig.addFilter("jsonify", function(value) {
    return JSON.stringify(value);
  });

  eleventyConfig.addFilter("articleJsonLd", function(person, title, date, url) {
    const { "@context": _context, ...author } = person;
    const article = {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `https://adiabatic.garden${url}#article`,
      headline: title,
      url: `https://adiabatic.garden${url}`,
      author
    };
    if (date) {
      article.datePublished = date instanceof Date
        ? date.toISOString().slice(0, 10)
        : String(date);
    }
    return article;
  });

  // Compose a collection into one forester-style document: every note becomes a
  // numbered, separately-addressable tree whose own headings are its subtrees.
  eleventyConfig.addFilter("forestTrees", function(notes) {
    const trees = (notes || []).map((note) =>
      forest.buildNote(note.templateContent, note.data, note.url)
    );
    return forest.numberForest(trees);
  });

  // The same rendering for a note on its own page: it is the root of the tree,
  // so it carries no number of its own and its sections number from one.
  eleventyConfig.addFilter("forestTree", function(html, data, url) {
    return forest.numberRoot(forest.buildNote(html, data, url));
  });

  eleventyConfig.addFilter("containsMath", function(content) {
    return /(^|[^\\])\${1,2}\S[\s\S]*?\${1,2}/m.test(content || "");
  });

  // Related bookmarks from curius via text similarity
  eleventyConfig.addFilter("relatedBookmarks", function(curius, title, tags, content, maxResults = 5) {
    if (!curius || !curius.length) return [];

    const pageTokens = [
      ...tokenize(title, 3),
      ...tokenize((tags || []).join(" "), 3),
      ...tokenize(content, 1),
    ];

    let index = bookmarkIndexCache.get(curius);
    if (!index) {
      const tokenSets = curius.map((bookmark) => [
        ...tokenize(bookmark.title, 3),
        ...tokenize((bookmark.topics || []).join(" "), 3),
        ...tokenize(bookmark.snippet, 1),
      ]);
      const docFreq = new Map();
      for (const tokens of tokenSets) {
        for (const token of new Set(tokens)) {
          docFreq.set(token, (docFreq.get(token) || 0) + 1);
        }
      }

      const size = curius.length;
      const idfFor = (token) => Math.log((size + 1) / ((docFreq.get(token) || 0) + 1)) + 1;
      const bookmarks = curius.map((bookmark, bookmarkIndex) => {
        const frequency = new Map();
        for (const token of tokenSets[bookmarkIndex]) {
          frequency.set(token, (frequency.get(token) || 0) + 1);
        }
        let magnitudeSquared = 0;
        for (const [token, count] of frequency) {
          const value = count * idfFor(token);
          magnitudeSquared += value * value;
        }
        return { bookmark, frequency, magnitude: Math.sqrt(magnitudeSquared) };
      });
      index = { bookmarks, idfFor };
      bookmarkIndexCache.set(curius, index);
    }

    const queryFrequency = new Map();
    for (const token of pageTokens) {
      queryFrequency.set(token, (queryFrequency.get(token) || 0) + 1);
    }
    const queryWeights = new Map();
    let queryMagnitudeSquared = 0;
    for (const [token, count] of queryFrequency) {
      const value = count * index.idfFor(token);
      queryWeights.set(token, value);
      queryMagnitudeSquared += value * value;
    }
    const queryMagnitude = Math.sqrt(queryMagnitudeSquared);

    return index.bookmarks
      .map(({ bookmark, frequency, magnitude }) => {
        let dot = 0;
        for (const [token, queryValue] of queryWeights) {
          const bookmarkCount = frequency.get(token);
          if (bookmarkCount) {
            dot += queryValue * bookmarkCount * index.idfFor(token);
          }
        }
        const score = queryMagnitude && magnitude ? dot / (queryMagnitude * magnitude) : 0;
        return { bookmark, score };
      })
      .filter(({ score }) => score > 0.08)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(({ bookmark }) => bookmark);
  });

  // Dynamic collections sorted by date (newest first)
  eleventyConfig.addCollection("highlights", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/highlights/*.md").sort((a, b) => b.date - a.date);
  });

  // Every note, whichever section claims it — the count the writing index prints.
  eleventyConfig.addCollection("notes", function(collectionApi) {
    return collectionApi.getFilteredByGlob(["src/pages/*.md", "src/highlights/*.md"])
      .sort((a, b) => b.date - a.date);
  });

  // Notes no section claims: a category of their own, or none at all. Without
  // this the writing index would silently drop them.
  eleventyConfig.addCollection("unfiled", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/*.md")
      .filter(item => !SECTION_CATEGORIES.has(item.data.category))
      .sort((a, b) => b.date - a.date);
  });
  
  eleventyConfig.addCollection("lab", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/*.md")
      .filter(item => item.data.category === "lab")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("problems", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/*.md")
      .filter(item => item.data.category === "problems")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("commonplace", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/*.md")
      .filter(item => item.data.category === "commonplace")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("slice-of-life", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/*.md")
      .filter(item => item.data.category === "slice-of-life")
      .sort((a, b) => b.date - a.date);
  });

  // Every page on the site as one graph: home, the sections, every note, and
  // the links between notes. `src/archive-graph.njk` serialises it and
  // `js/archive-graph.js` draws it.
  eleventyConfig.addCollection("graph", function(collectionApi) {
    const notes = collectionApi.getFilteredByGlob(["src/pages/*.md", "src/highlights/*.md"]);
    const nodes = [
      { id: "/", title: "adiabatic.garden", group: "home" },
      { id: "/about/", title: "About", group: "home" },
      { id: "/writing/", title: "Writing", group: "home" },
      { id: "/archive/", title: "Archive", group: "home" }
    ];
    const edges = [["/", "/about/"], ["/", "/writing/"], ["/", "/archive/"]];
    for (const [key, section] of Object.entries(SECTIONS)) {
      nodes.push({ id: section.url, title: section.title, group: key });
      edges.push(["/writing/", section.url]);
    }
    const known = new Set(nodes.map(node => node.id));
    for (const note of notes) {
      const group = sectionOf(note);
      nodes.push({ id: note.url, title: note.data.title || note.fileSlug, group, date: note.date });
      known.add(note.url);
      edges.push([SECTIONS[group].url, note.url]);
    }
    for (const note of notes) {
      for (const target of linkedNotes(note.rawInput)) {
        if (known.has(target) && target !== note.url) edges.push([note.url, target]);
      }
    }
    return [{ nodes, edges }];
  });

  eleventyConfig.addCollection("stories", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/*.md")
      .filter(item => item.data.category === "stories")
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
