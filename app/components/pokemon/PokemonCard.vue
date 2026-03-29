<template>
  <div
    class="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer
           hover:border-yellow-300 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
    @click="$emit('click', pokemon)"
  >
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="typeGradient" />
    <div class="relative p-5">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-mono text-gray-400">#{{ String(pokemon.id).padStart(4, '0') }}</span>
        <span v-if="pokemon.isCustom"
          class="text-xs font-bold text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">✦ Custom</span>
      </div>
      <div class="w-28 h-28 mx-auto my-3 relative">
        <div class="absolute inset-0 bg-gray-50 rounded-full opacity-60" />
        <img v-if="pokemon.image" :src="pokemon.image" :alt="pokemon.name"
          class="relative w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
          loading="lazy" />
        <div v-else class="relative w-full h-full flex items-center justify-center text-4xl"><img src="/assets/img/meme_under_construction.jpg" alt="Under Construction" class="w-full h-full object-contain" /></div>
      </div>
      <h3 class="text-center font-black capitalize text-gray-900 text-sm tracking-tight mb-2.5">{{ pokemon.name }}</h3>
      <div class="flex flex-wrap justify-center gap-1">
        <TypeBadge v-for="t in pokemon.types" :key="t" :type="t" />
      </div>
      <div class="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
        <div class="text-center">
          <p class="text-xs text-gray-400 font-medium">HP</p>
          <p class="text-sm font-black text-gray-800">{{ pokemon.hp }}</p>
        </div>
        <div class="text-center">
          <p class="text-xs text-gray-400 font-medium">ATK</p>
          <p class="text-sm font-black text-gray-800">{{ pokemon.attack }}</p>
        </div>
      </div>
    </div>
    <div v-if="pokemon.isCustom" class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button @click.stop="$emit('edit', pokemon)"
        class="w-7 h-7 rounded-lg bg-white shadow-md flex items-center justify-center text-xs hover:bg-yellow-50 border border-gray-100 transition-colors">✏️</button>
      <button @click.stop="$emit('delete', pokemon)"
        class="w-7 h-7 rounded-lg bg-white shadow-md flex items-center justify-center text-xs hover:bg-red-50 border border-gray-100 transition-colors">🗑️</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '~/stores/PokemonStore'
import TypeBadge from '~/components/ui/TypeBadge.vue'

const props = defineProps<{ pokemon: Pokemon }>()
defineEmits<{ click: [pokemon: Pokemon]; edit: [pokemon: Pokemon]; delete: [pokemon: Pokemon] }>()

const typeGradientMap: Record<string, string> = {
  fire:     'bg-gradient-to-br from-orange-50 to-red-50',
  water:    'bg-gradient-to-br from-blue-50 to-cyan-50',
  grass:    'bg-gradient-to-br from-green-50 to-emerald-50',
  electric: 'bg-gradient-to-br from-yellow-50 to-amber-50',
  psychic:  'bg-gradient-to-br from-pink-50 to-rose-50',
  ice:      'bg-gradient-to-br from-cyan-50 to-sky-50',
  dragon:   'bg-gradient-to-br from-indigo-50 to-violet-50',
  dark:     'bg-gradient-to-br from-gray-100 to-slate-100',
  fairy:    'bg-gradient-to-br from-rose-50 to-pink-50',
  fighting: 'bg-gradient-to-br from-red-50 to-orange-50',
  poison:   'bg-gradient-to-br from-purple-50 to-violet-50',
  ground:   'bg-gradient-to-br from-amber-50 to-yellow-50',
  ghost:    'bg-gradient-to-br from-violet-50 to-purple-50',
  steel:    'bg-gradient-to-br from-slate-50 to-gray-50',
  bug:      'bg-gradient-to-br from-lime-50 to-green-50',
  flying:   'bg-gradient-to-br from-sky-50 to-blue-50',
  rock:     'bg-gradient-to-br from-stone-50 to-amber-50',
  normal:   'bg-gradient-to-br from-gray-50 to-slate-50',
}

const typeGradient = computed(() =>
  typeGradientMap[props.pokemon.types[0]] ?? 'bg-gradient-to-br from-gray-50 to-white'
)
</script>