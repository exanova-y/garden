#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "openai>=1.0",
#   "numpy>=1.24",
#   "scikit-learn>=1.3",
#   "python-dotenv>=1.0",
# ]
# ///
"""
Embed curius bookmarks + site pages with OpenAI, cluster bookmarks with HDBSCAN,
and precompute per-page related bookmarks via embedding cosine similarity.

Outputs (consumed by 11ty):
  src/_data/related.json        page URL -> [related bookmark records]
  src/_data/curius-clusters.json cluster id -> {label, size, bookmark ids}

Cache (not needed by 11ty, safe to gitignore):
  src/_data/.embed-cache.json   id/path -> {hash, embedding}

Usage:
  uv run scripts/embed-curius.py          # reads scripts/.env or ./.env automatically

Tuning:
  CURIUS_SIM_THRESHOLD=0.45 uv run scripts/embed-curius.py
"""

import os
import re
import sys
import json
import glob
import hashlib
from collections import Counter, defaultdict

import numpy as np

# Load OPENAI_API_KEY from scripts/.env or ./.env if present
try:
    from dotenv import load_dotenv
    for _envpath in (os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"),
                     os.path.join(os.getcwd(), ".env")):
        if os.path.exists(_envpath):
            load_dotenv(_envpath)
            break
except ImportError:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "src", "_data")
BOOKMARKS = os.path.join(DATA_DIR, "curius.json")
RELATED_OUT = os.path.join(DATA_DIR, "related.json")
CLUSTERS_OUT = os.path.join(DATA_DIR, "curius-clusters.json")
CACHE = os.path.join(DATA_DIR, ".embed-cache.json")

PAGE_GLOBS = ["src/pages/*.md", "src/favs/*.md"]
LAYOUT_REQUIRED = "layouts/post.njk"

EMBED_MODEL = "text-embedding-3-small"
EMBED_DIMS = 512
BATCH = 128

TOP_N = 6
# cosine similarity floor for embeddings (override via CURIUS_SIM_THRESHOLD)
SIM_THRESHOLD = float(os.environ.get("CURIUS_SIM_THRESHOLD", "0.6"))

STOPWORDS = set("""
the and for are but not you all can had her was one our out has have been some them
than its over such that this with will which what when where how about into through
during before after above below between under because just also very more most few
then own same here there please etc via from they their would could should may might
these those each every both any com org www http https edu net pdf html
""".split())


# ----------------------------- text helpers -----------------------------

def clean_snippet(s):
    if not s:
        return ""
    s = s.replace("Follow along using the transcript.", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def bookmark_text(b):
    parts = [b.get("title", "")]
    topics = b.get("topics") or []
    if topics:
        parts.append(" ".join(t.replace("-", " ") for t in topics))
    parts.append(clean_snippet(b.get("snippet", "")))
    return " ".join(p for p in parts if p)[:4000]


def strip_frontmatter(text):
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4 :]
    return text


def parse_frontmatter(text):
    fm = {}
    if not text.startswith("---"):
        return fm
    end = text.find("\n---", 3)
    if end == -1:
        return fm
    block = text[3:end]
    for line in block.splitlines():
        m = re.match(r"^(\w+):\s*(.*)$", line)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip()
        if val.startswith("[") and val.endswith("]"):
            inner = val[1:-1]
            items = [x.strip().strip('"').strip("'") for x in inner.split(",")]
            fm[key] = [x for x in items if x]
        else:
            fm[key] = val.strip('"').strip("'")
    return fm


def strip_markdown(md):
    md = strip_frontmatter(md)
    md = re.sub(r"```.*?```", " ", md, flags=re.S)      # code fences
    md = re.sub(r"`[^`]*`", " ", md)                      # inline code
    md = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", md)         # images
    md = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", md)      # links -> text
    md = re.sub(r"<[^>]+>", " ", md)                       # html tags
    md = md.replace("\\", " ")                              # escaped chars
    md = re.sub(r"[#>*_~`-]", " ", md)                     # md punctuation
    md = re.sub(r"\s+", " ", md).strip()
    return md


def page_url(path):
    # src/pages/bci.md -> /pages/bci/ ; src/favs/x.md -> /favs/x/
    rel = os.path.relpath(path, os.path.join(ROOT, "src"))
    no_ext = os.path.splitext(rel)[0]
    return "/" + no_ext + "/"


def text_hash(s):
    return hashlib.sha1(s.encode("utf-8")).hexdigest()


def tokens(s):
    return [t for t in re.split(r"[^a-z0-9]+", s.lower()) if len(t) >= 3 and t not in STOPWORDS]


# ----------------------------- embedding -----------------------------

def load_cache():
    if os.path.exists(CACHE):
        with open(CACHE) as f:
            return json.load(f)
    return {}


def save_cache(cache):
    with open(CACHE, "w") as f:
        json.dump(cache, f)


