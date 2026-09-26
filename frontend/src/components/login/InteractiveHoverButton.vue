<script setup>
import { useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()

defineProps({
  text: { type: String, default: 'Button' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button
    v-bind="attrs"
    :type="type"
    :disabled="disabled"
    class="group relative inline-flex w-32 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-background px-6 py-2 text-center font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50"
  >
    <span class="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
      {{ text }}
    </span>
    <div class="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:opacity-100">
      <span>{{ text }}</span>
      <slot name="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </slot>
    </div>
  </button>
</template>
