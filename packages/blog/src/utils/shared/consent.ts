/**
 * Consent layer shared by the blog and landing themes.
 *
 * The theme deliberately ships no banner UI. Serving Google ads to visitors
 * in the EEA or the UK requires a Google-certified CMP wired to IAB TCF 2.2,
 * and a hand-rolled banner does not qualify — see the "Consent" doc page. So
 * the theme owns only the parts a CMP cannot provide for it: the Consent
 * Mode v2 defaults that must be set before any tag loads, a place to persist
 * the visitor decision, and a reactive read of that decision for gating the
 * theme's own ad slots.
 *
 * Nothing here talks to a specific vendor. An external CMP calls
 * {@link consentToGtagPayload} indirectly through `useConsent().set()`, or
 * updates Consent Mode itself and leaves the theme state alone.
 */

import type { ConsentState } from '../../types.d.ts'

/** localStorage key holding the visitor decision. */
export const CONSENT_STORAGE_KEY = 'neptu-consent'

/** DOM event dispatched on `window` whenever the decision changes. */
export const CONSENT_EVENT = 'neptu:consent-change'

/**
 * The Consent Mode v2 signals, named as the theme exposes them.
 *
 * `analytics` maps to `analytics_storage`, `ads` to `ad_storage`; the two
 * ad-specific signals were added in v2 and are required for Google to keep
 * serving personalised ads and conversion modelling in the EEA.
 */
export type { ConsentState }

/** A stored decision — the state plus when it was recorded. */
export interface StoredConsent extends ConsentState {
  /** Epoch milliseconds. */
  timestamp: number
  /** Schema version, so a future category change can invalidate old records. */
  schemaVersion: number
}

export const CONSENT_SCHEMA_VERSION = 1

/**
 * Everything denied. Consent Mode requires the defaults to be set to `denied`
 * before the first tag runs; anything else leaks a measurement hit that the
 * visitor never agreed to.
 */
export const CONSENT_DENIED: ConsentState = {
  analytics: false,
  ads: false,
  adUserData: false,
  adPersonalization: false,
  functional: false,
}

export const CONSENT_GRANTED: ConsentState = {
  analytics: true,
  ads: true,
  adUserData: true,
  adPersonalization: true,
  functional: true,
}

/** Map of theme category -> Consent Mode v2 signal name. */
export const CONSENT_SIGNAL_NAMES = {
  analytics: 'analytics_storage',
  ads: 'ad_storage',
  adUserData: 'ad_user_data',
  adPersonalization: 'ad_personalization',
  functional: 'functionality_storage',
} as const satisfies Record<keyof ConsentState, string>

/** Coerce an arbitrary object into a complete state, defaulting to denied. */
export function normalizeConsent(
  value: Partial<ConsentState> | null | undefined,
  base: ConsentState = CONSENT_DENIED
): ConsentState {
  if (!value || typeof value !== 'object') return { ...base }

  const pick = (key: keyof ConsentState): boolean =>
    typeof value[key] === 'boolean' ? (value[key] as boolean) : base[key]

  return {
    analytics: pick('analytics'),
    ads: pick('ads'),
    adUserData: pick('adUserData'),
    adPersonalization: pick('adPersonalization'),
    functional: pick('functional'),
  }
}

/**
 * Translate the state into the payload `gtag('consent', ...)` expects.
 * Callers pass the result straight to `gtag('consent', 'update', payload)`.
 */
export function consentToGtagPayload(
  state: ConsentState
): Record<string, 'granted' | 'denied'> {
  const payload: Record<string, 'granted' | 'denied'> = {}

  for (const [category, signal] of Object.entries(CONSENT_SIGNAL_NAMES)) {
    payload[signal] = state[category as keyof ConsentState] ? 'granted' : 'denied'
  }

  return payload
}

/**
 * Parse a stored record. Returns `null` for anything unreadable or written by
 * an older schema, which makes the visitor be asked again rather than be
 * silently held to a decision about categories that no longer match.
 */
export function parseStoredConsent(
  raw: string | null | undefined
): StoredConsent | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<StoredConsent>
    if (!parsed || typeof parsed !== 'object') return null
    if (parsed.schemaVersion !== CONSENT_SCHEMA_VERSION) return null

    return {
      ...normalizeConsent(parsed),
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : 0,
      schemaVersion: CONSENT_SCHEMA_VERSION,
    }
  } catch {
    return null
  }
}

/** Serialise a decision for storage. */
export function serializeConsent(
  state: ConsentState,
  now: number = Date.now()
): string {
  return JSON.stringify({
    ...state,
    timestamp: now,
    schemaVersion: CONSENT_SCHEMA_VERSION,
  } satisfies StoredConsent)
}
