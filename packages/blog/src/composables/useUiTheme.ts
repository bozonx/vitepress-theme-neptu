import { useData } from 'vitepress'
import type { Ref } from 'vue'
import type { ThemeConfig } from '../types.d.ts'

export function useUiTheme(): {
  theme: Ref<ThemeConfig>
} {
  const { theme } = useData<ThemeConfig>()

  return { theme }
}
