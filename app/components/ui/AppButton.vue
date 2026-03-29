<template>
  <button
    v-bind="$attrs"
    :disabled="disabled || loading"
    class="inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[sizeClass, variantClass]"
  >
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
})

const sizeClass = computed(() => ({
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
}[props.size]))

const variantClass = computed(() => ({
  primary:   'bg-yellow-400 text-gray-900 hover:bg-yellow-300 focus:ring-yellow-400 shadow-md hover:shadow-lg hover:-translate-y-0.5',
  secondary: 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-600 shadow-md hover:shadow-lg hover:-translate-y-0.5',
  danger:    'bg-red-500 text-white hover:bg-red-400 focus:ring-red-400 shadow-md hover:shadow-lg hover:-translate-y-0.5',
  ghost:     'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 border border-gray-300',
}[props.variant]))
</script>
