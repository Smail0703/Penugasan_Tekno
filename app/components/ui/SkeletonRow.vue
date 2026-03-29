<template>
  <tr v-for="i in count" :key="i" class="animate-pulse border-b border-gray-100">
    <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-8"></div></td>
    <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-28"></div></td>
    <td class="px-6 py-4"><div class="flex gap-2"><div class="h-5 bg-gray-200 rounded-full w-16"></div><div class="h-5 bg-gray-200 rounded-full w-14"></div></div></td>
    <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-10"></div></td>
    <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-10"></div></td>
    <td class="px-6 py-4"><div class="flex gap-2"><div class="h-8 bg-gray-200 rounded-lg w-14"></div><div class="h-8 bg-gray-200 rounded-lg w-14"></div></div></td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{ count?: number }>()
</script>
