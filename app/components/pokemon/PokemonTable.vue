
<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <table class="min-w-full">
      <thead>
        <tr class="bg-gray-900 text-white">
          <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">#</th>
          <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Pokémon</th>
          <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Type</th>
          <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">HP</th>
          <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">ATK</th>
          <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">DEF</th>
          <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <SkeletonRow v-if="loading" :count="10" />
        <tr v-else-if="!pokemons.length">
          <td colspan="7" class="px-6 py-16 text-center">
            <div class="text-5xl mb-3">🔍</div>
            <p class="text-gray-500 font-medium">No Pokémon found</p>
          </td>
        </tr>
        <tr v-else v-for="pokemon in pokemons" :key="pokemon.id"
          class="group hover:bg-yellow-50 transition-colors duration-150 cursor-pointer"
          @click.stop="$emit('view', pokemon)">
          <td class="px-6 py-4 text-sm text-gray-400 font-mono">
            {{ String(pokemon.id).padStart(4, '0') }}
            <span v-if="pokemon.isCustom" class="ml-1 text-xs text-yellow-500 font-bold">✦</span>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="pokemon.image" :src="pokemon.image" :alt="pokemon.name" class="w-full h-full object-contain" />
                <span v-else class="text-lg"><img src="/assets/img/meme_under_construction.jpg" alt="Under Construction" class="w-full h-full object-contain" /></span>
              </div>
              <span class="capitalize font-semibold text-gray-800 text-sm">{{ pokemon.name }}</span>
            </div>
          </td>
          <td class="px-6 py-4"><div class="flex flex-wrap gap-1"><TypeBadge v-for="t in pokemon.types" :key="t" :type="t" /></div></td>
          <td class="px-6 py-4 text-sm font-semibold text-gray-700">{{ pokemon.hp }}</td>
          <td class="px-6 py-4 text-sm font-semibold text-gray-700">{{ pokemon.attack }}</td>
          <td class="px-6 py-4 text-sm font-semibold text-gray-700">{{ pokemon.defense }}</td>
          <td class="px-6 py-4 text-right" @click.stop>
            <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <AppButton v-if="pokemon.isCustom" variant="ghost" size="sm" @click="$emit('edit', pokemon)">✏️</AppButton>
              <AppButton v-if="pokemon.isCustom" variant="danger" size="sm" @click="$emit('delete', pokemon)">🗑️</AppButton>
              <AppButton v-if="!pokemon.isCustom" variant="ghost" size="sm" @click="$emit('view', pokemon)">👁️</AppButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '~/stores/PokemonStore'
import TypeBadge from '~/components/ui/TypeBadge.vue'
import AppButton from '~/components/ui/AppButton.vue'
import SkeletonRow from '~/components/ui/SkeletonRow.vue'

defineProps<{ pokemons: Pokemon[]; loading: boolean }>()
defineEmits<{ view: [pokemon: Pokemon]; edit: [pokemon: Pokemon]; delete: [pokemon: Pokemon] }>()
</script>