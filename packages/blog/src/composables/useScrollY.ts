import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useScrollY(win?: Window): { scrollY: Ref<number> } {
  const scrollY = ref(0)
  let ticking = false

  const getWin = () => win || (inBrowser ? window : undefined)

  function onScroll() {
    const targetWin = getWin()
    if (!targetWin) return

    if (!ticking) {
      targetWin.requestAnimationFrame(() => {
        scrollY.value = targetWin.scrollY
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    const targetWin = getWin()
    if (!targetWin) return
    scrollY.value = targetWin.scrollY
    targetWin.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    const targetWin = getWin()
    if (!targetWin) return
    targetWin.removeEventListener('scroll', onScroll)
  })

  return { scrollY }
}
