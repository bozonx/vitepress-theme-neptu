# Contributing to Neptu VitePress Themes

Thank you for your interest in contributing! This document covers the basics.

## Prerequisites

- Node.js >= 22 (see `.node-version`)
- pnpm 11+ (version is pinned via `packageManager` in `package.json`)

## Getting Started

```bash
git clone https://github.com/bozonx/vitepress-theme-neptu-blog.git
cd vitepress-theme-neptu-blog
pnpm install
```

## Monorepo Layout

```
packages/blog     — blog theme (vitepress-theme-neptu-blog)
packages/landing  — landing theme (vitepress-theme-neptu-landing)
docs              — documentation site
docs/landing-example — landing example site
```

## Development Workflow

```bash
# Run all checks
pnpm check

# Individual tasks
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm e2e

# Dev servers
pnpm docs:dev
pnpm landing:dev
```

## Making Changes

1. Create a branch from `main`.
2. Make your changes. Keep commits focused.
3. Run `pnpm check` to verify everything passes.
4. Open a pull request with a clear description.

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new theme preset
fix: correct RSS feed date format
docs: update installation guide
chore: bump dependencies
```

### Dependency Versions

Shared dependency versions are managed via pnpm `catalog:` in `pnpm-workspace.yaml`.
To bump a shared dependency, update the catalog entry and run `pnpm install`.

## Reporting Issues

Use [GitHub Issues](https://github.com/bozonx/vitepress-theme-neptu-blog/issues).
For security vulnerabilities, see [SECURITY.md](./SECURITY.md).
