---
title: Publishing and deployment
description: >
  How to build a static site and deploy it to any static hosting —
  using GitHub Pages as an example.
authorId: ivan-k
date: 2026-07-30
category: getting-started
tags: [start, deploy]
descriptionAsPreview: true
translations:
  ru: /ru/posts/deploy
---

The blog builds into a set of static files — you can deploy them anywhere: GitHub Pages, Netlify, Vercel, Cloudflare Pages or a regular web server. Let's walk through the process using GitHub Pages as an example: that's how [this site](https://bozonx.github.io/vitepress-theme-neptu/blog) is published.

## Build

```bash
npm run build      # or: pnpm build / yarn build
```

The command builds the site into `src/.vitepress/dist` and simultaneously builds the Pagefind search index — the theme does this automatically, no separate build step needed.

To preview the result locally:

```bash
npm run preview    # or: pnpm preview / yarn preview
```

The contents of `src/.vitepress/dist` is the finished website. Upload this folder to your hosting and everything will work.

## Two addresses: `siteUrl` and `base`

These are easy to confuse, but they're different things:

- **`siteUrl`** — the absolute address of the site (`https://myblog.org`). Used for canonical, sitemap, RSS, Open Graph. Set in `.vitepress/config.ts`.
- **`base`** — the path where the site lives on the domain. For the root of a domain, this is `/`. For GitHub Pages, for example, it's `/<repo-name>/`. You can also host the site at any path, even nested: `/path/to/site/`. A trailing slash is required.

So if the site is published at the root (`myblog.org`), you don't need to set `base`. It's only needed when the site is not at the root.

:::info
If the site is not at the root (using e.g. `base: /path-to-site/`), the `base` path is **automatically added** to `siteUrl` for all SEO links (canonical, sitemap, RSS, Open Graph, JSON-LD). You don't need to duplicate the path in `siteUrl` manually — just specify the domain: `https://myblog.org`.
:::

## GitHub Pages (project page)

A project page lives at `https://<user>.github.io/<repo>/`, i.e. in a subfolder. So you need `base: '/<repo>/'`. Pass it at build time:

```json
// package.json
{
  "scripts": {
    "build": "vitepress build src --base /my-blog/"
  }
}
```

And specify the absolute address in the config:

```ts
// .vitepress/config.ts
siteUrl: 'https://<user>.github.io'
```

The `/my-blog/` path will be added automatically from `base`.

## Automatic deployment with GitHub Actions

This workflow builds the site on every push to `main` and publishes it to Pages:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    permissions:
      contents: read
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      # npm run build will pick up --base from the script in package.json
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: src/.vitepress/dist
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

In your repository settings, enable **Settings → Pages → Source: GitHub Actions**.

If you use [analytics and popular posts](analytics), add the secrets `GA_PROPERTY_ID` and `GA_CREDENTIALS_JSON` in **Settings → Secrets and variables → Actions** and pass them to the `npm run build` step via `env:`.

## Other hosting providers

On Netlify, Vercel or Cloudflare Pages, specify the same parameters:

| Parameter | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `src/.vitepress/dist` |
| Node.js version | 22.18+ |

On these platforms the site usually lives at the root of the domain, so you don't need to change `base` — just set the correct `siteUrl`.

## Deploying with an AI agent

If you don't want to set up deployment manually, ask an AI agent (e.g., Codex, Claude Code, Cascade, etc.) to do it for you. The agent can create the configuration, write a workflow and verify the build.

Run the request in the root of your blog.

### What makes a good prompt

The agent doesn't guess — it does what's written. A useful prompt consists of four parts:

1. **What the project is** — a VitePress blog with the `vitepress-theme-neptu` theme, sources in `src/`, build output in `src/.vitepress/dist`, Node.js 22.18+.
2. **Where to deploy** — the platform and site address.
3. **What to do** — which files to create or modify.
4. **How to verify** — how to finish the work (usually `npm run build`).

Below are ready-made prompts. Replace the values in angle brackets `<...>` with your own; the rest can be left as-is.

**Netlify:**

> Set up deployment of my blog on Netlify. It's a VitePress site using the
> `vitepress-theme-neptu` theme: sources in `src/`, build with `npm run build`,
> output in `src/.vitepress/dist`, needs Node.js 22.18+.
>
> Do:
>
> 1. Create `netlify.toml`: build command, publish directory and
>    `NODE_VERSION = "22"` in environment variables.
> 2. Set `siteUrl: 'https://<my-domain>'` in `src/.vitepress/config.ts`.
>    The site lives at the root of the domain, so no need to change `base`.
> 3. Run `npm run build` and make sure the build passes without errors.
>
> Don't commit or push anything — I'll review the changes myself.

**Vercel:**

> Set up deployment of my blog on Vercel. It's a VitePress site using the
> `vitepress-theme-neptu` theme: sources in `src/`, build with `npm run build`,
> output in `src/.vitepress/dist`, needs Node.js 22.18+.
>
> Do:
>
> 1. Create `vercel.json` for a static site: `buildCommand`,
>    `outputDirectory` and `framework: null` (auto-detection doesn't work here
>    — the build directory is non-standard).
> 2. Add `"engines": { "node": "22.x" }` to `package.json` so Vercel picks
>    the right Node version.
> 3. Set `siteUrl: 'https://<my-domain>'` in `src/.vitepress/config.ts`.
> 4. Run `npm run build` and make sure the build passes without errors.
>
> Don't commit or push anything — I'll review the changes myself.

**Cloudflare Pages:**

> Prepare my blog for deployment on Cloudflare Pages. It's a VitePress site
> using the `vitepress-theme-neptu` theme: sources in `src/`, build with
> `npm run build`, output in `src/.vitepress/dist`, needs Node.js 22.18+.
>
> Do:
>
> 1. Create a `.node-version` file in the root with value `22` — Cloudflare
>    reads it during build.
> 2. Set `siteUrl: 'https://<my-domain>'` in `src/.vitepress/config.ts`.
> 3. Run `npm run build` and make sure the build passes without errors.
> 4. List what I need to enter in the Cloudflare Dashboard when creating the
>    project (build command, output directory, environment variables) — I'll
>    connect the repository myself.
>
> Don't commit or push anything — I'll review the changes myself.

**GitHub Pages (project page + auto-deploy):**

> Set up automatic deployment of my blog to GitHub Pages. It's a VitePress
> site using the `vitepress-theme-neptu` theme: sources in `src/`, build with
> `npm run build`, output in `src/.vitepress/dist`, needs Node.js 22.18+.
> The repository is `<user>/<repo>`, the site will be at
> `https://<user>.github.io/<repo>/`.
>
> Do:
>
> 1. The site lives in a subfolder, so add `--base /<repo>/` to the `build`
>    script in `package.json` (slashes on both sides are required). Add the same
>    `--base` to the `preview` script so local preview matches production.
> 2. Set `siteUrl: 'https://<user>.github.io'` in `src/.vitepress/config.ts`
>    — without the repository path, it will be added automatically from `base`.
> 3. Create `.github/workflows/deploy.yml`: build on push to `main`,
>    `actions/upload-pages-artifact` with path `src/.vitepress/dist` and
>    `actions/deploy-pages`. Add `concurrency` with group `pages`.
> 4. Run `npm run build` and verify that in the built `index.html` the asset
>    paths start with `/<repo>/`.
> 5. Remind me what I need to enable in the repository settings.
>
> Don't commit or push anything — I'll review the changes myself.

### What the agent does well, and what it doesn't

The agent handles routine tasks within the repository:

- generate the platform config file (`netlify.toml`, `vercel.json`, `.node-version`);
- create or update a GitHub Actions workflow;
- fix `base` and `siteUrl` and explain how they relate;
- pass environment variables to the build step;
- run `npm run build` and troubleshoot build errors.

But you'll need to do these yourself — the agent doesn't have access to your accounts:

- connect the repository to Netlify / Vercel / Cloudflare;
- enable **Settings → Pages → Source: GitHub Actions**;
- add secrets to repository or platform settings;
- link a domain and wait for the certificate to be issued.

### Tips

- Give the agent a link to this article — it will see the current build parameters.
- Ask it to verify with `npm run build`, not "by eye": almost all errors in `base` and `siteUrl` surface at build time.
- Don't dictate file contents line by line — just name the required values. This keeps the config readable and easy to fix by hand.
- Add secrets (`GA_CREDENTIALS_JSON`, platform tokens) yourself through the UI — no need to write them in the prompt.
- If something goes wrong, show the agent the full build log — it fixes problems faster from the log than from a description like "the site doesn't open."

---

Next: [Markdown features](./markdown-syntax)
