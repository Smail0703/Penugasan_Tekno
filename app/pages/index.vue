<template>
  <div>
    <section
      ref="heroRef"
      class="relative min-h-screen bg-gray-900 overflow-hidden flex items-center select-none"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
      <!-- Background dot pattern -->
      <div class="absolute inset-0 opacity-5 pointer-events-none"
        style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;" />

      <!-- ── Spotlight Trails (Jejak Gerakan Biasa) ── -->
      <div
        v-for="(trail, index) in trails"
        :key="'move-' + trail.id"
        class="pointer-events-none absolute rounded-full"
        :style="{
          width: '100px',
          height: '100px',
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(250,204,21,0.15) 0%, transparent 70%)',
          opacity: (index / trails.length) * 0.6, 
        }"
      />

      <!-- ── Spotlight Click/Drag (Jejak Tahan & Geser Tertinggal 5 Detik) ── -->
      <div
        v-for="ct in clickTrails"
        :key="'click-' + ct.id"
        class="pointer-events-none absolute rounded-full"
        :style="{
          width: '100px',
          height: '100px',
          left: `${ct.x}px`,
          top: `${ct.y}px`,
          background: 'radial-gradient(circle, rgba(250,204,21,0.25) 0%, transparent 60%)',
          animation: 'pulse-out 5s ease-out forwards'
        }"
      />

      <!-- Static yellow blob -->
      <div class="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-yellow-400 rounded-full blur-3xl opacity-10 pointer-events-none" />

      <!-- Content -->
      <div class="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center w-full pointer-events-none">

        <!-- Text -->
        <div
          class="transition-all duration-1000 ease-out"
          :class="loaded ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'"
        >
          <div class="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest pointer-events-auto">
            ✦ Pokédex v2.0
          </div>
          <h1 class="text-7xl font-black text-white leading-none tracking-tighter mb-6">
            Catch<br />
            <span class="text-yellow-400">Them</span><br />
            All.
          </h1>
          <p class="text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
            Explore over 1,000 Pokémon with detailed stats, types, and artwork. Your ultimate companion for the Pokémon world.
          </p>
          <NuxtLink to="/pokemon" class="pointer-events-auto">
            <AppButton variant="primary" size="lg">Browse Pokédex →</AppButton>
          </NuxtLink>
        </div>

        <!-- Pokemon image -->
        <div
          class="flex justify-center transition-all duration-1000 delay-300 ease-out pointer-events-auto"
          :class="loaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'"
        >
          <div class="relative w-72 h-72">
            <div
              class="absolute inset-0 rounded-full pointer-events-none"
              :style="{
                background: `radial-gradient(circle, rgba(250,204,21,${glowIntensity}) 0%, transparent 70%)`,
                filter: 'blur(32px)',
                transform: `scale(${1 + glowIntensity * 0.3})`,
                transition: 'all 0.4s ease',
              }"
            />
            <Transition name="fade-pokemon" mode="out-in">
              <img
                v-if="currentPokemon?.image"
                :key="currentPokemon.id"
                :src="currentPokemon.image"
                :alt="currentPokemon.name"
                class="relative w-full h-full object-contain pointer-events-none"
                :style="{
                  filter: `drop-shadow(0 20px 40px rgba(250,204,21,${0.25 + glowIntensity * 0.5})) brightness(${1 + glowIntensity * 0.12})`,
                  transform: `scale(${1 + glowIntensity * 0.04})`,
                  transition: 'filter 0.4s ease, transform 0.4s ease',
                }"
              />
            </Transition>
          </div>
        </div>
      </div>

      <!-- Bottom info bar -->
      <div v-if="currentPokemon" class="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm border-t border-white/10 px-8 py-4 pointer-events-auto">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="text-gray-500 text-sm font-mono">#{{ String(currentPokemon.id).padStart(4, '0') }}</span>
            <span class="text-white font-bold text-lg capitalize">{{ currentPokemon.name }}</span>
            <div class="flex gap-1.5">
              <TypeBadge v-for="t in currentPokemon.types" :key="t" :type="t" />
            </div>
          </div>
          <div class="flex gap-4 text-sm text-gray-400">
            <span><span class="font-bold text-white">{{ currentPokemon.hp }}</span> HP</span>
            <span><span class="font-bold text-white">{{ currentPokemon.attack }}</span> ATK</span>
          </div>
        </div>
      </div>

      <!-- Scroll hint -->
      <div class="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs animate-bounce pointer-events-none">
        <span class="font-medium">scroll</span>
        <div class="w-0.5 h-8 bg-gray-700 rounded" />
      </div>
    </section>

    <!-- Stats section -->
    <section class="bg-white py-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-3 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label"
            class="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-yellow-300 transition-colors">
            <div class="text-5xl mb-3">{{ stat.icon }}</div>
            <div class="text-4xl font-black text-gray-900 mb-1">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import TypeBadge from '~/components/ui/TypeBadge.vue'

definePageMeta({ layout: 'main' })

