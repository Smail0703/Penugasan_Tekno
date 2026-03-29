<template>
  <div class="p-8 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">Daftar Pokémon</h1>

    <input v-model="searchQuery" type="text" placeholder="Cari Pokémon..."
      class="mb-4 w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

    <div v-if="pokemonStore.loading" class="text-center py-8">Loading...</div>
    <div v-else-if="pokemonStore.error" class="text-red-500">{{ pokemonStore.error }}</div>
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-yellow-500 text-white">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold">ID</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Type</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">HP</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Attack</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="pokemon in filteredPokemons" :key="pokemon.id"
            class="hover:bg-gray-100 cursor-pointer transition-colors" @click="openModal(pokemon)">
            <td class="px-6 py-4">{{ pokemon.id }}</td>
            <td class="px-6 py-4 capitalize">{{ pokemon.name }}</td>
            <td class="px-6 py-4">
              <span v-for="type in pokemon.types" :key="type" class="mr-1 px-2 py-1 bg-gray-200 rounded">
                {{ type }}
              </span>
            </td>
            <td class="px-6 py-4">{{ pokemon.hp }}</td>
            <td class="px-6 py-4">{{ pokemon.attack }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-4xl">
          &times;
        </button>
        <h2 class="text-2xl font-bold mb-4 capitalize">{{ selectedPokemon?.name }}</h2>
        <p><strong>Type:</strong> <span v-for="t in selectedPokemon?.types" :key="t" class="mr-1">{{ t }}</span></p>
        <p><strong>HP:</strong> {{ selectedPokemon?.hp }}</p>
        <p><strong>Attack:</strong> {{ selectedPokemon?.attack }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'main'
})

const pokemonStore = usePokemonStore()

const searchQuery = ref('')
const selectedPokemon = ref<any>(null)
const showModal = ref(false)

onMounted(() => {
  pokemonStore.fetchPokemons(50)
})

const filteredPokemons = computed(() => {
  if (!searchQuery.value) return pokemonStore.pokemons
  return pokemonStore.pokemons.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const openModal = (pokemon: any) => {
  selectedPokemon.value = pokemon
  showModal.value = true
}

const closeModal = () => {
  selectedPokemon.value = null
  showModal.value = false
}
</script>