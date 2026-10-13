// Forest interaction, following forester's `forester.js`.
//
// Trees are collapsible, so any jump to an address has to open the trees that
// contain it first — otherwise the target exists but is not laid out, and the
// browser has nowhere to scroll. Three entry points need that: the sidebar,
// in-document links, and arriving on a URL that already carries a fragment.

(function () {
  const reveal = (element) => {
    for (let node = element; node; node = node.parentNode) {
      if (node.nodeName === "DETAILS") node.open = true;
    }
  };

  const target = (hash) => {
    if (!hash || hash === "#") return null;
    try {
      return document.querySelector(hash);
    } catch {
      return null; // a fragment that is not a valid selector
    }
  };

  // The sidebar title scrolls in place; its bullet is a link to the canonical
  // address and is left alone.
  document.querySelectorAll("[data-target^='#']").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target.tagName === "A") return;
      const hash = element.getAttribute("data-target");
      const found = target(hash);
      if (!found) return;
      reveal(found);
      window.location.hash = hash;
    });
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link) return;
    const found = target(link.hash);
    if (found) reveal(found);
  });

  const revealCurrentHash = () => {
    const found = target(window.location.hash);
    if (!found) return;
    reveal(found);
    found.scrollIntoView();
  };
  window.addEventListener("hashchange", revealCurrentHash);
  revealCurrentHash();

  // Mark the tree being read, so the sidebar tracks position on long forests.
  const links = new Map();
  document.querySelectorAll("#toc [data-target^='#']").forEach((element) => {
    links.set(element.getAttribute("data-target").slice(1), element);
  });
  // Only trees the sidebar actually lists. The page's own root tree encloses
  // every other one, so observing it would keep winning the topmost-visible
  // comparison below and nothing else would ever read as current.
  const trees = [
    ...document.querySelectorAll("#grid-wrapper article details[id]")
  ].filter((tree) => links.has(tree.id));
  if (!links.size || !trees.length || !("IntersectionObserver" in window)) return;

  let active = null;
  const setActive = (id) => {
    if (id === active) return;
    if (active) links.get(active)?.removeAttribute("aria-current");
    links.get(id)?.setAttribute("aria-current", "location");
    active = id;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: "-10% 0px -72% 0px" }
  );
  trees.forEach((tree) => observer.observe(tree));
  setActive(trees[0].id);
})();
