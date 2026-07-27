<script setup lang="ts">
/**
 * Subscribe / contact form — the one thing a static landing page could not do
 * before: collect a lead.
 *
 * It is a plain `<form>` that posts to whatever endpoint you point it at
 * (Formspree, Netlify Forms, Buttondown, Mailchimp, your own handler). No
 * fetch, no state machine, no third-party script: a native submit works with
 * JS disabled and is impossible to get subtly wrong.
 *
 * Set `ajax` to keep the visitor on the page — then the response is posted in
 * the background and a status message replaces the form.
 */
import { computed, ref, useId } from 'vue'
import { useData } from 'vitepress'
import LnSection from '../primitives/LnSection.vue'
import LnHeading from '../primitives/LnHeading.vue'
import LnIcon from '../primitives/LnIcon.vue'
import type { FormField, SectionProps } from './types.ts'

const props = withDefaults(
  defineProps<
    SectionProps & {
      eyebrow?: string
      title?: string
      text?: string
      /** Form endpoint. Without it the block renders as a preview only. */
      action?: string
      method?: 'post' | 'get'
      /** Name of the email input — providers disagree (`email`, `EMAIL`, …). */
      emailName?: string
      emailLabel?: string
      placeholder?: string
      submitText?: string
      /** Extra inputs rendered before the email field. */
      fields?: FormField[]
      /** Consent line with a required checkbox. Supports inline HTML. */
      consent?: string
      /** Small print under the form. */
      note?: string
      /** Submit in the background instead of navigating away. */
      ajax?: boolean
      successText?: string
      errorText?: string
      /** `card` wraps the form in a panel, `banner` keeps it inline. */
      variant?: 'card' | 'banner'
    }
  >(),
  {
    method: 'post',
    emailName: 'email',
    ajax: false,
    variant: 'card',
    align: 'center',
    width: 'narrow',
  }
)

const { theme } = useData()
const formText = computed(() => {
  const t = theme.value.t as { landing?: { form?: Record<string, string> } } | undefined
  return t?.landing?.form ?? {}
})
const label = (key: string, fallback: string): string => formText.value[key] ?? fallback

const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const visibleFields = computed(() => props.fields ?? [])
const generatedId = useId()
const formId = computed(() => props.id ?? `ln-form-${generatedId}`)

