<script setup lang="ts">
import SideBarHeader from './SideBarHeader.vue'
import MenuItem from '../MenuItem.vue'
import type { SideBarItem } from '../../types.d.ts'

const props = defineProps<{ items: SideBarItem[] }>()
</script>

<template>
  <ul v-if="props.items?.length" class="space-y-1">
    <template
      v-for="(item, index) in props.items"
      :key="item.href || item.header || index"
    >
      <li
        :class="{
          'max-lg:hidden': item.desktopOnly,
          'lg:hidden': item.mobile || item.mobileOnly,
        }"
      >
        <SideBarHeader
          v-if="item.header"
          :text="item.header"
          :class="item.class"
        />
        <MenuItem v-else v-bind="item" active-compare-method="softPagination" />
      </li>
    </template>
  </ul>
</template>
