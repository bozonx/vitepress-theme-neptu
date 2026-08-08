import { BUILTIN_PODCAST_PLATFORMS, FALLBACK_PODCAST_ICON } from '../../configs/podcastPlatforms.ts'

import type {
  PodcastEntry,
  PodcastPlatform,
  ResolvedPodcast,
} from '../../types.d.ts'

/**
 * Picks a label out of the `string | Record<locale, string>` union used by
 * `PodcastPlatform.label`. An unknown locale falls back to the first value so
 * a half-translated registry still renders something.
 */
function pickLabel(
  label: string | Record<string, string> | undefined,
  localeIndex: string | undefined
): string | undefined {
  if (typeof label === 'string') return label
  if (!label || typeof label !== 'object') return undefined
  if (localeIndex && label[localeIndex]) return label[localeIndex]
  const first = Object.values(label).find((value) => typeof value === 'string' && value)
  return first
}

/**
 * Last-resort label for an id present in no registry at all: `player-fm` and
 * `player_fm` both become `Player Fm`. Better than the empty menu item the
 * dropdown used to render for unknown ids.
 */
function humanizeId(id: string): string {
  return id
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/**
 * Normalises one frontmatter entry to `{ id, url, ... }`.
 *
 * Two accepted shapes: the extended form `{ id, url, label?, icon?, iconUrl? }`
 * and the one-line shorthand `{ <id>: <url> }`. The presence of an `id` key is
 * the discriminator. Anything that matches neither shape is dropped rather
 * than rendered as a broken menu item.
 */
function normalizeEntry(entry: PodcastEntry): { id: string, url: string, overrides: PodcastPlatform } | undefined {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return undefined

  const candidate = entry as Record<string, unknown>

  // `id` alone commits the entry to the extended form: a shorthand whose
  // platform is literally called `id` is far less likely than a hand-written
  // extended entry with a typo'd or missing `url`, and silently reading that
  // one as `{ id: "<url>" }` would render a menu item pointing nowhere.
  if ('id' in candidate) {
    if (typeof candidate.id !== 'string' || !candidate.id) return undefined
    if (typeof candidate.url !== 'string' || !candidate.url) return undefined
    return {
      id: candidate.id,
      url: candidate.url,
      overrides: {
        label: candidate.label as string | Record<string, string> | undefined,
        icon: typeof candidate.icon === 'string' ? candidate.icon : undefined,
        iconUrl: typeof candidate.iconUrl === 'string' ? candidate.iconUrl : undefined,
      },
    }
  }

  const keys = Object.keys(candidate)
  if (keys.length !== 1) return undefined
  const id = keys[0]!
  const url = candidate[id]
  if (typeof url !== 'string' || !url) return undefined
  return { id, url, overrides: {} }
}

export interface ResolvePodcastsOptions {
  /** `themeConfig.podcastPlatforms` — merged over the built-in registry. */
  platforms?: Record<string, PodcastPlatform> | undefined
  /** `t.podcasts` — per-locale labels, used for the generic `site`/`rss` ids. */
  translations?: Record<string, string> | undefined
  /** Current VitePress `localeIndex`, for `label: { ru, en }` records. */
  localeIndex?: string | undefined
}

/**
 * Turns the frontmatter `podcasts` list into ready-to-render menu items,
 * preserving the authored order.
 *
 * Label precedence: entry override → user registry → `t.podcasts` → built-in
 * registry → humanized id. The user registry outranks `t.podcasts` because it
 * is the explicit, per-platform statement; the built-in one ranks below it so
 * that a locale can still translate a built-in brand name.
 */
export function resolvePodcasts(
  entries: PodcastEntry[] | undefined,
  options: ResolvePodcastsOptions = {}
): ResolvedPodcast[] {
  if (!Array.isArray(entries)) return []

  const { platforms, translations, localeIndex } = options
  const resolved: ResolvedPodcast[] = []

  for (const entry of entries) {
    const normalized = normalizeEntry(entry)
    if (!normalized) continue

    const { id, url, overrides } = normalized
    const user = platforms?.[id]
    const builtin = BUILTIN_PODCAST_PLATFORMS[id]

    const label =
      pickLabel(overrides.label, localeIndex) ??
      pickLabel(user?.label, localeIndex) ??
      translations?.[id] ??
      pickLabel(builtin?.label, localeIndex) ??
      humanizeId(id)

    const iconUrl = overrides.iconUrl ?? user?.iconUrl ?? builtin?.iconUrl
    const icon = iconUrl
      ? undefined
      : overrides.icon ?? user?.icon ?? builtin?.icon ?? FALLBACK_PODCAST_ICON

    resolved.push({ id, url, label, icon, iconUrl })
  }

  return resolved
}
