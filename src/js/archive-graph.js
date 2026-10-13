// Every page on the site, drawn as a graph.
//
// `/archive/graph.json` is written at build time (see the `graph` collection in
// `.eleventy.js`): the front door, the sections, every note, and the links
// between notes. Any element with `data-graph="full"` or `data-graph="compact"`
// gets a canvas; compact is the homepage box, full is `/archive/`. Plain
// force-directed layout, no dependencies: ~100 nodes is nothing.

(function () {
  const COLORS = {
    home: "#ffffff",
    highlights: "#00fc50",
    lab: "#7287fd",
    problems: "#eba8ff",
    stories: "#9058f8",
    commonplace: "#00fcb5",
    unfiled: "#89dceb"
  };

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isDay() {
    return document.documentElement.classList.contains("day-mode")
      && document.body.classList.contains("page-forest");
  }

  function mount(container, data) {
    const compact = container.dataset.graph === "compact";
    const canvas = document.createElement("canvas");
    // An inline canvas adds a baseline gap that can feed back into its size
    // when a stylesheet is delayed or unavailable.
    canvas.style.display = "block";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const nodes = data.nodes.map((n) => ({ ...n, x: 0, y: 0, vx: 0, vy: 0, degree: 0 }));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const edges = data.edges
      .map(([a, b]) => ({ a: byId.get(a), b: byId.get(b) }))
      .filter((e) => e.a && e.b && e.a !== e.b);
    for (const e of edges) { e.a.degree++; e.b.degree++; }
    const neighbours = new Map(nodes.map((n) => [n, new Set()]));
    for (const e of edges) { neighbours.get(e.a).add(e.b); neighbours.get(e.b).add(e.a); }

    // Tuning. Compact boxes are ~500px across; the archive page is ~1100px.
    const REST = compact ? 22 : 46;        // spring rest length
    const REPEL = compact ? 500 : 2200;    // inverse-square repulsion
    const GRAVITY = 0.012;                 // pull toward the centre
    const DAMPING = 0.82;

    let width = 0, height = 0, dpr = 1;
    let alpha = 1;
    let hovered = null, dragging = null, dragMoved = false;
    let frame = null;

    function resize() {
      const nextWidth = Math.max(container.clientWidth, 1);
      const nextHeight = Math.max(container.clientHeight, 1);
      const nextDpr = window.devicePixelRatio || 1;
      if (width === nextWidth && height === nextHeight && dpr === nextDpr) return false;
      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      return true;
    }

    // Start each section in a ring around the centre and each note beside its
    // section, so the layout settles into clusters instead of a hairball.
    function seed() {
      const sections = nodes.filter((n) => n.id.startsWith("/writing/") && n.id !== "/writing/");
      const cx = width / 2, cy = height / 2;
      const ring = Math.min(width, height) * 0.3;
      sections.forEach((s, i) => {
        const angle = (i / sections.length) * Math.PI * 2 - Math.PI / 2;
        s.x = cx + Math.cos(angle) * ring;
        s.y = cy + Math.sin(angle) * ring;
      });
      for (const n of nodes) {
        if (sections.includes(n)) continue;
        const parent = [...neighbours.get(n)].find((m) => sections.includes(m));
        const ox = parent ? parent.x : cx, oy = parent ? parent.y : cy;
        const spread = parent ? ring * 0.5 : ring * 0.2;
        n.x = ox + (Math.random() - 0.5) * spread;
        n.y = oy + (Math.random() - 0.5) * spread;
      }
    }

    function radius(n) {
      const base = compact ? 2 : 3;
      return base + Math.sqrt(n.degree) * (compact ? 0.8 : 1.3);
    }

    function step() {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 1; }
          const f = REPEL / d2;
          const d = Math.sqrt(d2);
          const fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
        }
      }
      for (const e of edges) {
        const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = (d - REST) * 0.03;
        const fx = (dx / d) * f, fy = (dy / d) * f;
        e.a.vx += fx; e.a.vy += fy; e.b.vx -= fx; e.b.vy -= fy;
      }
      const cx = width / 2, cy = height / 2;
      const pad = compact ? 8 : 24;
      for (const n of nodes) {
        if (n === dragging) { n.vx = n.vy = 0; continue; }
        n.vx += (cx - n.x) * GRAVITY;
        n.vy += (cy - n.y) * GRAVITY;
        n.vx *= DAMPING; n.vy *= DAMPING;
        n.x = Math.min(width - pad, Math.max(pad, n.x + n.vx * alpha));
        n.y = Math.min(height - pad, Math.max(pad, n.y + n.vy * alpha));
      }
      alpha *= 0.96;
    }

    function draw() {
      const day = isDay();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const focus = hovered || dragging;
      const near = focus ? neighbours.get(focus) : null;

      ctx.lineWidth = 1;
      for (const e of edges) {
        const lit = focus && (e.a === focus || e.b === focus);
        ctx.strokeStyle = lit
          ? (day ? "rgba(109, 40, 217, 0.8)" : "rgba(255, 255, 255, 0.8)")
          : (day ? "rgba(0, 0, 0, 0.14)" : "rgba(198, 208, 245, 0.16)");
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.stroke();
      }

      for (const n of nodes) {
        const r = radius(n);
        const dim = focus && n !== focus && !near.has(n);
        ctx.globalAlpha = dim ? 0.35 : 1;
        ctx.fillStyle = day && n.group === "home" ? "#111" : (COLORS[n.group] || COLORS.unfiled);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (n === focus) {
          ctx.strokeStyle = day ? "#111" : "#fff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Labels: sections always; every node on the archive page; the focused
      // node and its neighbours everywhere.
      ctx.font = (compact ? 10 : 11) + 'px "Fira Code", monospace';
      ctx.textBaseline = "middle";
      for (const n of nodes) {
        const hub = n.group === "home" || n.id.startsWith("/writing/");
        const show = n === focus || (near && near.has(n)) || hub || (!compact && !focus);
        if (!show) continue;
        const strong = n === focus || hub || (near && near.has(n));
        ctx.fillStyle = day
          ? (strong ? "#111" : "rgba(0, 0, 0, 0.55)")
          : (strong ? "#e6e9ff" : "rgba(198, 208, 245, 0.6)");
        const text = compact && !strong ? "" : n.title;
        if (text) ctx.fillText(text, n.x + radius(n) + 4, n.y);
      }
    }

    function loop() {
      frame = null;
      step();
      draw();
      if (alpha > 0.03 || dragging) frame = requestAnimationFrame(loop);
    }

    function wake(a) {
      alpha = Math.max(alpha, a);
      if (!frame) frame = requestAnimationFrame(loop);
    }

    function settle() {
      for (let i = 0; i < 400; i++) step();
      alpha = 0;
      draw();
    }

    function nodeAt(x, y) {
      let best = null, bestD = (compact ? 9 : 12) ** 2;
      for (const n of nodes) {
        const dx = n.x - x, dy = n.y - y;
        const d = dx * dx + dy * dy - radius(n) ** 2;
        if (d < bestD) { bestD = d; best = n; }
      }
      return best;
    }

    function point(event) {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    canvas.addEventListener("pointermove", (event) => {
      const p = point(event);
      if (dragging) {
        dragging.x = p.x; dragging.y = p.y;
        dragMoved = true;
        wake(0.3);
        return;
      }
      const n = nodeAt(p.x, p.y);
      if (n !== hovered) {
        hovered = n;
        canvas.style.cursor = n ? "pointer" : "";
        canvas.title = n ? n.title : "";
        draw();
      }
    });
    canvas.addEventListener("pointerleave", () => {
      if (hovered) { hovered = null; canvas.style.cursor = ""; draw(); }
    });
    canvas.addEventListener("pointerdown", (event) => {
      const p = point(event);
      const n = nodeAt(p.x, p.y);
      if (!n) return;
      dragging = n; dragMoved = false;
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    canvas.addEventListener("pointerup", (event) => {
      const n = dragging;
      dragging = null;
      if (n && !dragMoved) location.href = n.id;
      else wake(0.2);
    });
    canvas.addEventListener("pointercancel", () => { dragging = null; });

    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        if (!resize()) return;
        seed();
        alpha = 1;
        reducedMotion ? settle() : wake(0.4);
      }).observe(container);
    }
    // The theme switch flips a class on <html>; redraw so the colours follow.
    new MutationObserver(() => draw()).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Lay out synchronously so the page never carries a long animation on
    // load; the compact box is static until touched, the archive page gets a
    // short settle-in.
    resize();
    seed();
    for (let i = 0; i < 250; i++) step();
    alpha = 0;
    draw();
    if (!reducedMotion && !compact) wake(0.25);
  }

  let loading = null;
  function load() {
    if (!loading) {
      loading = fetch("/archive/graph.json").then((response) => response.json());
    }
    return loading;
  }

  function mountWhenVisible(container) {
    const go = () => load().then((data) => mount(container, data))
      .catch((error) => console.warn("archive graph failed to load:", error));
    if (!("IntersectionObserver" in window)) return go();
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        go();
      }
    }, { rootMargin: "200px" });
    observer.observe(container);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-graph]").forEach(mountWhenVisible);
  });
})();
