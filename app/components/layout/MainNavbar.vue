<template>
  <nav
    class="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-700"
    :class="loaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'"
  >
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center font-black text-gray-900 text-sm group-hover:scale-110 transition-transform">
          P
        </div>
        <span class="font-black text-gray-900 text-lg tracking-tight">Pokédex</span>
      </NuxtLink>

      <!-- Nav links -->
      <ul class="flex items-center gap-1">
        <li v-for="link in links" :key="link.to">
          <NuxtLink :to="link.to"
            class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="isActive(link.to)
              ? 'bg-yellow-400 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Logout -->
      <AppButton variant="ghost" size="sm" @click="auth.logout">
        Sign Out
      </AppButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'

const loaded = ref(false)
const route = useRoute()
const auth = useAuthStore()

onMounted(() => setTimeout(() => (loaded.value = true), 50))

const isActive = (path: string) => route.path === path

const links = [
  { to: '/', label: 'Home' },
  { to: '/pokemon', label: 'Pokémon' },
]
</script>
