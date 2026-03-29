<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium min-w-[260px] max-w-xs border backdrop-blur-sm"
          :class="toastClass(toast.type)"
        >
          <span class="text-lg">{{ toastIcon(toast.type) }}</span>
          <span>{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'


const { toasts } = useToast()

const toastClass = (type: string) => ({
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
}[type] ?? 'bg-white border-gray-200 text-gray-800')

const toastIcon = (type: string) => ({
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
  warning: '⚠️',
}[type] ?? '💬')
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from  { opacity: 0; transform: translateX(60px); }
.toast-leave-to   { opacity: 0; transform: translateX(60px); }
</style>