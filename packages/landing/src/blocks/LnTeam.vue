<script setup lang="ts">
/** People behind the product: team, maintainers, speakers. */
import { computed } from 'vue'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnGrid from '../primitives/LnGrid.vue'
import LnCard from '../primitives/LnCard.vue'
import LnIcon from '../primitives/LnIcon.vue'
import { externalTarget, resolveUrl } from '../utils/url.ts'
import type { SectionProps, TeamGroup, TeamMember } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      items?: TeamMember[]
      groups?: TeamGroup[]
      cols?: 2 | 3 | 4
      variant?: 'card' | 'plain'
      /** Round or squared portraits. */
      avatarShape?: 'circle' | 'rounded'
    }
  >(),
  { cols: 4, variant: 'card', avatarShape: 'circle', align: 'center' }
)

const grouped = computed(() => {
  if (!props.groups?.length) return [{ id: '', items: props.items ?? [] }]
  const members = props.items ?? []
  const groupIds = new Set(props.groups.map((group) => group.id))
  const declared = props.groups.map((group) => ({
    ...group,
    items: members.filter((member) => member.group === group.id),
  }))
  const ungrouped = members.filter((member) => !member.group || !groupIds.has(member.group))
  return ungrouped.length ? [...declared, { id: '__ungrouped', items: ungrouped }] : declared
})

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

    <section v-for="group in grouped" :key="group.id" class="ln-team__group">
      <LnHeading v-if="group.title || group.text" :title="group.title" :text="group.text" level="h3" size="card" />
      <LnGrid :cols="props.cols">
      <LnCard
        v-for="(member, i) in group.items"
        :key="`${member.name}-${i}`"
        :plain="props.variant === 'plain'"
        class="ln-member"
        :class="{ 'ln-member--center': props.align === 'center' }"
      >
        <img
          v-if="member.avatar"
          class="ln-member__avatar"
          :class="`ln-member__avatar--${props.avatarShape}`"
          :src="resolveUrl(member.avatar)"
          :alt="member.name"
          loading="lazy"
        />
        <h3 class="ln-member__name">{{ member.name }}</h3>
        <p v-if="member.role" class="ln-member__role">{{ member.role }}</p>
        <p v-if="member.department" class="ln-member__department">{{ member.department }}</p>
        <p v-if="member.text" class="ln-member__text">{{ member.text }}</p>
        <div v-if="member.meta?.length" class="ln-member__meta"><span v-for="meta in member.meta" :key="meta">{{ meta }}</span></div>

        <div v-if="member.links?.length" class="ln-member__links">
          <a
            v-for="(link, li) in member.links"
            :key="li"
            :href="resolveUrl(link.link)"
            class="ln-member__link"
            :target="externalTarget(link.link)"
            :rel="externalTarget(link.link) ? 'noreferrer' : undefined"
            :aria-label="link.text ?? link.link"
          >
            <LnIcon v-if="link.icon" :icon="link.icon" size="1.05rem" />
            <span v-else>{{ link.text }}</span>
          </a>
        </div>
      </LnCard>
      </LnGrid>
    </section>
    <slot />
  </LnSection>
</template>

<style scoped>
.ln-member {
  gap: 0.375rem;
}
.ln-team__group + .ln-team__group { margin-top: var(--ln-gap); }

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
  border: 0;
  padding: 0;
  font-family: var(--ln-font-display);
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--ln-c-text-1);
}

.ln-member__role {
  margin: 0;
  color: var(--ln-c-brand-text);
  font-size: 0.875rem;
  font-weight: 600;
}
.ln-member__department { margin: 0; color: var(--ln-c-text-2); font-size: 0.8125rem; }
.ln-member__meta { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.35rem; color: var(--ln-c-text-2); font-size: 0.75rem; }

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
  color: var(--ln-c-brand-text);
}
</style>
