<script setup lang="ts">
/**
 * Comparison table — plans against each other, or the product against the
 * alternatives. What `pricing` cards stop being able to show past six or seven
 * lines per plan.
 *
 * A real `<table>`: screen readers announce "row 4, column Pro", and the header
 * row sticks while the body scrolls. On narrow screens the table scrolls
 * horizontally inside its own container instead of squashing the labels.
 */
import { computed } from 'vue'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnIcon from '../primitives/LnIcon.vue'
import LnButton from '../primitives/LnButton.vue'
import type { CompareColumn, CompareRow, HeadingProps, SectionProps } from './types.ts'
import { useSectionProps } from './sectionProps.ts'

const props = withDefaults(
  defineProps<
    SectionProps &
      HeadingProps & {
        /** Column headers — one per entry of every row's `values`. */
        columns?: CompareColumn[]
      rows?: CompareRow[]
      /** Header of the first (label) column. */
      rowsLabel?: string
      /** Small print under the table. */
      note?: string
      /** Keep the header visible while the page scrolls. */
      stickyHead?: boolean
      /** Accessible name for the table region. Defaults to the section title. */
      ariaLabel?: string
    }
  >(),
  { stickyHead: true, align: 'center', width: 'wide' }
)

const columns = computed(() => props.columns ?? [])

/**
 * Rows carry their group header with them, so the flat `rows` array stays the
 * authoring format while the table still renders grouped sections.
 */
const body = computed(() =>
  (props.rows ?? []).map((row, index) => ({
    row,
    /** Only the first row of a run renders the group heading. */
    groupStart: Boolean(row.group) && row.group !== props.rows?.[index - 1]?.group,
  }))
)

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
const sectionProps = useSectionProps(props)

/* Dev-mode validation: each row's values must match the column count. */
if (import.meta.env.DEV) {
  for (const [i, row] of (props.rows ?? []).entries()) {
    if (row.values && columns.value.length && row.values.length !== columns.value.length) {
      console.warn(
        `[LnCompare] Row ${i} ("${row.label ?? ''}") has ${row.values.length} values, ` +
        `but there are ${columns.value.length} columns.`
      )
    }
  }
}
</script>

<template>
  <LnSection
    v-bind="sectionProps"
    class="ln-compare"
  >
    <LnHeading
      :eyebrow="props.eyebrow"
      :title="props.title"
      :text="props.text"
      :align="props.align"
    />

    <div class="ln-compare__scroll" tabindex="0" role="region" :aria-label="props.ariaLabel ?? props.title ?? 'Comparison'">
      <table class="ln-compare__table" :class="{ 'ln-compare__table--sticky': props.stickyHead }">
        <thead>
          <tr>
            <th scope="col" class="ln-compare__corner">{{ props.rowsLabel ?? '' }}</th>
            <th
              v-for="(column, ci) in columns"
              :key="`col-${ci}`"
              scope="col"
              class="ln-compare__head"
              :class="{ 'is-featured': column.featured }"
            >
              <span v-if="column.badge" class="ln-compare__badge">{{ column.badge }}</span>
              <span class="ln-compare__head-title">{{ column.title }}</span>
              <span v-if="column.text" class="ln-compare__head-text">{{ column.text }}</span>
              <LnButton
                v-if="column.action"
                :text="column.action.text"
                :link="column.action.link"
                :variant="column.action.variant ?? (column.featured ? 'brand' : 'alt')"
                :target="column.action.target"
                size="sm"
                class="ln-compare__head-action"
              />
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="({ row, groupStart }, ri) in body" :key="`row-${ri}`">
            <tr v-if="groupStart" class="ln-compare__group">
              <th :colspan="columns.length + 1" scope="colgroup">{{ row.group }}</th>
            </tr>
            <tr>
              <th scope="row" class="ln-compare__label">
                <span>{{ row.label }}</span>
                <span v-if="row.text" class="ln-compare__label-text">{{ row.text }}</span>
              </th>
              <td
                v-for="(value, vi) in row.values"
                :key="`cell-${vi}`"
                class="ln-compare__cell"
                :class="{ 'is-featured': columns[vi]?.featured }"
              >
                <!--
                  A bare icon would read as nothing at all: the text label is
                  what the screen reader announces, the icon is decoration.
                -->
                <template v-if="isBoolean(value)">
                  <LnIcon
                    :icon="value ? 'fa6-solid:check' : 'fa6-solid:minus'"
                    size="0.9rem"
                    :class="value ? 'ln-compare__yes' : 'ln-compare__no'"
                  />
                  <span class="ln-compare__sr">{{ value ? '✓' : '—' }}</span>
                </template>
                <template v-else>{{ value ?? '—' }}</template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <p v-if="props.note" class="ln-compare__note">{{ props.note }}</p>
    <slot />
  </LnSection>
