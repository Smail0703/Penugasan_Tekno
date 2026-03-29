<template>
  <div class="max-w-7xl mx-auto px-6 py-10">

    <!-- ── Header ────────────────────────────────────────────── -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tight">Pokédex</h1>
        <p class="text-gray-500 text-sm mt-1">
          <template v-if="isFiltering && store.searchLoading">
            <span class="text-yellow-600">🔍 Searching…</span>
          </template>
          <template v-else-if="store.loading && !isFiltering">
            Loading Pokémon…
          </template>
          <template v-else>
            <span class="font-semibold text-gray-700">{{ filteredTotal }}</span> results
            <span v-if="isFiltering" class="text-gray-400"> · global search</span>
            <span v-if="store.customPokemons.length" class="text-yellow-600 font-semibold">
              · {{ store.customPokemons.length }} custom ✦
            </span>
          </template>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search all Pokémon…"
            class="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white w-56
                   focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            @input="handleSearchInput"
          />
          <button v-if="searchQuery" @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold">✕</button>
        </div>

        <!-- Type filter -->
        <select v-model="typeFilter" @change="handleTypeChange"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                 focus:outline-none focus:ring-2 focus:ring-yellow-400">
          <option value="">All Types</option>
          <option v-for="t in POKEMON_TYPES" :key="t" class="capitalize">{{ t }}</option>
        </select>

        <!-- Sort -->
        <select v-model="sortBy"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white
                 focus:outline-none focus:ring-2 focus:ring-yellow-400">
          <option value="id">Sort: ID</option>
          <option value="name">Sort: Name</option>
          <option value="hp">Sort: HP</option>
          <option value="attack">Sort: Attack</option>
        </select>

        <!-- View toggle -->
        <div class="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button v-for="v in views" :key="v.key" @click="activeView = v.key"
            class="px-3 py-2.5 text-sm transition-colors"
            :class="activeView === v.key
              ? 'bg-yellow-400 text-gray-900 font-semibold'
              : 'text-gray-500 hover:bg-gray-50'">
            {{ v.icon }}
          </button>
        </div>

        <AppButton variant="primary" @click="showAddModal = true">+ Add</AppButton>
      </div>
    </div>

    <!-- ── Index loading bar ─────────────────────────────────── -->
    <Transition name="slide-down">
      <div v-if="store.indexLoading"
        class="mb-4 flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm">
        <span class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0"></span>
        Loading Pokémon index… (one-time)
      </div>
    </Transition>

    <!-- ── Error ──────────────────────────────────────────────── -->
    <Transition name="slide-down">
      <div v-if="store.error"
        class="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
        <span>⚠️</span>
        <span class="flex-1">{{ store.error }}</span>
        <AppButton variant="danger" size="sm" @click="store.fetchPokemons(store.currentPage)">Retry</AppButton>
      </div>
    </Transition>

    <!-- ── Content ────────────────────────────────────────────── -->
    <Transition name="view-switch" mode="out-in">
      <!-- GRID -->
      <div v-if="activeView === 'grid'" key="grid">
        <div v-if="isLoadingAny" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div v-for="i in PAGE_SIZE" :key="i" class="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
            <div class="h-3 bg-gray-100 rounded w-10 mb-3"></div>
            <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-3"></div>
            <div class="h-4 bg-gray-100 rounded w-20 mx-auto mb-2"></div>
            <div class="flex justify-center gap-1"><div class="h-5 w-14 bg-gray-100 rounded-full"></div></div>
          </div>
        </div>

        <div v-else-if="!pagedList.length"
          class="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <p class="text-5xl mb-4">🔍</p>
          <p class="font-bold text-gray-700">No Pokémon found</p>
          <p class="text-gray-400 text-sm mt-1">Try a different name or type</p>
          <AppButton variant="ghost" size="sm" class="mt-4" @click="resetFilters">Clear filters</AppButton>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <PokemonCard
            v-for="pokemon in pagedList"
            :key="pokemon.id"
            :pokemon="pokemon"
            @click="openDetail"
            @edit="openEdit"
            @delete="confirmDelete"
          />
        </div>
      </div>

      <!-- TABLE -->
      <div v-else key="table">
        <PokemonTable
          :pokemons="pagedList"
          :loading="isLoadingAny"
          @view="openDetail"
          @edit="openEdit"
          @delete="confirmDelete"
        />
      </div>
    </Transition>

    <!-- ── Pagination ─────────────────────────────────────────── -->
    <!-- Mode API normal -->
    <Pagination
      v-if="!isFiltering && !store.loading && store.totalPages > 1"
      :current-page="store.currentPage"
      :total-pages="store.totalPages"
      :total-count="store.totalCount"
      class="mt-8"
      @change="changeApiPage"
    />

    <!-- Mode filter/search — pagination lokal -->
    <Pagination
      v-if="isFiltering && !store.searchLoading && localTotalPages > 1"
      :current-page="localPage"
      :total-pages="localTotalPages"
      :total-count="filteredTotal"
      class="mt-8"
      @change="changeLocalPage"
    />

    <!-- ── Modals ──────────────────────────────────────────────── -->
    <PokemonDetailModal v-model="showDetail" :pokemon="selectedPokemon" />
    <PokemonFormModal v-model="showAddModal" @submit="handleAdd" />
    <PokemonFormModal v-model="showEditModal" :pokemon="editingPokemon" @submit="handleEdit" />

    <!-- Delete confirm -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteConfirm = false" />
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
            <h3 class="text-lg font-black text-gray-900 mb-1">Delete Pokémon?</h3>
            <p class="text-gray-500 text-sm mb-6">
              Remove <span class="font-bold capitalize">{{ deletingPokemon?.name }}</span>? This cannot be undone.
            </p>
            <div class="flex gap-3 justify-center">
              <AppButton variant="ghost" @click="showDeleteConfirm = false">Cancel</AppButton>
              <AppButton variant="danger" @click="executeDelete">Yes, Delete</AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '~/stores/PokemonStore'
