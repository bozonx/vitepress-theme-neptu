import type { Component } from 'vue'
import LnHero from './LnHero.vue'
import LnFeatureGrid from './LnFeatureGrid.vue'
import LnFeatureSplit from './LnFeatureSplit.vue'
import LnBento from './LnBento.vue'
import LnCarousel from './LnCarousel.vue'
import LnLogoCloud from './LnLogoCloud.vue'
import LnStats from './LnStats.vue'
import LnSteps from './LnSteps.vue'
import LnTestimonials from './LnTestimonials.vue'
import LnPricing from './LnPricing.vue'
import LnFaq from './LnFaq.vue'
import LnCta from './LnCta.vue'
import LnTimeline from './LnTimeline.vue'
import LnTeam from './LnTeam.vue'
import LnGallery from './LnGallery.vue'
import LnCode from './LnCode.vue'
import LnTabs from './LnTabs.vue'
import LnCompare from './LnCompare.vue'
import LnNewsletter from './LnNewsletter.vue'
import LnVideo from './LnVideo.vue'
import LnBanner from './LnBanner.vue'
import LnContent from './LnContent.vue'
import LnCollection from './LnCollection.vue'
import LnEmbed from './LnEmbed.vue'

/**
 * Maps the `type` used in the declarative `blocks:` array to a component.
 *
 * Keys are short and stable — they are part of the content format, written by
 * hand in YAML and by AI agents. Component names may change, keys should not.
 */
export const blockRegistry: Record<string, Component> = {
  hero: LnHero,
  features: LnFeatureGrid,
  'feature-split': LnFeatureSplit,
  bento: LnBento,
  carousel: LnCarousel,
  logos: LnLogoCloud,
  stats: LnStats,
  steps: LnSteps,
  testimonials: LnTestimonials,
  pricing: LnPricing,
  faq: LnFaq,
  cta: LnCta,
  timeline: LnTimeline,
  team: LnTeam,
  gallery: LnGallery,
  code: LnCode,
  tabs: LnTabs,
  compare: LnCompare,
  newsletter: LnNewsletter,
  video: LnVideo,
  banner: LnBanner,
  content: LnContent,
  collection: LnCollection,
  embed: LnEmbed,
}

/** Component names used for global registration and in markdown. */
export const blockComponents = {
  LnHero,
  LnFeatureGrid,
  LnFeatureSplit,
  LnBento,
  LnCarousel,
  LnLogoCloud,
  LnStats,
  LnSteps,
  LnTestimonials,
  LnPricing,
  LnFaq,
  LnCta,
  LnTimeline,
  LnTeam,
  LnGallery,
  LnCode,
  LnTabs,
  LnCompare,
  LnNewsletter,
  LnVideo,
  LnBanner,
  LnContent,
  LnCollection,
  LnEmbed,
} satisfies Record<string, Component>

/** All block types known to the renderer, for docs and error messages. */
export const blockTypes: string[] = Object.keys(blockRegistry)

/**
 * Registers extra block types, or overrides built-in ones with your own
 * components. Call it before the renderer mounts, e.g. in `enhanceApp`.
 */
export function registerBlockTypes(blocks: Record<string, Component>): void {
  Object.assign(blockRegistry, blocks)
  blockTypes.splice(0, blockTypes.length, ...Object.keys(blockRegistry))
}

/** Resolves a block type, returning `undefined` for unknown ones. */
export function resolveBlock(type: string): Component | undefined {
  return blockRegistry[type]
}
