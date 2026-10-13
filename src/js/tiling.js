function splitTiles(tiles, depth = 0) {
  if (tiles.length === 1) return tiles[0];
  const split = document.createElement("div");
  split.className = `bsp-split ${depth % 2 === 0 ? "vertical" : "horizontal"}`;
  const midpoint = Math.floor(tiles.length / 2);
  split.append(
    splitTiles(tiles.slice(0, midpoint), depth + 1),
    splitTiles(tiles.slice(midpoint), depth + 1),
  );
  return split;
}

export function arrangeTiles(workspace, tiles) {
  workspace.replaceChildren();
  if (tiles.length) workspace.append(splitTiles(tiles));
}
