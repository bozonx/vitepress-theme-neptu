# Neptu Blog Starter Template

A clean, production-ready starter blog template powered by [VitePress](https://vitepress.dev/) and [`vitepress-theme-neptu`](https://github.com/bozonx/vitepress-theme-neptu).

## 🚀 Quick Start

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

This compiles the static site into `src/.vitepress/dist` and indexes content using [Pagefind](https://pagefind.app/).

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
│   ├── en/                 # English content locale
│   │   ├── _authors.yaml   # Author profiles
│   │   ├── _site.yaml      # Locale site config
│   │   ├── post/           # Blog posts (Markdown)
│   │   └── page/           # Standalone pages (About, Donate, etc.)
│   └── public/             # Static public assets
├── package.json
└── README.md
```

---

## ⚙️ Customization

- **Site Info & Navigation**: Edit `src/site.yaml` and `src/en/_site.yaml` to set your blog title, navigation links, social icons, and footer text.
- **VitePress & integrations**: Edit `src/.vitepress/config.ts` to set your site URL (`siteUrl`), search provider, build-time pagination, and environment-backed integrations.
- **Repository & edit links**: Set `themeConfig.repo` in `src/site.yaml`. The edit-link URL is generated from this repository URL automatically; use `editLink.pattern` only for a custom repository layout.
- **Authors**: Add your author profile in `src/en/_authors.yaml`.
- **New Posts**: Add new `.md` files in `src/en/post/`.
