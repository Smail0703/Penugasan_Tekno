import { defineStore } from "pinia";
import { ref } from "vue";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  hp: number;
  attack: number;
  image: string;
}

export const usePokemonStore = defineStore("pokemon", () => {
  const pokemons = ref<Pokemon[]>([]);
  const loading = ref(false);
  const error = ref("");

  const fetchPokemons = async (limit = 20) => {
    loading.value = true;
    error.value = "";
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
      );
      const data = await res.json();

      const details = await Promise.all(
        data.results.map(async (p: any) => {
          const detailRes = await fetch(p.url);
          const detailData = await detailRes.json();

          return {
            id: detailData.id,
            name: detailData.name,
            types: detailData.types.map((t: any) => t.type.name),
            hp:
              detailData.stats.find((s: any) => s.stat.name === "hp")
                ?.base_stat ?? 0,
            attack:
              detailData.stats.find((s: any) => s.stat.name === "attack")
                ?.base_stat ?? 0,
            image:
              detailData.sprites.other["official-artwork"].front_default || "", // ambil gambar resmi
          } as Pokemon;
        })
      );

      pokemons.value = details;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch Pokémon";
    } finally {
      loading.value = false;
    }
  };

  return { pokemons, loading, error, fetchPokemons };
});