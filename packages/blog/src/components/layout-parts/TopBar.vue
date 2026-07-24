<script setup lang="ts">
import NeptuBtn from '../NeptuBtn.vue'
import SwitchAppearance from './SwitchAppearance.vue'
import SwitchTheme from './SwitchTheme.vue'
import SwitchLang from './SwitchLang.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'
import { computed } from 'vue'
import type { LinkItem } from '../../types.d.ts'

const { theme } = useUiTheme()
defineProps<{
  isMobile?: boolean
}>()
const emit = defineEmits<{
  (e: 'openSearch'): void
  (e: 'openDrawer'): void
}>()

const resolveItemShowClass = (item: LinkItem) => {
  if (item.desktopOnly) return 'max-lg:hidden'
  else if (item.mobileOnly) return 'lg:hidden'
  // both
  return ''
}
const links = computed<LinkItem[]>(() => {
  const result: LinkItem[] = [...(theme.value.nav?.links || [])]
  if (theme.value.nav?.donate && theme.value.donate) {
    result.push({
      text: theme.value.t.links.donate,
      href: `${theme.value.donate.url}`,
      icon: theme.value.donate.icon || theme.value.donateIcon,
      iconClass: 'donate-icon',
    })
  }
  return result
})
const socialLinks = computed<LinkItem[]>(() =>
  (theme.value.nav?.socialLinks || []).map((item) => ({
    href: item.url || item.link,
    icon: item.icon,
    iconClass: item.iconClass,
    class: item.class,
    desktopOnly: item.desktopOnly,
    mobileOnly: item.mobileOnly,
  })).filter((item) => Boolean(item.href))
)
</script>

<template>
  <nav
    :class="[
      'flex w-full py-2 px-2 gap-x-1 top-bar pl-[0.675rem]',
      'max-lg:fixed max-lg:z-[1] max-lg:topbar--mobile max-lg:bg-[var(--topbar-mobile-bg)] max-lg:border-b max-lg:border-[var(--topbar-mobile-border)] max-lg:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.07)] max-lg:dark:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.2)]',
    ]"
  >
    <div class="flex-1 flex gap-x-3">
      <NeptuBtn
        icon="fa6-solid:bars"
        :no-bg="true"
        class="lg:hidden px-[0.7rem]"
        icon-class="muted"
        :text="theme.sidebarMenuLabel"
        @click="emit('openDrawer')"
      />

      <slot name="nav-bar-content-before" />
    </div>

    <ul v-if="links.length" class="flex space-x-1">
      <li v-for="(item, index) in links" :key="item.href || index" :class="resolveItemShowClass(item)">
        <NeptuBtn
          v-bind="item"
          :no-bg="true"
          :class="[item.class, 'px-[0.7rem]']"
          :icon-class="item.iconClass || 'muted'"
        />
      </li>
    </ul>

    <div>
      <SwitchLang :no-bg="true" />
    </div>

    <div class="max-lg:hidden">
      <SwitchAppearance />
    </div>

    <div v-if="theme.themeSwitcher">
      <SwitchTheme :no-bg="true" />
    </div>

    <ul v-if="socialLinks.length" class="flex space-x-1">
      <li
        v-for="(item, index) in socialLinks"
        :key="item.href || index"
        :class="resolveItemShowClass(item)"
      >
        <NeptuBtn :no-bg="true" v-bind="item" :class="[item.class]" />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.top-bar .btn-base.active {
  background: var(--btn-bg-active);
  color: var(--btn-text);
}
</style>
