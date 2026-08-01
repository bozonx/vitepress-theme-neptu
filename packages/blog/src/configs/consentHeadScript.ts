import {
  CONSENT_DENIED,
  CONSENT_SCHEMA_VERSION,
  CONSENT_SIGNAL_NAMES,
  CONSENT_STORAGE_KEY,
  consentToGtagPayload,
  normalizeConsent,
} from '../utils/shared/consent.ts'
import type { ConsentConfig } from '../types.d.ts'

/**
 * Inline `<head>` script that establishes Google Consent Mode v2 before any
 * measurement or ad tag can run.
 *
 * Order is the whole point: Consent Mode only suppresses storage for tags
 * that load *after* the defaults are set, so this must be the first script on
 * the page — ahead of gtag.js, AdSense, and any CMP. It is emitted first in
 * the merged `head` array for exactly that reason.
 *
 * The script also replays a decision the visitor already made, so a returning
 * reader is not measured as denied until the CMP finishes booting. Both a
 * certified CMP and the theme's `useConsent()` composable can issue further
 * `update` calls afterwards; last call wins, which is the documented Consent
 * Mode behaviour.
 */
export function createConsentHeadScript(config?: ConsentConfig): string {
  const defaults = normalizeConsent(config?.defaults, CONSENT_DENIED)
  const storageKey = config?.storageKey || CONSENT_STORAGE_KEY
  const defaultPayload: Record<string, string | number | string[]> = {
    ...consentToGtagPayload(defaults),
    // Gives a CMP time to restore its own decision before tags read the
    // signals, instead of firing a denied hit and correcting it later.
    wait_for_update: config?.waitForUpdate ?? 500,
  }

  if (config?.region?.length) {
    defaultPayload.region = config.region
  }

  const signals = JSON.stringify(CONSENT_SIGNAL_NAMES)

  return (
    `(function(){` +
    `window.dataLayer=window.dataLayer||[];` +
    `function gtag(){window.dataLayer.push(arguments)}` +
    `window.gtag=window.gtag||gtag;` +
    `gtag('consent','default',${JSON.stringify(defaultPayload)});` +
    `try{` +
    `var raw=localStorage.getItem(${JSON.stringify(storageKey)});` +
    `if(!raw)return;` +
    `var saved=JSON.parse(raw);` +
    `if(!saved||saved.v!==${CONSENT_SCHEMA_VERSION})return;` +
    `var names=${signals},update={};` +
    `for(var k in names){update[names[k]]=saved[k]?'granted':'denied'}` +
    `gtag('consent','update',update);` +
    `}catch(e){}` +
    `})()`
  )
}
