import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

import { TABLET_BREAKPOINT } from '../constants.ts'

export function useBreakpoint(
  breakpoint: number = TABLET_BREAKPOINT,
  win?: Window
): {
  windowWidth: Ref<number>
  isMobileOrTablet: Ref<boolean>
} {
  const windowWidth = ref(0)
  const isMobileOrTablet = ref(false)

  const getWin = () => win || (inBrowser ? window : undefined)

  function onResize() {
    const targetWin = getWin()
    if (!targetWin) return
    windowWidth.value = targetWin.innerWidth
    isMobileOrTablet.value = windowWidth.value < breakpoint
  }

  onMounted(() => {
    const targetWin = getWin()
    if (!targetWin) return
    onResize()
    targetWin.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    const targetWin = getWin()
    if (!targetWin) return
    targetWin.removeEventListener('resize', onResize)
  })

  return { windowWidth, isMobileOrTablet }
}
