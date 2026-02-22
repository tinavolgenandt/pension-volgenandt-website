<script setup lang="ts">
defineProps<{
  question: string
  answer: string
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="border-b border-sage-200">
    <button
      class="flex w-full items-center justify-between py-5 text-left"
      :aria-expanded="isOpen"
      @click="$emit('toggle')"
    >
      <span class="pr-4 text-lg font-semibold text-sage-900">
        {{ question }}
      </span>
      <Icon
        name="ph:caret-down"
        class="size-5 shrink-0 text-sage-500 transition-transform duration-300"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>
    <div
      class="overflow-hidden transition-all duration-300"
      :class="isOpen ? 'max-h-96 pb-5' : 'max-h-0'"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="leading-relaxed text-sage-700" v-html="answer" />
    </div>
  </div>
</template>
