<template>
  <div class="flex items-center gap-3">
    <span class="text-xs font-bold text-gray-500 uppercase w-16 shrink-0">{{ label }}</span>
    <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-700"
        :class="color"
        :style="{ width: `${Math.min(100, (value / 255) * 100)}%` }"
      />
    </div>
    <span class="text-sm font-bold text-gray-700 w-8 text-right">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: number; color?: string }>()
</script>
