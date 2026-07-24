<template>
  <aside v-if="$slots.default" class="aside-container hidden min-[1550px]:block min-[1550px]:w-[300px] min-[1550px]:min-w-[300px] min-[1550px]:max-w-[300px] min-[1550px]:px-4 min-[1550px]:ml-6">
    <div class="aside-content w-full sticky top-[100px]">
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
// Component for rendering the aside panel
// Visible only on wide screens (1550px and above)
// Width matches the standard Google ad block (300px)
// Visible only if default slot content exists
</script>
