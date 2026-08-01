import { onMounted, ref, type Ref } from 'vue'

/**
 * Style presets are the shape/density axis of the theme, independent from the
 * color axis handled by {@link useColorTheme}. Both packages share the axis:
 * the presets live in `styles/style-presets.css` and are keyed by the
 * `data-style` attribute on `<html>`.
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
  { id: 'mono', label: 'Mono', hint: 'Monospace, terminal-like' },
]

export const STYLE_STORAGE_KEY = 'neptu-style-preset'
export const STYLE_ATTRIBUTE = 'data-style'
export const DEFAULT_STYLE_PRESET = 'soft'

const activeStyle = ref<string>(DEFAULT_STYLE_PRESET)

/**
 * Reads and writes the `data-style` attribute on `<html>`.
 *
 * The initial value is applied by the inline head script (see
 * `createThemeHeadScript` in `src/configs`) to avoid a flash of the default
 * style; this composable only keeps the Vue side in sync.
 */
export function useStylePreset(): {
  activeStyle: Ref<string>
  setStylePreset: (id: string) => void
  stylePresets: StylePresetOption[]
} {
  const setStylePreset = (id: string): void => {
    if (!id) return
    activeStyle.value = id
    if (typeof document === 'undefined') return

    document.documentElement.setAttribute(STYLE_ATTRIBUTE, id)
    try {
      localStorage.setItem(STYLE_STORAGE_KEY, id)
    } catch {
      // Storage can be unavailable (private mode, disabled cookies).
    }
  }

  onMounted(() => {
    if (typeof document === 'undefined') return

    const current = document.documentElement.getAttribute(STYLE_ATTRIBUTE)
    if (current) {
      activeStyle.value = current
      return
    }

    try {
      const saved = localStorage.getItem(STYLE_STORAGE_KEY)
      if (saved) setStylePreset(saved)
    } catch {
      // ignore
    }
  })

  return { activeStyle, setStylePreset, stylePresets: STYLE_PRESETS }
}
