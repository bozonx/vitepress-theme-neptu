import { inBrowser } from 'vitepress'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * Calls `handler` when a pointer event occurs outside the referenced element.
 * Listens on `document` for `pointerdown` (covers mouse + touch) and is
 * cleaned up automatically on unmount.
 */
export function useOnClickOutside(
  target: Ref<HTMLElement | null>,
  handler: (event: PointerEvent) => void,
  doc?: Document
): void {
  const listener = (event: PointerEvent) => {
    const el = target.value
    if (!el || el.contains(event.target as Node)) return
    handler(event)
  }

  const getDoc = () => doc || (inBrowser ? document : undefined)

  onMounted(() => {
    const targetDoc = getDoc()
    if (!targetDoc) return
    targetDoc.addEventListener('pointerdown', listener, true)
  })

  onBeforeUnmount(() => {
    const targetDoc = getDoc()
    if (!targetDoc) return
    targetDoc.removeEventListener('pointerdown', listener, true)
  })
}
