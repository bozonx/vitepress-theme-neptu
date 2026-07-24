<script setup lang="ts">
import DropdownButton from '../DropdownButton.vue'
import MenuItem from '../MenuItem.vue'
import { Icon } from '@iconify/vue'
import { useColorTheme } from '../../composables/useColorTheme.ts'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const props = defineProps<{ noBg?: boolean }>()
const { activeTheme, setColorTheme, colorThemes } = useColorTheme()
const { theme } = useUiTheme()
</script>

<template>
  <DropdownButton
    :no-bg="props.noBg"
    :title="theme.colorThemeMenuLabel || 'Change color theme'"
    :aria-label="theme.colorThemeMenuLabel || 'Change color theme'"
    class="switch-theme-btn px-0"
  >
    <template #btn-text>
      <span class="inline-flex items-center gap-1.5" aria-hidden="true">
        <Icon
          icon="fa6-solid:palette"
          width="1.1rem"
          height="1.1rem"
          aria-hidden="true"
        />
      </span>
    </template>

    <template v-for="t in colorThemes" :key="t.id">
      <MenuItem
        :disabled="false"
        class="cursor-pointer"
        @click="setColorTheme(t.id)"
      >
        <span class="flex items-center justify-between gap-3 w-full">
          <span class="flex items-center gap-2">
            <span
              class="w-3.5 h-3.5 rounded-full inline-block shrink-0 border border-black/10 dark:border-white/20"
              :style="{ backgroundColor: t.color }"
            />
            <span :class="{ 'font-semibold': activeTheme === t.id }">{{ t.label }}</span>
          </span>
          <Icon
            v-if="activeTheme === t.id"
            icon="fa6-solid:star"
            width="0.75rem"
            height="0.75rem"
            class="text-[var(--primary-btn-bg)]"
          />
        </span>
      </MenuItem>
    </template>
  </DropdownButton>
</template>
