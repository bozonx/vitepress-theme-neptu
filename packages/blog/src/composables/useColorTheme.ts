import { ref, onMounted, onUnmounted } from 'vue'

export interface ColorThemeOption {
  id: string
  label: string
  color: string
}

export const COLOR_THEME_PRESETS: ColorThemeOption[] = [
  { id: 'blue', label: 'Blue', color: 'hsl(213, 66%, 46%)' },
  { id: 'green', label: 'Green', color: 'hsl(115, 70%, 37%)' },
  { id: 'purple', label: 'Purple', color: 'hsl(270, 66%, 46%)' },
  { id: 'amber', label: 'Amber', color: 'hsl(30, 66%, 46%)' },
  { id: 'teal', label: 'Teal', color: 'hsl(180, 66%, 46%)' },
  { id: 'rose', label: 'Rose', color: 'hsl(345, 66%, 46%)' },
  { id: 'magenta', label: 'Magenta', color: 'hsl(320, 66%, 46%)' },
  { id: 'monochrome', label: 'Monochrome', color: 'hsl(0, 0%, 30%)' },
]

export const COLOR_STORAGE_KEY = 'neptu-color-theme'
export const COLOR_ATTRIBUTE = 'data-theme'
export const DEFAULT_COLOR_THEME = 'blue'

const VALID_THEME_IDS = new Set(COLOR_THEME_PRESETS.map((p) => p.id))

function isValidThemeId(id: string | null | undefined): id is string {
  return typeof id === 'string' && VALID_THEME_IDS.has(id)
}

const activeThemeId = ref<string>(DEFAULT_COLOR_THEME)

export function useColorTheme() {
  const setColorTheme = (themeId: string) => {
    if (!isValidThemeId(themeId)) return
    activeThemeId.value = themeId
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute(COLOR_ATTRIBUTE, themeId)
      try {
        localStorage.setItem(COLOR_STORAGE_KEY, themeId)
      } catch {
        // ignore
      }
    }
  }

  const initColorTheme = () => {
    if (typeof document !== 'undefined') {
      try {
        const saved = localStorage.getItem(COLOR_STORAGE_KEY)
        if (isValidThemeId(saved)) {
          activeThemeId.value = saved
          document.documentElement.setAttribute(COLOR_ATTRIBUTE, saved)
        } else {
          const currentAttr = document.documentElement.getAttribute(COLOR_ATTRIBUTE)
          if (isValidThemeId(currentAttr)) {
            activeThemeId.value = currentAttr
          }
        }
      } catch {
        // ignore
      }
    }
  }

  const onStorageChange = (e: StorageEvent) => {
    if (e.key === COLOR_STORAGE_KEY) {
      if (isValidThemeId(e.newValue)) {
        activeThemeId.value = e.newValue
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute(COLOR_ATTRIBUTE, e.newValue)
        }
      } else if (e.newValue === null) {
        activeThemeId.value = DEFAULT_COLOR_THEME
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute(COLOR_ATTRIBUTE, DEFAULT_COLOR_THEME)
        }
      }
    }
  }

  onMounted(() => {
    initColorTheme()
    window.addEventListener('storage', onStorageChange)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', onStorageChange)
  })

  return {
    activeThemeId,
    setColorTheme,
    colorThemes: COLOR_THEME_PRESETS,
  }
}
