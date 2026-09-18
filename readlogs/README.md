# Readlogs — local mirror

Local mirror of five posts by *noesis*
(Substack: `feralscholars.substack.com`, formerly linked as `pawsitivefeedback.substack.com`).

All images are downloaded locally under `images/` and referenced with relative
paths rather than hotlinked to Substack's CDN.

## Layout

Flat — every post is a top-level `.md` + generated `.html`, all sharing one
`images/` folder. Image filenames are prefixed with the post slug to avoid
collisions.

```
readlogs/
├── index.html                    # bookmark index (open this)
├── README.md                     # you are here
├── build.py                      # rebuild HTMLs from MDs
├── download_images.sh            # re-fetch all 27 images from S3
├── images/                       # all images, prefixed by post slug
│   ├── march-01-ben-barres.png
│   ├── november-01-kardashev.jpeg
│   ├── october-01-electricity-generator.png
│   ├── september-01-flowers-for-algernon.png
│   ├── early-may-01-header.png
│   └── … (27 files total)
├── march-readlogs.md         ├── march-readlogs.html
├── november-readlogs.md      ├── november-readlogs.html
├── october-readlog.md        ├── october-readlog.html
├── september-readlog.md      ├── september-readlog.html
└── early-may-observelog.md   └── early-may-observelog.html
```

## Posts

| Post | File | Source |
|---|---|---|
| Early May observelog | [early-may-observelog.md](early-may-observelog.md) | <https://feralscholars.substack.com/p/early-may-observelog> |
| March readlogs       | [march-readlogs.md](march-readlogs.md)             | <https://feralscholars.substack.com/p/march-readlogs> |
| November readlogs    | [november-readlogs.md](november-readlogs.md)       | <https://feralscholars.substack.com/p/november-readlogs> |
| October readlog      | [october-readlog.md](october-readlog.md)           | <https://feralscholars.substack.com/p/october-readlog> |
| September readlog    | [september-readlog.md](september-readlog.md)       | <https://feralscholars.substack.com/p/september-readlog> |

## Notes

- The `pawsitivefeedback.substack.com/p/…` URLs originally requested all return 404.
  The publication was renamed / moved to `feralscholars.substack.com`; the post slugs
  are otherwise identical. Content was fetched from the current live URLs.
- Substack footnote markers (`[1]`, `[2]`, `[3]`) from the source were removed as
  their target footnotes were not present in the rendered page content.
- Some Substack captions/quotes were inline in raw HTML; punctuation and paragraph
  breaks were normalized for readability but wording is unchanged.
- Images are stored at their original resolution as delivered by
  `substack-post-media.s3.amazonaws.com` (no `w_1456` CDN transform).

## Rebuilding

```bash
# fetch all images fresh
bash download_images.sh

# re-render every .md into a matching .html
python3 build.py
```
