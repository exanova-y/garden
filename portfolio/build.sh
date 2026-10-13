#!/usr/bin/env bash
# Builds the two PDFs in this folder from the site's own images:
#   noesis-portfolio.pdf  <- deck.html     (16:9 slideshow, printed by headless Chrome)
#   diy-mea.pdf           <- diy-mea.tex   (the DIY MEA post as a paper, via tectonic)
# Needs: imagemagick, tectonic, Google Chrome.
set -euo pipefail
cd "$(dirname "$0")"

ASSETS=../src/assets
IMG=.cache/img
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
mkdir -p "$IMG"

# A PDF embeds every image at its native size, and LaTeX cannot read webp,
# so each image is shrunk to a jpg once and both documents read from .cache/img.
shrink() { # shrink <path under src/assets> [longest side in px]
  local src="$ASSETS/$1" size="${2:-1600}"
  local out="$IMG/$(basename "${1%.*}").jpg"
  [ "$out" -nt "$src" ] && return
  magick "${src}[0]" -auto-orient -background white -flatten \
    -resize "${size}x${size}>" -strip -quality 86 "$out"
}

for image in \
  images/plant.jpg images/flowers.jpg \
  images/miv/beautiful-lig.webp images/miv/lig.webp images/miv/aluminum.webp \
  images/miv/onshape.png images/miv/mea-routes.png images/miv/klayout.png \
  images/miv/copper-plating.png images/miv/copper-completed.webp \
  images/miv/copper-waterbath.webp images/miv/copper-table.webp images/miv/copper-heating.webp \
  images/readlogs/early-may-01-header.png images/readlogs/early-may-03-study2-setup.jpeg \
  images/readlogs/early-may-04-transducer-prep.jpeg images/readlogs/early-may-05-errors-analysis.png \
  images/dino.png images/femg.png images/musenet.webp \
  images/chem0/ui1.png images/chem0/multimeter.png images/chem0/pouring.jpg \
  images/chem0/human.jpg images/chem0/sim.png images/chem0/sim2.png \
  images/arxiv.jpg noesis-gallery/arxiv-wars-selection.png \
  images/nn.png images/wsl.png \
  images/microdrone.jpeg images/microdrone2.jpeg images/pso-unity.png \
  images/swarm-history.png images/topologies.png images/bio-inspo.png \
  images/laser-cutter.jpg noesis-gallery/e-waste.jpg \
  images/hiki-causality.png images/hiki-network.png
do
  shrink "$image"
done

# The homepage wallpaper, dimmed so slide text stays readable without backdrop-filter
# (which Chrome rasterises badly in print).
[ "$IMG/bg.jpg" -nt "$ASSETS/wallpapers/home.webp" ] || magick "$ASSETS/wallpapers/home.webp" \
  -resize 1600x900^ -gravity center -extent 1600x900 -blur 0x3 \
  -fill '#0a0a1c' -colorize 50 -strip -quality 80 "$IMG/bg.jpg"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=4000 --print-to-pdf=noesis-portfolio.pdf \
  "file://$PWD/deck.html" 2>/dev/null

tectonic diy-mea.tex

ls -lh noesis-portfolio.pdf diy-mea.pdf
