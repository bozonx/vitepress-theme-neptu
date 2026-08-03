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
    noReveal: props.noReveal,
    reveal: props.reveal,
  }
}
