#!/usr/bin/env sh
# Usage: ./generate-page.sh input.md
# Output: pages/<basename>.html (template + md pasted into content area, [title] set from basename)

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PAGES_DIR="${SCRIPT_DIR}/pages"
TEMPLATE="${PAGES_DIR}/template.html"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <input.md>" >&2
  exit 1
fi

MD_FILE="$1"
if [ ! -f "$MD_FILE" ]; then
  echo "Error: not a file: $MD_FILE" >&2
  exit 1
fi

BASENAME="$(basename "$MD_FILE" .md)"
OUTPUT="${PAGES_DIR}/${BASENAME}.html"

# Escape for JS template literal: \ -> \\, ` -> \`, ${ -> \${
escape_js_template() {
  sed 's/\\/\\\\/g; s/`/\\`/g' | sed 's#\${#\\${#g'
}

TMP_ESC=$(mktemp)
trap 'rm -f "$TMP_ESC"' EXIT
escape_js_template < "$MD_FILE" > "$TMP_ESC"

# / echo content of md file
echo "md file content:"
cat "$MD_FILE"


awk -v title="$BASENAME" '
NR==FNR { content = content $0 "\n"; next; }
/__MD_CONTENT__/ { printf "%s", content; next; }
/\[title\]/ { gsub(/\[title\]/, title); }
{ print; }
' "$TMP_ESC" "$TEMPLATE" > "$OUTPUT"

# Replace "[date]" with today's date
TODAY=$(date +%Y-%m-%d)
sed "s/\[date\]/$TODAY/g" "$OUTPUT" > "${OUTPUT}.tmp" && mv "${OUTPUT}.tmp" "$OUTPUT"
# check if it has found the [date]

echo "Wrote ${OUTPUT}"
