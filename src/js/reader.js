const dialog = document.querySelector("#reader");
const clip = dialog.querySelector(".reader-clip");
const flow = dialog.querySelector(".reader-flow");
const folio = dialog.querySelector(".reader-folio");
let page = 0;

// Each overflow column is one page: as wide as the clip, plus the gap.
function pageStep() {
  return clip.clientWidth + parseFloat(getComputedStyle(flow).columnGap);
}

function turnTo(target) {
  const step = pageStep();
  const count = Math.max(1, Math.round((flow.scrollWidth + step - clip.clientWidth) / step));
  page = Math.min(Math.max(target, 0), count - 1);
  flow.style.transform = `translateX(${-page * step}px)`;
  folio.textContent = `${page + 1} / ${count}`;
  dialog.querySelector('[data-turn="-1"]').disabled = page === 0;
  dialog.querySelector('[data-turn="1"]').disabled = page === count - 1;
}

export function openSheet(sheet) {
  const body = sheet.querySelector(".sheet-body").cloneNode(true);
  flow.replaceChildren(...body.childNodes);
  dialog.setAttribute("aria-label", sheet.dataset.sheet);
  dialog.showModal();
  turnTo(0);
}

dialog.addEventListener("click", event => {
  const turn = event.target.closest("[data-turn]");
  if (turn) turnTo(page + Number(turn.dataset.turn));
  // The dialog element itself is only hit on its backdrop.
  if (event.target === dialog || event.target.closest("[data-close]")) dialog.close();
});

dialog.addEventListener("keydown", event => {
  if (event.key === "ArrowRight") turnTo(page + 1);
  if (event.key === "ArrowLeft") turnTo(page - 1);
});

// Tabbing to a link on another page scrolls the clip; follow it properly.
flow.addEventListener("focusin", event => {
  clip.scrollLeft = 0;
  const offset = event.target.getBoundingClientRect().left - flow.getBoundingClientRect().left;
  turnTo(Math.floor(offset / pageStep()));
});

// Opening a <details> list or resizing the window changes the page count.
flow.addEventListener("toggle", () => turnTo(page), true);
window.addEventListener("resize", () => dialog.open && turnTo(page));
