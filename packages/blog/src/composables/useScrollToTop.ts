import { ref, onUnmounted } from 'vue'

export function useScrollToTop(animationMs = 1000) {
  const isShown = ref(false)
  const opacity = ref(0)
  let animationTimeout: ReturnType<typeof setTimeout> | null = null

  const show = () => {
    if (isShown.value) return
    isShown.value = true
    setTimeout(() => (opacity.value = 1))
  }

  const hide = () => {
    if (!isShown.value) return
    opacity.value = 0
    if (animationTimeout) clearTimeout(animationTimeout)
    animationTimeout = setTimeout(() => {
      isShown.value = false
      animationTimeout = null
    }, animationMs)
  }

  const handleClick = () => {
    window.scrollTo(0, 0)
  }

  onUnmounted(() => {
    if (animationTimeout) clearTimeout(animationTimeout)
  })

  return { isShown, opacity, show, hide, handleClick, animationMs }
}

/** @deprecated Use `useScrollToTop` instead. */
export const useToTheTop = useScrollToTop
