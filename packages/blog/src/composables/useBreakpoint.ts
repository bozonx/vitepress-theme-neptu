import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

import { MOBILE_BREAKPOINT } from '../constants.ts'

export function useBreakpoint(
  breakpoint: number = MOBILE_BREAKPOINT,
  win?: Window
): {
  windowWidth: Ref<number>
  isMobile: Ref<boolean>
} {
  const windowWidth = ref(0)
  const isMobile = ref(false)

  const getWin = () => win || (inBrowser ? window : undefined)

  function onResize() {
    const targetWin = getWin()
    if (!targetWin) return
    windowWidth.value = targetWin.innerWidth
    isMobile.value = windowWidth.value < breakpoint
  }

  if (getWin()) {
    onResize()
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

  return { windowWidth, isMobile }
}
