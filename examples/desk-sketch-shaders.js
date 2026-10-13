// Shader variants for desk-sketch-prints.html, picked by URL hash tokens joined
// with "+": a backdrop (#wood, #water, default frosted scenery) and optionally
// #paper to fold the text sheets. Needs http: WebGL cannot read file:// images.
const cdn = "https://esm.sh/@paper-design/shaders@0.0.81";
const tokens = location.hash.slice(1).split("+");
const backdrop = tokens.find(token => ["wood", "water"].includes(token)) ?? "scenery";
document.body.classList.add(backdrop);

function sizing(paper, fit) {
  const entries = Object.entries(paper.defaultObjectSizing).map(([key, value]) => [`u_${key}`, value]);
  return { ...Object.fromEntries(entries), u_fit: paper.ShaderFitOptions[fit] };
}

async function loadImage(src) {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}

async function toDataUrl(url) {
  const blob = await (await fetch(url)).blob();
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// Settings from shaders.paper.design/water, except fit: cover fills the stage.
async function mountWater(paper) {
  const uniforms = {
    ...sizing(paper, "cover"),
    u_image: await loadImage("../originals/open-world.jpg"),
    u_colorBack: paper.getShaderColorFromString("#8f8f8f"),
    u_colorHighlight: paper.getShaderColorFromString("#ffffff"),
    u_highlights: 0.07,
    u_layering: 0.5,
    u_edges: 0.41,
    u_waves: 0.3,
    u_caustic: 0.1,
    u_size: 1,
  };
  new paper.ShaderMount(document.querySelector(".backdrop"), paper.waterFragmentShader, uniforms, undefined, 0.25);
}

// An SVG used as an image may not fetch anything, so the web font has to be
// inlined or the rasterised sheets fall back to a system monospace.
async function inlineStyles() {
  const fontLink = document.querySelector('link[href*="fonts.googleapis"]');
  let css = await (await fetch(fontLink.href)).text();
  for (const url of new Set(css.match(/https:[^)]+\.woff2/g))) {
    css = css.replaceAll(url, await toDataUrl(url));
  }
  return css + document.querySelector("style").textContent;
}

// The paper shader bends an image, not DOM, so each sheet is first drawn into
// an SVG foreignObject and handed over as a texture.
async function rasterize(sheet, styles) {
  const { offsetWidth: width, offsetHeight: height } = sheet;
  const copy = sheet.cloneNode(true);
  copy.style.cssText = "position:relative;left:0;top:0;rotate:none;filter:none;margin:0";
  for (const img of copy.querySelectorAll("img")) img.src = await toDataUrl(img.src);
  const wrapper = document.createElement("div");
  const { fontSize, color } = getComputedStyle(sheet);
  wrapper.style.cssText = `font:400 ${fontSize}/1.7 "Fira Code",monospace;color:${color}`;
  const style = document.createElement("style");
  style.textContent = styles;
  wrapper.append(style, copy);
  const xhtml = new XMLSerializer().serializeToString(wrapper);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="${height * 2}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">${xhtml}</foreignObject></svg>`;
  return loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
}

// Settings from shaders.paper.design/paper-texture; the seed varies per sheet.
function paperUniforms(paper, image, noise, seed) {
  return {
    ...sizing(paper, "contain"),
    u_scale: 0.9,
    u_image: image,
    u_isImage: true,
    u_noiseTexture: noise,
    u_colorBack: paper.getShaderColorFromString("#ffffff00"),
    u_colorPaper: paper.getShaderColorFromString("#ffffffb5"),
    u_colorShadow: paper.getShaderColorFromString("#b3b3b3"),
    u_blending: 1,
    u_distortion: 1,
    u_clip: true,
    u_angle: 236,
    u_seed: seed,
    u_roughness: 0.15,
    u_roughnessSize: 0.25,
    u_roughnessRows: 0,
    u_fiber: 0.5,
    u_fiberSize: 0.5,
    u_folds: 0.38,
    u_foldSizeX: 1,
    u_foldSizeY: 1,
    u_foldOffsetX: 0,
    u_foldOffsetY: 0.37,
    u_wrinkles: 0,
    u_wrinkleSize: 0.75,
    u_crumples: 0,
    u_crumpleCount: 9,
    u_drops: 0,
  };
}

async function mountPapers(paper) {
  const styles = await inlineStyles();
  const noise = paper.getShaderNoiseTexture();
  await noise.decode();
  const sheets = [...document.querySelectorAll(".paper")];
  const images = await Promise.all(sheets.map(sheet => rasterize(sheet, styles)));
  sheets.forEach((sheet, index) => {
    const host = document.createElement("div");
    host.className = "sheet-shader";
    sheet.prepend(host);
    sheet.classList.add("shaded");
    const uniforms = paperUniforms(paper, images[index], noise, 613 + index * 61);
    new paper.ShaderMount(host, paper.paperTextureFragmentShader, uniforms, undefined, 0);
  });
}

if (backdrop === "water" || tokens.includes("paper")) {
  const paper = await import(cdn);
  if (backdrop === "water") await mountWater(paper);
  if (tokens.includes("paper")) await mountPapers(paper);
}
