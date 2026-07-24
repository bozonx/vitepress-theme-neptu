import { ref, onUnmounted } from 'vue'

export function useToTheTop(animationMs = 1000) {
  const showed = ref(false)
  const opacity = ref(0)
  let animationTimeout: ReturnType<typeof setTimeout> | null = null

  const show = () => {
    if (showed.value) return
    showed.value = true
    setTimeout(() => (opacity.value = 1))
  }

  const hide = () => {
    if (!showed.value) return
    opacity.value = 0
    if (animationTimeout) clearTimeout(animationTimeout)
    animationTimeout = setTimeout(() => {
      showed.value = false
      animationTimeout = null
    }, animationMs)
  }

  const handleClick = () => {
    window.scrollTo(0, 0)
  }

  onUnmounted(() => {
    if (animationTimeout) clearTimeout(animationTimeout)
  })

  return { showed, opacity, show, hide, handleClick, animationMs }
}
