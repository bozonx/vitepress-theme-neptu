/**
 * Shared prop contract of the landing block library.
 *
 * Every block accepts {@link SectionProps} plus its own `items` / content
 * props. Keeping the outer contract identical across blocks is deliberate: it
 * is what makes the library predictable for humans, for the YAML-driven
 * renderer and for AI agents composing pages.
 */

/** Background surface a section paints itself with. */
export type SectionBg =
  | 'base'
  | 'soft'
  | 'mute'
  | 'inverse'
  | 'brand'
  | 'transparent'

/** Max content width inside a section. */
export type SectionWidth = 'narrow' | 'default' | 'wide' | 'full'

/** Vertical rhythm of a section. */
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg'

/** Horizontal alignment of the section header and, where relevant, content. */
export type Align = 'start' | 'center'

/** Visual weight of a button. */
export type ButtonVariant = 'brand' | 'alt' | 'ghost' | 'outline' | 'link'

export type ButtonSize = 'sm' | 'md' | 'lg'

/** Props accepted by every block, forwarded to `LnSection`. */
export interface SectionProps {
  /** Anchor id — also used by in-page navigation. */
  id?: string
  bg?: SectionBg
  width?: SectionWidth
  padding?: SectionPadding
  align?: Align
  /** Draw a hairline on top of the section. */
  divider?: boolean
  /** Disable the scroll-reveal animation for this section. */
  noReveal?: boolean
}

/** Header content shared by most blocks. */
export interface HeadingProps {
  /** Small label above the title. */
  eyebrow?: string
  title?: string
  /** Sub-title / lead paragraph. */
  text?: string
}

/** A call-to-action button. */
export interface ActionItem {
  text: string
  link?: string
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: string
  target?: string
  rel?: string
}

/** An image, or a video with a poster. */
export interface MediaSpec {
  src?: string
  alt?: string
  /** Video URL. When set, a `<video>` is rendered instead of an `<img>`. */
  video?: string
  poster?: string
  width?: number | string
  height?: number | string
  /** CSS aspect-ratio, e.g. `16/9`. */
  ratio?: string
  /** `contain` keeps the whole image visible, `cover` fills the frame. */
  fit?: 'cover' | 'contain'
}

/** Either a plain image path or a full media spec. */
export type MediaLike = string | MediaSpec

/** Icon reference: an Iconify name (`fa6-solid:rocket`), an emoji or an image. */
export type IconLike = string | { src: string; alt?: string }

export interface FeatureItem extends HeadingProps {
  icon?: IconLike
  image?: MediaLike
  link?: string
  linkText?: string
  badge?: string
  target?: string
  rel?: string
  /** Bento only: how many grid columns/rows the tile spans. */
  span?: 1 | 2
  rowSpan?: 1 | 2
}

export interface LogoItem {
  src: string
  alt?: string
  link?: string
  /** Override the logo height, e.g. `2.5rem`. */
  height?: string
}

export interface StatItem {
  value: string
  label?: string
  text?: string
  icon?: IconLike
}

export interface StepItem extends HeadingProps {
  icon?: IconLike
  image?: MediaLike
  /** Defaults to the 1-based position. */
  label?: string
}

export interface TestimonialItem {
  text: string
  author?: string
  role?: string
  avatar?: string
  /** Company / product logo shown in the card footer. */
  logo?: string
  link?: string
  rating?: number
}

export interface PricingFeature {
  text: string
  /** `false` renders the feature as unavailable. */
  included?: boolean
}

export interface PricingPlan extends HeadingProps {
  price?: string
  /** Price shown when the period toggle is on the yearly option. */
  priceYearly?: string
  /** e.g. `/ mo`. */
  period?: string
  periodYearly?: string
  features?: (string | PricingFeature)[]
  action?: ActionItem
  /** Highlight the plan as the recommended one. */
  featured?: boolean
  badge?: string
}

export interface FaqItem {
  /** Supports inline HTML. */
  question: string
  answer: string
  /** Open by default. */
  open?: boolean
}

export interface TimelineItem extends HeadingProps {
  /** Date, version or phase label. */
  label?: string
  icon?: IconLike
  /** `done` | `active` | `planned` — drives the marker style. */
  state?: 'done' | 'active' | 'planned'
}

export interface TeamMember {
  name: string
  role?: string
  text?: string
  avatar?: string
  links?: { icon?: string; text?: string; link: string }[]
}

export interface GalleryItem {
  src: string
  alt?: string
  caption?: string
  link?: string
  ratio?: string
}

export interface CarouselSlide extends HeadingProps {
  image?: MediaLike
  icon?: IconLike
  link?: string
  linkText?: string
  badge?: string
}

/**
 * One entry of the declarative `blocks:` array.
 *
 * `type` is the key registered in the block registry; every other key is passed
 * to the block as a prop.
 */
export interface BlockSpec extends SectionProps {
  type: string
  [prop: string]: unknown
}
