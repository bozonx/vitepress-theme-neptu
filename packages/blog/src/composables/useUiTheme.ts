import { useData } from 'vitepress'
import type { Ref } from 'vue'
import type { RuntimeThemeConfig } from '../types.d.ts'

export function useUiTheme(): {
  theme: Ref<RuntimeThemeConfig>
} {
  const { theme } = useData<RuntimeThemeConfig>()

  return { theme }
}
