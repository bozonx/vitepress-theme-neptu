import { ref, onUnmounted } from 'vue'

export function useScrollToTop(animationMs = 1000) {
  const isButtonVisible = ref(false)
  const opacity = ref(0)
  let animationTimeout: ReturnType<typeof setTimeout> | null = null

  const show = () => {
    if (isButtonVisible.value) return
    isButtonVisible.value = true
    setTimeout(() => (opacity.value = 1))
  }

  const hide = () => {
    if (!isButtonVisible.value) return
    opacity.value = 0
    if (animationTimeout) clearTimeout(animationTimeout)
    animationTimeout = setTimeout(() => {
      isButtonVisible.value = false
      animationTimeout = null
    }, animationMs)
  }

  const handleClick = () => {
    window.scrollTo(0, 0)
  }

  onUnmounted(() => {
    if (animationTimeout) clearTimeout(animationTimeout)
  })

  return { isButtonVisible, opacity, show, hide, handleClick, animationMs }
}

