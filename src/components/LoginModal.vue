<template>
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay de fondo -->
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

    <!-- Modal -->
    <div class="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Cabecera -->
      <div class="flex items-center justify-between p-5 border-b border-gray-200">
        <h3 class="text-xl font-semibold text-gray-900">
          {{ isRegisterMode ? 'Registro' : isConfirmMode ? 'Confirma tu número' : isNewPasswordMode ?
            'Cambiar contraseña' : 'Iniciar sesión' }}
        </h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Cuerpo -->
      <div class="p-5">
        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {{ errorMessage }}
        </div>

        <!-- Formulario de inicio de sesión -->
        <form v-if="!isRegisterMode && !isConfirmMode && !isNewPasswordMode" @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="phone" class="block mb-2 text-sm font-medium text-gray-700">Número de celular</label>
            <input id="phone" v-model="phone" type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="999999999" required />
            <p class="mt-1 text-xs text-gray-500">Formato: 999999999</p>
          </div>

          <div class="mb-6">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
            <input id="password" v-model="password" type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>

          <button type="submit"
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="loading">
            <span v-if="!loading">Iniciar sesión</span>
            <span v-else class="flex justify-center items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Procesando...
            </span>
          </button>

          <div class="mt-4 text-center">
            <button type="button" @click="switchToRegister" class="text-sm text-blue-600 hover:text-blue-800">
              ¿No tienes una cuenta? Regístrate
            </button>
          </div>
        </form>

        <!-- Formulario de cambio de contraseña obligatorio -->
        <form v-if="isNewPasswordMode" @submit.prevent="handleNewPasswordSubmit">
          <div class="mb-4">
            <p class="text-sm text-gray-700 mb-4">
              Tu cuenta requiere un cambio de contraseña. Por favor, crea una nueva contraseña para continuar.
            </p>
          </div>

          <div class="mb-4">
            <label for="newPassword" class="block mb-2 text-sm font-medium text-gray-700">Nueva contraseña</label>
            <input id="newPassword" v-model="newPassword" type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required minlength="8" />
            <p class="mt-1 text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
          </div>

          <div class="mb-6">
            <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-700">Confirmar
              contraseña</label>
            <input id="confirmPassword" v-model="confirmPassword" type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>

          <button type="submit"
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="loading || newPassword !== confirmPassword">
            <span v-if="!loading">Cambiar contraseña</span>
            <span v-else class="flex justify-center items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Procesando...
            </span>
          </button>
        </form>

        <!-- Formulario de registro -->
        <form v-if="isRegisterMode && !isConfirmMode" @submit.prevent="handleRegister">
          <!-- Información básica -->
          <div class="mb-4">
            <label for="registerPhone" class="block mb-2 text-sm font-medium text-gray-700">Número de celular</label>
            <input id="registerPhone" v-model="phone" type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="999999999" required />
            <p class="mt-1 text-xs text-gray-500">Formato: 999999999</p>
          </div>

          <div class="mb-6">
            <label for="registerPassword" class="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
            <input id="registerPassword" v-model="password" type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required minlength="8" />
            <p class="mt-1 text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
          </div>

          <!-- Información del perfil -->
          <div class="my-6 border-t border-gray-200 pt-6">
            <h4 class="text-sm font-medium text-gray-700 mb-4">Información personal</h4>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label for="firstName" class="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
                <input id="firstName" v-model="userInfo.firstName" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>

              <div>
                <label for="lastName" class="block mb-2 text-sm font-medium text-gray-700">Apellido</label>
                <input id="lastName" v-model="userInfo.lastName" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
            </div>

            <div class="mb-4">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-700">Email (opcional)</label>
              <input id="email" v-model="userInfo.email" type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="mb-4">
              <label for="documentNumber" class="block mb-2 text-sm font-medium text-gray-700">Documento de
                identidad</label>
              <input id="documentNumber" v-model="userInfo.documentNumber" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>
          </div>

          <button type="submit"
            class="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            :disabled="loading">
            <span v-if="!loading">Registrarse</span>
            <span v-else class="flex justify-center items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Procesando...
            </span>
          </button>

          <div class="mt-4 text-center">
            <button type="button" @click="switchToLogin" class="text-sm text-blue-600 hover:text-blue-800">
              ¿Ya tienes una cuenta? Inicia sesión
            </button>
          </div>
        </form>

        <!-- Formulario de confirmación de código -->
        <form v-if="isConfirmMode" @submit.prevent="handleConfirmation">
          <div class="mb-6">
            <label for="confirmationCode" class="block mb-2 text-sm font-medium text-gray-700">Código de
              verificación</label>
            <input id="confirmationCode" v-model="confirmationCode" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123456" required />
            <p class="mt-2 text-sm text-gray-600">
              Ingresa el código enviado a tu celular {{ maskedPhone }}
            </p>
          </div>

          <button type="submit"
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="loading">
            <span v-if="!loading">Verificar código</span>
            <span v-else class="flex justify-center items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Verificando...
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'

