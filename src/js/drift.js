// Loose feathers blow across the desk in gusts, from the top left corner down
// to anywhere along the bottom edge.
// Ginkgo leaves stand in for the feathers the names below still refer to.
const FEATHERS = ["ginkgo-green", "ginkgo-green-yellow", "ginkgo-rainbow", "ginkgo-yellow"];
const MEAN_GAP = 10; // seconds between gusts
const GAP_SPREAD = 1; // standard deviation of that gap, in seconds
const LEAST_PER_GUST = 2;
const MOST_PER_GUST = 5;
// Velocities are a [slowest, fastest] range in percent of the desk per second,
// so a feather takes as long to cross a phone as a wide monitor.
const X_VELOCITY = [5, 10]; // rightward, percent of desk width per second
const Y_VELOCITY = [5, 10]; // downward, percent of desk height per second
const FALL = 150; // percent of desk height; clears the bottom edge from any entry

const between = (low, high) => low + Math.random() * (high - low);

// Box–Muller transform: two uniform samples make one normal sample.
function gaussian(mean, deviation) {
  const radius = Math.sqrt(-2 * Math.log(1 - Math.random()));
  return mean + deviation * radius * Math.cos(2 * Math.PI * Math.random());
}

// A leaf turns as it falls but the light does not. Its shadow is therefore a
// second, blackened copy of the image: both turn together, the copy from a
// fixed offset to the lower left (set in garden.css).
function leafImages() {
  const src = `assets/desk/${FEATHERS[Math.floor(Math.random() * FEATHERS.length)]}.webp`;
  return ["shade", "leaf"].map(name => {
    const image = new Image();
    image.src = src;
    image.alt = "";
    image.className = name;
    return image;
  });
}

function releaseFeather(table) {
  const drifter = document.createElement("div");
  drifter.className = "drifter";
  // Half enter over the left edge and half over the top, both near the corner.
  const overLeftEdge = Math.random() < 0.5;
  const left = overLeftEdge ? -12 : between(-5, 35);
  drifter.style.left = `${left}%`;
  drifter.style.top = overLeftEdge ? `${between(-5, 35)}%` : "-30%";
  drifter.style.width = `${between(3, 7)}em`;
  drifter.style.setProperty("--phase", Math.random());
  const images = leafImages();
  drifter.append(...images);
  table.append(drifter);

  const turn = between(-40, 40);
  const turns = [`${turn}deg`, `${turn + between(-90, 90)}deg`];
  const seconds = FALL / between(...Y_VELOCITY);
  // A feather entering over the left edge drifts at least far enough to be seen.
  const across = Math.max(between(...X_VELOCITY) * seconds, -left);
  const path = ["0 0", `${(across / 100) * table.clientWidth}px ${(FALL / 100) * table.clientHeight}px`];
  const timing = { duration: seconds * 1000, delay: between(0, 2000) };
  const flight = drifter.animate({ translate: path }, timing);
  for (const image of images) image.animate({ rotate: turns }, timing);
  flight.finished.then(() => drifter.remove());
}

export function driftFeathers(table) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const gust = () => {
    // A hidden tab pauses nothing by itself, so feathers would pile up unseen.
    const spread = MOST_PER_GUST - LEAST_PER_GUST + 1;
    const count = document.hidden ? 0 : LEAST_PER_GUST + Math.floor(Math.random() * spread);
    for (let released = 0; released < count; released++) releaseFeather(table);
    setTimeout(gust, Math.max(1, gaussian(MEAN_GAP, GAP_SPREAD)) * 1000);
  };
  setTimeout(gust, MEAN_GAP * 1000);
}
