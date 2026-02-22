<script setup lang="ts">
interface FaqItem {
  question: string
  answer: string
  category: string
  relatedPage?: string
}

defineProps<{
  items: FaqItem[]
}>()

const openIndex = ref<number | null>(null)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div>
    <ContactFaqItem
      v-for="(item, index) in items"
      :key="index"
      :question="item.question"
      :answer="item.answer"
      :is-open="openIndex === index"
      @toggle="toggle(index)"
    />
  </div>
</template>
