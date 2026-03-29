<template>
  <span
    class="inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border"
    :class="typeClass"
  >{{ type }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ type: string }>()

const typeColors: Record<string, string> = {
  fire:     'bg-orange-100 text-orange-700 border-orange-300',
  water:    'bg-blue-100 text-blue-700 border-blue-300',
  grass:    'bg-green-100 text-green-700 border-green-300',
  electric: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  psychic:  'bg-pink-100 text-pink-700 border-pink-300',
  ice:      'bg-cyan-100 text-cyan-700 border-cyan-300',
  dragon:   'bg-indigo-100 text-indigo-700 border-indigo-300',
  dark:     'bg-gray-800 text-gray-100 border-gray-600',
  fairy:    'bg-rose-100 text-rose-600 border-rose-300',
  fighting: 'bg-red-100 text-red-700 border-red-300',
  poison:   'bg-purple-100 text-purple-700 border-purple-300',
  ground:   'bg-amber-100 text-amber-700 border-amber-300',
  rock:     'bg-stone-100 text-stone-700 border-stone-300',
  bug:      'bg-lime-100 text-lime-700 border-lime-300',
  ghost:    'bg-violet-100 text-violet-700 border-violet-300',
  steel:    'bg-slate-100 text-slate-700 border-slate-300',
  normal:   'bg-gray-100 text-gray-600 border-gray-300',
  flying:   'bg-sky-100 text-sky-600 border-sky-300',
}

const typeClass = computed(() => typeColors[props.type] ?? 'bg-gray-100 text-gray-600 border-gray-300')
</script>