import { useToast } from '~/composables/useToast'
import AppButton from '~/components/ui/AppButton.vue'
import PokemonTable from '~/components/pokemon/PokemonTable.vue'
import PokemonCard from '~/components/pokemon/PokemonCard.vue'
import PokemonDetailModal from '~/components/pokemon/PokemonDetailModal.vue'
import PokemonFormModal from '~/components/pokemon/PokemonFormModal.vue'
import Pagination from '~/components/ui/Pagination.vue'

definePageMeta({ layout: 'main' })

const store = usePokemonStore()
const toast = useToast()

const PAGE_SIZE = 20

// ── View ──────────────────────────────────────────────────────
type ViewKey = 'grid' | 'table'
const views = [{ key: 'grid' as ViewKey, icon: '⊞' }, { key: 'table' as ViewKey, icon: '☰' }]
const activeView = ref<ViewKey>('grid')

// ── Filters ───────────────────────────────────────────────────
const searchQuery = ref('')
const typeFilter  = ref('')
const sortBy      = ref<'id' | 'name' | 'hp' | 'attack'>('id')

const POKEMON_TYPES = [
  'fire','water','grass','electric','psychic','ice','dragon','dark',
  'fairy','fighting','poison','ground','rock','bug','ghost','steel','normal','flying',
]

// ── Pagination lokal (untuk hasil filter/search) ──────────────
const localPage = ref(1)

const isFiltering  = computed(() => !!searchQuery.value || !!typeFilter.value)
const isLoadingAny = computed(() =>
  (store.loading && !isFiltering.value) || store.searchLoading
)

