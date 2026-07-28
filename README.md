# Neptu — VitePress themes monorepo

Monorepo for the **Neptu** family of VitePress themes and their tooling.

## Packages

| Package | Path | Description |
| --- | --- | --- |
| [`vitepress-theme-neptu`](./packages/blog) | `packages/blog` | SEO-first blog theme — post lists, tags, authors, archive, feeds, search, i18n. |
| [`vitepress-theme-neptu-landing`](./packages/landing) | `packages/landing` | Landing/site theme built on top of the blog theme. |
| Docs & demos | `docs` | Published blog docs and the runnable landing example. |

The blog starter is in [`packages/blog/template`](./packages/blog/template); the
landing example is in [`docs/landing-example`](./docs/landing-example).

## Development

This monorepo uses npm workspaces. From the repo root:

```sh
npm install
npm run docs:dev        # run the published blog docs
npm run landing:dev     # run the landing example
npm run check           # validate every workspace package
```

Root scripts run matching scripts in every workspace package; you can also run
a package's own scripts directly, e.g.
`npm run test -w vitepress-theme-neptu`.

End-user projects (the blog template or a standalone installation) work with
npm, pnpm or yarn — see the [blog README](./packages/blog/README.md).

## License

[MIT](./LICENSE)
