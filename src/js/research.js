const svgNamespace = "http://www.w3.org/2000/svg";
const nodeWidth = 164;
const columnWidth = 194;

function readBranch(item) {
  const label = item.cloneNode(true);
  label.querySelector("ul")?.remove();
  const children = item.querySelector(":scope > ul");
  return {
    label: label.textContent.trim(),
    href: label.querySelector("a")?.getAttribute("href"),
    children: children ? [...children.children].map(readBranch) : [],
  };
}

function readGroups(body) {
  return [...body.querySelectorAll("h3")].filter(heading =>
    ["Engineering", "Society"].includes(heading.textContent.trim()),
  ).map(heading => ({
    label: heading.textContent.trim(),
    children: [...heading.nextElementSibling.children].map(readBranch),
    sources: [heading, heading.nextElementSibling],
  }));
}

function positionBranch(node, depth, cursor, nodes, edges, group) {
  node.x = 24 + depth * columnWidth;
  node.group = group;
  if (node.children.length) {
    for (const child of node.children) {
      positionBranch(child, depth + 1, cursor, nodes, edges, group);
      edges.push([node, child]);
    }
    node.y = node.children.reduce((sum, child) => sum + child.y, 0) / node.children.length;
  } else {
    node.y = cursor.y;
    cursor.y += 100;
  }
  nodes.push(node);
}

function createNode(node) {
  const card = document.createElement(node.href ? "a" : "div");
  card.className = `research-node ${node.group.toLowerCase()}`;
  card.style.left = `${node.x}px`;
  card.style.top = `${node.y}px`;
  if (node.href) card.href = node.href;
  const rank = node.label.match(/\[(\d+)\]$/)?.[1];
  card.dataset.recency = rank || "";
  const name = document.createElement("span");
  name.textContent = node.label.replace(/\s*\[\d+\]$/, "");
  const caption = document.createElement("small");
  caption.textContent = rank ? `${rank === "1" ? "most recent" : "recency"} [${rank}]` : node.label === node.group ? "research branch" : node.group;
  card.append(name, caption);
  return card;
}

function createConnectors(edges, width, height) {
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");
  for (const [source, target] of edges) {
    const path = document.createElementNS(svgNamespace, "path");
    const startX = source.x + nodeWidth;
    const middleX = (startX + target.x) / 2;
    path.setAttribute("d", `M ${startX} ${source.y + 34} H ${middleX} V ${target.y + 34} H ${target.x}`);
    path.setAttribute("class", source.group.toLowerCase());
    svg.append(path);
  }
  return svg;
}

function addZoomControls(map, viewport, stage, canvas, width, height) {
  let scale = 1;
  const controls = document.createElement("div");
  controls.className = "research-controls";
  const legend = document.createElement("span");
  legend.textContent = "EXPLORATION MAP · [1] MOST RECENT";
  controls.append(legend);
  const applyScale = value => {
    scale = Math.max(0.65, Math.min(1.6, value));
    canvas.style.transform = `scale(${scale})`;
    stage.style.width = `${width * scale}px`;
    stage.style.height = `${height * scale}px`;
  };
  for (const [label, title, change] of [["−", "Zoom out", -0.15], ["+", "Zoom in", 0.15], ["Fit", "Fit map", 0]]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-label", title);
    button.addEventListener("click", () => applyScale(change ? scale + change : viewport.clientWidth / width));
    controls.append(button);
  }
  map.prepend(controls);
  let previousWidth = 0;
  const observer = new ResizeObserver(() => {
    if (!viewport.clientWidth || viewport.clientWidth === previousWidth) return;
    previousWidth = viewport.clientWidth;
    applyScale(previousWidth / width);
  });
  observer.observe(viewport);
}

function createMap(groups) {
  const nodes = [];
  const edges = [];
  const cursor = { y: 24 };
  for (const group of groups) {
    positionBranch(group, 0, cursor, nodes, edges, group.label);
    cursor.y += 24;
  }
  const width = Math.max(...nodes.map(node => node.x)) + nodeWidth + 24;
  const height = cursor.y;
  const map = document.createElement("div");
  map.className = "research-map";
  const viewport = document.createElement("div");
  viewport.className = "research-viewport";
  viewport.tabIndex = 0;
  viewport.setAttribute("role", "region");
  viewport.setAttribute("aria-label", "Research cladogram. Scroll to explore the branches.");
  const stage = document.createElement("div");
  const canvas = document.createElement("div");
  canvas.className = "research-canvas";
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.append(createConnectors(edges, width, height), ...nodes.map(createNode));
  stage.append(canvas);
  viewport.append(stage);
  map.append(viewport);
  addZoomControls(map, viewport, stage, canvas, width, height);
  return map;
}

export function renderResearch(body) {
  const groups = readGroups(body);
  if (!groups.length) return;
  groups[0].sources[0].before(createMap(groups));
  for (const group of groups) group.sources.forEach(element => element.remove());
}