</template>

<style scoped>
.ln-compare__scroll {
  overflow-x: auto;
  /* The table must scroll on its own — never the page body. */
  max-width: 100%;
  border: var(--ln-border-width) solid var(--ln-c-border);
  border-radius: var(--ln-radius-lg);
  background-color: var(--ln-c-bg-elevated);
}

.ln-compare__scroll:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 2px;
}

.ln-compare__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
  text-align: left;
}

.ln-compare__table--sticky thead th {
  position: sticky;
  top: var(--vp-nav-height, 0px);
  z-index: 1;
  background-color: var(--ln-c-bg-elevated);
}

.ln-compare__corner,
.ln-compare__head {
  border-bottom: var(--ln-border-width) solid var(--ln-c-border);
  padding: 1rem;
  vertical-align: bottom;
}

.ln-compare__corner {
  min-width: 12rem;
  color: var(--ln-c-text-2);
  font-weight: 600;
}

.ln-compare__head {
  display: table-cell;
  min-width: 9rem;
  text-align: center;
}

.ln-compare__head.is-featured {
  box-shadow: inset 0 3px 0 var(--ln-c-brand);
}

.ln-compare__head-title {
  display: block;
  font-family: var(--ln-font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--ln-c-text-1);
}

.ln-compare__head-text {
  display: block;
  margin-top: 0.25rem;
  color: var(--ln-c-text-2);
  font-size: 0.8125rem;
  font-weight: 400;
}

.ln-compare__head-action {
  margin-top: 0.75rem;
}

.ln-compare__badge {
  display: inline-block;
  margin-bottom: 0.375rem;
  border-radius: var(--ln-radius-pill);
  background-color: var(--ln-c-brand-soft);
  padding: 0.1rem 0.55rem;
  color: var(--ln-c-brand-text);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ln-compare__group th {
  border-bottom: var(--ln-border-width) solid var(--ln-c-border);
  background-color: var(--ln-c-bg-soft);
  padding: 0.5rem 1rem;
  color: var(--ln-c-text-2);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ln-compare__label {
  border-bottom: var(--ln-border-width) solid var(--ln-c-border);
  padding: 0.875rem 1rem;
  font-weight: 500;
  color: var(--ln-c-text-1);
}

.ln-compare__label-text {
  display: block;
  margin-top: 0.15rem;
  color: var(--ln-c-text-2);
  font-size: 0.8125rem;
  font-weight: 400;
}

.ln-compare__cell {
  border-bottom: var(--ln-border-width) solid var(--ln-c-border);
  padding: 0.875rem 1rem;
  text-align: center;
  color: var(--ln-c-text-2);
}

.ln-compare__cell.is-featured {
  background-color: var(--ln-c-brand-soft);
}

.ln-compare__table tbody tr:last-child .ln-compare__label,
.ln-compare__table tbody tr:last-child .ln-compare__cell {
  border-bottom: 0;
}

.ln-compare__yes {
  color: var(--ln-c-brand-text);
}

.ln-compare__no {
  color: var(--ln-c-text-3);
}

/* Visible to assistive tech only — the icon carries no text of its own. */
.ln-compare__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.ln-compare__note {
  margin: 1.5rem 0 0;
  text-align: center;
  color: var(--ln-c-text-2);
  font-size: 0.875rem;
}
</style>
