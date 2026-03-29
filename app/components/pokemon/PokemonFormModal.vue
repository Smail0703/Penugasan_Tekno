<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-5 flex items-center justify-between">
            <h2 class="text-xl font-black text-gray-900 uppercase tracking-wide">
              {{ isEdit ? '✏️ Edit Pokémon' : '➕ Add Custom Pokémon' }}
            </h2>
            <button @click="$emit('update:modelValue', false)"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/50 text-gray-800 font-bold transition-colors text-lg">
              ×
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
                <input v-model="form.name" type="text" placeholder="e.g. Pikachu"
                  class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                <input v-model="form.image" type="url" placeholder="https://..."
                  class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Types (comma separated) *</label>
                <input v-model="typesInput" type="text" placeholder="fire, flying"
                  class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
              </div>
              <div v-for="stat in ['hp','attack','defense','speed']" :key="stat">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{{ stat }}</label>
                <input v-model.number="(form as any)[stat]" type="number" min="1" max="255"
                  class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
              </div>
            </div>

            <p v-if="formError" class="text-red-500 text-xs font-medium">{{ formError }}</p>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-6 flex justify-end gap-3">
            <AppButton variant="ghost" @click="$emit('update:modelValue', false)">Cancel</AppButton>
            <AppButton variant="primary" @click="handleSubmit">
              {{ isEdit ? 'Save Changes' : 'Add Pokémon' }}
            </AppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Pokemon } from '~/stores/PokemonStore'
import AppButton from '~/components/ui/AppButton.vue'

const props = defineProps<{
  modelValue: boolean
  pokemon?: Pokemon | null
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  submit: [data: Omit<Pokemon, 'id' | 'isCustom'>]
}>()

const isEdit = computed(() => !!props.pokemon)

const defaultForm = () => ({ name: '', image: '', hp: 50, attack: 50, defense: 50, speed: 50 })
const form = reactive(defaultForm())
const typesInput = ref('')
const formError = ref('')

watch(() => props.modelValue, (val) => {
  if (val) {
    if (props.pokemon) {
      Object.assign(form, props.pokemon)
      typesInput.value = props.pokemon.types.join(', ')
    } else {
      Object.assign(form, defaultForm())
      typesInput.value = ''
    }
    formError.value = ''
  }
})

const handleSubmit = () => {
  if (!form.name.trim()) { formError.value = 'Name is required'; return }
  const types = typesInput.value.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
  if (!types.length) { formError.value = 'At least one type is required'; return }
  formError.value = ''

  emit('submit', { ...form, types })
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>
