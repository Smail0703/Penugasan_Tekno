// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  app: {
    baseURL: "/",
    head: {
      title: "Himakom Pokedex",
      link: [{ rel: "icon", type: "image/png", href: "/assets/img/pokemon.png" }],
    },
  },

  nitro: {
    preset: "static",
  },

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss"
  ],

  css: ["./app/assets/css/main.css"],
});
