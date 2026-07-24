<script setup lang="ts">
import { useData } from 'vitepress'
import { ref } from 'vue'

import PageContent from '../components/PageContent.vue'
import LayoutAside from '../components/layout-parts/LayoutAside.vue'
import NeptuFooter from '../components/layout-parts/NeptuFooter.vue'
import SideBar from '../components/layout-parts/SideBar.vue'
import ToTheTop from '../components/layout-parts/ToTheTop.vue'
import TopBar from '../components/layout-parts/TopBar.vue'
import { useBreakpoint } from '../composables/useBreakpoint.ts'
import { useScrollY } from '../composables/useScrollY.ts'
import { useSwipeDrawer } from '../composables/useSwipeDrawer.ts'
import { resolveBodyMarker } from '../utils/shared/index.ts'

import type { ThemeConfig } from '../types.d.ts'

const { theme, frontmatter } = useData<ThemeConfig>()
const { isMobile } = useBreakpoint()
const { scrollY } = useScrollY()
const sidebarRef = ref<InstanceType<typeof SideBar> | null>(null)
const bodyMarker = resolveBodyMarker(theme.value, frontmatter.value)

useSwipeDrawer({
  enabled: () => isMobile.value,
  canOpen: () => !sidebarRef.value?.isDrawerOpen(),
  canClose: () => Boolean(sidebarRef.value?.isDrawerOpen()),
  onOpen: () => sidebarRef.value?.openDrawer(),
  onClose: () => sidebarRef.value?.handleLeftSwipe(),
})
</script>

<template>
  <div class="min-h-screen lg:flex w-full">
    <!--  left col-->
    <SideBar ref="sidebarRef" :is-mobile="isMobile">
      <template v-if="$slots['sidebar-top']" #sidebar-top>
        <slot name="sidebar-top" />
      </template>
      <template v-if="$slots['sidebar-middle']" #sidebar-middle>
        <slot name="sidebar-middle" />
      </template>
      <template v-if="$slots['sidebar-bottom']" #sidebar-bottom>
        <slot name="sidebar-bottom" />
      </template>
      <template v-if="$slots['sub-sidebar']" #sub-sidebar>
        <slot name="sub-sidebar" />
      </template>
    </SideBar>
    <!-- right col-->
    <div class="flex-1 flex flex-col min-h-screen">
      <header>
        <TopBar
          :is-mobile="isMobile"
          @open-drawer="() => sidebarRef?.openDrawer()"
        >
          <template #nav-bar-content-before>
            <slot name="nav-bar-content-before" />
          </template>
        </TopBar>
      </header>

      <div class="flex flex-1">
        <main
          class="lg:ml-4 xl:ml-24 mt-20 lg:mt-4 px-4 sm:px-8 app-page flex flex-col w-full max-w-[var(--page-max-width)]"
        >
          <div class="flex-1" v-bind="bodyMarker ? { [bodyMarker]: true } : {}">
            <PageContent>
              <template v-if="$slots['post-header-before']" #post-header-before>
                <slot name="post-header-before" />
              </template>
              <template v-if="$slots['post-header-after']" #post-header-after>
                <slot name="post-header-after" />
              </template>
              <template
                v-if="$slots['post-content-before']"
                #post-content-before
              >
                <slot name="post-content-before" />
              </template>
              <template v-if="$slots['post-content-after']" #post-content-after>
                <slot name="post-content-after" />
              </template>
              <template v-if="$slots['post-footer']" #post-footer>
                <slot name="post-footer" />
              </template>
            </PageContent>
          </div>

          <slot v-if="$slots.footer" name="footer" />

          <div v-else-if="theme.footer" class="mt-30 pb-12">
            <NeptuFooter />
          </div>
        </main>

        <LayoutAside>
          <slot name="aside" />
        </LayoutAside>
      </div>
    </div>

    <ToTheTop :scroll-y="scrollY" :is-mobile="isMobile" />
  </div>
</template>
