# Changelog

All notable changes to the Neptu VitePress themes monorepo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `packages/landing`: block library — 15 landing blocks (`hero`, `features`, `feature-split`, `bento`, `carousel`, `logos`, `stats`, `steps`, `testimonials`, `pricing`, `faq`, `cta`, `timeline`, `team`, `gallery`) and 11 primitives (`LnPage`, `LnSection`, `LnContainer`, `LnGrid`, `LnHeading`, `LnButton`, `LnButtonGroup`, `LnCard`, `LnMedia`, `LnIcon`, `LnReveal`), all registered globally by the theme.
- `packages/landing`: semantic token layer (`landing-vars.css`) on top of the shared Neptu palette, plus a second, color-independent theme axis — style presets `soft`, `sharp`, `brutal`, `glass`, `editorial` (`style-presets.css`, `data-ln-style`).
- `packages/landing`: `vitepress-bridge.css` mapping landing tokens onto `--vp-*`, so the VitePress default theme chrome follows the active theme.
- `packages/landing`: declarative page mode — a `blocks:` array in frontmatter rendered by `<LandingRenderer />`, with a block registry, `registerBlockTypes()` and a dev-time warning for unknown types.
- `packages/landing`: `LnThemePicker` component and `useLandingStyle` composable for switching either theme axis at runtime; `createLandingHeadScript` restores both before the first paint and arms the reveal animations (`html.ln-js`).
- `packages/landing`: `themeConfig.defaultColorTheme` and `themeConfig.defaultLandingStyle`.
- `packages/landing`: `schema/landing-blocks.schema.json` and `AGENTS.md` (rules, block contract, page recipes) for AI-assisted authoring.
- `docs/landing-example`: full block showcase on the English home page (component mode), the same page in YAML on the Russian one (declarative mode), theme pickers in the nav bar, and new docs pages — Blocks, Theming, Page as data.
- `packageManager` field in root `package.json` to pin pnpm version across environments.
- `CONTRIBUTING.md`, `SECURITY.md`, issue templates, and Dependabot configuration.
- `CHANGELOG.md` for tracking notable changes.
- pnpm `catalog:` for centralized dependency version management across the monorepo.

### Changed

- **Breaking** `packages/landing`: the default export is now a full theme — the VitePress default theme extended with the block library and the style layers — instead of a bare `Layout: SiteHome`. Use `export default LandingTheme`, or `{ ...LandingTheme, Layout }` to add nav bar slots. `SiteHome` is still exported from `…/layouts`.
- `packages/landing`: `themeConfig` types for `nav`, `sidebar`, `footer`, `socialLinks` and other chrome options now come from the VitePress default theme (`LandingChromeConfig`), matching the theme the landing actually renders.
- `docs/landing-example`: search switched from Pagefind to the built-in VitePress local search, which drops the extra build step and the head scripts.
- CI workflow: `permissions: pages: write` and `id-token: write` scoped to `deploy` job only.
- CI workflow: `concurrency` group changed to per-branch (`${{ github.workflow }}-${{ github.ref }}`) with `cancel-in-progress: true`.
- CI workflow: removed hardcoded `version: 10` from `pnpm/action-setup` — now uses `packageManager` field.
- `docs/tsconfig.json` now extends `tsconfig.base.json` instead of duplicating compiler options.
- `packages/landing`: `vitepress-theme-neptu-blog` dependency changed from `workspace:*` to `workspace:^`.
- `packages/blog/template/package.json`: blog dependency bumped from `^0.19.0` to `^0.20.0`.

### Removed

- `docs/landing-example/.gitignore` — root `.gitignore` already covers all needed patterns.
- Duplicate `../packages/blog/src/**` include from `docs/tsconfig.json` — blog sources are type-checked in their own package.
