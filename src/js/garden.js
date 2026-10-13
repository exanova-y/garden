import { driftFeathers } from "./drift.js";
import { openSheet } from "./reader.js";
import { shadeSheets } from "./sheet-shader.js";

const table = document.querySelector(".table");
const sheets = [...table.querySelectorAll(".paper")];
// Read from the stylesheet link so the breakpoint is defined in one place.
const stacked = matchMedia(document.querySelector("#stacked-styles").media).matches;

for (const link of table.querySelectorAll('a[href^="en.wikipedia.org/"]')) {
  link.href = `https://${link.getAttribute("href")}`;
}

// On the desk a note is one large button; its links are reached in the reader.
// The intro card opens the whole About page rather than its own few lines.
function makeOpenable(sheet) {
  sheet.querySelector(".sheet-body").inert = true;
  sheet.tabIndex = 0;
  sheet.setAttribute("role", "button");
  sheet.setAttribute("aria-label", `Open ${sheet.dataset.sheet}`);
  sheet.addEventListener("click", () => openSheet(sheet));
  sheet.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openSheet(sheet);
  });
}

// Objects are images with transparent corners that sit on top of sheets, so a
// click on one opens whichever sheet lies beneath that point. An object grouped
// with a sheet opens that sheet instead.
function openSheetBeneath(event) {
  const paired = event.currentTarget.dataset.opens;
  const sheet = paired
    ? table.querySelector(`.paper.${paired}`)
    : document.elementsFromPoint(event.clientX, event.clientY).find(element => element.matches(".paper[data-sheet]"));
  if (sheet) openSheet(sheet);
}

if (!stacked) {
  table.classList.add("desk-ready");
  sheets.filter(sheet => sheet.dataset.sheet).forEach(makeOpenable);
  for (const object of table.querySelectorAll(".object")) object.addEventListener("click", openSheetBeneath);
  shadeSheets(sheets);
  driftFeathers(table);
}