// Semua hasil filter/search yang sudah di-sort (belum dipaginasi)
const sortedFilteredList = computed(() => {
  const base = isFiltering.value
    ? [...store.customPokemons, ...store.searchResults]
    : store.allPokemons

  const list = [...base]
  list.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    return (a[sortBy.value] as number) - (b[sortBy.value] as number)
  })
  return list
})

const filteredTotal  = computed(() => sortedFilteredList.value.length)
const localTotalPages = computed(() => Math.ceil(filteredTotal.value / PAGE_SIZE))

// Slice untuk halaman aktif (pagination lokal)
const pagedList = computed(() => {
  if (!isFiltering.value) return sortedFilteredList.value // API pagination sudah handle ini
  const start = (localPage.value - 1) * PAGE_SIZE
  return sortedFilteredList.value.slice(start, start + PAGE_SIZE)
})

// Reset ke halaman 1 setiap kali filter/search berubah
watch([() => store.searchResults, typeFilter, searchQuery], () => {
  localPage.value = 1
})

// ── Handlers ─────────────────────────────────────────────────
let searchTimer: ReturnType<typeof setTimeout>

const handleSearchInput = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    if (!searchQuery.value && !typeFilter.value) return
    if (searchQuery.value) {
      await store.searchGlobal(searchQuery.value, typeFilter.value)
    } else if (typeFilter.value) {
      await store.filterByType(typeFilter.value)
    }
  }, 400)
}

const handleTypeChange = async () => {
  if (!typeFilter.value && !searchQuery.value) return
  if (typeFilter.value && !searchQuery.value) {
    await store.filterByType(typeFilter.value)
  } else if (searchQuery.value) {
    await store.searchGlobal(searchQuery.value, typeFilter.value)
  }
}

const clearSearch = async () => {
  searchQuery.value = ''
  if (typeFilter.value) await store.filterByType(typeFilter.value)
}

const resetFilters = () => {
  searchQuery.value = ''
  typeFilter.value  = ''
}

// ── Pagination handlers ───────────────────────────────────────
const changeApiPage = async (page: number) => {
  await store.fetchPokemons(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const changeLocalPage = (page: number) => {
  localPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Modal state ───────────────────────────────────────────────
const selectedPokemon   = ref<Pokemon | null>(null)
const editingPokemon    = ref<Pokemon | null>(null)
const deletingPokemon   = ref<Pokemon | null>(null)
const showDetail        = ref(false)
const showAddModal      = ref(false)
const showEditModal     = ref(false)
const showDeleteConfirm = ref(false)

const openDetail    = (p: Pokemon) => { selectedPokemon.value = p; showDetail.value = true }
const openEdit      = (p: Pokemon) => { editingPokemon.value = p;  showEditModal.value = true }
const confirmDelete = (p: Pokemon) => { deletingPokemon.value = p; showDeleteConfirm.value = true }

// ── CRUD ──────────────────────────────────────────────────────
const handleAdd = (data: Omit<Pokemon, 'id' | 'isCustom'>) => {
  store.addPokemon(data)
  toast.success(`✦ ${data.name} added!`)
}
const handleEdit = (data: Omit<Pokemon, 'id' | 'isCustom'>) => {
  if (!editingPokemon.value) return
  store.updatePokemon(editingPokemon.value.id, data)
  toast.success(`${data.name} updated!`)
  editingPokemon.value = null
}
const executeDelete = () => {
  if (!deletingPokemon.value) return
  store.deletePokemon(deletingPokemon.value.id)
  toast.info(`${deletingPokemon.value.name} removed.`)
  showDeleteConfirm.value = false
  deletingPokemon.value = null
}

onMounted(() => {
  store.fetchPokemons(1)
  store.loadGlobalIndex() // pre-load index di background
})
</script>

<style scoped>
.view-switch-enter-active, .view-switch-leave-active { transition: all 0.2s ease; }
.view-switch-enter-from  { opacity: 0; transform: translateY(8px); }
.view-switch-leave-to    { opacity: 0; transform: translateY(-8px); }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>