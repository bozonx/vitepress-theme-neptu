<script setup lang="ts">
import { useData, withBase, inBrowser } from 'vitepress'
import { ref, watch, inject, onUnmounted, computed, nextTick } from 'vue'

import { SIDEBAR_WIDTH } from '../../constants.ts'
import SideBarFooter from './SideBarFooter.vue'
import SideBarGroup from './SideBarGroup.vue'
import SideBarItems from './SideBarItems.vue'
import { Icon } from '@iconify/vue'
import SideBarTags from './SideBarTags.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import type { PostLite, SideBarItem } from '../../types.d.ts'

const props = defineProps<{ isMobile: boolean; localePosts?: PostLite[] }>()
const { localeIndex } = useData()
const { theme } = useUiTheme()
const allPosts = inject<Record<string, PostLite[]>>('posts', {})
const localePosts = computed(
  () => props.localePosts || allPosts[localeIndex.value] || []
)
const animationTimeMs = 400
// Default to closed (mobile) so SSR HTML doesn't render the drawer open
// and intercept clicks before hydration. The watch below with
// `{ immediate: inBrowser }` sets the correct state on the client.
const drawerOpen = ref(false)
const drawerTranslateXPx = ref(-SIDEBAR_WIDTH)
const backdropOpacity = ref(0)
const drawerRef = ref<HTMLElement | null>(null)
let animationTimeout: ReturnType<typeof setTimeout> | null = null
let animationFrame: number | null = null
let previousBodyOverflow: string | null = null
let previousActiveElement: HTMLElement | null = null

const clearAnimationTimeout = () => {
  if (!animationTimeout) return
  clearTimeout(animationTimeout)
  animationTimeout = null
}

const clearAnimationFrame = () => {
  if (animationFrame === null) return
  cancelAnimationFrame(animationFrame)
  animationFrame = null
}

const setBodyScrollLocked = (locked: boolean) => {
  if (typeof document === 'undefined') return

  if (locked) {
    if (previousBodyOverflow === null) {
      previousBodyOverflow = document.body.style.overflow
    }
    document.body.style.overflow = 'hidden'
    return
  }

  if (previousBodyOverflow !== null) {
    document.body.style.overflow = previousBodyOverflow
    previousBodyOverflow = null
  }
}

const restoreFocus = () => {
  previousActiveElement?.focus?.()
  previousActiveElement = null
}

const getFocusableElements = () =>
  drawerRef.value?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ) || []

const focusDrawer = async () => {
  await nextTick()
  const focusTarget = getFocusableElements()[0] || drawerRef.value
  focusTarget?.focus()
}

const runOpenAnimation = async () => {
  clearAnimationFrame()
  await nextTick()
  animationFrame = requestAnimationFrame(() => {
    drawerTranslateXPx.value = 0
    backdropOpacity.value = 1
    animationFrame = null
  })
}

const links = computed<SideBarItem[]>(() => {
  const cfg = theme.value.sidebar || {}
  const items: SideBarItem[] = [...(cfg.links || [])]

  if (cfg.recent) {
    items.push({
      text: theme.value.t.links.recent,
      href: `recent/1`,
      icon: theme.value.recentIcon,
    })
  }
  if (cfg.popular) {
    items.push({
      text: theme.value.t.links.popular,
      href: `popular/1`,
      icon: theme.value.popularIcon,
    })
  }
  if (cfg.archive) {
    items.push({
      text: theme.value.t.links.byDate,
      href: `archive`,
      icon: theme.value.byDateIcon,
    })
  }
  if (cfg.authors) {
    items.push({
      text: theme.value.t.links.authors,
      href: `authors`,
      icon: theme.value.authorsIcon,
    })
  }

  return items
})

const bottomLinks = computed<SideBarItem[]>(() => {
  const cfg = theme.value.sidebar || {}
  const items: SideBarItem[] = [...(cfg.bottomLinks || [])]

  if (cfg.donate && theme.value.donate) {
    items.push({
      text: theme.value.t.links.donate,
      href: `${theme.value.donate.url}`,
      icon: theme.value.donate.icon || theme.value.donateIcon,
      iconClass: 'donate-icon',
    })
  }

  return items
})
const openDrawer = () => {
  if (!props.isMobile) return

  clearAnimationTimeout()
  if (!drawerOpen.value) {
    previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
  }
  drawerOpen.value = true
  setBodyScrollLocked(true)
  void focusDrawer()
  void runOpenAnimation()
}

const finishClose = () => {
  drawerOpen.value = false
  animationTimeout = null
  setBodyScrollLocked(false)
  restoreFocus()
}

