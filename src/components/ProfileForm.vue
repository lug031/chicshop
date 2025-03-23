<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">Completa tu Perfil</h2>

    <div v-if="loading" class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <form v-else @submit.prevent="saveProfile" class="space-y-6">
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        {{ successMessage }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Información básica -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-700 border-b pb-2">Información Personal</h3>

          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input id="firstName" v-model="formData.firstName" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input id="lastName" v-model="formData.lastName" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>

          <div>
            <label for="documentNumber" class="block text-sm font-medium text-gray-700 mb-1">Documento de
              identidad</label>
            <input id="documentNumber" v-model="formData.documentNumber" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" v-model="formData.email" type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input id="phone" v-model="formData.phone" type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <!-- Dirección -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-700 border-b pb-2">Dirección</h3>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input id="address" v-model="formData.address" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input id="city" v-model="formData.city" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label for="state" class="block text-sm font-medium text-gray-700 mb-1">Región/Estado</label>
            <input id="state" v-model="formData.state" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label for="zipCode" class="block text-sm font-medium text-gray-700 mb-1">Código postal</label>
            <input id="zipCode" v-model="formData.zipCode" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4 pt-4">
        <button type="button" @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>

        <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md" :disabled="loading">
          Guardar perfil
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import type { CreateProfileInput, UpdateProfileInput } from '@/types/profile.types'

// Props
defineProps<{
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancel'): void
}>()

// Stores
const authStore = useAuthStore()
const profileStore = useProfileStore()

// State
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Formulario
const formData = ref({
  id: '',
  firstName: '',
  lastName: '',
  documentNumber: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
})

// Computed
const isNew = computed(() => !profileStore.profile)

// Methods
const loadProfile = async () => {
  if (!authStore.isAuthenticated) return

  loading.value = true
  try {
    await profileStore.fetchUserProfile(true) // Forzar recarga

    if (profileStore.profile) {
      // Llenar formulario con datos existentes
      formData.value = {
        id: profileStore.profile.id,
        firstName: profileStore.profile.firstName || '',
        lastName: profileStore.profile.lastName || '',
        documentNumber: profileStore.profile.documentNumber || '',
        email: profileStore.profile.email || '',
        phone: profileStore.profile.phone || '',
        address: profileStore.profile.address || '',
        city: profileStore.profile.city || '',
        state: profileStore.profile.state || '',
        zipCode: profileStore.profile.zipCode || '',
      }
    } else {
      // Si no hay perfil pero hay usuario autenticado, prellenar el email
      formData.value.email = authStore.userEmail || '';
    }
  } catch (error) {
    errorMessage.value = 'Error al cargar el perfil'
    console.error(error)
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  if (!authStore.isAuthenticated || !authStore.user) {
    errorMessage.value = 'Debes iniciar sesión para guardar tu perfil'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (isNew.value) {
      // Crear nuevo perfil
      const profileData: CreateProfileInput = {
        userID: authStore.user.userId,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        documentNumber: formData.value.documentNumber || undefined,
        email: formData.value.email || authStore.userEmail || undefined,
        phone: formData.value.phone || '',
        address: formData.value.address || undefined,
        city: formData.value.city || undefined,
        state: formData.value.state || undefined,
        zipCode: formData.value.zipCode || undefined,
      }

      await profileStore.createProfile(profileData)
    } else {
      // Actualizar perfil existente
      const profileData: UpdateProfileInput = {
        id: formData.value.id,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        documentNumber: formData.value.documentNumber || undefined,
        email: formData.value.email || undefined,
        phone: formData.value.phone || undefined,
        address: formData.value.address || undefined,
        city: formData.value.city || undefined,
        state: formData.value.state || undefined,
        zipCode: formData.value.zipCode || undefined,
      }

      await profileStore.updateProfile(profileData)
    }

    successMessage.value = 'Perfil guardado exitosamente'
    emit('saved')
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Error al guardar el perfil'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProfile()
})
</script>
