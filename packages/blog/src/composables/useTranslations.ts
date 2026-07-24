import { useRoute } from 'vitepress'
import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'

import type { I18n } from '../types.d.ts'
import { resolveTranslationsByFilePath } from '../utils/shared/index.ts'

export type TranslationsResult = { t: I18n; [key: string]: unknown }

export const TranslationsKey: InjectionKey<ComputedRef<TranslationsResult>> =
  Symbol('neptu-translations')

export function useTranslations(): ComputedRef<TranslationsResult> {
  const provided = inject(TranslationsKey, null)
  if (provided) return provided

  const route = useRoute()
  return computed(() => resolveTranslationsByFilePath(route.path))
}
