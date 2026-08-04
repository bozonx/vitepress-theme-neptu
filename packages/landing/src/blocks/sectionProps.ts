import type { SectionProps } from './types.ts'

/**
 * Resolves section props for `v-bind` onto `<LnSection>`. Returns only the
 * keys `LnSection` actually consumes, so blocks don't re-declare them.
 *
 * @example
 * const props = defineProps<SectionProps & { items?: Foo[] }>()
 * const sectionProps = useSectionProps(props)
 * // template:
 * // <LnSection v-bind="sectionProps" class="ln-foo">
 */
export function useSectionProps(props: SectionProps) {
  return {
    id: props.id,
    bg: props.bg,
    width: props.width,
    padding: props.padding,
    divider: props.divider,
    // Resolve the deprecated `noReveal` alias here so LnSection only receives
    // the canonical `reveal` flag from block-level usage.
    reveal: props.reveal === false || props.noReveal === true ? false : props.reveal,
  }
}
