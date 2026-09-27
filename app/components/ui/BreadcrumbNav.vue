<script setup lang="ts">
import { t } from '~/utils/translations'

const { locale } = useLocale()

// EN pages live under /en/, so treat /en as the root segment (otherwise the
// trail reads "Startseite › En › …")
const items = useBreadcrumbItems({
  rootSegment: locale.value === 'en' ? '/en' : '/',
  overrides: [{ label: t('nav.home', locale.value) }],
})

// BreadcrumbList structured data, emitted via our own JSON-LD graph
// (nuxt-schema-org emits no nodes, see nuxt.config.ts)
const SITE = 'https://www.pension-volgenandt.de'
const withSlash = (p: string) => (p.endsWith('/') ? p : `${p}/`)
if (items.value.length > 1) {
  useJsonLd(
    {
      '@type': 'BreadcrumbList',
      itemListElement: items.value.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        ...(item.to ? { item: SITE + withSlash(item.to) } : {}),
      })),
    },
    'breadcrumb-list',
  )
}
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
