<template>
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
    <!-- Overlay de fondo -->
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

    <!-- Modal -->
    <div class="relative w-full max-w-md mx-auto my-8 bg-white rounded-lg shadow-xl overflow-hidden">
      <!-- Mostrar ProfileForm después de cambio de contraseña -->
      <div v-if="showProfileForm">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">Completa tu Perfil</h3>
        </div>
        <ProfileForm :isNewUser="true" :showInModal="true" @profile-completed="handleProfileCompleted"
          @saved="handleProfileCompleted" @cancel="handleCancelProfile" />
      </div>

      <!-- Contenido normal del LoginModal cuando no se está completando perfil -->
      <div v-else class="max-h-[90vh] overflow-y-auto">
        <!-- Cabecera -->
        <div class="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h3 class="text-xl font-bold text-gray-900">
            {{ isRegisterMode ? 'Crear cuenta' : isConfirmMode ? 'Verificar correo' : isNewPasswordMode ?
              'Cambiar contraseña' : 'Iniciar sesión' }}
          </h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Cuerpo -->
        <div class="p-6">
          <!-- Mensaje de error -->
          <div v-if="errorMessage" class="mb-5 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-md">
            {{ errorMessage }}
          </div>

          <!-- Formulario de inicio de sesión -->
          <form v-if="!isRegisterMode && !isConfirmMode && !isNewPasswordMode" @submit.prevent="handleLogin"
            class="space-y-4">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-700">Correo electrónico</label>
              <input id="email" v-model="email" type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="ejemplo@correo.com" required />
            </div>

            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
              <input id="password" v-model="password" type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                required />
            </div>

            <div class="pt-2">
              <button type="submit"
                class="w-full py-3 px-4 bg-black hover:bg-gray-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                :disabled="loading">
                <span v-if="!loading">Iniciar sesión</span>
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

            <div class="mt-4 text-center">
              <button type="button" @click="switchToRegister" class="text-sm text-gray-600 hover:text-black">
                ¿No tienes una cuenta? <span class="font-medium">Regístrate ahora</span>
              </button>
            </div>
          </form>

          <!-- Formulario de cambio de contraseña obligatorio -->
          <form v-if="isNewPasswordMode" @submit.prevent="handleNewPasswordSubmit" class="space-y-4">
            <div>
              <p class="text-sm text-gray-700 mb-4">
                Tu cuenta requiere un cambio de contraseña. Por favor, crea una nueva contraseña para continuar.
              </p>
            </div>

            <div>
              <label for="newPassword" class="block mb-2 text-sm font-medium text-gray-700">Nueva contraseña</label>
              <input id="newPassword" v-model="newPassword" type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                required minlength="8" />
              <p class="mt-1 text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
            </div>

            <div>
              <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-700">Confirmar
                contraseña</label>
              <input id="confirmPassword" v-model="confirmPassword" type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                required />
            </div>

            <div class="pt-2">
              <button type="submit"
                class="w-full py-3 px-4 bg-black hover:bg-gray-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                :disabled="loading || newPassword !== confirmPassword">
                <span v-if="!loading">Cambiar contraseña</span>
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

          <!-- Formulario de registro -->
          <form v-if="isRegisterMode && !isConfirmMode" @submit.prevent="handleRegister" class="space-y-4">
            <!-- Información básica para autenticación -->
            <div>
              <label for="registerEmail" class="block mb-2 text-sm font-medium text-gray-700">Correo electrónico</label>
              <input id="registerEmail" v-model="email" type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="ejemplo@correo.com" required />
            </div>

            <div>
              <label for="registerPassword" class="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
              <input id="registerPassword" v-model="password" type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                required minlength="8" />
              <p class="mt-1 text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
            </div>

            <!-- Información del perfil -->
            <div class="pt-4 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-700 mb-4">Información personal</h4>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label for="firstName" class="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
                  <input id="firstName" v-model="userInfo.firstName" type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    required />
                </div>

                <div>
                  <label for="lastName" class="block mb-2 text-sm font-medium text-gray-700">Apellido</label>
                  <input id="lastName" v-model="userInfo.lastName" type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    required />
                </div>
              </div>

              <div class="mb-4">
                <label for="phone" class="block mb-2 text-sm font-medium text-gray-700">Número de celular</label>
                <input id="phone" v-model="userInfo.phone" type="tel"
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="999999999" />
                <p class="mt-1 text-xs text-gray-500">Formato: 999999999 (opcional)</p>
              </div>

              <div class="mb-4">
                <label for="documentNumber" class="block mb-2 text-sm font-medium text-gray-700">Documento de
                  identidad</label>
                <input id="documentNumber" v-model="userInfo.documentNumber" type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  required />
              </div>
            </div>

            <div class="pt-2">
              <button type="submit"
                class="w-full py-3 px-4 bg-black hover:bg-gray-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                :disabled="loading">
                <span v-if="!loading">Crear cuenta</span>
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

            <div class="mt-4 text-center">
              <button type="button" @click="switchToLogin" class="text-sm text-gray-600 hover:text-black">
                ¿Ya tienes una cuenta? <span class="font-medium">Inicia sesión</span>
              </button>
            </div>
          </form>

          <!-- Formulario de confirmación de código -->
          <form v-if="isConfirmMode" @submit.prevent="handleConfirmation" class="space-y-4">
            <div>
              <label for="confirmationCode" class="block mb-2 text-sm font-medium text-gray-700">Código de
                verificación</label>
              <input id="confirmationCode" v-model="confirmationCode" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="123456" required />
              <p class="mt-2 text-sm text-gray-600">
                Hemos enviado un código de verificación a <span class="font-medium">{{ email }}</span>
              </p>
            </div>

            <div class="pt-2">
              <button type="submit"
                class="w-full py-3 px-4 bg-black hover:bg-gray-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                :disabled="loading">
                <span v-if="!loading">Verificar código</span>
                <span v-else class="flex justify-center items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Verificando...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import ProfileForm from '@/components/ProfileForm.vue'

