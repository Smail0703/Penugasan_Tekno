<template>
  <div class="flex items-center justify-between mt-6">
    <p class="text-sm text-gray-500">
      Page <span class="font-semibold text-gray-800">{{ currentPage }}</span> of
      <span class="font-semibold text-gray-800">{{ totalPages }}</span>
      <span class="ml-1">({{ totalCount }} total)</span>
    </p>
    <div class="flex items-center gap-2">
      <AppButton variant="ghost" size="sm" :disabled="currentPage <= 1" @click="$emit('change', currentPage - 1)">
        ← Prev
      </AppButton>

      <!-- PERUBAHAN: Gunakan (page, index) dan :key="index" -->
      <template v-for="(page, index) in visiblePages" :key="index">
        
        <!-- PERUBAHAN: Logika Toggle Input untuk "..." -->
        <template v-if="page === '...'">
          <input
            v-if="editingIndex === index"
            :id="`jump-input-${index}`"
            v-model="jumpPage"
            type="number"
            class="w-12 h-9 text-center rounded-lg border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm appearance-none"
            @keyup.enter="submitJump"
            @blur="submitJump"
          />
          <button
            v-else
            @click="startEditing(index)"
            class="w-9 h-9 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors cursor-text"
            title="Jump to page"
          >
            …
          </button>
        </template>

        <!-- Tombol angka halaman (Tetap sama, hanya v-else-if) -->
        <button
          v-else-if="page !== '...'"
          @click="$emit('change', page as number)"
          class="w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-150"
          :class="page === currentPage
            ? 'bg-yellow-400 text-gray-900 shadow-md'
            : 'text-gray-600 hover:bg-gray-100'"
        >{{ page }}</button>
      </template>

      <AppButton variant="ghost" size="sm" :disabled="currentPage >= totalPages" @click="$emit('change', currentPage + 1)">
        Next →
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// PERUBAHAN: Import ref dan nextTick dari vue
import { ref, computed, nextTick } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  totalCount: number
}>()

const emit = defineEmits<{ change: [page: number] }>()

// --- PERUBAHAN: State dan Fungsi untuk Input "..." ---
const editingIndex = ref<number | null>(null)
const jumpPage = ref<number | string>('')

const startEditing = async (index: number) => {
  editingIndex.value = index
  jumpPage.value = '' // Kosongkan input saat mulai
  
  // Tunggu DOM merender input, lalu fokuskan kursor ke dalamnya
  await nextTick()
  const inputEl = document.getElementById(`jump-input-${index}`)
  if (inputEl) {
    inputEl.focus()
  }
}

const submitJump = () => {
  if (editingIndex.value === null) return

  const page = Number(jumpPage.value)
  // Validasi: Pastikan input adalah angka, minimal 1, dan maksimal sesuai totalPages
  if (!isNaN(page) && page >= 1 && page <= props.totalPages) {
    emit('change', page)
  }

  // Tutup kembali input menjadi "..."
  editingIndex.value = null
  jumpPage.value = ''
}
// ---------------------------------------------------

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)

  return pages
})
</script>