const closeDrawer = () => {
  if (!props.isMobile || !drawerOpen.value) return

  clearAnimationFrame()
  drawerTranslateXPx.value = -SIDEBAR_WIDTH
  backdropOpacity.value = 0

  clearAnimationTimeout()

  animationTimeout = setTimeout(() => {
    finishClose()
  }, animationTimeMs)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isMobile || !drawerOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    closeDrawer()
    return
  }

  if (event.key !== 'Tab') return

  const focusable = Array.from(getFocusableElements())
  if (!focusable.length) {
    event.preventDefault()
    drawerRef.value?.focus()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

defineExpose({
  openDrawer,
  isDrawerOpen: () => drawerOpen.value,
  handleLeftSwipe() {
    if (props.isMobile) closeDrawer()
  },
})

watch(
  () => props.isMobile,
  (isMobile) => {
    clearAnimationTimeout()
    clearAnimationFrame()
    drawerOpen.value = !isMobile
    drawerTranslateXPx.value = isMobile ? -SIDEBAR_WIDTH : 0
    backdropOpacity.value = 0
    setBodyScrollLocked(false)
    previousActiveElement = null
  },
  { immediate: inBrowser }
)

onUnmounted(() => {
  clearAnimationTimeout()
  clearAnimationFrame()
  setBodyScrollLocked(false)
})
</script>

<template>
  <div :class="{ 'max-lg:hidden': !drawerOpen }">
    <div
      ref="drawerRef"
      :role="props.isMobile ? 'dialog' : undefined"
      :aria-modal="props.isMobile ? 'true' : undefined"
      :aria-label="props.isMobile ? theme.sidebarMenuLabel : undefined"
      :tabindex="props.isMobile ? -1 : undefined"
      :style="{
        transform: props.isMobile
          ? `translate3d(${drawerTranslateXPx}px, 0, 0)`
          : 'none',
        width: `${SIDEBAR_WIDTH}px`,
      }"
      class="max-lg:overflow-y-auto max-lg:overflow-x-clip max-lg:fixed lg:h-fit app-drawer z-10 top-0 bottom-0 left-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
      @keydown="handleKeydown"
    >
      <div>
        <a
          v-if="theme.sidebarLogoSrc"
          :href="withBase(`/${localeIndex}/`)"
          class="sidebar-logo block"
          :title="theme.t.toHome"
          :aria-label="theme.t.toHome"
        >
          <img
            :src="theme.sidebarLogoSrc.startsWith('/') ? withBase(theme.sidebarLogoSrc) : theme.sidebarLogoSrc"
            loading="lazy"
            decoding="async"
            width="320"
            :height="theme.sidebarLogoHeight || 158"
            class="max-w-full h-auto"
            aria-hidden="true"
          />
        </a>
        <h4
          v-if="
            theme.sidebar?.blogTitle !== false &&
            (theme.sidebar?.blogTitle || theme.blogTitle)
          "
          class="sidebar-site-title text-sm muted font-bold px-1 pt-[0.35rem] pb-3 pl-[0.65rem]"
        >
          <a :href="withBase(`/${localeIndex}/`)" :title="theme.t.toHome">
            {{ theme.sidebar?.blogTitle || theme.blogTitle }}
          </a>
        </h4>

        <div class="sidebar-menu pt-1">
          <slot name="sidebar-top" />

          <SideBarGroup v-if="links.length">
            <SideBarItems
              :items="links"
              @click="closeDrawer"
            />
          </SideBarGroup>

          <SideBarGroup v-if="theme.sidebar?.tags">
            <SideBarTags
              :locale-posts="localePosts"
              @item-click="closeDrawer"
            />
          </SideBarGroup>

          <slot name="sidebar-middle" />

          <SideBarGroup v-if="bottomLinks.length" class="mt-2">
            <SideBarItems
              :items="bottomLinks"
              @click="closeDrawer"
            />
          </SideBarGroup>

          <slot name="sidebar-bottom" />
        </div>
      </div>

      <SideBarFooter @click="closeDrawer" />

      <div
        class="sidebar-gradient max-lg:hidden w-full relative h-[200px]"
        aria-hidden="true"
      >
        <div class="w-[calc(100%+1px)] h-[200px] absolute"></div>
      </div>
    </div>
    <div
      :style="{ opacity: backdropOpacity }"
      class="lg:hidden app-drawer-backdrop fixed inset-0 z-[9] cursor-pointer transition-opacity duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[opacity]"
      @click="closeDrawer"
    >
      <div class="sidebar-closebtn-wrapper absolute h-0 right-0">
        <button
          type="button"
          :title="theme.t.closeMenu"
          :aria-label="theme.t.closeMenu"
          class="py-6 px-6 cursor-pointer text-[var(--gray-400)] hover:text-[var(--body-text-color)]"
          @click.prevent.stop="closeDrawer"
        >
          <Icon icon="fa6-solid:xmark" class="text-2xl" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div
      v-if="$slots['sub-sidebar']"
      class="max-lg:hidden sub-sidebar mt-80 flex w-full flex-col justify-center gap-y-4"
    >
      <slot name="sub-sidebar" />
    </div>
  </div>
</template>

<style scoped>
.app-drawer {
  border-right: 1px solid var(--drawer-border-color);
  background: var(--drawer-bg);
  box-sizing: content-box;
}

.app-drawer-backdrop {
  background: var(--backdrop-bg);
}

.sidebar-gradient div {
  background: var(--drawer-bg);
  background: linear-gradient(
    0deg,
    var(--drawer-bg) 0%,
    transparent 100%
  );
}

.dark .sidebar-gradient div {
  background: var(--gray-900);
  background: linear-gradient(
    0deg,
    var(--gray-900) 0%,
    var(--gray-900-trans) 100%
  );
}
</style>
