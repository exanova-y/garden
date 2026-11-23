const { readFileSync } = require("node:fs");
const cheerio = require("cheerio");

// data/reads.xml is a copy of reads.xml from the digest repo (`scan reads`).
// /feed/ lists its items as plain text.

// Items tagged before the topic was renamed in the digest.
const ALIAS = { physics: "applied physics" };
module.exports = function () {
  const $ = cheerio.load(readFileSync("data/reads.xml", "utf8"), { xml: true });
  const items = $("item").toArray().map((element) => {
    const item = $(element);
    const [summary, ...via] = item.find("description").text().split(/\n\s*\n/);
    return {
      title: item.find("title").text(),
      link: item.find("link").text(),
      date: new Date(item.find("pubDate").text()).toISOString().slice(0, 10),
      categories: item.find("category").toArray().map((c) => ALIAS[$(c).text()] || $(c).text()),
      summary: summary.trim(),
      via: via.join(" ").trim(),
    };
  });
  // Items per topic, shown beside each checkbox on /feed/.
  const count = {};
  for (const item of items) {
    for (const topic of item.categories) count[topic] = (count[topic] || 0) + 1;
  }
  return { items, count };
};
