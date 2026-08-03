# Neptu Blog Starter Template

A clean, production-ready starter blog template powered by [VitePress](https://vitepress.dev/) and [`vitepress-theme-neptu`](https://github.com/bozonx/vitepress-theme-neptu).

Requires **Node.js 20.19+ or 22.12+** (the VitePress 2 baseline).

## 🚀 Quick Start

If you have not copied this folder yet, the scaffolder does it for you and asks
for the blog title and content language:

```bash
npm create neptu-blog@latest my-blog
```

Already have the folder? Continue from step 1.

### 1. Install dependencies

```bash
npm install
# or: pnpm install / yarn install
```

### 2. Start local development server

```bash
npm run dev
# or: pnpm dev / yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
# or: pnpm build / yarn build
```

This compiles the static site into `src/.vitepress/dist` and indexes it with
[Pagefind](https://pagefind.app/) — the theme runs the indexing itself, so there
is no separate search build step.

### 4. Preview production build

```bash
npm run preview
# or: pnpm preview / yarn preview
```

---

## 📁 Project Structure

```text
.
├── src/
│   ├── .vitepress/
│   │   ├── config.ts       # Main VitePress & theme config
│   │   └── theme/          # Theme customization & components
│   ├── site.yaml           # Global cross-locale site config
│   ├── index.md            # Language selector (never locale content)
│   ├── en/                 # English content locale
│   │   ├── _authors.yaml   # Author profiles
│   │   ├── _site.yaml      # Locale site config
│   │   ├── post/           # Blog posts (Markdown)
│   │   └── page/           # Standalone pages (About, Donate, etc.)
│   └── public/             # Static public assets
├── package.json
└── README.md
```

This structure is required for both single-language and multilingual Neptu
sites. Keeping only `src/en/` is a complete single-language setup; it does not
mean that you must create translations. Do not move locale content directly
under `src/`.

### Adding a language

1. Copy `src/en/` to a sibling folder named after the locale, e.g. `src/ru/`.
2. Set `lang`, `title` and `description` in its `_site.yaml`.
3. Register the locale's post data in `src/.vitepress/theme/Layout.vue` — data
   loaders are static imports, so each locale needs one line there. The file
   carries an example in a comment.

UI strings come from the theme's built-in translations for that language;
override individual keys under `themeConfig.t` when you want different wording.

The root `src/index.md` is a neutral language selector. It contains crawlable
links and only highlights the browser's likely language; it deliberately does
not perform an automatic browser-language redirect.

---

## ⚙️ Customization

- **Site Info & Navigation**: Edit `src/site.yaml` and `src/en/_site.yaml` to set your blog title, navigation links, social icons, and footer text.
- **VitePress & integrations**: Edit `src/.vitepress/config.ts` to set your site URL (`siteUrl`), search provider, build-time pagination, and environment-backed integrations.
- **Repository & edit links**: Set `themeConfig.repo` in `src/.vitepress/config.ts`. The edit-link URL is generated from this repository URL automatically; use `editLink.pattern` only for a custom repository layout.
- **Authors**: Add your author profile in `src/en/_authors.yaml`.
- **New Posts**: Add new `.md` files in `src/en/post/`. Two demo posts are
  there to be deleted once you have your own.
- **Popular posts**: off by default so the first build is quiet. Set
  `popularPosts.enabled` in `src/.vitepress/config.ts` and `sidebar.popular` in
  `src/site.yaml` once GA4 credentials are available.

Every option in `src/site.yaml`, `src/en/_site.yaml`, `src/en/_authors.yaml`
and `src/.vitepress/config.ts` is documented in comments right next to it —
those four files are the reference you will use most.

## 📚 Full guide

The documentation site is itself a blog built with this theme, arranged as a
guide from first launch to advanced customization:

### → [bozonx.github.io/vitepress-theme-neptu](https://bozonx.github.io/vitepress-theme-neptu)
