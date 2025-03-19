<template>
  <div>
    <!-- Botón para abrir el modal -->
    <button @click="showModal = true"
      class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
      {{ isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión' }}
    </button>

    <!-- Modal de login -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="showModal = false"></div>

        <div class="bg-white rounded-lg p-6 w-full max-w-md z-10 relative">
          <!-- Botón de cierre -->
          <button @click="showModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Encabezado del modal -->
          <h2 class="text-2xl font-bold mb-6 text-center">
            {{ isRegisterMode ? 'Crear cuenta' : (isCodeConfirmMode ? 'Verificar código' : (isNewPasswordMode ?
              'Crear nueva contraseña' : 'Iniciar sesión')) }}
          </h2>

          <!-- Formulario de login -->
          <form @submit.prevent="handleSubmit" v-if="!isCodeConfirmMode && !isNewPasswordMode">
            <!-- Campo de teléfono -->
            <div class="mb-4">
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input id="phone" v-model="phone" type="tel" placeholder="Ej: 1166778899"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required />
              <p class="text-xs text-gray-500 mt-1">Formato: +54 9 11 1234-5678 o 11 1234-5678</p>
            </div>

            <!-- Campo de contraseña -->
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input id="password" v-model="password" type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required />
            </div>

            <!-- Campo de email (solo en registro) -->
            <div v-if="isRegisterMode" class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email (opcional)</label>
              <input id="email" v-model="email" type="email" placeholder="tucorreo@ejemplo.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary" />
            </div>

            <!-- Mensaje de error -->
            <div v-if="errorMessage" class="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
              {{ errorMessage }}
            </div>

            <!-- Botón de submit -->
            <button type="submit"
              class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              :disabled="authStore.loading">
              <span v-if="authStore.loading">Procesando...</span>
              <span v-else>{{ isRegisterMode ? 'Registrarme' : 'Iniciar sesión' }}</span>
            </button>

            <!-- Enlace para cambiar entre login y registro -->
            <div class="mt-4 text-center">
              <a href="#" @click.prevent="isRegisterMode = !isRegisterMode" class="text-primary hover:underline">
                {{ isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
              </a>
            </div>
          </form>

          <!-- Formulario de confirmación de código -->
          <form @submit.prevent="confirmCode" v-if="isCodeConfirmMode">
            <div class="mb-4">
              <label for="code" class="block text-sm font-medium text-gray-700 mb-1">Código de verificación</label>
              <input id="code" v-model="verificationCode" type="text" placeholder="Ingresa el código de 6 dígitos"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required />
              <p class="text-xs text-gray-500 mt-1">
                Hemos enviado un código a tu teléfono {{ phone }}
              </p>
            </div>

            <!-- Mensaje de error -->
            <div v-if="errorMessage" class="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
              {{ errorMessage }}
            </div>

            <button type="submit"
              class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              :disabled="authStore.loading">
              <span v-if="authStore.loading">Verificando...</span>
              <span v-else>Verificar código</span>
            </button>
          </form>

          <!-- Formulario de nueva contraseña -->
          <form @submit.prevent="setNewPassword" v-if="isNewPasswordMode">
            <div class="mb-4">
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input id="newPassword" v-model="newPassword" type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required />
            </div>

            <div class="mb-4">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirmar
                contraseña</label>
              <input id="confirmPassword" v-model="confirmPassword" type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required />
            </div>

            <!-- Mensaje de error -->
            <div v-if="errorMessage" class="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
              {{ errorMessage }}
            </div>

            <button type="submit"
              class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              :disabled="authStore.loading">
              <span v-if="authStore.loading">Procesando...</span>
              <span v-else>Establecer nueva contraseña</span>
            </button>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Estado del modal
const showModal = ref(false)
const isRegisterMode = ref(false)
const isCodeConfirmMode = ref(false)
const isNewPasswordMode = ref(false)

// Campos del formulario
const phone = ref('')
const password = ref('')
const email = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const temporaryPassword = ref('')
const errorMessage = ref('')

// Computa si el usuario está autenticado
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Maneja el envío del formulario (login o registro)
async function handleSubmit() {
  errorMessage.value = ''

  try {
    if (isRegisterMode.value) {
      // Registro
      const result = await authStore.register(phone.value, password.value, email.value || undefined)

      if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        isCodeConfirmMode.value = true
      }
    } else {
      // Login
      const result = await authStore.login(phone.value, password.value)

      if (result.requiresNewPassword) {
        // Usuario necesita cambiar su contraseña
        isNewPasswordMode.value = true
        temporaryPassword.value = password.value
      } else if (result.isSignedIn) {
        // Login exitoso, cerrar modal
        showModal.value = false
      }
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Ocurrió un error. Intente nuevamente.'
  }
}

// Confirma el código de verificación
async function confirmCode() {
  errorMessage.value = ''

  try {
    const isComplete = await authStore.confirmSignUp(phone.value, verificationCode.value)

    if (isComplete) {
      // Registro completado, intentar login automático
      try {
        await authStore.login(phone.value, password.value)
        showModal.value = false
      } catch {
        // Si falla el login automático, volver a la pantalla de login
        isCodeConfirmMode.value = false
        errorMessage.value = 'Registro completado. Por favor inicie sesión.'
      }
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Código inválido. Intente nuevamente.'
  }
}

// Establece la nueva contraseña
async function setNewPassword() {
  errorMessage.value = ''

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  try {
    await authStore.completeNewPasswordChallenge(
      phone.value,
      temporaryPassword.value,
      newPassword.value
    )

    // Contraseña cambiada con éxito, cerrar modal
    showModal.value = false
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error al cambiar la contraseña. Intente nuevamente.'
  }
}
</script>

<style scoped>
/* Puedes agregar estilos específicos del componente aquí */
</style>
