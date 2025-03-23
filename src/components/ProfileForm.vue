<template>
  <div class="bg-white rounded-lg overflow-auto max-h-[90vh] w-full">
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
    </div>

    <form v-else @submit.prevent="saveProfile" class="p-6 space-y-6">
      <div v-if="errorMessage" class="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-md">
        {{ successMessage }}
      </div>

      <!-- Información Personal -->
      <div class="mb-6 border-b border-gray-200 pb-4">
        <h3 class="text-lg font-medium text-gray-700 mb-4">Información Personal</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="firstName" class="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
            <input id="firstName" v-model="formData.firstName" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              required />
          </div>

          <div>
            <label for="lastName" class="block mb-2 text-sm font-medium text-gray-700">Apellido</label>
            <input id="lastName" v-model="formData.lastName" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              required />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="documentNumber" class="block mb-2 text-sm font-medium text-gray-700">Documento de
              identidad</label>
            <input id="documentNumber" v-model="formData.documentNumber" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black" />
          </div>

          <div>
            <label for="phone" class="block mb-2 text-sm font-medium text-gray-700">Teléfono</label>
            <input id="phone" v-model="formData.phone" type="tel"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black" />
            <p class="mt-1 text-xs text-gray-500">Formato: 999999999</p>
          </div>
        </div>

        <div class="mb-4">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input id="email" v-model="formData.email" type="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black" />
        </div>
      </div>

      <!-- Dirección -->
      <div class="mb-6">
        <h3 class="text-lg font-medium text-gray-700 mb-4">Dirección</h3>

        <div class="mb-4">
          <label for="address" class="block mb-2 text-sm font-medium text-gray-700">Dirección</label>
          <input id="address" v-model="formData.address" type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="city" class="block mb-2 text-sm font-medium text-gray-700">Ciudad</label>
            <input id="city" v-model="formData.city" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black" />
          </div>

          <div>
            <label for="state" class="block mb-2 text-sm font-medium text-gray-700">Región/Estado</label>
            <input id="state" v-model="formData.state" type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black" />
          </div>
        </div>

        <div>
          <label for="zipCode" class="block mb-2 text-sm font-medium text-gray-700">Código postal</label>
          <input id="zipCode" v-model="formData.zipCode" type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black" />
        </div>
      </div>

      <div class="flex justify-end space-x-4 pt-4">
        <button type="button" @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
          Cancelar
        </button>

        <button type="submit"
          class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
          :disabled="loading">
          <span v-if="!loading">Guardar perfil</span>
          <span v-else class="flex justify-center items-center">
            <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Procesando...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useRouter, useRoute } from 'vue-router'
import type { CreateProfileInput, UpdateProfileInput } from '@/types/profile.types'

// Props
const props = defineProps<{
  isEditing?: boolean
  isNewUser?: boolean  // Para identificar si viene de cambio de contraseña
  showInModal?: boolean // Para diferenciar entre modal y vista completa
}>()

const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancel'): void
  (e: 'profile-completed'): void
}>()

// Router
const router = useRouter()
const route = useRoute()

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
    // Asegurarnos de que el teléfono tenga un valor (es requerido en el modelo)
    // Si no hay teléfono, usamos el email como valor de respaldo
    const phoneValue = formData.value.phone || authStore.userEmail || '';

    if (isNew.value) {
      // Crear nuevo perfil
      const profileData: CreateProfileInput = {
        userID: authStore.user.userId,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        documentNumber: formData.value.documentNumber || undefined,
        email: formData.value.email || authStore.userEmail || undefined,
        phone: phoneValue, // Garantizamos que phone siempre tenga un valor
        address: formData.value.address || undefined,
        city: formData.value.city || undefined,
        state: formData.value.state || undefined,
        zipCode: formData.value.zipCode || undefined,
      }

      console.log('Creando perfil con datos:', profileData);
      await profileStore.createProfile(profileData)
    } else {
      // Actualizar perfil existente
      const profileData: UpdateProfileInput = {
        id: formData.value.id,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        documentNumber: formData.value.documentNumber || undefined,
        email: formData.value.email || undefined,
        phone: phoneValue, // Garantizamos que phone siempre tenga un valor
        address: formData.value.address || undefined,
        city: formData.value.city || undefined,
        state: formData.value.state || undefined,
        zipCode: formData.value.zipCode || undefined,
      }

      await profileStore.updateProfile(profileData)
    }

    successMessage.value = 'Perfil guardado exitosamente'

    // Emitir el evento apropiado según el contexto
    if (props.isNewUser) {
      emit('profile-completed')

      // Si estamos en una ruta de redirección, navegar al dashboard
      if (route.query.redirect) {
        setTimeout(() => {
          router.push(route.query.redirect as string)
        }, 1000)
      } else if (!props.showInModal) {
        // Si no es un modal, redirigir al dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } else {
      emit('saved')
    }
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Error al guardar el perfil'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Watch para recargar datos si cambia el estado de autenticación
watch(() => authStore.isAuthenticated, (newValue) => {
  if (newValue) {
    loadProfile();
  }
}, { immediate: true });

// Lifecycle
onMounted(() => {
  // Forzar comprobación de autenticación para formularios independientes
  if (!props.showInModal) {
    authStore.checkAuth().then(() => {
      if (authStore.isAuthenticated) {
        loadProfile();
      } else if (route.path === '/profile') {
        // Si estamos en la ruta de perfil pero no estamos autenticados
        router.push({
          path: '/',
          query: { showLogin: 'true', redirect: route.fullPath }
        });
      }
    });
  } else {
    // Para modales, depender del watcher
    loadProfile();
  }
})
</script>
