<script setup lang="ts">
/** People behind the product: team, maintainers, speakers. */
import { withBase } from 'vitepress'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnGrid from '../primitives/LnGrid.vue'
import LnCard from '../primitives/LnCard.vue'
import LnIcon from '../primitives/LnIcon.vue'
import type { SectionProps, TeamMember } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: TeamMember[]
      cols?: 2 | 3 | 4
      variant?: 'card' | 'plain'
      /** Round or squared portraits. */
      avatarShape?: 'circle' | 'rounded'
    }
  >(),
  { cols: 4, variant: 'card', avatarShape: 'circle', align: 'center' }
)

const resolve = (url?: string) =>
  !url || /^(https?:)?\/\//.test(url) ? url : withBase(url)
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.bg"
    :width="props.width"
    :padding="props.padding"
    :divider="props.divider"
    :no-reveal="props.noReveal"
    class="ln-team"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <LnGrid :cols="props.cols">
      <LnCard
        v-for="(member, i) in props.items"
        :key="`${member.name}-${i}`"
        :plain="props.variant === 'plain'"
        class="ln-member"
        :class="{ 'ln-member--center': props.align === 'center' }"
      >
        <img
          v-if="member.avatar"
          class="ln-member__avatar"
          :class="`ln-member__avatar--${props.avatarShape}`"
          :src="resolve(member.avatar)"
          :alt="member.name"
          loading="lazy"
        />
        <p class="ln-member__name">{{ member.name }}</p>
        <p v-if="member.role" class="ln-member__role">{{ member.role }}</p>
        <p v-if="member.text" class="ln-member__text">{{ member.text }}</p>

        <div v-if="member.links?.length" class="ln-member__links">
          <a
            v-for="(link, li) in member.links"
            :key="li"
            :href="link.link"
            class="ln-member__link"
            :target="/^https?:/.test(link.link) ? '_blank' : undefined"
            rel="noreferrer"
            :aria-label="link.text ?? link.link"
          >
            <LnIcon v-if="link.icon" :icon="link.icon" size="1.05rem" />
            <span v-else>{{ link.text }}</span>
          </a>
        </div>
      </LnCard>
      <slot />
    </LnGrid>
  </LnSection>
</template>

<style scoped>
.ln-member {
  gap: 0.375rem;
}

.ln-member--center {
  align-items: center;
  text-align: center;
}

.ln-member__avatar {
  margin-bottom: 0.75rem;
  width: 5rem;
  height: 5rem;
  object-fit: cover;
}

.ln-member__avatar--circle {
  border-radius: var(--ln-radius-pill);
}

.ln-member__avatar--rounded {
  border-radius: var(--ln-radius-md);
}

.ln-member__name {
  margin: 0;
  font-family: var(--ln-font-display);
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--ln-c-text-1);
}

.ln-member__role {
  margin: 0;
  color: var(--ln-c-brand);
  font-size: 0.875rem;
  font-weight: 600;
}

.ln-member__text {
  margin: 0.25rem 0 0;
  color: var(--ln-c-text-2);
  font-size: 0.875rem;
  line-height: 1.55;
}

.ln-member__links {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.ln-member__link {
  display: inline-flex;
  align-items: center;
  color: var(--ln-c-text-2);
  font-size: 0.875rem;
  text-decoration: none;
  transition: color var(--ln-duration) var(--ln-ease);
}

.ln-member__link:hover {
  color: var(--ln-c-brand);
}
</style>
