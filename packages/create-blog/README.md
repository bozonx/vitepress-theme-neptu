# create-neptu-blog

Scaffolds a new blog built with
[`vitepress-theme-neptu`](https://github.com/bozonx/vitepress-theme-neptu) —
a VitePress blog theme with post lists, tags, categories, authors, archive,
RSS/Atom/JSON feeds, Pagefind search, multilingual routing and technical SEO.

```sh
npm create neptu-blog@latest my-blog
```

Then:

```sh
cd my-blog
npm install
npm run dev
```

Requires **Node.js 22.18+**.

## What it does

- Copies the starter template out of the theme package — one source of truth,
  always matching the theme version this scaffolder ships with.
- Asks for a directory, a blog title and a content locale (or takes them as
  flags).
- Renames the locale folder, sets `lang` and `title` in its `_site.yaml`, and
  registers the locale's post data loader in `Layout.vue`.
- Names the generated `package.json` after the target directory.

## Options

```sh
npx create-neptu-blog [directory] [options]
```

| Option            | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| `--title <text>`  | Blog title                                                      |
| `--locale <code>` | Content locale folder, e.g. `en`, `ru`, `pt-BR` (default: `en`) |
| `-y`, `--yes`     | Accept defaults, ask nothing                                    |
| `-h`, `--help`    | Show usage                                                      |

The theme ships built-in UI translations for `ar`, `cs`, `de`, `en`, `es`,
`fr`, `he`, `hi`, `it`, `ja`, `ko`, `lv`, `nl`, `pl`, `pt`, `ru`, `sr`, `sv`,
`th`, `tr` and `zh`. Any other locale code works too and falls back to English
labels until you override them under `themeConfig.t`.

## Documentation

The guide is itself a blog built with the theme:
[bozonx.github.io/vitepress-theme-neptu/blog](https://bozonx.github.io/vitepress-theme-neptu/blog)

## License

[MIT](./LICENSE)
