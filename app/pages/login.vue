<template>
  <div class="relative min-h-screen overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-[var(--fifth-color)]">
    <!-- Left side -->
    <div :class="[
      'bg-[var(--primary-color)] flex flex-col items-center justify-center text-white p-8 transition-transform duration-700',
      successAnimation ? '-translate-x-full' : ''
    ]">
      <h1 class="text-6xl font-bold mb-4">Welcome Back!</h1>
      <p class="text-center max-w-xs text-lg">
        Silakan masuk dengan akunmu untuk melanjutkan pengalaman terbaik di website kami.
      </p>
    </div>

    <!-- Right side -->
    <div :class="[
      'flex items-center justify-center p-8 transition-transform duration-700',
      successAnimation ? 'translate-x-full' : ''
    ]">
      <div class="w-full max-w-md bg-white rounded-xl shadow-xl border p-8 relative">
        <div v-if="loading" class="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-10">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>

        <h2 class="text-4xl font-semibold mb-6 text-center">Sign In</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1" for="email">Email</label>
            <input id="email" type="email" v-model="email" required
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-gray-700 mb-1" for="password">Password</label>
            <input id="password" type="password" v-model="password" required
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit"
            class="w-full py-2 bg-[var(--primary-color)] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
            Sign In
          </button>
        </form>

        <p class="text-center text-gray-500 mt-4">
          Belum punya akun? <span class="text-blue-500">Daftar</span>
        </p>
      </div>
    </div>
    <div class="fixed inset-0 flex items-center justify-center bg-black/30" v-if="showAlert">
      <div class="bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-bounce">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const successAnimation = ref(false)
const showAlert = ref(false)

const handleLogin = async () => {
  error.value = ''
  showAlert.value = false
  loading.value = true

  await new Promise(resolve => setTimeout(resolve, 1000))

  const success = auth.login(email.value, password.value)

  loading.value = false

  if (success) {
    successAnimation.value = true

    setTimeout(() => {
    }, 1000)
  } else {
    error.value = 'Email atau password salah'
    showAlert.value = true

    setTimeout(() => (showAlert.value = false), 2000)
  }
}
</script>