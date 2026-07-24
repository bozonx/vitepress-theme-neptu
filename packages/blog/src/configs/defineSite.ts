import type { Author, ThemeConfig } from '../types.d.ts'

/**
 * Shape shared by the three TS/YAML config sources that the theme consumes:
 *   - `<srcDir>/site.yaml` / `<srcDir>/site.ts` (cross-locale admin layer)
 *   - `<srcDir>/<locale>/_site.yaml` / `<srcDir>/<locale>/_site.ts` (per-locale admin layer)
 *
 * The `extends` field is only meaningful for the per-locale variant.
 * The shared `site.yaml` should leave `lang` / `title` / `description`
 * empty — those belong in `<locale>/_site.*`.
 */
export interface SiteYamlConfig {
  lang?: string
  title?: string
  titleTemplate?: string
  description?: string
  /** Inherit from another locale's `_site.*`. Per-locale files only. */
  extends?: string
  themeConfig?: Partial<ThemeConfig>
}

/**
 * Identity helper that types the return as {@link SiteYamlConfig}.
 * Use from `site.ts` or `_site.ts` to get autocomplete and refactor support:
 *
 * ```ts
 * // src/en/_site.ts
 * import { defineLocaleConfig } from 'vitepress-theme-neptu-blog/configs'
 * export default defineLocaleConfig({ lang: 'en-US', themeConfig: { ... } })
 * ```
 */
export function defineLocaleConfig(config: SiteYamlConfig): SiteYamlConfig {
  return config
}

/**
 * Identity helper for the cross-locale `site.ts`.
 *
 * ```ts
 * // src/site.ts
 * import { defineSiteConfig } from 'vitepress-theme-neptu-blog/configs'
 * export default defineSiteConfig({ themeConfig: { publisher: { ... } } })
 * ```
 */
export function defineSiteConfig(config: SiteYamlConfig): SiteYamlConfig {
  return config
}

/**
 * Identity helper for `_authors.ts`.
 *
 * ```ts
 * // src/en/_authors.ts
 * import { defineAuthorsList } from 'vitepress-theme-neptu-blog/configs'
 * export default defineAuthorsList([{ id: 'ivan', name: 'Ivan K', ... }])
 * ```
 */
export function defineAuthorsList(authors: Author[]): Author[] {
  return authors
}
