import { ref, onMounted } from 'vue'

export interface ColorThemeOption {
  id: string
  label: string
  color: string
}

export const COLOR_THEMES: ColorThemeOption[] = [
  { id: 'blue', label: 'Blue', color: 'hsl(213, 66%, 46%)' },
  { id: 'green', label: 'Green', color: 'hsl(115, 70%, 37%)' },
  { id: 'purple', label: 'Purple', color: 'hsl(270, 66%, 46%)' },
  { id: 'amber', label: 'Amber', color: 'hsl(30, 66%, 46%)' },
  { id: 'teal', label: 'Teal', color: 'hsl(180, 66%, 46%)' },
  { id: 'rose', label: 'Rose', color: 'hsl(345, 66%, 46%)' },
  { id: 'magenta', label: 'Magenta', color: 'hsl(320, 66%, 46%)' },
  { id: 'monochrome', label: 'Monochrome', color: 'hsl(0, 0%, 30%)' },
]

const STORAGE_KEY = 'neptu-color-theme'
const activeTheme = ref<string>('blue')

export function useColorTheme() {
  const setColorTheme = (themeId: string) => {
    activeTheme.value = themeId
    if (typeof document !== 'undefined') {
      if (themeId) {
        document.documentElement.setAttribute('data-theme', themeId)
        try {
          localStorage.setItem(STORAGE_KEY, themeId)
        } catch {
          // ignore
        }
      }
    }
  }

  const initColorTheme = () => {
    if (typeof document !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          activeTheme.value = saved
          document.documentElement.setAttribute('data-theme', saved)
        } else {
          const currentAttr = document.documentElement.getAttribute('data-theme')
          if (currentAttr) {
            activeTheme.value = currentAttr
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
    activeTheme,
    setColorTheme,
    colorThemes: COLOR_THEMES,
  }
}
