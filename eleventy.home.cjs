const configure = require("./.eleventy.js");

// Only the modules the paper-texture shader imports, so the browser never
// downloads the rest of the shader library.
const shaderModules = [
  "shader-mount.js",
  "vertex-shader.js",
  "shader-sizing.js",
  "shader-utils.js",
  "get-shader-color-from-string.js",
  "get-shader-noise-texture.js",
  "shaders/paper-texture.js",
];

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/about.md");
  eleventyConfig.addPassthroughCopy("src/sections/*.md");
  for (const file of shaderModules) {
    eleventyConfig.addPassthroughCopy({
      [`node_modules/@paper-design/shaders/dist/${file}`]: `js/vendor/paper-shaders/${file}`,
    });
  }
  return configure(eleventyConfig);
};
