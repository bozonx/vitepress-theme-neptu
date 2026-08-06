import { ref, onMounted } from 'vue'

export interface ColorThemeOption {
  id: string
  label: string
  color: string
}

export const COLOR_THEME_OPTIONS: ColorThemeOption[] = [
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

const activeThemeId = ref<string>(DEFAULT_COLOR_THEME)

export function useColorTheme() {
  const setColorTheme = (themeId: string) => {
    activeThemeId.value = themeId
    if (typeof document !== 'undefined') {
      if (themeId) {
        document.documentElement.setAttribute('data-theme', themeId)
        try {
          localStorage.setItem(COLOR_STORAGE_KEY, themeId)
        } catch {
          // ignore
        }
      }
    }
  }

  const initColorTheme = () => {
    if (typeof document !== 'undefined') {
      try {
        const saved = localStorage.getItem(COLOR_STORAGE_KEY)
        if (saved) {
          activeThemeId.value = saved
          document.documentElement.setAttribute('data-theme', saved)
        } else {
          const currentAttr = document.documentElement.getAttribute('data-theme')
          if (currentAttr) {
            activeThemeId.value = currentAttr
          }
        }
      } catch {
        // ignore
      }
    }
  }

  onMounted(() => {
    initColorTheme()
  })

  return {
    activeThemeId,
    setColorTheme,
    colorThemes: COLOR_THEME_OPTIONS,
  }
}