// Props
defineProps<{
  showModal: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'login-success'): void
  (e: 'register-success'): void
  (e: 'register-success-profile-needed'): void
}>()

const router = useRouter()
const route = useRoute()

// Stores
const authStore = useAuthStore()
const profileStore = useProfileStore()

// State
const isRegisterMode = ref(false)
const isConfirmMode = ref(false)
const isNewPasswordMode = ref(false)
const showProfileForm = ref(false)
const email = ref('')
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
  phone: '',
  documentNumber: '',
})

// Computed
const loading = computed(() => authStore.loading || profileStore.loading)

// Methods
const closeModal = () => {
  if (showProfileForm.value) {
    // Si estamos mostrando el formulario de perfil, evitar cerrar
    // a menos que se haya completado correctamente
    return;
  }

  emit('update:showModal', false)
  resetForm()
}

const resetForm = () => {
  email.value = ''
  password.value = ''
  temporaryPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  confirmationCode.value = ''
  errorMessage.value = ''
  isRegisterMode.value = false
  isConfirmMode.value = false
  isNewPasswordMode.value = false
  showProfileForm.value = false
  userInfo.value = {
    firstName: '',
    lastName: '',
    phone: '',
    documentNumber: '',
  }
}

const handleProfileCompleted = () => {
  emit('login-success')
  showProfileForm.value = false
  closeModal()
}

