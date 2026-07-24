<script setup lang="ts">
import { computed } from 'vue'

interface HeroAction {
  link: string
  text: string
  theme?: string
  target?: string
  rel?: string
}

interface HeroImage {
  src: string
  alt?: string
}

interface Hero {
  name?: string
  text?: string
  tagline?: string
  actions?: HeroAction[]
  image?: string | HeroImage
}

interface Feature {
  title: string
  details: string
  icon?: string | { src: string; alt?: string }
  link?: string
  linkText?: string
  rel?: string
  target?: string
}

const props = defineProps<{
  hero?: Hero
  features?: Feature[]
}>()

const hero = computed(() => props.hero)
</script>

<template>
  <div class="neptu-site-home">
    <section v-if="hero" class="hero">
      <div class="hero-container">
        <div class="hero-main">
          <h1 v-if="hero.name || hero.text" class="heading">
            <span v-if="hero.name" class="name" v-html="hero.name" />
            <span v-if="hero.text" class="text" v-html="hero.text" />
          </h1>
          <p v-if="hero.tagline" class="tagline" v-html="hero.tagline" />
          <div v-if="hero.actions && hero.actions.length" class="actions">
            <a
              v-for="a in hero.actions"
              :key="a.link"
              :href="a.link"
              :target="a.target"
              :rel="a.rel"
              class="action"
              :class="{ 'action-brand': a.theme !== 'alt', 'action-alt': a.theme === 'alt' }"
            >
              {{ a.text }}
            </a>
          </div>
        </div>
        <div v-if="hero.image" class="hero-image">
          <img
            :src="typeof hero.image === 'string' ? hero.image : hero.image.src"
            :alt="typeof hero.image === 'object' ? hero.image.alt : ''"
          />
        </div>
      </div>
    </section>

    <section v-if="features && features.length" class="features">
      <div class="features-container">
        <a
          v-for="f in features"
          :key="f.title"
          class="feature"
          :href="f.link"
          :target="f.target"
          :rel="f.rel"
        >
          <div v-if="f.icon" class="feature-icon">
            <img
              v-if="typeof f.icon === 'string'"
              :src="f.icon"
              :alt="f.title"
            />
            <component :is="'img'" v-else-if="f.icon.src" :src="f.icon.src" :alt="f.icon.alt || f.title" />
          </div>
          <h2 class="feature-title" v-html="f.title" />
          <p class="feature-details" v-html="f.details" />
          <span v-if="f.linkText" class="feature-link-text">{{ f.linkText }}</span>
        </a>
      </div>
    </section>

    <div class="vp-doc home-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.neptu-site-home {
  width: 100%;
}

/* Hero */
.hero {
  padding: 48px 24px;
}
@media (min-width: 640px) {
  .hero { padding: 80px 48px 64px; }
}
@media (min-width: 960px) {
  .hero { padding: 80px 64px 64px; }
}
.hero-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1152px;
  gap: 2rem;
}
@media (min-width: 960px) {
  .hero-container { flex-direction: row; align-items: center; }
}
.hero-main { flex: 1 1 auto; min-width: 0; }
.heading { display: flex; flex-direction: column; gap: 4px; margin: 0; }
.name { color: var(--vp-c-brand-1); font-weight: 700; font-size: 32px; line-height: 40px; }
.text { font-weight: 700; font-size: 32px; line-height: 40px; }
@media (min-width: 640px) {
  .name, .text { font-size: 48px; line-height: 56px; }
}
@media (min-width: 960px) {
  .name, .text { font-size: 56px; line-height: 64px; }
}
.tagline {
  padding-top: 8px;
  max-width: 576px;
  line-height: 28px;
  font-size: 18px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
.actions { display: flex; flex-wrap: wrap; gap: 12px; padding-top: 24px; }
.action {
  display: inline-flex;
  align-items: center;
  padding: 0 20px;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.25s, background-color 0.25s, border-color 0.25s;
}
.action-brand {
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}
.action-brand:hover { background-color: var(--vp-c-brand-2); }
.action-alt {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}
.action-alt:hover { background-color: var(--vp-c-default-2); }

.hero-image { display: flex; justify-content: center; }
.hero-image img { max-width: 100%; height: auto; }

/* Features */
.features { padding: 0 24px; }
@media (min-width: 640px) { .features { padding: 0 48px; } }
@media (min-width: 960px) { .features { padding: 0 64px; } }
.features-container {
  display: grid;
  gap: 16px;
  margin: 0 auto;
  max-width: 1152px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .features-container { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 960px) {
  .features-container { grid-template-columns: repeat(3, 1fr); }
}
.feature {
  display: block;
  padding: 24px;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.25s, background-color 0.25s;
}
.feature:hover { border-color: var(--vp-c-brand-1); }
.feature-icon { font-size: 24px; }
.feature-title { margin: 12px 0 0; font-size: 16px; font-weight: 600; line-height: 24px; border: 0; padding: 0; letter-spacing: normal; }
.feature-details { margin: 8px 0 0; font-size: 14px; line-height: 24px; color: var(--vp-c-text-2); }
.feature-link-text { display: inline-block; margin-top: 8px; color: var(--vp-c-brand-1); font-size: 14px; font-weight: 500; }

/* Home content slot */
.home-content { margin: 2.5rem auto 4rem; padding: 0 24px; max-width: 1152px; }
@media (min-width: 640px) { .home-content { padding: 0 48px; } }
@media (min-width: 960px) { .home-content { padding: 0 64px; } }
</style>
