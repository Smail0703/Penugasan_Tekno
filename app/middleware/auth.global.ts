import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (to.path === '/login') return

  if (!auth.isLoggedIn) {
    return navigateTo('/login')
  }
})