// Day and night.
//
// Day is the default on the reading pages — the writing index, a tag, a note:
// they open on white unless the reader has chosen night before. The class
// lands on `<html>` from inside `<head>`, before the first paint, so the wrong
// theme never flashes; the switch itself waits for the body to exist. See the
// "Day mode" section of `css/style.css`.

(function () {
  const KEY = "theme";
  const root = document.documentElement;

  // Private browsing can make `localStorage` throw on access, not just on write.
  const read = () => {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  };

  const write = (theme) => {
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* the choice lasts for this page only */
    }
  };

  // Anything other than an explicit "night" — including no preference at all —
  // is day.
  const apply = (theme) => root.classList.toggle("day-mode", theme !== "night");

  apply(read());

  document.addEventListener("DOMContentLoaded", function () {
    // Day mode dresses the reading pages — the writing index, a tag, a note.
    // Elsewhere there is nothing for the switch to change, so it stays away.
    if (!document.body.classList.contains("page-forest")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-switch";

    // The icon shows the mode on offer, not the one in use.
    const sync = () => {
      const day = root.classList.contains("day-mode");
      button.textContent = day ? "☾" : "☀";
      button.title = day ? "Switch to night" : "Switch to day";
      button.setAttribute("aria-label", button.title);
      button.setAttribute("aria-pressed", String(!day));
    };

    button.addEventListener("click", function () {
      const theme = root.classList.contains("day-mode") ? "night" : "day";
      apply(theme);
      write(theme);
      sync();
    });

    sync();
    document.body.appendChild(button);
  });
})();
