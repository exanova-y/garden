const USER_ID = 3782;
const OUTPUT = 'src/_data/curius.json';

const fs = require('fs');

async function main() {
  const all = [];
  let page = 0;

  while (true) {
    const res = await fetch(`https://curius.app/api/users/${USER_ID}/links?page=${page}`);
    const data = await res.json();
    const saved = data.userSaved || [];
    if (saved.length === 0) break;

    for (const item of saved) {
      if (item.createdBy === USER_ID) {
        all.push({
          id: item.id,
          link: item.link,
          title: item.title || '',
          snippet: (item.snippet && item.snippet !== 'N/A') ? item.snippet : '',
          topics: (item.topics || []).map(t => t.slug),
          favorite: !!item.favorite,
        });
      }
    }
    page++;
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(all, null, 2));
  console.log(`Wrote ${all.length} bookmarks to ${OUTPUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
