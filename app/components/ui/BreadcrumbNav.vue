<script setup lang="ts">
const items = useBreadcrumbItems({
  schemaOrg: true,
  overrides: [{ label: 'Startseite' }],
})
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1 text-sm text-white/80">
      <li v-for="(item, index) in items" :key="item.to || index" class="flex items-center">
        <NuxtLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="transition-colors hover:text-white"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="font-medium text-white" aria-current="page">
          {{ item.label }}
        </span>
        <Icon
          v-if="index < items.length - 1"
          name="ph:caret-right"
          class="mx-1 size-3 text-white/60"
        />
      </li>
    </ol>
  </nav>
</template>
