---
title: Launch a blog in 5 minutes
description: >
  The shortest path to a working blog: copy the template, install
  dependencies and start the local server.
authorId: ivan-k
cover: https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Laptop and coffee cup on a wooden table
coverDescription: "Photo by [Alejandro Escamilla](https://unsplash.com/@alejandroescamilla) on Unsplash."
date: 2026-08-02
category: getting-started
tags: [start]
featured: true
descriptionAsPreview: true
translations:
  ru: /ru/posts/getting-started
---

This guide for the **Neptu blog** project is itself running on Neptu, which allows you to not only read the documentation but also explore all the features of this project.

Neptu blog is a theme for VitePress that lets you create static blogs which, when built, are just ordinary HTML, JS and CSS files.

Creating and launching your own blog is incredibly simple:

## Step 1. Copy the template

The theme repository includes a ready-made starter project — the `template/` folder. That's the installation: copy its contents into a new folder for your blog.

```bash
git clone https://github.com/bozonx/vitepress-theme-neptu
cp -r vitepress-theme-neptu/packages/blog/template my-blog
cd my-blog
```

Inside is a minimal but fully functional blog: configuration, one locale and a couple of demo posts.

## Step 2. Install dependencies

```bash
npm install      # or: pnpm install / yarn install
```

You need Node.js **22.18** minimum — that's what VitePress 2 requires.

## Step 3. Start the development server

```bash
npm run dev      # or: pnpm dev / yarn dev
```

Open `http://localhost:5173` — the blog is already running.

:::info
Thanks to VitePress's built-in hot reload support, all your changes in `src/` will automatically appear on the open page in the browser without needing to refresh.
:::

## Step 4. Build the production version

```bash
npm run build      # or: pnpm build / yarn build
npm run preview    # or: pnpm preview / yarn preview
```

The `build` script compiles the static site into `src/.vitepress/dist` and builds the [Pagefind](search-pagefind) search index. The `preview` script starts a local server at `http://localhost:4173` so you can view the final build — exactly what you'll later publish to the internet.

## Step 5. Deploy

To publish your blog on the internet, follow the deployment instructions on the
[Publishing and deployment](deploy) page. To simplify the process, you can use AI agents — example prompts are provided on that same page.

## What's next

The blog is running — now you need to understand it. Let's start with the [project structure](project-structure).
