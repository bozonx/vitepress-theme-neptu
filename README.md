# Neptu — VitePress themes monorepo

Monorepo for the **Neptu** family of VitePress themes and their tooling.

## Packages

| Package | Path | Description |
| --- | --- | --- |
| [`vitepress-theme-neptu-blog`](./packages/blog) | `packages/blog` | SEO-first blog theme — post lists, tags, authors, archive, feeds, search, i18n. |
| [`vitepress-theme-neptu-landing`](./packages/landing) | `packages/landing` | Landing/site theme built on top of the blog theme. |
| Docs & demos | `docs` | Published blog docs and the runnable landing example. |

The blog starter is in [`packages/blog/template`](./packages/blog/template); the
landing example is in [`docs/landing-example`](./docs/landing-example).

## Development

pnpm workspace. From the repo root:

```sh
pnpm install
pnpm docs:dev        # run the published blog docs
pnpm landing:dev     # run the landing example
pnpm check           # validate every workspace package
```

Root scripts run matching scripts in every workspace package; you can also run
a package's own scripts directly, e.g.
`pnpm --filter vitepress-theme-neptu-blog test`.

## License

[MIT](./LICENSE)
