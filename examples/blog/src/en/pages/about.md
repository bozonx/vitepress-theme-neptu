---
title: About this demo
description: What this demo blog is and how to use it as a starting point for your own site.
layout: page
translations:
  ru: /ru/pages/about
---

# About this demo

This site is both a demo and a guide to the
[vitepress-theme-neptu](https://github.com/bozonx/vitepress-theme-neptu) theme.
Every post demonstrates a real feature of the theme, with the frontmatter or config
that produces it shown alongside. It reads as a guide — from setup to advanced customization.

## Guide sections

The guide consists of seven sections and is meant to be read in order — from launching
a blog to hooks and slots. The full table of contents with all thirty articles is on
a separate page:

### → [Table of contents](contents)

The same order is reflected in the [recent posts list](../recent/1), and the sections
are available as [categories](../categories/).

## Start your own blog

The starting point is the template folder from the repository. Copy it and
make it your own:

- set `siteUrl` in `.vitepress/config.ts`,
- edit `src/site.yaml` and `src/<locale>/_site.yaml`,
- delete the demo posts in `src/<locale>/posts/` and write your own.

Step-by-step instructions are in the [Getting started](../posts/getting-started) section,
and which file does what is explained in [Project structure](../posts/project-structure).
