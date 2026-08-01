import { describe, it, expect } from 'vitest'
import {
  CONSENT_DENIED,
  CONSENT_GRANTED,
  CONSENT_SCHEMA_VERSION,
  consentToGtagPayload,
  normalizeConsent,
  parseStoredConsent,
  serializeConsent,
} from '../../../../src/utils/shared/consent.ts'

describe('normalizeConsent', () => {
  it('denies everything by default', () => {
    expect(normalizeConsent(undefined)).toEqual(CONSENT_DENIED)
    expect(normalizeConsent(null)).toEqual(CONSENT_DENIED)
  })

  it('keeps unspecified categories at the base value', () => {
    expect(normalizeConsent({ ads: true }, CONSENT_DENIED)).toEqual({
      ...CONSENT_DENIED,
      ads: true,
    })
  })

  it('ignores non-boolean values', () => {
    expect(
      normalizeConsent({ ads: 'yes' } as unknown as { ads: boolean })
    ).toEqual(CONSENT_DENIED)
  })
})

describe('consentToGtagPayload', () => {
  it('maps categories onto the Consent Mode v2 signal names', () => {
    expect(consentToGtagPayload(CONSENT_DENIED)).toEqual({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'denied',
    })
  })

  it('grants every signal when everything is allowed', () => {
    const payload = consentToGtagPayload(CONSENT_GRANTED)
    expect(Object.values(payload).every((v) => v === 'granted')).toBe(true)
  })
})

describe('parseStoredConsent', () => {
  it('round-trips a serialised decision', () => {
    const stored = parseStoredConsent(serializeConsent(CONSENT_GRANTED, 1234))
    expect(stored).toEqual({ ...CONSENT_GRANTED, ts: 1234, v: CONSENT_SCHEMA_VERSION })
  })

  it('returns null for missing or unparsable input', () => {
    expect(parseStoredConsent(null)).toBeNull()
    expect(parseStoredConsent('')).toBeNull()
    expect(parseStoredConsent('{oops')).toBeNull()
  })

  it('rejects a record written by another schema version', () => {
    // Asking again beats holding the visitor to a decision about categories
    // that no longer exist.
    const raw = JSON.stringify({ ...CONSENT_GRANTED, ts: 1, v: 999 })
    expect(parseStoredConsent(raw)).toBeNull()
  })
})
