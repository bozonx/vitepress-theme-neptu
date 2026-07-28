# Changelog

All notable changes to the Neptu VitePress themes monorepo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Migrated monorepo from pnpm to npm: replaced `pnpm-workspace.yaml` with `workspaces` in root `package.json`, inlined all `catalog:` versions into individual `package.json` files, replaced pnpm commands in scripts with npm equivalents, updated CI workflow and documentation.

### Added

- `packages/landing`: publishable `neptu-landing` validation CLI with explicit file/directory targets, plus `hasBlockType()` and `unregisterBlockTypes()` registry helpers.
- `packages/landing`: six new blocks — `code` (copy-ready samples with tabs, no runtime highlighter), `tabs` (WAI-ARIA feature tabs), `compare` (comparison table with sticky head and row groups), `newsletter` (native form posting to any endpoint, optional background submit), `video` (click-to-load YouTube/Vimeo facade, no third-party cookies before consent) and `banner` (dismissable announcement strip).
- `packages/landing`: `--ln-c-brand-text` token — the brand color for text, re-derived by `LnSection` on `inverse` and `brand` surfaces so accents never disappear into their background.
- `packages/landing`: `LnFaq` emits `FAQPage` JSON-LD (`schema` prop, on by default).
- `packages/landing`: `LnCta` `surface` prop — the `card` variant no longer forces the surrounding strip to `base`.
- `packages/landing`: visible pause control and background-tab handling for carousel autoplay (WCAG 2.2.2); arrow-key navigation and localized labels in the gallery lightbox.

- `packages/landing`: block library — 21 landing blocks (`hero`, `features`, `feature-split`, `bento`, `tabs`, `carousel`, `logos`, `stats`, `steps`, `code`, `video`, `compare`, `testimonials`, `pricing`, `faq`, `cta`, `newsletter`, `timeline`, `team`, `gallery`, `banner`) and 11 primitives (`LnPage`, `LnSection`, `LnContainer`, `LnGrid`, `LnHeading`, `LnButton`, `LnButtonGroup`, `LnCard`, `LnMedia`, `LnIcon`, `LnReveal`), all registered globally by the theme.
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

- **Breaking** `packages/landing`: declarative TypeScript block specs now enforce the same required fields and non-empty collections as the JSON Schema; block actions require a `link`, and replacing a registered block requires `{ override: true }`.
- **Breaking** `packages/landing`: the default export is now a full theme — the VitePress default theme extended with the block library and the style layers — instead of a bare `Layout: SiteHome`. Use `export default LandingTheme`, or `{ ...LandingTheme, Layout }` to add nav bar slots. `SiteHome` is still exported from `…/layouts`.
- `packages/landing`: `themeConfig` types for `nav`, `sidebar`, `footer`, `socialLinks` and other chrome options now come from the VitePress default theme (`LandingChromeConfig`), matching the theme the landing actually renders.
- `docs/landing-example`: search switched from Pagefind to the built-in VitePress local search, which drops the extra build step and the head scripts.
- CI workflow: `permissions: pages: write` and `id-token: write` scoped to `deploy` job only.
- CI workflow: `concurrency` group changed to per-branch (`${{ github.workflow }}-${{ github.ref }}`) with `cancel-in-progress: true`.
- CI workflow: removed hardcoded `version: 10` from `pnpm/action-setup` — now uses `packageManager` field.
- `docs/tsconfig.json` now extends `tsconfig.base.json` instead of duplicating compiler options.
- `packages/landing`: `vitepress-theme-neptu` dependency changed from `workspace:*` to `workspace:^`.
- `packages/blog/template/package.json`: blog dependency bumped from `^0.19.0` to `^0.20.0`.

### Fixed

- `packages/landing`: `layout: landing` is accepted by `schema/landing-blocks.schema.json` — the schema demanded `layout: home`, so the declarative example page failed `validate:blocks`.
- `packages/landing`: `LnCarousel` measured slide positions against the section instead of the scroll container, so the active dot and the arrow steps drifted by the track offset on wide viewports. The active slide is now the first visible one, and the last dot is reachable at the end of the track.
- `packages/landing`: local paths are resolved against the site `base` everywhere — the `cover` hero background, image icons and the inline link of a `feature-split` row were not prefixed and broke on sub-path deployments.
- `packages/blog`: brand color of the `teal`, `green` and `amber` presets darkened so white text on a brand surface clears WCAG AA (was 2.2:1, 3.4:1 and 3.6:1).
- `packages/landing`: an eyebrow or accent on a `brand` background is no longer painted brand-on-brand.
- `packages/landing`: `LnLogoCloud` marquee loops seamlessly (the shift was half a gap short) and no longer announces every logo twice; logo links work in the marquee variant too.
- `packages/landing`: `LnBento` resolves tile spans in JS — `grid-column: span min(…)` is not portable and could flatten the grid.
- `packages/landing`: the landing page no longer scrolls sideways — the default theme's full-bleed nav bar padding leaked ~100vw of horizontal overflow.
- `packages/landing`: `LnFeatureGrid`'s default slot appends to the items instead of replacing them, matching every other block.
- `packages/landing`: carousel slides and testimonial ratings carry a role, so their labels reach assistive tech; team member names are headings.
- `packages/landing`: `scripts/validate-blocks.mjs` reports a YAML syntax error as a finding instead of aborting with a stack trace.

### Removed

- `docs/landing-example/.gitignore` — root `.gitignore` already covers all needed patterns.
- Duplicate `../packages/blog/src/**` include from `docs/tsconfig.json` — blog sources are type-checked in their own package.
