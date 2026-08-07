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
  /** Enable the scroll-reveal animation for this section (default `true`). */
  reveal?: boolean
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
  /** Destination is required: block actions are navigation, not event handlers. */
  link: string
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
  /** Explicitly mark an image as decorative when it has no useful text alternative. */
  decorative?: boolean
  /** Play ambient video automatically. Respects `prefers-reduced-motion`. */
  autoplay?: boolean
  /** Show native controls for a video. Defaults to true when autoplay is off. */
  controls?: boolean
  /** Mute the video. Defaults to true when autoplay is on. */
  muted?: boolean
  /** Loop the video. Defaults to true when autoplay is on. */
  loop?: boolean
}

/** Either a plain image path or a full media spec. */
export type MediaLike = string | MediaSpec

/** Icon reference: an Iconify name (`fa6-solid:rocket`), an emoji or an image. */
export type IconLike = string | { src: string; alt?: string }

/** Shared content model for card-based blocks. */
export interface CardItem extends HeadingProps {
  icon?: IconLike
  image?: MediaLike
  link?: string
  linkText?: string
  badge?: string
  tags?: string[]
  meta?: string[]
  date?: string
  actions?: ActionItem[]
  target?: string
  rel?: string
}

export interface FeatureItem extends CardItem {
  /** Bento only: how many grid columns/rows the tile spans. */
  span?: 1 | 2
  rowSpan?: 1 | 2
}

