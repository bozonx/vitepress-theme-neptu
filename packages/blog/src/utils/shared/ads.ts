import type { AdsConfig, PostFrontmatter, ThemeConfig } from '../../types.d.ts'
import { isHomePage, resolveLayoutKey } from './page.ts'

/**
 * Layouts that may render ad slots unless `themeConfig.ads.layouts` says
 * otherwise. Posts only: listing and utility pages have no reading flow to
 * place an in-content unit into, and `page` layouts are usually the imprint,
 * contact or donate pages where ads are out of place.
 */
export const DEFAULT_ADS_LAYOUTS = ['post']

/** Placements the theme knows how to render. */
export type AdPlacement = 'aside' | 'in-content' | 'after-content'

/**
 * Defaults for the in-content rule.
 *
 * Anchoring to headings rather than paragraphs keeps the unit at a natural
 * section break instead of splitting an argument in half, and `start: 2`
 * leaves the opening section clean.
 */
export type InContentRule = Required<NonNullable<AdsConfig['inContent']>>

export const DEFAULT_ADS_IN_CONTENT: InContentRule = {
  enabled: true,
  anchor: 'heading',
  start: 2,
  every: 3,
  max: 2,
  minBlocks: 6,
}

/**
 * Whether ad slots may render on the current page at all.
 *
 * Frontmatter `ads: true | false` wins over `themeConfig.ads.layouts`; the
 * home page never renders ads because it uses its own full-takeover layout.
 * Individual placements are then narrowed by {@link isPlacementEnabled}.
 */
export function isAdsEnabled(
  theme: ThemeConfig | null | undefined,
  frontmatter: PostFrontmatter | null | undefined
): boolean {
  if (isHomePage(frontmatter)) return false
  if (theme?.ads?.enabled === false) return false
  if (typeof frontmatter?.ads === 'boolean') return frontmatter.ads

  const layouts = theme?.ads?.layouts ?? DEFAULT_ADS_LAYOUTS

  return layouts.includes(
    resolveLayoutKey(frontmatter, theme?.ads?.defaultLayout)
  )
}

/** Whether one specific placement is turned on in the config. */
export function isPlacementEnabled(
  ads: AdsConfig | null | undefined,
  placement: AdPlacement
): boolean {
  if (placement === 'aside') return ads?.aside !== false
  if (placement === 'after-content') return ads?.afterContent === true

  return (ads?.inContent?.enabled ?? DEFAULT_ADS_IN_CONTENT.enabled) !== false
}

/**
 * Whether an ad slot must wait for consent before rendering.
 *
 * Defaults to `false`: a certified CMP already withholds personalised ads on
 * its own, and blanking the slot entirely would also drop the non-personalised
 * ads such a visitor may still be served. Set `ads.requireConsent: true` to
 * render nothing until the visitor opts in.
 */
export function requiresAdConsent(
  ads: AdsConfig | null | undefined
): boolean {
  return ads?.requireConsent === true
}

/**
 * Resolve the in-content rule with defaults applied — shared by the markdown
 * plugin (which places the slots) and the tests.
 */
export function resolveInContentRule(
  ads: AdsConfig | null | undefined
): InContentRule {
  return { ...DEFAULT_ADS_IN_CONTENT, ...ads?.inContent }
}
