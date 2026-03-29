<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <MainNavbar />
    <ToastContainer />
    <main class="flex-1">
      <slot />
    </main>
    <MainFooter />
  </div>
</template>

<script setup lang="ts">
import MainNavbar from '~/components/layout/MainNavbar.vue'
import MainFooter from '~/components/layout/MainFooter.vue'
import ToastContainer from '~/components/ui/ToastContainer.vue'
</script>