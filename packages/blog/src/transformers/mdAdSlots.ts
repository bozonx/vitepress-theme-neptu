import {
  DEFAULT_ADS_LAYOUTS,
  resolveInContentRule,
} from '../utils/shared/ads.ts'
import type { AdsConfig } from '../types.d.ts'

export interface MdAdSlotsOptions {
  ads?: AdsConfig
}

interface MarkdownToken {
  type: string
  tag: string
  level: number
  content: string
  markup?: string
  block?: boolean
}

interface MdAdSlotsEnv {
  frontmatter?: Record<string, unknown>
}

interface MdAdSlotsState {
  tokens: MarkdownToken[]
  Token: new (type: string, tag: string, nesting: number) => MarkdownToken
  env?: MdAdSlotsEnv
}

interface MdAdSlotsMarkdown {
  core: {
    ruler: {
      push(name: string, fn: (state: MdAdSlotsState) => void): void
    }
  }
}

/**
 * Top-level tokens that count as "a block of content" when measuring whether
 * an article is long enough to carry an in-content unit.
 */
const BLOCK_OPENERS = new Set([
  'paragraph_open',
  'heading_open',
  'blockquote_open',
  'bullet_list_open',
  'ordered_list_open',
  'table_open',
  'fence',
])

/**
 * Markdown-it plugin that places in-content ad slots at build time.
 *
 * Injecting the slots here rather than from the client keeps them part of the
 * server-rendered HTML: no layout shift as a unit appears mid-article, no
 * flicker when VitePress swaps pages, and the position is deterministic
 * instead of depending on when a script happened to run. The emitted
 * `<NeptuAd />` is an ordinary component — VitePress compiles page markdown
 * into a Vue template, so raw HTML blocks may reference global components.
 *
 * Authors who want a unit somewhere specific can write `<NeptuAd />` in the
 * markdown themselves; automatic slots are placed independently of those.
 */
export function mdAdSlots(md: unknown, { ads }: MdAdSlotsOptions = {}): void {
  const markdown = md as MdAdSlotsMarkdown
  const rule = resolveInContentRule(ads)

  markdown.core.ruler.push('neptu_ad_slots', (state) => {
    if (ads?.enabled === false || rule.enabled === false) return
    if (rule.max <= 0 || rule.every <= 0) return

    const frontmatter = state.env?.frontmatter ?? {}

    if (typeof frontmatter.ads === 'boolean') {
      if (!frontmatter.ads) return
    } else {
      const layout =
        typeof frontmatter.layout === 'string' && frontmatter.layout
          ? frontmatter.layout
          : (ads?.defaultLayout ?? 'post')
      const layouts = ads?.layouts ?? DEFAULT_ADS_LAYOUTS
      if (!layouts.includes(layout)) return
    }

    const tokens = state.tokens
    const isAnchor = (token: MarkdownToken): boolean =>
      token.level === 0 &&
      (rule.anchor === 'paragraph'
        ? token.type === 'paragraph_open'
        : token.type === 'heading_open' && token.tag === 'h2')

    // Short articles are left alone: breaking six blocks of prose with a unit
    // costs more attention than the impression is worth.
    const blockCount = tokens.filter(
      (token) => token.level === 0 && BLOCK_OPENERS.has(token.type)
    ).length

    if (blockCount < rule.minBlocks) return

    // Collect first, splice after — mutating while scanning would shift the
    // indices of every anchor still ahead.
    const positions: number[] = []
    let seen = 0

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (!token || !isAnchor(token)) continue

      seen++

      if (seen < rule.start) continue
      if ((seen - rule.start) % rule.every !== 0) continue

      positions.push(i)

      if (positions.length >= rule.max) break
    }

    for (let n = positions.length - 1; n >= 0; n--) {
      const position = positions[n]
      if (position === undefined) continue

      const token = new state.Token('html_block', '', 0)
      token.block = true
      token.content = `<NeptuAd placement="in-content" :index="${n}" />\n`

      tokens.splice(position, 0, token)
    }
  })
}
