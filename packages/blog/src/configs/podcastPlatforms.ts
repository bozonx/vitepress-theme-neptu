import type { PodcastPlatform } from '../types.d.ts'

/**
 * Built-in podcast platforms: id → dropdown label and Iconify icon.
 *
 * Deliberately limited to platforms with meaningful global reach and an icon
 * that ships in the theme's offline icon bundle. Anything else — regional
 * services, niche apps — is added by the user through
 * `themeConfig.podcastPlatforms`, which is merged over this map and can also
 * override entries here.
 *
 * `site` and `rss` carry no label: they are generic wording rather than brand
 * names, so their labels come from `t.podcasts` per locale.
 */
export const BUILTIN_PODCAST_PLATFORMS: Record<string, PodcastPlatform> = {
  site: { icon: 'mdi:globe' },
  rss: { icon: 'mdi:rss' },
  applepodcasts: { label: 'Apple Podcasts', icon: 'simple-icons:applepodcasts' },
  spotify: { label: 'Spotify', icon: 'simple-icons:spotify' },
  youtube: { label: 'YouTube', icon: 'simple-icons:youtube' },
  youtubemusic: { label: 'YouTube Music', icon: 'simple-icons:youtubemusic' },
  amazonmusic: { label: 'Amazon Music', icon: 'simple-icons:amazonmusic' },
  castbox: { label: 'Castbox', icon: 'simple-icons:castbox' },
  deezer: { label: 'Deezer', icon: 'simple-icons:deezer' },
  iheartradio: { label: 'iHeartRadio', icon: 'simple-icons:iheartradio' },
  tunein: { label: 'TuneIn', icon: 'simple-icons:tunein' },
  pocketcasts: { label: 'Pocket Casts', icon: 'simple-icons:pocketcasts' },
  overcast: { label: 'Overcast', icon: 'simple-icons:overcast' },
  podcastaddict: { label: 'Podcast Addict', icon: 'simple-icons:podcastaddict' },
  podcastindex: { label: 'Podcast Index', icon: 'simple-icons:podcastindex' },
}

/** Icon used when a platform resolves to no icon of its own. */
export const FALLBACK_PODCAST_ICON = 'mdi:podcast'
