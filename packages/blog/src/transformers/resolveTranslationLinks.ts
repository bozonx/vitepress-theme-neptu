import fs from 'node:fs'
import path from 'node:path'
import {
  getFrontmatterTranslations,
  pickExistingTranslationRelativePath,
  resolveTranslationRelativePathCandidates,
} from '../utils/shared/index.ts'
import type { ExtendedPageData, ExtendedSiteConfig } from '../types.d.ts'

/**
 * Frontmatter key holding the resolved translations of an ordinary page, as
 * `{ [localeCode]: relativePath }`.
 *
 * Prefixed to mark it as theme-generated: it is written during
 * `transformPageData` and overwrites whatever a post might declare under this
 * name.
 */
export const TRANSLATION_LINKS_KEY = '__neptuTranslations'

/**
 * Resolves, at build time, which locales actually have a translation of this
 * page, and records the answer for the client.
 *
 * The language switcher cannot work this out on its own. It matches candidate
 * paths against `site.pages`, but that index is a dev-server convenience —
 * in a production bundle it is absent, `pickExistingTranslationRelativePath`
 * has nothing to filter against, and it returns the candidate unchecked. The
 * result is a switcher that offers every locale on every page, including the
 * ones where the translation was never written.
 *
 * Here the check is a real `fs.existsSync` against `srcDir`, the same one
 * {@link addHreflang} already performs for the `<link rel="alternate">` tags —
 * so the visible switcher and the hreflang markup now agree by construction.
 *
 * Generated list routes are skipped: they have no source file per locale and
 * are mapped by `useContentLangs` on their own terms.
 */
export function resolveTranslationLinks(
  pageData: ExtendedPageData,
  options: { siteConfig?: ExtendedSiteConfig } = {}
): void {
  const siteConfig = options.siteConfig
  const srcDir = siteConfig?.srcDir
  const relativePath = pageData.relativePath
  const locales = siteConfig?.site?.locales

  if (!srcDir || !relativePath || !locales) return
  if (Object.keys(locales).length <= 1) return

  const declared = getFrontmatterTranslations(pageData.frontmatter)
  const resolved: Record<string, string> = {}

  for (const code of Object.keys(locales)) {
    const candidate = pickExistingTranslationRelativePath(
      resolveTranslationRelativePathCandidates(relativePath, code, declared),
      {
        fileExists: (value) => fs.existsSync(path.join(srcDir, value)),
      }
    )
    if (candidate) resolved[code] = candidate
  }

  pageData.frontmatter[TRANSLATION_LINKS_KEY] = resolved
}