const loaded       = ref(false)
const heroRef      = ref<HTMLElement | null>(null)
const pokemonStore = usePokemonStore()
const currentIndex = ref(0)
const currentPokemon = computed(() => pokemonStore.pokemons[currentIndex.value] || null)

// ── Spotlight Trail state (Jejak Gerakan) ─────────────────────
const MAX_TRAILS = 20 // Jumlah jejak gerakan
const trails = ref<{ x: number, y: number, id: number }[]>([])

// ── Spotlight Click state (Jejak Tahan & Geser) ───────────────
const clickTrails = ref<{ x: number, y: number, id: number, createdAt: number }[]>([])
let clickCounter = 0
const isMouseDown = ref(false)
let lastDropX = 0
let lastDropY = 0

// Target mouse
let targetX    = 0
let targetY    = 0
let currentX   = 0
let currentY   = 0
const isInside = ref(false)
let rafId      = 0
let trailCounter = 0

const LERP_SPEED = 0.15
const glowIntensity = ref(0.2)

// requestAnimationFrame loop
const animateSpot = () => {
  // 1. Animasi jejak gerakan (Trails)
  if (isInside.value) {
    currentX += (targetX - currentX) * LERP_SPEED
    currentY += (targetY - currentY) * LERP_SPEED

    trails.value.push({ x: currentX, y: currentY, id: trailCounter++ })

    if (trails.value.length > MAX_TRAILS) {
      trails.value.shift()
    }

    if (heroRef.value) {
      const rect = heroRef.value.getBoundingClientRect()
      const pkCx = rect.width  * 0.75
      const pkCy = rect.height * 0.50
      const dx   = currentX - pkCx
      const dy   = currentY - pkCy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const prox = Math.max(0, 1 - dist / 380)
      glowIntensity.value += (0.2 + prox * 0.8 - glowIntensity.value) * 0.08
    }
  } else {
    if (trails.value.length > 0) {
      trails.value.shift()
    }
  }

  // 2. Pembersihan elemen jejak klik dari DOM setelah 5 detik
  const now = Date.now()
  for (let i = clickTrails.value.length - 1; i >= 0; i--) {
    if (now - clickTrails.value[i].createdAt >= 5000) {
      clickTrails.value.splice(i, 1) // Hapus dari memori ketika animasinya sudah selesai
    }
  }

  rafId = requestAnimationFrame(animateSpot)
}

// ── Event Handlers ───────────────────────────────────────────
const onMouseMove = (e: MouseEvent) => {
  if (!heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  targetX  = e.clientX - rect.left
  targetY  = e.clientY - rect.top
  
  if (!isInside.value) {
    currentX = targetX
    currentY = targetY
    isInside.value = true
  }

  // Logika saat kursor ditahan dan digeser (Drag)
  if (isMouseDown.value) {
    const dx = targetX - lastDropX
    const dy = targetY - lastDropY
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    // Jatuhkan jejak baru hanya jika kursor sudah bergeser sejauh 40 pixel
    if (dist > 40) {
      clickTrails.value.push({
        x: targetX,
        y: targetY,
        id: clickCounter++,
        createdAt: Date.now()
      })
      lastDropX = targetX
      lastDropY = targetY
    }
  }
}

const onMouseLeave = () => {
  isInside.value = false
  isMouseDown.value = false // Batalkan drag jika mouse keluar layar
}

const onMouseDown = (e: MouseEvent) => {
  if (!heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  
  isMouseDown.value = true
  const startX = e.clientX - rect.left
  const startY = e.clientY - rect.top

  lastDropX = startX
  lastDropY = startY

  // Jatuhkan jejak pertama
  clickTrails.value.push({
    x: startX,
    y: startY,
    id: clickCounter++,
    createdAt: Date.now()
  })
}

const onMouseUp = () => {
  isMouseDown.value = false
}

// ── Stats & carousel ───────────────────────────────────────────
const stats = [
  { icon: '🔴', value: '1,000+', label: 'Pokémon' },
  { icon: '⚡', value: '18',     label: 'Types' },
  { icon: '📊', value: '6',      label: 'Base Stats' },
]

let carouselInterval: ReturnType<typeof setInterval>

onMounted(async () => {
  setTimeout(() => (loaded.value = true), 100)
  if (!pokemonStore.pokemons.length) await pokemonStore.fetchPokemons(1)

  carouselInterval = setInterval(() => {
    if (pokemonStore.pokemons.length > 1) {
      currentIndex.value = (currentIndex.value + 1) % pokemonStore.pokemons.length
    }
  }, 3000)

  // Mulai loop animasi
  rafId = requestAnimationFrame(animateSpot)
})

onUnmounted(() => {
  clearInterval(carouselInterval)
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.fade-pokemon-enter-active, .fade-pokemon-leave-active { transition: all 0.5s ease; }
.fade-pokemon-enter-from { opacity: 0; transform: scale(0.8) translateY(20px); }
.fade-pokemon-leave-to   { opacity: 0; transform: scale(1.1) translateY(-10px); }

/* Animasi untuk jejak klik memudar dalam 5 detik */
@keyframes pulse-out {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
}
</style>