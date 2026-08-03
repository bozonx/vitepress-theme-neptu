# Contributing to Neptu VitePress Themes

Thank you for your interest in contributing! This document covers the basics.

## Prerequisites

- Node.js >= 22 (see `.node-version`)
- npm 10+ (bundled with Node.js 22)

## Getting Started

```bash
git clone https://github.com/bozonx/vitepress-theme-neptu.git
cd vitepress-theme-neptu
npm install
```

## Monorepo Layout

```
packages/blog     — blog theme (vitepress-theme-neptu)
packages/landing  — landing theme (vitepress-theme-neptu-landing)
docs              — documentation site
docs/landing-example — landing example site
```

## Development Workflow

```bash
# Run all checks
npm run check

# Individual tasks
npm run typecheck
npm run lint
npm run test
npm run build
npm run e2e

# Dev servers
npm run blog:dev
npm run landing:dev
```

## Making Changes

1. Create a branch from `main`.
2. Make your changes. Keep commits focused.
3. Run `npm run check` to verify everything passes.
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

Shared dependency versions are managed via npm workspaces. To bump a shared
dependency, update the version in each `package.json` that uses it and run
`npm install`.

## Reporting Issues

Use [GitHub Issues](https://github.com/bozonx/vitepress-theme-neptu/issues).
For security vulnerabilities, see [SECURITY.md](./SECURITY.md).
