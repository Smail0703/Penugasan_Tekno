import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Pokemon {
  id: number
  name: string
  types: string[]
  hp: number
  attack: number
  defense: number
  speed: number
  image: string
  isCustom?: boolean
}

// Tipe ringkas untuk index global (hanya nama + id, tanpa detail)
interface PokemonIndex {
  id: number
  name: string
  url: string
}

const PAGE_SIZE = 20

function getBestImage(sprites: any): string {
  return (
    sprites?.other?.['official-artwork']?.front_default ||
    sprites?.other?.home?.front_default ||
    sprites?.front_default ||
    ''
  )
}

function getIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, '').split('/')
  return parseInt(parts[parts.length - 1])
}

// Gambar dari ID langsung — tidak perlu fetch detail
function getSpriteById(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

function mapPokemon(d: any): Pokemon {
  return {
    id: d.id,
    name: d.name,
    types: d.types.map((t: any) => t.type.name),
    hp:      d.stats.find((s: any) => s.stat.name === 'hp')?.base_stat ?? 0,
    attack:  d.stats.find((s: any) => s.stat.name === 'attack')?.base_stat ?? 0,
    defense: d.stats.find((s: any) => s.stat.name === 'defense')?.base_stat ?? 0,
    speed:   d.stats.find((s: any) => s.stat.name === 'speed')?.base_stat ?? 0,
    image:   getBestImage(d.sprites),
    isCustom: false,
  }
}

export const usePokemonStore = defineStore('pokemon', () => {
  // ── Halaman aktif ──────────────────────────────────────────
  const pokemons      = ref<Pokemon[]>([])
  const loading       = ref(false)
  const error         = ref('')
  const currentPage   = ref(1)
  const totalCount    = ref(0)
  const totalPages    = computed(() => Math.ceil(totalCount.value / PAGE_SIZE))

  // ── Index global (nama+id saja, sangat ringan ~150KB) ──────
  const globalIndex   = ref<PokemonIndex[]>([])
  const indexLoaded   = ref(false)
  const indexLoading  = ref(false)

  // ── Hasil search global ────────────────────────────────────
  const searchResults     = ref<Pokemon[]>([])
  const searchLoading     = ref(false)
  const lastSearchQuery   = ref('')
  const lastTypeFilter    = ref('')

  // ── Custom CRUD ────────────────────────────────────────────
  const customPokemons = ref<Pokemon[]>([])
  const allPokemons    = computed(() => [...customPokemons.value, ...pokemons.value])

  // ── Fetch halaman normal ───────────────────────────────────
  const fetchPokemons = async (page = 1) => {
    loading.value = true
    error.value   = ''
    currentPage.value = page

    try {
      const offset = (page - 1) * PAGE_SIZE
      const res  = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`)
      const data = await res.json()
      totalCount.value = data.count

      const details = await Promise.all(
        data.results.map((p: { url: string }) =>
          fetch(p.url).then(r => r.json()).then(mapPokemon)
        )
      )
      pokemons.value = details
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch Pokémon'
    } finally {
      loading.value = false
    }
  }

  // ── Load index global (1 request, ~150KB JSON) ─────────────
  // Hanya berisi { name, url } — SANGAT cepat
  const loadGlobalIndex = async () => {
    if (indexLoaded.value || indexLoading.value) return
    indexLoading.value = true
    try {
      // Ambil total count dulu
      if (!totalCount.value) {
        const r = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1')
        totalCount.value = (await r.json()).count
      }
      const res  = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalCount.value}&offset=0`)
      const data = await res.json()
      globalIndex.value = data.results.map((p: { name: string; url: string }) => ({
        name: p.name,
        url:  p.url,
        id:   getIdFromUrl(p.url),
      }))
      indexLoaded.value = true
    } catch (err) {
      console.error('Failed to load global index', err)
    } finally {
      indexLoading.value = false
    }
  }

  // ── Search global ──────────────────────────────────────────
  // Step 1: filter index (instant, no API call)
  // Step 2: fetch detail hanya untuk hasil yang cocok (max ~20 item)
  const searchGlobal = async (query: string, typeFilter: string) => {
    lastSearchQuery.value = query
    lastTypeFilter.value  = typeFilter

    // Pastikan index sudah loaded
    if (!indexLoaded.value) await loadGlobalIndex()

    const q = query.toLowerCase().trim()

    // Filter dari index (nama saja, instant)
    let candidates = globalIndex.value.filter(p =>
      p.name.toLowerCase().includes(q) || String(p.id).includes(q)
    )

    // Batasi hasil sebelum fetch detail (ambil max 100 kandidat)
    // Ini agar tidak fetch terlalu banyak saat query pendek
    const MAX_CANDIDATES = 100
    if (candidates.length > MAX_CANDIDATES) {
      candidates = candidates.slice(0, MAX_CANDIDATES)
    }

    if (!candidates.length) {
      searchResults.value = []
      return
    }

    searchLoading.value = true

    try {
      // Fetch detail hanya untuk kandidat yang cocok nama
      // Gunakan gambar langsung dari GitHub sprites (tanpa fetch detail dulu)
      // lalu filter type setelah dapat detail
      const BATCH = 20
      const results: Pokemon[] = []

      for (let i = 0; i < candidates.length; i += BATCH) {
        const batch = candidates.slice(i, i + BATCH)
        const details = await Promise.all(
          batch.map(p => fetch(p.url).then(r => r.json()).then(mapPokemon))
        )
        // Filter type jika ada
        const filtered = typeFilter
          ? details.filter(p => p.types.includes(typeFilter))
          : details
        results.push(...filtered)
      }

      searchResults.value = results
    } catch (err) {
      console.error('Search failed', err)
    } finally {
      searchLoading.value = false
    }
  }

  // ── Search hanya berdasarkan type (tanpa keyword) ──────────
  // Strategi berbeda: kita tidak bisa filter type dari index saja
  // Jadi kita fetch semua dan filter — tapi pakai sprite URL langsung
  // agar tidak perlu fetch detail 1350 item
  const filterByType = async (typeFilter: string) => {
    if (!typeFilter) {
      searchResults.value = []
      return
    }

    if (!indexLoaded.value) await loadGlobalIndex()

    searchLoading.value = true
    lastTypeFilter.value = typeFilter
    lastSearchQuery.value = ''

    try {
      // PokéAPI punya endpoint type langsung!
      const res  = await fetch(`https://pokeapi.co/api/v2/type/${typeFilter}`)
      const data = await res.json()

      // Ambil semua pokemon dari type ini
      const pokemonList: { name: string; url: string }[] =
        data.pokemon.map((p: any) => p.pokemon)

      // Fetch detail batch 20
      const BATCH = 20
      const results: Pokemon[] = []
      for (let i = 0; i < pokemonList.length; i += BATCH) {
        const batch = pokemonList.slice(i, i + BATCH)
        const details = await Promise.all(
          batch.map(p => fetch(p.url).then(r => r.json()).then(mapPokemon))
        )
        results.push(...details)
      }

      searchResults.value = results
    } catch (err) {
      console.error('Filter by type failed', err)
    } finally {
      searchLoading.value = false
    }
  }

  // ── CRUD ──────────────────────────────────────────────────
  const addPokemon = (pokemon: Omit<Pokemon, 'id' | 'isCustom'>) => {
    customPokemons.value.unshift({ ...pokemon, id: Date.now(), isCustom: true })
  }
  const updatePokemon = (id: number, updated: Partial<Pokemon>) => {
    const idx = customPokemons.value.findIndex(p => p.id === id)
    if (idx !== -1) customPokemons.value[idx] = { ...customPokemons.value[idx], ...updated }
  }
  const deletePokemon = (id: number) => {
    customPokemons.value = customPokemons.value.filter(p => p.id !== id)
  }

  return {
    // state
    pokemons, allPokemons, customPokemons,
    loading, error, currentPage, totalCount, totalPages,
    globalIndex, indexLoaded, indexLoading,
    searchResults, searchLoading,
    // actions
    fetchPokemons, loadGlobalIndex,
    searchGlobal, filterByType,
    addPokemon, updatePokemon, deletePokemon,
  }
})