import { icon } from "./icons.js";
import { arrangeTiles } from "./tiling.js";
import { renderResearch } from "./research.js";

const sections = [
  { id: "intro", title: "Introduction", icon: "circle" },
  { id: "writing", title: "Writing", icon: "feather" },
  { id: "research", title: "Research areas", icon: "branch" },
  { id: "places", title: "Places traversed", icon: "pin" },
  { id: "shelves", title: "Shelves", icon: "bookmark" },
  { id: "friends", title: "Friends", icon: "people" },
];
const storageKey = "garden:panes:v1";
const workspace = document.querySelector("#workspace");
const menu = document.querySelector("#section-menu");
let openSections = restoreLayout();
let focusedSection = null;
let sceneryRequested = false;
let lastOpenSections = openSections.length ? [...openSections] : ["intro"];
const tiles = new Map();

function restoreLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(saved)) {
      return [...new Set(saved.filter(id => sections.some(section => section.id === id)))];
    }
  } catch {
    // Storage can be disabled; the workspace still works for this visit.
  }
  return sections.map(section => section.id);
}

function saveLayout() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(openSections));
  } catch {
    // Layout persistence is optional in browsers that disable storage.
  }
}

function createTile(section) {
  const tile = document.createElement("section");
  tile.className = "tile";
  tile.dataset.section = section.id;
  tile.setAttribute("aria-label", section.title);
  tile.innerHTML = `
      <div class="tile-actions" aria-label="${section.title} controls">
        <button type="button" data-action="focus" aria-label="Focus ${section.title}" aria-pressed="false">Expand</button>
        <button type="button" data-action="close" aria-label="Close ${section.title}">×</button>
      </div>
    <div class="tile-body" aria-busy="true">Loading…</div>`;
  tile.addEventListener("click", event => handleTileAction(event, section.id));
  return tile;
}

function handleTileAction(event, id) {
  const action = event.target.closest("button[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "close") {
    openSections = openSections.filter(sectionId => sectionId !== id);
    if (focusedSection === id) focusedSection = null;
  } else {
    focusedSection = focusedSection === id ? null : id;
  }
  updateLayout();
  if (action === "close") {
    const selector = openSections.length ? `#section-menu [data-section="${id}"]` : "#scenery";
    document.querySelector(selector).focus();
  }
}

function loadSection(section, tile) {
  const body = tile.querySelector(".tile-body");
  try {
    const template = document.querySelector(`#note-${section.id}`);
    if (!template) throw new Error("Note template unavailable");
    body.replaceChildren(template.content.cloneNode(true));
    for (const link of body.querySelectorAll('a[href^="en.wikipedia.org/"]')) {
      link.href = `https://${link.getAttribute("href")}`;
    }
    if (section.id === "research") renderResearch(body);
  } catch (error) {
    body.replaceChildren(document.createTextNode("This note could not be opened. "));
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Try again";
    retry.addEventListener("click", () => loadSection(section, tile));
    body.append(retry);
    console.error(`Could not load ${section.id}`, error);
  } finally {
    body.setAttribute("aria-busy", "false");
  }
}

function createMenuButton(section) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "rail-button";
  button.dataset.section = section.id;
  button.setAttribute("aria-label", section.title);
  button.append(icon(section.icon));
  button.addEventListener("click", () => toggleSection(section.id));
  return button;
}

function toggleSection(id) {
  const isOpen = openSections.includes(id);
  openSections = isOpen ? openSections.filter(sectionId => sectionId !== id) : [...openSections, id];
  focusedSection = null;
  sceneryRequested = false;
  updateLayout();
  if (!isOpen) workspace.querySelector(`[data-section="${id}"] button`).focus();
}

function updateLayout() {
  const visible = focusedSection ? [focusedSection] : openSections;
  for (const [id, tile] of tiles) {
    tile.hidden = !visible.includes(id);
    const focusButton = tile.querySelector('[data-action="focus"]');
    focusButton.textContent = focusedSection === id ? "Restore" : "Expand";
    focusButton.setAttribute("aria-pressed", String(focusedSection === id));
  }
  arrangeTiles(workspace, visible.map(id => tiles.get(id)));
  for (const button of menu.children) {
    button.setAttribute("aria-pressed", String(openSections.includes(button.dataset.section)));
  }
  workspace.classList.toggle("focused", visible.length === 1);
  const scenery = sceneryRequested || openSections.length === 0;
  document.body.classList.toggle("scenery", scenery);
  const sceneryButton = document.querySelector("#scenery");
  sceneryButton.setAttribute("aria-pressed", String(scenery));
  sceneryButton.textContent = scenery ? "Return to notes" : "View scenery";
  if (openSections.length) lastOpenSections = [...openSections];
  saveLayout();
}

function initialize() {
  workspace.replaceChildren();
  for (const section of sections) tiles.set(section.id, createTile(section));
  menu.append(...sections.map(createMenuButton));
  for (const control of document.querySelectorAll("[data-icon]")) control.append(icon(control.dataset.icon));
  updateLayout();
  for (const section of sections) loadSection(section, tiles.get(section.id));
}

document.querySelector("#reset-layout").addEventListener("click", () => {
  openSections = sections.map(section => section.id);
  focusedSection = null;
  sceneryRequested = false;
  updateLayout();
});

document.querySelector("#scenery").addEventListener("click", () => {
  const isScenery = document.body.classList.contains("scenery");
  sceneryRequested = !isScenery;
  if (isScenery && !openSections.length) openSections = [...lastOpenSections];
  updateLayout();
});

initialize();
