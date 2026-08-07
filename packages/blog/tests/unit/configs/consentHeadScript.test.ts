import { describe, it, expect } from 'vitest'
import { createConsentHeadScript } from '../../../src/configs/consentHeadScript.ts'
import { CONSENT_SCHEMA_VERSION } from '../../../src/utils/shared/consent.ts'

describe('createConsentHeadScript', () => {
  it('denies every signal by default', () => {
    const script = createConsentHeadScript()

    expect(script).toContain("gtag('consent','default'")
    expect(script).toContain('"analytics_storage":"denied"')
    expect(script).toContain('"ad_storage":"denied"')
    expect(script).toContain('"ad_user_data":"denied"')
    expect(script).toContain('"ad_personalization":"denied"')
  })

  it('gives a CMP time to answer before tags act on the defaults', () => {
    expect(createConsentHeadScript()).toContain('"wait_for_update":500')
    expect(createConsentHeadScript({ waitForUpdate: 2000 })).toContain(
      '"wait_for_update":2000'
    )
  })

  it('applies configured defaults', () => {
    const script = createConsentHeadScript({ defaults: { analytics: true } })

    expect(script).toContain('"analytics_storage":"granted"')
    expect(script).toContain('"ad_storage":"denied"')
  })

  it('scopes the defaults to a region when asked', () => {
    expect(createConsentHeadScript({ regions: ['ES', 'US-CA'] })).toContain(
      '"region":["ES","US-CA"]'
    )
    expect(createConsentHeadScript()).not.toContain('"region"')
  })

  it('replays a stored decision so returning readers are not measured as denied', () => {
    const script = createConsentHeadScript()

    expect(script).toContain("gtag('consent','update'")
    expect(script).toContain(`saved.schemaVersion!==${CONSENT_SCHEMA_VERSION}`)
  })

  it('reads the configured storage key', () => {
    expect(createConsentHeadScript({ storageKey: 'my-key' })).toContain(
      '"my-key"'
    )
    expect(createConsentHeadScript()).toContain('"neptu-consent"')
  })

  it('runs without throwing when storage is unavailable', () => {
    // Executed in an environment with no `localStorage`: the script must fall
    // through its catch rather than break every later inline script.
    const script = createConsentHeadScript()
    const calls: unknown[][] = []
    const win: Record<string, unknown> = {}

    const fn = new Function(
      'window',
      'localStorage',
      `${script}; return window.dataLayer`
    )

    const dataLayer = fn(win, {
      getItem: () => {
        throw new Error('blocked')
      },
    }) as unknown[]

    for (const entry of dataLayer) calls.push(Array.from(entry as ArrayLike<unknown>))

    expect(calls).toHaveLength(1)
    expect(calls[0]![0]).toBe('consent')
    expect(calls[0]![1]).toBe('default')
  })

  it('issues an update when a valid decision is stored', () => {
    const script = createConsentHeadScript()
    const win: Record<string, unknown> = {}

    const fn = new Function(
      'window',
      'localStorage',
      `${script}; return window.dataLayer`
    )

    const dataLayer = fn(win, {
      getItem: () =>
        JSON.stringify({
          analytics: true,
          ads: false,
          adUserData: false,
          adPersonalization: false,
          functional: true,
          timestamp: 1,
          schemaVersion: CONSENT_SCHEMA_VERSION,
        }),
    }) as unknown[]

    const update = Array.from(dataLayer[1] as ArrayLike<unknown>)

    expect(update[0]).toBe('consent')
    expect(update[1]).toBe('update')
    expect(update[2]).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
    })
  })
})
