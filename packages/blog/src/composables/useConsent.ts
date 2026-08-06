import { inBrowser, useData } from 'vitepress'
import { computed, onMounted, onUnmounted, readonly, ref, type Ref } from 'vue'

import {
  CONSENT_DENIED,
  CONSENT_EVENT,
  CONSENT_GRANTED,
  CONSENT_STORAGE_KEY,
  consentToGtagPayload,
  normalizeConsent,
  parseStoredConsent,
  serializeConsent,
  type ConsentState,
} from '../utils/shared/consent.ts'
import type { ThemeConfig } from '../types.d.ts'

/**
 * Module-level state so every caller observes the same decision. A visitor
 * accepting in one component must unblock ad slots elsewhere on the page
 * without a reload.
 */
const consentState = ref<ConsentState>({ ...CONSENT_DENIED })
const decided = ref(false)
let hydrated = false

function readStorage(storageKey: string): void {
  if (!inBrowser) return

  const stored = parseStoredConsent(localStorage.getItem(storageKey))

  if (stored) {
    consentState.value = normalizeConsent(stored)
    decided.value = true
  }

  hydrated = true
}

function pushToGtag(next: ConsentState): void {
  if (!inBrowser) return

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag

  // The head script defines `gtag` before anything else runs; guard anyway so
  // a site that stripped the consent layer degrades to a no-op.
  if (typeof gtag === 'function') {
    gtag('consent', 'update', consentToGtagPayload(next))
  }
}

/**
 * Read and update the visitor's consent decision.
 *
 * The theme ships no banner: for Google ads in the EEA or the UK a
 * Google-certified CMP wired to IAB TCF 2.2 is required, and this composable
 * is the seam that CMP plugs into. Call {@link set} (or `acceptAll` /
 * `rejectAll`) from the CMP callback and the theme persists the decision,
 * mirrors it into Consent Mode v2, and re-renders any consent-gated ad slot.
 *
 * A site whose CMP already drives Consent Mode itself can ignore this
 * entirely — the theme only *reads* `granted` when `ads.requireConsent` is
 * turned on.
 */
export function useConsent(): {
  consent: Readonly<Ref<ConsentState>>
  /** False until the visitor has made an explicit choice. */
  hasDecided: Readonly<Ref<boolean>>
  /** True once ads may render — see `ads.requireConsent`. */
  adsAllowed: Readonly<Ref<boolean>>
  analyticsAllowed: Readonly<Ref<boolean>>
  set: (next: Partial<ConsentState>) => void
  acceptAll: () => void
  rejectAll: () => void
  /** Forget the decision, e.g. from a "change cookie settings" link. */
  reset: () => void
} {
  const { theme } = useData<ThemeConfig>()
  const storageKey = computed(
    () => theme.value?.consent?.storageKey || CONSENT_STORAGE_KEY
  )

  if (inBrowser && !hydrated) {
    readStorage(storageKey.value)
  }

  // A decision made in another tab must not leave this one showing ads the
  // visitor just rejected.
  const onExternalChange = (): void => readStorage(storageKey.value)

  onMounted(() => {
    if (!hydrated) readStorage(storageKey.value)
    window.addEventListener('storage', onExternalChange)
    window.addEventListener(CONSENT_EVENT, onExternalChange)
  })

  onUnmounted(() => {
    if (!inBrowser) return
    window.removeEventListener('storage', onExternalChange)
    window.removeEventListener(CONSENT_EVENT, onExternalChange)
  })

  function set(next: Partial<ConsentState>): void {
    const resolved = normalizeConsent(next, consentState.value)

    consentState.value = resolved
    decided.value = true

    if (!inBrowser) return

    try {
      localStorage.setItem(storageKey.value, serializeConsent(resolved))
    } catch {
      // Private mode or a full quota — the in-memory decision still holds for
      // this page view, which is better than throwing out of a click handler.
    }

    pushToGtag(resolved)
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: resolved }))
  }

  function reset(): void {
    consentState.value = { ...CONSENT_DENIED }
    decided.value = false

    if (!inBrowser) return

    try {
      localStorage.removeItem(storageKey.value)
    } catch {
      // ignore — see `set`
    }

    pushToGtag(consentState.value)
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }))
  }

  return {
    consent: readonly(consentState) as Readonly<Ref<ConsentState>>,
    hasDecided: readonly(decided),
    adsAllowed: computed(() => consentState.value.ads),
    analyticsAllowed: computed(() => consentState.value.analytics),
    set,
    acceptAll: () => set(CONSENT_GRANTED),
    rejectAll: () => set(CONSENT_DENIED),
    reset,
  }
}
