# gusfowler.com

Personal portfolio. Hugo, no theme: hand-written layouts in `layouts/`, one stylesheet in `assets/site.css`, no JavaScript,
no external fonts, CDNs, or trackers.

## Editing

| What | Where |
|---|---|
| Home / About text, "Now" strip | `content/_index.md` |
| Jobs, title progression, education, other experience | `data/experience.yaml` |
| Projects (`featured: true` puts it on the home page; `group: school` files it under School) | `content/projects/*.md` |
| Contact page | `content/contact.md` |
| Email / LinkedIn / GitHub links, headline, default description | `hugo.toml` → `[params]` |
| Photo, social preview card | `static/img/gus.jpg`, `static/img/og.jpg` (1200×630) |


## Local preview

```sh
hugo server --bind 127.0.0.1 --port 1313   # http://127.0.0.1:1313
hugo --minify                              # production build into public/
node scripts/shoot.mjs                     # full-page screenshots (desktop + mobile, light + dark) into .preview/
```

## Cloudflare Pages settings

Workers & Pages → Create → Pages → Connect to Git, then:

| Setting | Value |
|---|---|
| Framework preset | Hugo |
| Build command | `hugo --minify` |
| Build output directory | `public` |
| Environment variable | `HUGO_VERSION` = `0.165.0` |

`HUGO_VERSION` pins the build to the version this site was developed on (`hugo v0.165.0+extended`). Bump it deliberately
after checking `hugo --minify` still builds with no warnings.

Push to `main` = production; any other branch gets a preview URL.
