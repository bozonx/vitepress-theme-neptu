---
title: Markdown Feature Guide
description: A quick reference for Markdown formatting options available in this blog.
date: 2026-07-20
authorId: ivan
category: Guides
tags:
  - Guide
  - Markdown
---

VitePress supports full GitHub Flavored Markdown (GFM) along with Vue component integration.

## Quotes & Callouts

> "Simplicity is prerequisite for reliability." &mdash; Edsger W. Dijkstra

## Code Snippets

```typescript
interface BlogPost {
  title: string
  date: string
  author: string
  tags?: string[]
}
```

## Tables

| Feature | Supported | Description |
| ------- | --------- | ----------- |
| Tags | Yes | Categorize posts automatically |
| RSS / Atom | Yes | Auto-generated feeds |
| Search | Yes | Fast client-side search via Pagefind |
