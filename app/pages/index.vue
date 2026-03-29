<template>
  <div ref="scrollContainer">
    <section class="relative min-h-screen w-full">
      <div class="flex flex-col py-40 px-20 select-none transition-all duration-1000 ease-out" :class="loaded
        ? 'translate-y-0 opacity-100'
        : '-translate-y-40 opacity-0'">
        <h1 class="uppercase text-[100px] text-[var(--primary-color)]">welcome</h1>
        <h1 class="uppercase text-[150px] text-[var(--primary-color)] -mt-20 font-bold">pokemon</h1>
      </div>
      <img src="/assets/img/pokemon.png"
        class="w-80 h-auto absolute right-20 bottom-24 transition-all duration-1000 ease-out" :class="loaded
          ? 'translate-y-0 opacity-100'
          : 'translate-y-40 opacity-0'">
    </section>

    <section class="min-h-screen py-40 px-20">
      <h1 class="text-6xl text-center uppercase font-bold text-[var(--primary-color)]">Pokemon Information</h1>
      <div class="flex items-center justify-around mt-20">
        <div class="w-[300px] h-[300px] flex items-center justify-center transition-opacity duration-500"
          :class="{ 'opacity-0': fading }">
          <img v-if="currentPokemon" :src="currentPokemon.image" class="w-full h-full object-contain">
        </div>
        <div>
          <div
            class="w-auto h-auto max-w-md mx-auto bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-8 border-yellow-400 rounded-2xl shadow-2xl px-8 py-10 transition-transform duration-500"
            :class="{ 'rotate-y-180': flipping }">
            <h2 class="text-5xl font-extrabold uppercase tracking-wide text-[var(--primary-color)] text-center">{{
              currentPokemon?.name || 'Loading...' }}
            </h2>
            <div class="flex flex-wrap justify-center gap-2 mt-4">
              <span v-for="t in currentPokemon?.types" :key="t"
                class="text-sm px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 font-semibold">
                {{ t }}
              </span>
            </div>
            <p v-if="currentPokemon" class="text-[var(--primary-color)] text-xl mt-2">
              <span class="font-semibold">HP:</span> {{ currentPokemon.hp }}
            </p>
            <p v-if="currentPokemon" class="text-[var(--primary-color)] text-xl mt-2">
              <span class="font-semibold">Attack:</span> {{ currentPokemon.attack }}
            </p>
          </div>

          <div class="mt-6 flex justify-center space-x-4">
            <button @click="prevPokemon"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105">
              ← Previous
            </button>
            <button @click="nextPokemon"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105">
              Next →
            </button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"

definePageMeta({
  layout: 'main'
})

const loaded = ref(false)

const pokemonStore = usePokemonStore()

const currentIndex = ref(0)
const flipping = ref(false)
const fading = ref(false)

const currentPokemon = computed(() =>
  pokemonStore.pokemons[currentIndex.value] || null
)

const nextPokemon = () => {
  if (!pokemonStore.pokemons.length) return
  flipping.value = true
  fading.value = true
  setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % pokemonStore.pokemons.length
    flipping.value = false
    fading.value = false
  }, 400)
}

const prevPokemon = () => {
  if (!pokemonStore.pokemons.length) return
  flipping.value = true
  fading.value = true
  setTimeout(() => {
    currentIndex.value =
      (currentIndex.value - 1 + pokemonStore.pokemons.length) %
      pokemonStore.pokemons.length
    flipping.value = false
    fading.value = false
  }, 400)
}

onMounted(async () => {
  setTimeout(() => {
    loaded.value = true
  }, 100);

  await pokemonStore.fetchPokemons(50)
  console.log(pokemonStore.pokemons);

})
</script>

<style>
.rotate-y-180 {
  transform: rotateY(180deg);
  backface-visibility: hidden;
}
</style>