def embed_all(items, cache):
    """items: list of (key, text). Returns dict key -> np.array. Uses + updates cache."""
    client = None
    pending = []
    for key, text in items:
        h = text_hash(text)
        cached = cache.get(key)
        if not cached or cached.get("hash") != h:
            pending.append((key, text, h))

    if pending:
        try:
            from openai import OpenAI
        except ImportError:
            sys.exit("Missing dependency: pip install openai")
        if not os.environ.get("OPENAI_API_KEY"):
            sys.exit("OPENAI_API_KEY is not set. export OPENAI_API_KEY=sk-... and retry.")
        client = OpenAI()
        print(f"Embedding {len(pending)} new/changed items ({len(items) - len(pending)} cached)...")
        for i in range(0, len(pending), BATCH):
            chunk = pending[i : i + BATCH]
            resp = client.embeddings.create(
                model=EMBED_MODEL,
                input=[t for _, t, _ in chunk],
                dimensions=EMBED_DIMS,
            )
            for (key, _, h), d in zip(chunk, resp.data):
                cache[key] = {"hash": h, "embedding": d.embedding}
            print(f"  {min(i + BATCH, len(pending))}/{len(pending)}")
        save_cache(cache)
    else:
        print(f"All {len(items)} items cached, no embedding calls needed.")

    out = {}
    for key, _ in items:
        out[key] = np.asarray(cache[key]["embedding"], dtype=np.float32)
    return out


def l2_normalize(mat):
    norms = np.linalg.norm(mat, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return mat / norms


# ----------------------------- main -----------------------------

def main():
    with open(BOOKMARKS) as f:
        bookmarks = json.load(f)

    cache = load_cache()

    # 1. embed bookmarks
    bm_items = [(f"bm:{b['id']}", bookmark_text(b)) for b in bookmarks]
    bm_vecs = embed_all(bm_items, cache)
    bm_mat = l2_normalize(np.vstack([bm_vecs[f"bm:{b['id']}"] for b in bookmarks]))

    # 2. cluster bookmarks with HDBSCAN (PCA reduce first for stability)
    from sklearn.cluster import HDBSCAN
    from sklearn.decomposition import PCA

    n_comp = min(50, bm_mat.shape[0], bm_mat.shape[1])
    reduced = PCA(n_components=n_comp, random_state=0).fit_transform(bm_mat)
    labels = HDBSCAN(min_cluster_size=8, min_samples=3, metric="euclidean").fit_predict(reduced)

    clusters = defaultdict(list)
    for b, lab in zip(bookmarks, labels):
        b["cluster"] = int(lab)
        clusters[int(lab)].append(b)

    cluster_summary = {}
    for lab, members in clusters.items():
        if lab == -1:
            continue
        words = Counter()
        for m in members:
            words.update(tokens(m.get("title", "")))
            for t in (m.get("topics") or []):
                words.update(tokens(t.replace("-", " ")))
        label = ", ".join(w for w, _ in words.most_common(4))
        cluster_summary[str(lab)] = {
            "label": label,
            "size": len(members),
            "ids": [m["id"] for m in members],
        }
    n_clusters = len(cluster_summary)
    n_noise = int((labels == -1).sum())
    print(f"HDBSCAN: {n_clusters} clusters, {n_noise} unclustered.")

    # 3. embed pages (only post.njk pages)
    pages = []
    for pattern in PAGE_GLOBS:
        for path in glob.glob(os.path.join(ROOT, pattern)):
            with open(path) as f:
                raw = f.read()
            fm = parse_frontmatter(raw)
            if LAYOUT_REQUIRED not in (fm.get("layout") or ""):
                continue
            title = fm.get("title", "")
            tags = fm.get("tags") or []
            if isinstance(tags, str):
                tags = [tags]
            body = strip_markdown(raw)
            text = " ".join([title, title, title,
                             " ".join(t.replace("-", " ") for t in tags) * 3,
                             body])[:6000]
            pages.append({"url": page_url(path), "title": title, "text": text})

    pg_items = [(f"pg:{p['url']}", p["text"]) for p in pages]
    pg_vecs = embed_all(pg_items, cache)
    pg_mat = l2_normalize(np.vstack([pg_vecs[f"pg:{p['url']}"] for p in pages]))

    # 4. per-page related bookmarks via cosine similarity (dot product, normalized)
    sims = pg_mat @ bm_mat.T  # (pages, bookmarks)
    related = {}
    for i, p in enumerate(pages):
        order = np.argsort(-sims[i])
        items = []
        for j in order[: TOP_N * 3]:
            score = float(sims[i, j])
            if score < SIM_THRESHOLD:
                break
            b = bookmarks[j]
            items.append({
                "id": b["id"],
                "link": b["link"],
                "title": b["title"],
                "snippet": clean_snippet(b.get("snippet", "")),
                "cluster": b.get("cluster", -1),
                "score": round(score, 4),
            })
            if len(items) >= TOP_N:
                break
        related[p["url"]] = items

    with open(RELATED_OUT, "w") as f:
        json.dump(related, f, indent=2, ensure_ascii=False)
    with open(CLUSTERS_OUT, "w") as f:
        json.dump(cluster_summary, f, indent=2, ensure_ascii=False)

    matched = sum(1 for v in related.values() if v)
    print(f"Wrote {RELATED_OUT} ({matched}/{len(pages)} pages with matches)")
    print(f"Wrote {CLUSTERS_OUT} ({n_clusters} clusters)")


if __name__ == "__main__":
    main()
