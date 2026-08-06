# Neptu Blog Starter

A working blog built with [VitePress](https://vitepress.dev/) and
[`vitepress-theme-neptu`](https://github.com/bozonx/vitepress-theme-neptu).
Everything here is meant to be edited, renamed or deleted — it is your blog now.

Requires **Node.js 22.18+** (the VitePress 2 baseline).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site + Pagefind search index → src/.vitepress/dist
npm run preview
```

Full documentation (config reference, frontmatter, components, deployment):
**[bozonx.github.io/vitepress-theme-neptu/blog](https://bozonx.github.io/vitepress-theme-neptu/blog)**

---

## What is where

```text
src/
├── .vitepress/
│   ├── config.ts        # developer layer: siteUrl, repo, env-driven integrations
│   └── theme/           # Layout.vue (locale data + slots), styles.css, index.ts
├── site.yaml            # admin layer shared by every locale
├── index.md             # language selector — the only file allowed at content root
├── en/                  # a content locale (rename it, see below)
│   ├── _site.yaml       # this locale: lang, title, description, overrides
│   ├── _authors.yaml    # author profiles referenced by `authorId` in posts
│   ├── posts/           # your posts
│   ├── pages/           # standalone pages (about, donate, …)
│   └── recent/ archive/ tags/ categories/ authors/ featured/ popular/
│                        # generated list pages — see "Trim what you don't need"
└── public/              # static assets served from the site root
```

Config is layered, lowest priority first:
`config.ts` → `src/site.yaml` → `src/<locale>/_site.yaml`.
Each file documents its own options in comments; do not duplicate a value in two
layers unless you intend to override it.

## Step 1 — name your locale folder

Content **must** live in a locale folder; `src/index.md` is the language
selector and the only file allowed directly under `src/`.

- Keep `src/en/` if you write in English, or **rename it** to your language
  (`src/ru/`, `src/de/`, …).
- Renaming a locale means: rename the folder, then update the static import and
  the `posts` map in `src/.vitepress/theme/Layout.vue`, and set `lang`/`title` in
  its `_site.yaml`.

**Folder naming.** The folder name is the locale key and the URL prefix
(`/ru/posts/hello`). Use a bare ISO 639-1 code — `en`, `ru`, `de`, `pt` — unless
you ship several variants of one language; then use BCP 47
`<language>-<REGION>` with a lowercase language and an uppercase region:

| Case | Folder | `lang:` in `_site.yaml` |
| --- | --- | --- |
| One English version | `en` | `en-US` or `en-GB` — pick your variety |
| American + British side by side | `en-US`, `en-GB` | `en-US`, `en-GB` |
| Brazilian + European Portuguese | `pt-BR`, `pt-PT` | `pt-BR`, `pt-PT` |
| Simplified Chinese | `zh-CN` (or `zh`) | `zh-CN` |
| Latin-American Spanish | `es-419` | `es-419` |

Built-in UI strings are resolved by exact folder name first, then by the bare
language part, then fall back to `en`. So `en-GB` reuses the `en` strings and
`pt-BR` reuses `pt` — override individual words under `themeConfig.t` in that
locale's `_site.yaml`. Translations ship for: `ar`, `cs`, `de`, `en`, `es`,
`fr`, `he`, `hi`, `it`, `ja`, `ko`, `lv`, `nl`, `pl`, `pt`, `ru`, `sr`, `sv`,
`th`, `tr`, `zh`. Any other folder name works too — it just starts from the
English strings until you translate `themeConfig.t`.

`lang` in `_site.yaml` is the IETF tag written into `<html lang>`, feeds and
hreflang. Keep it region-qualified (`en-US`, not `en`) even when the folder is
bare.

## Step 2 — make it yours

1. `src/.vitepress/config.ts` — `siteUrl` and `themeConfig.repo` (edit links are
   derived from `repo`), plus `base` if you deploy to a subfolder.
2. `src/<locale>/_site.yaml` — `lang`, `title`, `description`, hero copy, nav,
   sidebar and footer links.
3. `src/site.yaml` — cross-locale presentation: home sections, sidebar sections,
   post-card and post-footer layout, `publisher` (used in JSON-LD).
4. `src/<locale>/_authors.yaml` — replace the demo author; the `id` is what
   posts reference via `authorId`.
5. `src/<locale>/pages/` — rewrite `about.md`, `donate.md` (or delete them and
   their links).
6. `src/<locale>/posts/` — delete `welcome.md` and `markdown-guide.md` and write
   your own. `markdown-guide.md` doubles as a cheatsheet for the theme's
   Markdown extensions, so read it before deleting.
7. `src/public/` — favicons, `site.webmanifest`, images. Paths in config are
   relative to this folder's root (`/img/logo.png`).

## Step 3 — trim what you don't need

Each generated section is a folder of route files plus the flags that link to
it. Delete the folder **and** turn the flags off, otherwise the sidebar or home
page will point at pages that no longer exist.

| Don't want | Delete | Also turn off |
| --- | --- | --- |
| Author pages & bylines | `src/<locale>/authors/`, `src/<locale>/_authors.yaml` | `sidebar.authors`, `postList.showAuthor` in `src/site.yaml`, `author` in `postFooter`, `authorId` in post frontmatter |
| Categories | `src/<locale>/categories/` | `sidebar.categories`, the `categories` home section, `categories` in `postFooter`, `category` in post frontmatter |
| Featured list | `src/<locale>/featured/` | `sidebar.featured`, the `featured` home section, `featured: true` in post frontmatter |
| Popular posts | `src/<locale>/popular/` and the `popular/` subfolders under `archive/[year]/`, `authors/[id]/`, `categories/[slug]/`, `tags/[slug]/` | `sidebar.popular`, the `popular` home section, `popularPosts.enabled` in `config.ts` |
| Tags | `src/<locale>/tags/` | `sidebar.tags`, the `tags` home section, `tags` in `postFooter`, `tags` in post frontmatter |
| Archive by year | `src/<locale>/archive/` | `sidebar.archive` |
| Recent list page | `src/<locale>/recent/` | `sidebar.recent`, the `Browse Recent Posts` hero action in `_site.yaml` |
| Donations | `src/<locale>/pages/donate.md` | `nav.donate`, `sidebar.donate`, `donate` in `postFooter`, the `donate` block |
| Search | the `#nav-bar-content-before` slot in `src/.vitepress/theme/Layout.vue` | — |

Sidebar and home flags live in `src/site.yaml`; `postFooter` too. Note that
arrays replace instead of merging across layers, so a `postFooter` override in
`_site.yaml` must list every block you want.

## Step 4 — add more languages (optional)

1. Copy `src/<locale>/` to a new folder, e.g. `src/ru/`.
   - Copy **everything** if you want the same URLs in both languages, then
     translate the texts in place.
   - Or copy everything except `posts/` and `pages/` if the new language gets its
     own articles and page slugs.
2. Edit the new `_site.yaml`: `lang`, `title`, `description`, hero and link
   texts. Use `extends: <locale>` to inherit another locale's settings instead of
   repeating them.
3. Add the locale to `src/.vitepress/theme/Layout.vue` — data loaders are static
   imports, so every locale needs one line there (an example is in the file).
4. Translate `_authors.yaml` descriptions if you keep authors.

`src/index.md` renders the language selector automatically from the locales it
finds; nothing to register there.

## Deploying

`npm run build` produces `src/.vitepress/dist`. Set `SITE_URL` (absolute URL, no
trailing slash) and, for a subfolder deployment, `VITEPRESS_BASE` — both are
read by `config.ts`. Popular posts additionally read `GA_PROPERTY_ID` and
`GA_CREDENTIALS_JSON` at build time.
