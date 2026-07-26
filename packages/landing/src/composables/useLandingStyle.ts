import { onMounted, ref, type Ref } from 'vue'

/**
 * Style presets are the shape/density axis of the theme, independent from the
 * color axis handled by `useColorTheme` of the blog package.
 */
export interface StylePresetOption {
  id: string
  label: string
  /** Short hint shown in the picker. */
  hint?: string
}

export const STYLE_PRESETS: StylePresetOption[] = [
  { id: 'soft', label: 'Soft', hint: 'Rounded, light shadows' },
  { id: 'sharp', label: 'Sharp', hint: 'Square corners, flat' },
  { id: 'brutal', label: 'Brutal', hint: 'Hard borders, offset shadows' },
  { id: 'glass', label: 'Glass', hint: 'Translucent surfaces' },
  { id: 'editorial', label: 'Editorial', hint: 'Serif headings, airy' },
]

export const STYLE_STORAGE_KEY = 'neptu-landing-style'
export const DEFAULT_STYLE = 'soft'

const activeStyle = ref<string>(DEFAULT_STYLE)

/**
 * Reads and writes the `data-ln-style` attribute on `<html>`.
 *
 * The initial value is applied by the inline head script (see `headScript` in
 * `src/configs`) to avoid a flash of the default style; this composable only
 * keeps the Vue side in sync.
 */
export function useLandingStyle(): {
  activeStyle: Ref<string>
  setLandingStyle: (id: string) => void
  stylePresets: StylePresetOption[]
} {
  const setLandingStyle = (id: string): void => {
    if (!id) return
    activeStyle.value = id
    if (typeof document === 'undefined') return

    document.documentElement.setAttribute('data-ln-style', id)
    try {
      localStorage.setItem(STYLE_STORAGE_KEY, id)
    } catch {
      // Storage can be unavailable (private mode, disabled cookies).
    }
  }

  onMounted(() => {
    if (typeof document === 'undefined') return

    const current = document.documentElement.getAttribute('data-ln-style')
    if (current) {
      activeStyle.value = current
      return
    }

    try {
      const saved = localStorage.getItem(STYLE_STORAGE_KEY)
      if (saved) setLandingStyle(saved)
    } catch {
      // ignore
    }
  })

  return { activeStyle, setLandingStyle, stylePresets: STYLE_PRESETS }
}
