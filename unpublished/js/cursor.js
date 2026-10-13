// Snowfall trailing the cursor, by way of cursorly.js.
//
// Replaces oneko, the cat that used to chase the pointer around. The library
// is loaded from jsDelivr just ahead of this file; see `index.html`.

(function () {
  if (typeof Cursorly === "undefined") return;

  // A trail is decoration: no pointer, no hover, or a reader who asked for
  // less motion all mean there is nothing worth drawing.
  const wanted = matchMedia("(pointer: fine)").matches
    && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!wanted) return;

  const cursor = Cursorly.init({
    effect: {
      name: "snowfall",
      color: "#ffffff",
      density: 3,
      size: [2, 5],
      decay: 0.97
    }
  });

  // The library hides the system pointer and repaints one from a hotlinked
  // icons8 PNG. We only want the snow, and a pointer that depends on a third
  // party is a pointer that can go missing, so the real one stays.
  cursor.cursorImage = null;
  document.body.style.cursor = "";
  document.documentElement.style.cursor = "";
})();
