import { describe, it, expect } from 'vitest'
import { resolvePodcasts } from '../../../../src/utils/shared/podcasts'

describe('resolvePodcasts', () => {
  it('returns an empty list for missing or non-array input', () => {
    expect(resolvePodcasts(undefined)).toEqual([])
    expect(resolvePodcasts({ spotify: 'https://x' } as never)).toEqual([])
  })

  it('resolves the shorthand form against the built-in registry', () => {
    expect(resolvePodcasts([{ spotify: 'https://open.spotify.com/e/1' }])).toEqual([
      {
        id: 'spotify',
        url: 'https://open.spotify.com/e/1',
        label: 'Spotify',
        icon: 'simple-icons:spotify',
        iconUrl: undefined,
      },
    ])
  })

  it('preserves the authored order', () => {
    const resolved = resolvePodcasts([
      { overcast: 'https://overcast.fm/1' },
      { spotify: 'https://open.spotify.com/e/1' },
      { rss: 'https://example.com/rss' },
    ])
    expect(resolved.map((entry) => entry.id)).toEqual(['overcast', 'spotify', 'rss'])
  })

  it('falls back to a humanized id and the generic icon for an unknown platform', () => {
    const [entry] = resolvePodcasts([{ 'player-fm': 'https://player.fm/1' }])
    expect(entry).toMatchObject({ label: 'Player Fm', icon: 'mdi:podcast' })
  })

  it('applies the label precedence: entry, user registry, translations, built-in', () => {
    const options = {
      platforms: { spotify: { label: 'Spotify RU' } },
      translations: { spotify: 'Spotify locale', site: 'Episode page' },
    }
    expect(resolvePodcasts([{ spotify: 'https://x' }], options)[0]!.label).toBe('Spotify RU')
    expect(
      resolvePodcasts([{ id: 'spotify', url: 'https://x', label: 'Inline' }], options)[0]!.label
    ).toBe('Inline')
    expect(
      resolvePodcasts([{ spotify: 'https://x' }], { translations: options.translations })[0]!.label
    ).toBe('Spotify locale')
    expect(resolvePodcasts([{ site: 'https://x' }], options)[0]!.label).toBe('Episode page')
  })

  it('picks a per-locale label and falls back to the first one', () => {
    const platforms = { zvuk: { label: { ru: 'Звук', en: 'Zvuk' } } }
    expect(
      resolvePodcasts([{ zvuk: 'https://x' }], { platforms, localeIndex: 'ru' })[0]!.label
    ).toBe('Звук')
    expect(
      resolvePodcasts([{ zvuk: 'https://x' }], { platforms, localeIndex: 'de' })[0]!.label
    ).toBe('Звук')
  })

  it('lets iconUrl win over icon', () => {
    const [entry] = resolvePodcasts([
      { id: 'spotify', url: 'https://x', iconUrl: '/icons/custom.svg' },
    ])
    expect(entry).toMatchObject({ icon: undefined, iconUrl: '/icons/custom.svg' })
  })

  it('skips malformed entries', () => {
    const resolved = resolvePodcasts([
      { spotify: '' },
      { spotify: 'https://a', overcast: 'https://b' },
      { id: 'x' } as never,
      null as never,
      { overcast: 'https://overcast.fm/1' },
    ])
    expect(resolved.map((entry) => entry.id)).toEqual(['overcast'])
  })
})