const handleCancelProfile = () => {
  // Si el usuario cancela durante la creación obligatoria del perfil,
  // redirigir a la página de inicio pero mantener la sesión
  if (route.query.redirect) {
    router.push('/')
  } else {
    closeModal()
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
    const result = await authStore.login(email.value, password.value)

    if (result.requiresNewPassword) {
      isNewPasswordMode.value = true
      temporaryPassword.value = password.value
      password.value = ''
      return
    }

    if (result.isSignedIn) {
      // Intentar cargar el perfil del usuario
      await profileStore.fetchUserProfile()

      // Verificar si el usuario tiene perfil
      if (!profileStore.profile) {
        // Si no tiene perfil, mostrar el formulario para completarlo
        showProfileForm.value = true
        return;
      }

      // Si tiene perfil, proceder normalmente
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
      email.value,
      temporaryPassword.value,
      newPassword.value
    )

    if (success) {
      // Intentar cargar el perfil del usuario
      await profileStore.fetchUserProfile()

      // Si el usuario no tiene perfil, mostrar el formulario de perfil
      if (!profileStore.profile) {
        showProfileForm.value = true
        isNewPasswordMode.value = false
        return;
      }

      // Si ya tiene perfil, proceder normalmente
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

    // Validar datos
    if (userInfo.value.firstName.trim() === '' || userInfo.value.lastName.trim() === '' || userInfo.value.documentNumber.trim() === '') {
      errorMessage.value = 'Por favor complete todos los campos obligatorios'
      return
    }

    // Registrar usuario con Cognito
    const result = await authStore.register(email.value, password.value, {
      firstName: userInfo.value.firstName,
      lastName: userInfo.value.lastName,
      phone: userInfo.value.phone,
      documentNumber: userInfo.value.documentNumber
    })

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
    const success = await authStore.confirmSignUp(email.value, confirmationCode.value)

    if (success) {
      // Guardar datos del perfil para uso posterior
      const formattedEmail = email.value.trim().toLowerCase();
      const storedProfileData = localStorage.getItem(`profile_data_${formattedEmail}`)

      if (storedProfileData) {
        const profileData = JSON.parse(storedProfileData)

        // Iniciar sesión automáticamente
        try {
          const loginResult = await authStore.login(formattedEmail, profileData.password || password.value)

          if (loginResult.isSignedIn) {
            console.log('Sesión iniciada correctamente después de verificación')

            // Esperar un momento para asegurar que la sesión se ha establecido completamente
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Asegurarnos de que el teléfono tenga un valor válido (es requerido según el tipo)
            const phoneValue = profileData.phone
              ? authStore.formatPeruPhoneNumber(profileData.phone)
              : formattedEmail; // Usamos el email como valor de respaldo si no hay teléfono

            if (!authStore.user || !authStore.user.userId) {
              console.error('No se pudo obtener userID válido para crear el perfil');
              emit('register-success-profile-needed');
              closeModal();
              return;
            }

            // Intentar crear el perfil con la sesión establecida
            try {
              const profileCreationData = {
                userID: authStore.user.userId,  // Ahora es seguro que no es undefined
                firstName: profileData.firstName || userInfo.value.firstName,
                lastName: profileData.lastName || userInfo.value.lastName,
                email: formattedEmail,
                phone: phoneValue,
                documentNumber: profileData.documentNumber || userInfo.value.documentNumber
              };

              console.log('Intentando crear perfil con datos:', profileCreationData);

              await profileStore.createProfile(profileCreationData);

              console.log('Perfil creado exitosamente');

              // Limpiar datos del localStorage
              localStorage.removeItem(`profile_data_${formattedEmail}`);

              // Notificar éxito y cerrar modal
              emit('register-success');
              closeModal();
              return;
            } catch (profileError) {
              console.error('Error al crear perfil después de verificar:', profileError);

              // Si falla la creación del perfil, emitir un evento especial
              // para que la vista principal muestre el formulario
              emit('register-success-profile-needed');
              closeModal();
              return;
            }
          } else {
            console.error('Error al iniciar sesión después de verificación');
            switchToLogin();
          }
        } catch (loginError) {
          console.error('Error al iniciar sesión después de verificación:', loginError);
          alert('Tu cuenta ha sido verificada. Por favor inicia sesión para continuar.');
          switchToLogin();
        }
      } else {
        alert('Tu cuenta ha sido verificada. Por favor inicia sesión para continuar.');
        switchToLogin();
      }
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error al verificar el código';
  }
}
</script>