const onSubmit = async (event: Event): Promise<void> => {
  if (!props.ajax || !props.action) return

  event.preventDefault()
  const form = event.target as HTMLFormElement
  state.value = 'sending'
  try {
    const response = await fetch(props.action, {
      method: props.method,
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
    state.value = response.ok ? 'done' : 'error'
    if (response.ok) form.reset()
  } catch {
    state.value = 'error'
  }
}
</script>

<template>
  <LnSection
    :id="props.id"
    :bg="props.bg"
    :width="props.width"
    :padding="props.padding"
    :divider="props.divider"
    :no-reveal="props.noReveal"
    class="ln-form"
    :class="`ln-form--${props.variant}`"
  >
    <div class="ln-form__inner" :class="{ 'ln-form__panel': props.variant === 'card' }">
      <LnHeading
        :eyebrow="props.eyebrow"
        :title="props.title"
        :text="props.text"
        :align="props.align"
        :spacing="false"
      />

      <p v-if="state === 'done'" class="ln-form__status ln-form__status--ok" role="status">
        <LnIcon icon="fa6-solid:check" size="0.9rem" />
        {{ props.successText ?? label('success', 'Thanks — check your inbox to confirm.') }}
      </p>

      <form
        v-else
        class="ln-form__form"
        :action="props.action"
        :method="props.method"
        @submit="onSubmit"
      >
        <div v-for="field in visibleFields" :key="field.name" class="ln-form__field">
          <template v-if="field.type === 'hidden'">
            <input type="hidden" :name="field.name" :value="field.value" />
          </template>
          <template v-else>
            <label class="ln-form__label" :for="`${formId}-${field.name}`">
              {{ field.label ?? field.name }}
            </label>
            <textarea
              v-if="field.type === 'textarea'"
              :id="`${formId}-${field.name}`"
              class="ln-form__input ln-form__input--area"
              :name="field.name"
              :placeholder="field.placeholder"
              :required="field.required"
              rows="4"
            />
            <input
              v-else
              :id="`${formId}-${field.name}`"
              class="ln-form__input"
              :type="field.type ?? 'text'"
              :name="field.name"
              :placeholder="field.placeholder"
              :required="field.required"
              :value="field.value"
            />
          </template>
        </div>

        <div class="ln-form__row">
          <div class="ln-form__field ln-form__field--grow">
            <label class="ln-form__label ln-form__label--visually-hidden" :for="`${formId}-email`">
              {{ props.emailLabel ?? label('email', 'Email') }}
            </label>
            <input
              :id="`${formId}-email`"
              class="ln-form__input"
              type="email"
              :name="props.emailName"
              autocomplete="email"
              required
              :placeholder="props.placeholder ?? label('placeholder', 'you@example.com')"
            />
          </div>

          <button type="submit" class="ln-form__submit" :disabled="state === 'sending'">
            {{ props.submitText ?? label('submit', 'Subscribe') }}
          </button>
        </div>

        <label v-if="props.consent" class="ln-form__consent">
          <input type="checkbox" name="consent" required />
          <span v-html="props.consent" />
        </label>

        <p v-if="state === 'error'" class="ln-form__status ln-form__status--error" role="alert">
          {{ props.errorText ?? label('error', 'Something went wrong. Please try again.') }}
        </p>

        <p v-if="props.note" class="ln-form__note">{{ props.note }}</p>
        <slot />
      </form>
    </div>
  </LnSection>
</template>

<style scoped>
.ln-form__inner {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ln-form__panel {
  border: var(--ln-border-width) solid var(--ln-card-border-color);
  border-radius: var(--ln-card-radius);
  background-color: var(--ln-card-bg);
  padding: clamp(1.5rem, 1rem + 3vw, 3rem);
  box-shadow: var(--ln-card-shadow);
}

.ln-form__form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.ln-form__row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .ln-form__row {
    flex-direction: row;
    align-items: flex-end;
  }
}

.ln-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.ln-form__field--grow {
  flex: 1 1 auto;
}

.ln-form__label {
  color: var(--ln-c-text-2);
  font-size: 0.8125rem;
  font-weight: 600;
}

/* Kept for screen readers — the placeholder is not a label. */
.ln-form__label--visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.ln-form__input {
  width: 100%;
  border: var(--ln-border-width) solid var(--ln-c-border-strong);
  border-radius: var(--ln-btn-radius);
  background-color: var(--ln-c-bg);
  padding: 0 1rem;
  height: var(--ln-btn-height);
  color: var(--ln-c-text-1);
  font: inherit;
  font-size: 0.9375rem;
  transition: border-color var(--ln-duration) var(--ln-ease);
}

.ln-form__input--area {
  height: auto;
  border-radius: var(--ln-radius-md);
  padding: 0.75rem 1rem;
  resize: vertical;
}

.ln-form__input::placeholder {
  color: var(--ln-c-text-3);
}

.ln-form__input:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 1px;
  border-color: transparent;
}

.ln-form__submit {
  flex: none;
  border: var(--ln-border-width) solid transparent;
  border-radius: var(--ln-btn-radius);
  background-color: var(--ln-c-brand);
  height: var(--ln-btn-height);
  padding-inline: var(--ln-btn-px);
  color: var(--ln-c-on-brand);
  font: inherit;
  font-weight: var(--ln-btn-weight);
  letter-spacing: var(--ln-btn-tracking);
  text-transform: var(--ln-btn-uppercase);
  cursor: pointer;
  transition: background-color var(--ln-duration) var(--ln-ease);
}

.ln-form__submit:hover:not(:disabled) {
  background-color: var(--ln-c-brand-active);
}

.ln-form__submit:disabled {
  opacity: 0.6;
  cursor: progress;
}

.ln-form__submit:focus-visible {
  outline: 2px solid var(--ln-c-brand);
  outline-offset: 2px;
}

.ln-form__consent {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: var(--ln-c-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
  text-align: left;
}

.ln-form__consent input {
  margin-top: 0.2rem;
  accent-color: var(--ln-c-brand);
}

.ln-form__consent :deep(a) {
  color: var(--ln-c-brand-text);
}

.ln-form__status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.9375rem;
}

.ln-form__status--ok {
  color: var(--ln-c-brand-text);
  font-weight: 600;
}

.ln-form__status--error {
  color: var(--ln-c-danger);
}

.ln-form__note {
  margin: 0;
  color: var(--ln-c-text-2);
  font-size: 0.8125rem;
}
</style>
