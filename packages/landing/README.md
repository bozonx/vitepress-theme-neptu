# vitepress-theme-neptu-landing

VitePress landing theme for Neptu main site.

This is a companion package to `vitepress-theme-neptu-blog`. It reuses shared utilities and transformers from the blog theme and provides landing-page specific layouts and configuration helpers.

The runnable example lives in `docs/landing-example` and can be started from
the repository root with `pnpm landing:dev`.

## Installation

```bash
pnpm add vitepress-theme-neptu-landing vitepress-theme-neptu-blog
```

## Usage

In your `.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'
import { defineLandingConfig } from 'vitepress-theme-neptu-landing/configs'
import type { LandingUserConfig } from 'vitepress-theme-neptu-landing'

export default async () => {
  const config: LandingUserConfig = defineConfig({
    srcDir: 'src',
    siteUrl: 'https://example.com',
    themeConfig: {
      repo: 'https://github.com/user/repo',
      logo: '/img/logo.svg',
    },
  })

  return defineLandingConfig(config)
}
```

`defineLandingConfig` auto-discovers locale folders from `srcDir` using
`<srcDir>/<locale>/_site.yaml` or `_site.ts`. Explicit `locales` still
win for advanced/manual setups.

### Config helpers

| Export | Description |
|--------|-------------|
| `defineLandingConfig(config)` | Async entry point — auto-discovers locales, applies defaults, validates required fields. |
| `defineLandingConfigSync(config)` | Sync variant — same as above but without locale auto-discovery. |
| `mergeLandingConfig(config)` | Low-level merge without validation warnings. |
| `loadSiteLocale(localeIndex, config)` | Build a single locale from YAML layers. |
| `autoLoadSiteLocales(config)` | Auto-discover all locale folders. |

### YAML config layers

- `<srcDir>/site.yaml` — cross-locale shared admin layer
- `<srcDir>/<locale>/_site.yaml` — per-locale admin layer (supports `extends:` chain)

Top-level keys: `lang`, `title`, `titleTemplate`, `description`. Everything else goes under `themeConfig:`.

### Landing page

In your landing page markdown:

```md
---
layout: home
---

<script setup lang="ts">
import { SiteHome } from 'vitepress-theme-neptu-landing/layouts'

const hero = { /* ... */ }
const features = [ /* ... */ ]
</script>

<SiteHome :hero="hero" :features="features" />
```

## TypeScript

The package is fully typed. Import types from the main entry:

```ts
import type { LandingUserConfig, ResolvedLandingConfig, ThemeConfig, I18n } from 'vitepress-theme-neptu-landing'
```
