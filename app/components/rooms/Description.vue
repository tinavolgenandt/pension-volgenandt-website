<script setup lang="ts">
interface Props {
  shortDescription: string
  description: string
}

defineProps<Props>()

const isExpanded = ref(false)

function toggle() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="room-description">
    <!-- Short description (always visible) -->
    <p class="text-lg leading-relaxed text-sage-700">
      {{ shortDescription }}
    </p>

    <!-- Full description (expandable) -->
    <div
      class="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
      :class="isExpanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
    >
      <p class="overflow-hidden leading-relaxed whitespace-pre-line text-sage-700">
        {{ description }}
      </p>
    </div>

    <!-- Toggle button -->
    <button
      type="button"
      class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-waldhonig-600 transition-colors hover:text-waldhonig-700 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-waldhonig-500"
      :aria-expanded="isExpanded"
      @click="toggle"
    >
      {{ isExpanded ? 'Weniger anzeigen' : 'Mehr lesen' }}
      <Icon
        :name="isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'"
        :size="16"
        aria-hidden="true"
        class="transition-transform duration-200"
      />
    </button>
  </div>
</template>