// Props
defineProps<{
  showModal: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'login-success'): void
  (e: 'register-success'): void
}>()

// Stores
const authStore = useAuthStore()
const profileStore = useProfileStore()

// State
const isRegisterMode = ref(false)
const isConfirmMode = ref(false)
const isNewPasswordMode = ref(false)
const phone = ref('')
const password = ref('')
const temporaryPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const confirmationCode = ref('')
const errorMessage = ref('')

// Información del perfil para registro
const userInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  documentNumber: '',
})

// Computed
const loading = computed(() => authStore.loading || profileStore.loading)

const maskedPhone = computed(() => {
  if (!phone.value) return ''
  const formatted = authStore.formatPeruPhoneNumber(phone.value)
  const lastFour = formatted.slice(-4)
  return `******${lastFour}`
})

// Methods
const closeModal = () => {
  emit('update:showModal', false)
  resetForm()
}

const resetForm = () => {
  phone.value = ''
  password.value = ''
  temporaryPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  confirmationCode.value = ''
  errorMessage.value = ''
  isRegisterMode.value = false
  isConfirmMode.value = false
  isNewPasswordMode.value = false
  userInfo.value = {
    firstName: '',
    lastName: '',
    email: '',
    documentNumber: '',
  }
}

const switchToRegister = () => {
  isRegisterMode.value = true
  isConfirmMode.value = false
  isNewPasswordMode.value = false
  errorMessage.value = ''
}

const switchToLogin = () => {
  isRegisterMode.value = false
  isConfirmMode.value = false
  isNewPasswordMode.value = false
  errorMessage.value = ''
}

const handleLogin = async () => {
  try {
    errorMessage.value = ''
    const result = await authStore.login(phone.value, password.value)

    if (result.requiresNewPassword) {
      isNewPasswordMode.value = true
      temporaryPassword.value = password.value
      // No limpiamos el número de teléfono porque lo necesitaremos
      password.value = ''
      return
    }

    if (result.isSignedIn) {
      // Intentar cargar el perfil del usuario
      await profileStore.fetchUserProfile()
      emit('login-success')
      closeModal()
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error al iniciar sesión'
  }
}

const handleNewPasswordSubmit = async () => {
  try {
    // Verificar que las contraseñas coinciden
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'Las contraseñas no coinciden'
      return
    }

    if (newPassword.value.length < 8) {
      errorMessage.value = 'La contraseña debe tener al menos 8 caracteres'
      return
    }

    errorMessage.value = ''
    const success = await authStore.completeNewPasswordChallenge(
      phone.value,
      temporaryPassword.value,
      newPassword.value
    )

    if (success) {
      // Intentar cargar el perfil del usuario
      await profileStore.fetchUserProfile()
      emit('login-success')
      closeModal()
    } else {
      errorMessage.value = 'Error al cambiar la contraseña'
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error al cambiar la contraseña'
  }
}

const handleRegister = async () => {
  try {
    errorMessage.value = ''
    const result = await authStore.register(phone.value, password.value)

    if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
      isConfirmMode.value = true
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error al registrarse'
  }
}

const handleConfirmation = async () => {
  try {
    errorMessage.value = ''
    const success = await authStore.confirmSignUp(phone.value, confirmationCode.value)

    if (success) {
      // Ya no iniciamos sesión automáticamente
      emit('register-success')
      // Mostrar mensaje de éxito y redirigir al login
      errorMessage.value = ''
      switchToLogin()
      // Mostrar mensaje de confirmación
      alert('¡Registro exitoso! Ahora puedes iniciar sesión con tu número y contraseña.')
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error al verificar el código'
  }
}
</script>
