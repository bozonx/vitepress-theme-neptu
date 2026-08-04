# Neptu — VitePress themes monorepo

Monorepo for the **Neptu** family of VitePress themes and their tooling.

## Packages

| Package | Path | Description |
| --- | --- | --- |
| [`vitepress-theme-neptu`](./packages/blog) | `packages/blog` | SEO-first blog theme — post lists, tags, authors, archive, feeds, search, i18n. |
| [`vitepress-theme-neptu-landing`](./packages/landing) | `packages/landing` | Landing/site theme built on top of the blog theme. |
| [`create-neptu-blog`](./packages/create-blog) | `packages/create-blog` | Scaffolder behind `npm create neptu-blog`. |
| Examples & demos | `examples` | Blog demo and landing example sites. |

The blog starter is in [`packages/blog/template`](./packages/blog/template); the
blog demo is in [`examples/blog`](./examples/blog) and the landing example is
in [`examples/landing`](./examples/landing).

## Start a blog

```sh
npm create neptu-blog@latest my-blog
```

The scaffolder copies the starter template out of the theme package, so there is
only ever one copy of it to maintain.

## Development

This monorepo uses npm workspaces. From the repo root:

```sh
npm install
npm run blog:dev        # run the blog demo
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
