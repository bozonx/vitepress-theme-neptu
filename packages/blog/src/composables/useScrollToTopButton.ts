import { ref, onUnmounted } from 'vue'

export function useScrollToTopButton(animationMs = 1000) {
  const isButtonVisible = ref(false)
  const opacity = ref(0)
  let animationTimeout: ReturnType<typeof setTimeout> | null = null
  // The zero-delay timer defers the opacity flip to the next task so the
  // browser paints the button at 0 first and the transition actually runs.
  // Tracked separately so it cannot fire after the component is gone.
  let fadeInTimeout: ReturnType<typeof setTimeout> | null = null

  const show = () => {
    if (isButtonVisible.value) return
    isButtonVisible.value = true
    if (fadeInTimeout) clearTimeout(fadeInTimeout)
    fadeInTimeout = setTimeout(() => {
      opacity.value = 1
      fadeInTimeout = null
    })
  }

  const hide = () => {
    if (!isButtonVisible.value) return
    opacity.value = 0
    if (fadeInTimeout) clearTimeout(fadeInTimeout)
    if (animationTimeout) clearTimeout(animationTimeout)
    animationTimeout = setTimeout(() => {
      isButtonVisible.value = false
      animationTimeout = null
    }, animationMs)
  }

  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  onUnmounted(() => {
    if (animationTimeout) clearTimeout(animationTimeout)
    if (fadeInTimeout) clearTimeout(fadeInTimeout)
  })

  return { isButtonVisible, opacity, show, hide, scrollToTop, animationMs }
}

