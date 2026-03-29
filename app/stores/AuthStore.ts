import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const user = ref<{ email: string; name: string } | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  const dummyUser = {
    email: 'admin@example.com',
    password: '1234',
    name: 'Admin'
  }

  const login = (emailInput: string, passwordInput: string) => {
    if (emailInput === dummyUser.email && passwordInput === dummyUser.password) {
      user.value = { email: dummyUser.email, name: dummyUser.name }
      router.push('/')
      return true
    }
    return false
  }

  const logout = () => {
    user.value = null
    router.push('/login')
  }

  return { user, isLoggedIn, login, logout }
})