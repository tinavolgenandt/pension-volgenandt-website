<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1 pt-20">
      <!-- pt-20 (~80px) offsets fixed header height -->
      <slot />
    </main>
    <AppFooter />
    <CookieConsent />
    <CookieSettings />
  </div>
</template>