/** A feature-split row adds actions and bullets to a regular feature item. */
export interface SplitItem extends FeatureItem {
  bullets?: string[]
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
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  source?: string
  note?: string
  link?: string
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
  currency?: string
  discountLabel?: string
  billingSuffix?: string
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

export interface TeamLink {
  icon?: string
  text?: string
  link: string
}

export interface TeamMember {
  name: string
  role?: string
  text?: string
  avatar?: string
  group?: string
  department?: string
  meta?: string[]
  links?: TeamLink[]
}

export interface TeamGroup extends HeadingProps {
  id: string
}

export interface GalleryItem {
  src: string
  alt?: string
  caption?: string
  title?: string
  text?: string
  tags?: string[]
  actions?: ActionItem[]
  link?: string
  /** CSS aspect-ratio for this tile, e.g. `4/3`. Overrides the block-level `mediaRatio`. */
  mediaRatio?: string
}

/** One tab of a `code` block. */
export interface CodeSample {
  /** Tab label. Defaults to `lang` or the 1-based position. */
  label?: string
  /** Language name shown in the header, e.g. `bash`, `ts`. */
  lang?: string
  /** Raw source. Always what the copy button puts on the clipboard. */
  code: string
  /**
   * Pre-highlighted markup for the same source. Rendered instead of `code`
   * when present — that is how a build-time highlighter plugs in.
   */
  html?: string
  /** Small note under the sample. */
  caption?: string
}

/** One tab of a `tabs` block. */
export interface TabItem extends HeadingProps {
  /** Tab label. Falls back to `title`. */
  label?: string
  icon?: IconLike
  image?: MediaLike
  bullets?: string[]
  actions?: ActionItem[]
  badge?: string
}

/** A column of a `compare` block — one product, plan or option. */
export interface CompareColumn {
  title: string
  text?: string
  /** Highlight the column as the recommended one. */
  featured?: boolean
  badge?: string
  action?: ActionItem
}

/**
 * A row of a `compare` block.
 *
 * `values` is positional — one entry per column. `true` / `false` render as a
 * check or a dash, anything else is printed as text.
 */
export interface CompareRow {
  label: string
  /** Extra explanation shown under the label. */
  text?: string
  values: (boolean | string | number | null)[]
  /** Start a new labelled group of rows. */
  group?: string
}

/** A field of a `newsletter` block, beyond the built-in email input. */
export interface FormField {
  name: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'hidden'
  value?: string
  required?: boolean
}

export type CollectionItem = CardItem

export type CarouselSlide = CardItem

export interface PricingToggleOptions {
  monthlyLabel?: string
  yearlyLabel?: string
  discountLabel?: string
}

type BlockBase<T extends string, Props = object> = SectionProps & HeadingProps & Props & { type: T }
type NonEmptyArray<T> = [T, ...T[]]
type SourcedVideo =
  | { youtube: string; vimeo?: string; src?: string }
  | { youtube?: string; vimeo: string; src?: string }
  | { youtube?: string; vimeo?: string; src: string }

/** Strict built-in entries of the declarative `blocks:` array. */
export type BuiltInBlockSpec =
  | BlockBase<'hero', { variant?: 'split' | 'centered' | 'cover' | 'plain'; actions?: ActionItem[]; image?: MediaLike; note?: string; glow?: boolean; overlay?: boolean }>
  | BlockBase<'features', { items: NonEmptyArray<FeatureItem>; cols?: 1 | 2 | 3 | 4; variant?: 'card' | 'plain' | 'bordered'; iconPosition?: 'top' | 'inline'; iconSize?: string }>
  | BlockBase<'feature-split', { items: NonEmptyArray<SplitItem>; reverse?: boolean; alternate?: boolean; mediaRatio?: string }>
  | BlockBase<'bento', { items: NonEmptyArray<FeatureItem>; cols?: 2 | 3 | 4 }>
  | BlockBase<'carousel', { items: NonEmptyArray<CarouselSlide>; perView?: 1 | 2 | 3 | 4; arrows?: boolean; dots?: boolean; /** Autoplay interval in ms. `0` disables it. */ autoplayInterval?: number; peek?: boolean; ariaLabel?: string; /** Card display style. */ variant?: 'card' | 'plain' | 'bordered' }>
  | BlockBase<'collection', { items: NonEmptyArray<CollectionItem>; actions?: ActionItem[]; cols?: 1 | 2 | 3 | 4; variant?: 'card' | 'plain' | 'bordered'; layout?: 'grid' | 'list'; mediaRatio?: string }>
  | BlockBase<'content', { content?: string; image?: MediaLike; actions?: ActionItem[]; variant?: 'prose' | 'split' | 'card'; reverse?: boolean }>
  | BlockBase<'logos', { items: NonEmptyArray<LogoItem>; variant?: 'row' | 'grid' | 'marquee'; monochrome?: boolean; speed?: number; logoHeight?: string }>
  | BlockBase<'stats', { items: NonEmptyArray<StatItem>; cols?: 2 | 3 | 4; variant?: 'plain' | 'card' | 'divided' }>
  | BlockBase<'steps', { items: NonEmptyArray<StepItem>; variant?: 'row' | 'column'; connector?: boolean }>
  | BlockBase<'testimonials', { items: NonEmptyArray<TestimonialItem>; cols?: 1 | 2 | 3; variant?: 'grid' | 'masonry' | 'single' }>
  | BlockBase<'pricing', { items: NonEmptyArray<PricingPlan>; cols?: 2 | 3 | 4; /** Flat alias for `toggle.monthlyLabel`. */ monthlyLabel?: string; /** Flat alias for `toggle.yearlyLabel`. */ yearlyLabel?: string; toggle?: PricingToggleOptions; currency?: string; /** Flat alias for `toggle.discountLabel`. */ discountLabel?: string; billingSuffix?: string; note?: string }>
  | BlockBase<'faq', { items: NonEmptyArray<FaqItem>; cols?: 1 | 2; exclusive?: boolean; actions?: ActionItem[]; schema?: boolean }>
  | BlockBase<'cta', { actions?: NonEmptyArray<ActionItem>; image?: MediaLike; note?: string; variant?: 'banner' | 'card' | 'split'; surface?: SectionBg }>
  | BlockBase<'timeline', { items: NonEmptyArray<TimelineItem>; variant?: 'stacked' | 'side' }>
  | BlockBase<'team', { items: NonEmptyArray<TeamMember>; groups?: TeamGroup[]; cols?: 2 | 3 | 4; variant?: 'card' | 'plain'; avatarShape?: 'circle' | 'rounded' }>
  | BlockBase<'gallery', { items: NonEmptyArray<GalleryItem>; cols?: 2 | 3 | 4; variant?: 'grid' | 'masonry'; lightbox?: boolean; mediaRatio?: string; ariaLabel?: string }>
  | BlockBase<'code', { items: NonEmptyArray<CodeSample>; copy?: boolean; chrome?: boolean; variant?: 'stacked' | 'split'; actions?: ActionItem[] }>
  | BlockBase<'tabs', { items: NonEmptyArray<TabItem>; variant?: 'top' | 'side'; initial?: number; mediaRatio?: string }>
  | BlockBase<'compare', { columns: NonEmptyArray<CompareColumn>; rows: NonEmptyArray<CompareRow>; rowsLabel?: string; note?: string; stickyHead?: boolean; ariaLabel?: string }>
  | BlockBase<'newsletter', { action?: string; method?: 'post' | 'get'; emailName?: string; emailLabel?: string; placeholder?: string; submitText?: string; fields?: FormField[]; consent?: string; note?: string; ajax?: boolean; successText?: string; errorText?: string; variant?: 'card' | 'banner' }>
  | (BlockBase<'video', { poster?: string; caption?: string; mediaRatio?: string; autoplay?: boolean; actions?: ActionItem[] }> & SourcedVideo)
  | BlockBase<'embed', { src?: string; embedTitle?: string; caption?: string; mediaRatio?: string; loading?: 'lazy' | 'eager'; allow?: string; sandbox?: string; actions?: ActionItem[] }>
  | BlockBase<'banner', { text?: string; badge?: string; icon?: IconLike; link?: string; linkText?: string; dismissible?: boolean; storageKey?: string; placement?: 'inline' | 'top' | 'bottom'; sticky?: boolean }>

export type CustomBlockSpec<T extends string> = SectionProps & { type: T; [prop: string]: unknown }

/** Built-ins are strict; pass a custom type union when extending the registry. */
export type BlockSpec<CustomType extends string = never> =
  | BuiltInBlockSpec
  | ([CustomType] extends [never] ? never : CustomBlockSpec<CustomType>)

/**
 * Keeps a data-mode block list narrow to built-in contracts. Use it when
 * declaring blocks in TypeScript before passing them to `LnRenderer`.
 */
export function defineBuiltInBlocks(blocks: BuiltInBlockSpec[]): BuiltInBlockSpec[] {
  return blocks
}

/**
 * Opt into dynamic registered block types explicitly, without weakening the
 * built-in block contract in the common case.
 */
export function defineCustomBlocks<CustomType extends string>(
  blocks: BlockSpec<CustomType>[]
): BlockSpec<CustomType>[] {
  return blocks
}
