# Changelog

All notable changes to the Neptu VitePress themes monorepo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `packageManager` field in root `package.json` to pin pnpm version across environments.
- `CONTRIBUTING.md`, `SECURITY.md`, issue templates, and Dependabot configuration.
- `CHANGELOG.md` for tracking notable changes.
- pnpm `catalog:` for centralized dependency version management across the monorepo.

### Changed

- CI workflow: `permissions: pages: write` and `id-token: write` scoped to `deploy` job only.
- CI workflow: `concurrency` group changed to per-branch (`${{ github.workflow }}-${{ github.ref }}`) with `cancel-in-progress: true`.
- CI workflow: removed hardcoded `version: 10` from `pnpm/action-setup` — now uses `packageManager` field.
- `docs/tsconfig.json` now extends `tsconfig.base.json` instead of duplicating compiler options.
- `packages/landing`: `vitepress-theme-neptu-blog` dependency changed from `workspace:*` to `workspace:^`.
- `packages/blog/template/package.json`: blog dependency bumped from `^0.19.0` to `^0.20.0`.

### Removed

- `docs/landing-example/.gitignore` — root `.gitignore` already covers all needed patterns.
- Duplicate `../packages/blog/src/**` include from `docs/tsconfig.json` — blog sources are type-checked in their own package.
