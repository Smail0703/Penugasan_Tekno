<template>
  <div
    class="w-full h-full flex justify-between px-20 py-5 items-center bg-[var(--fifth-color)] transition-all duration-1000 ease-out"
    :class="loaded ? 'translate-y-0 opacity-100' : '-translate-y-40 opacity-0'">
    <h1 class="text-xl font-bold">Pokedex</h1>
    <ul class="flex gap-8 text-xl">
      <li>
        <NuxtLink to="/" :class="isActive('/') ? 'text-orange-500 font-bold' : 'text-gray-800'">
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/pokemon" :class="isActive('/pokemon') ? 'text-orange-500 font-bold' : 'text-gray-800'">
          Pokemon
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const loaded = ref(false)
const route = useRoute()

onMounted(() => {
  setTimeout(() => {
    loaded.value = true
  }, 100)
})

// function untuk cek route aktif
const isActive = (path: string) => {
  return route.path === path
}
</script>