# Neptu — VitePress themes monorepo

Monorepo for the **Neptu** family of VitePress themes and their tooling.

## Packages

| Package | Path | Description |
| --- | --- | --- |
| [`vitepress-theme-neptu-blog`](./packages/blog) | `packages/blog` | SEO-first blog theme — post lists, tags, authors, archive, feeds, search, i18n. |
| [`vitepress-theme-neptu-landing`](./packages/landing) | `packages/landing` | Landing/site theme built on top of the blog theme. |
| Docs & demo | `docs` | The documentation site (published), built with the blog theme. |

Each package ships its own `template/` or `example/` starter. The blog theme's
guide and live demo: **https://bozonx.github.io/vitepress-theme-neptu-blog**.

## Development

pnpm workspace. From the repo root:

```sh
pnpm install
pnpm docs:dev        # run the docs/demo site
pnpm test            # blog unit tests
pnpm typecheck       # blog type check
pnpm lint            # blog lint
pnpm e2e             # blog end-to-end tests
```

Root scripts delegate to the relevant package via `pnpm --filter`; you can also
run a package's own scripts directly, e.g.
`pnpm --filter vitepress-theme-neptu-blog test`.

## License

[MIT](./LICENSE)
