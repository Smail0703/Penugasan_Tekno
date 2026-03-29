<template>
  <div class="min-h-screen bg-gray-900 flex overflow-hidden">
    <!-- Left: Branding -->
    <div
      class="hidden md:flex flex-col items-center justify-center w-1/2 bg-gray-900 relative p-12 transition-all duration-700"
      :class="successAnimation ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'"
    >
      <!-- Decorative circles -->
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />

      <div class="relative text-center">
        <div class="w-20 h-20 rounded-2xl bg-yellow-400 flex items-center justify-center font-black text-gray-900 text-3xl mx-auto mb-8 shadow-2xl shadow-yellow-400/20">P</div>
        <h1 class="text-5xl font-black text-white leading-tight mb-4">
          Pokédex<br /><span class="text-yellow-400">World</span>
        </h1>
        <p class="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
          Your ultimate companion for exploring the Pokémon universe. Thousands of Pokémon at your fingertips.
        </p>
        <div class="flex items-center justify-center gap-2 mt-8 text-xs text-gray-600 font-medium uppercase tracking-widest">
          <span>v2.0</span>
          <span>·</span>
          <span>Powered by PokéAPI</span>
        </div>
      </div>
    </div>

    <!-- Right: Form -->
    <div
      class="flex items-center justify-center w-full md:w-1/2 bg-white p-8 transition-all duration-700"
      :class="successAnimation ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'"
    >
      <div class="w-full max-w-md">
        <div class="mb-8">
          <h2 class="text-3xl font-black text-gray-900">Sign in</h2>
          <p class="text-gray-500 text-sm mt-1">Enter your credentials to continue</p>
        </div>

        <!-- Demo credentials hint -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 text-sm">
          <p class="font-semibold text-yellow-800 mb-1">Demo credentials:</p>
          <p class="text-yellow-700 font-mono">admin@example.com / 1234</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-shadow"
              :class="{ 'border-red-400 focus:ring-red-400': formError }"
              @keyup.enter="handleLogin"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                :placeholder="showPass ? '1234' : '••••••••'"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent pr-10 transition-shadow"
                :class="{ 'border-red-400 focus:ring-red-400': formError }"
                @keyup.enter="handleLogin"
              />
              <button type="button" @click="showPass = !showPass"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                {{ showPass ? '🔑' : '🔒' }}
              </button>
            </div>
          </div>

          <Transition name="slide-down">
            <p v-if="formError" class="text-red-500 text-xs font-medium">{{ formError }}</p>
          </Transition>

          <AppButton
            variant="primary"
            size="lg"
            :loading="loading"
            class="w-full justify-center mt-2"
            @click="handleLogin"
          >
            Sign In
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'

definePageMeta({ layout: false })

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const formError = ref('')
const loading = ref(false)
const successAnimation = ref(false)
const showPass = ref(false)

const handleLogin = async () => {
  formError.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 800))

  const ok = auth.login(email.value, password.value)
  loading.value = false

  if (ok) {
    successAnimation.value = true
  } else {
    formError.value = 'Invalid email or password.'
  }
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
