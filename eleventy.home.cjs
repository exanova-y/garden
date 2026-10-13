const configure = require("./.eleventy.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/about.md");
  eleventyConfig.addPassthroughCopy("src/sections/*.md");
  return configure(eleventyConfig);
};
