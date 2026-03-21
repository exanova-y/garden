#!/usr/bin/env sh
# Usage: ./generate-page.sh input.md
# Output: pages/<basename>.html (template + md pasted into content area, [title] set from basename)

# features:
# uses today's date
# converts markdown to html, including 1st line as title and onwards as content!
# supports custom coloured spans!


set -e
# paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PAGES_DIR="${SCRIPT_DIR}/pages"
TEMPLATE="${PAGES_DIR}/template.html"

MD_FILE="$1"
BASENAME="$(basename "$MD_FILE" .md)"
OUTPUT="${PAGES_DIR}/${BASENAME}.html"

# Expand custom span syntax: {{#id}}content{{/}} -> <span id="id">content</span>
# (single-line only; for multiline or complex HTML use raw HTML in the .md)
# Matches IDs from style.css: lavender-txt, green-txt, teal-txt, sapphire-txt, purple-txt, etc.
expand_custom_spans() {
  sed -E 's/\{\{#([a-z0-9-]+)\}\}[[:space:]]*([^{]*)[[:space:]]*\{\{\/\}\}/<span id="\1">\2<\/span>/g'
}

# Escape for JS template literal: \ -> \\, ` -> \`, ${ -> \${
escape_js_template() {
  sed 's/\\/\\\\/g; s/`/\\`/g' | sed 's#\${#\\${#g'
}

TMP_ESC=$(mktemp)
trap 'rm -f "$TMP_ESC"' EXIT
# Content = lines 2 onwards only (line 1 is used as [title], not pasted into body)
tail -n +2 "$MD_FILE" | expand_custom_spans | escape_js_template > "$TMP_ESC"

# Title from first line of .md: strip leading # and trim whitespace
TITLE=$(sed -n '1p' "$MD_FILE" | sed -E 's/^#+[[:space:]]*//; s/[[:space:]]*$//')

TODAY=$(date +%Y-%m-%d)

# Build output from template: inject [content], replace [title] and [date] in the *output* (never modify template.html)

awk -v title="$TITLE" -v today="$TODAY" '
NR==FNR { content = content $0 "\n"; next; }
/\[content\]/ { printf "%s", content; next; }
{
  line = $0
  gsub(/\[date\]/, today, line)
  while ((i = index(line, "[title]")) > 0) {
    line = substr(line, 1, i-1) title substr(line, i+7)
  }
  print line
}
' "$TMP_ESC" "$TEMPLATE" > "$OUTPUT"

echo "Wrote ${OUTPUT}"
