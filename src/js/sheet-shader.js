import { ShaderMount } from "./vendor/paper-shaders/shader-mount.js";
import { paperTextureFragmentShader } from "./vendor/paper-shaders/shaders/paper-texture.js";
import { getShaderColorFromString } from "./vendor/paper-shaders/get-shader-color-from-string.js";
import { getShaderNoiseTexture } from "./vendor/paper-shaders/get-shader-noise-texture.js";

// Tuned at shaders.paper.design/paper-texture. The image and a seed are added
// per sheet.
const texture = {
  u_fit: 1,
  u_scale: 0.9,
  u_rotation: 0,
  u_offsetX: 0,
  u_offsetY: 0,
  u_originX: 0.5,
  u_originY: 0.5,
  u_worldWidth: 0,
  u_worldHeight: 0,
  u_isImage: true,
  u_colorBack: getShaderColorFromString("#ffffff00"),
  u_colorPaper: getShaderColorFromString("#ffffffb5"),
  u_colorShadow: getShaderColorFromString("#d1d1d1"),
  u_blending: 1,
  u_distortion: 1,
  u_clip: true,
  u_angle: 236,
  u_roughness: 0.2,
  u_roughnessSize: 0.23,
  u_roughnessRows: 0,
  u_fiber: 0.5,
  u_fiberSize: 0.5,
  u_folds: 0.38,
  u_foldSizeX: 1,
  u_foldSizeY: 0.8,
  u_foldOffsetX: 0.4,
  u_foldOffsetY: 0,
  u_wrinkles: 0,
  u_wrinkleSize: 0.75,
  u_crumples: 0,
  u_crumpleCount: 9,
  u_drops: 0,
};
const seed = 613;

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

// An SVG used as an image may not fetch anything, so the stylesheet is
// inlined with its font embedded; otherwise the redrawn text loses Fira Code.
async function inlineStyles() {
  const sheetUrl = new URL("../css/garden.css", import.meta.url);
  let css = await (await fetch(sheetUrl)).text();
  for (const [, path] of css.matchAll(/url\("(\.\.\/assets\/fonts\/[^"]+)"\)/g)) {
    css = css.replace(path, await toDataUrl(new URL(path, sheetUrl)));
  }
  return css;
}

// The shader bends an image, not DOM, so the sheet is first drawn into an SVG
// foreignObject at twice its size and handed over as a texture.
async function rasterize(sheet, styles) {
  const { offsetWidth: width, offsetHeight: height } = sheet;
  const copy = sheet.cloneNode(true);
  copy.style.cssText = "position:relative;inset:auto;rotate:none;filter:none;margin:0;overflow:hidden";
  for (const img of copy.querySelectorAll("img")) img.src = await toDataUrl(img.src);
  const wrapper = document.createElement("div");
  const { fontSize, color } = getComputedStyle(sheet);
  wrapper.className = "desk-ready";
  wrapper.style.cssText = `font:400 ${fontSize}/1.7 "Fira Code",monospace;color:${color}`;
  const style = document.createElement("style");
  style.textContent = styles;
  wrapper.append(style, copy);
  const xhtml = new XMLSerializer().serializeToString(wrapper);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="${height * 2}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">${xhtml}</foreignObject></svg>`;
  return loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
}

function mount(sheet, image, noise, index) {
  const host = document.createElement("div");
  host.className = "sheet-shader";
  const uniforms = {
    ...texture,
    u_image: image,
    u_noiseTexture: noise,
    u_seed: seed + index * 61,
  };
  new ShaderMount(host, paperTextureFragmentShader, uniforms, undefined, 0);
  sheet.prepend(host);
  sheet.classList.add("shaded");
}

// Sheets keep their plain CSS paper if anything here fails (no WebGL, a
// browser that refuses SVG textures), so errors are logged, not thrown.
export async function shadeSheets(sheets) {
  try {
    const styles = await inlineStyles();
    const noise = getShaderNoiseTexture();
    await Promise.all([noise.decode(), document.fonts.ready]);
    const images = await Promise.all(sheets.map(sheet => rasterize(sheet, styles)));
    sheets.forEach((sheet, index) => mount(sheet, images[index], noise, index));
  } catch (error) {
    console.error("Paper shader unavailable; keeping flat sheets", error);
  }
}
