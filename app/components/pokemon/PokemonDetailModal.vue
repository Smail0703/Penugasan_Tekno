<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue && pokemon" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <!-- Top gradient section with image -->
          <div class="bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 px-6 pt-6 pb-0 text-center relative">
            <button @click="$emit('update:modelValue', false)"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/60 font-bold text-lg transition-colors">
              ×
            </button>
            <div class="w-40 h-40 mx-auto">
              <img v-if="pokemon.image" :src="pokemon.image" :alt="pokemon.name"
                class="w-full h-full object-contain drop-shadow-2xl" />
              <div v-else class="w-full h-full flex items-center justify-center text-6xl"><img src="/assets/img/meme_under_construction.jpg" alt="Under Construction" class="w-full h-full object-contain" /></div>
            </div>
          </div>

          <!-- Info -->
          <div class="px-6 py-5">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-3xl font-black capitalize tracking-tight text-gray-900">{{ pokemon.name }}</h2>
              <span class="text-sm font-bold text-gray-400">#{{ String(pokemon.id).padStart(4, '0') }}</span>
            </div>

            <div class="flex flex-wrap gap-1.5 mb-5">
              <TypeBadge v-for="t in pokemon.types" :key="t" :type="t" />
            </div>

            <!-- Stats -->
            <div class="space-y-3">
              <StatBar label="HP" :value="pokemon.hp" color="bg-green-400" />
              <StatBar label="Attack" :value="pokemon.attack" color="bg-red-400" />
              <StatBar label="Defense" :value="pokemon.defense" color="bg-blue-400" />
              <StatBar label="Speed" :value="pokemon.speed" color="bg-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Pokemon } from '~/stores/PokemonStore'
import TypeBadge from '~/components/ui/TypeBadge.vue'
import StatBar from '~/components/pokemon/StatBar.vue'

defineProps<{ modelValue: boolean; pokemon: Pokemon | null }>()
defineEmits<{ 'update:modelValue': [val: boolean] }>()
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>
