<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import LoginModal from '@/components/LoginModal.vue'
import ProfileForm from '@/components/ProfileForm.vue'

// Estados
const showLoginModal = ref(false)
const showProfileForm = ref(false)
const authStore = useAuthStore()
const profileStore = useProfileStore()

// Comprobar si el usuario ya está autenticado
authStore.checkAuth()

// Cargar perfil si está autenticado
onMounted(async () => {
  if (authStore.isAuthenticated) {
    console.log("Usuario autenticado, cargando perfil...");
    const profile = await profileStore.fetchUserProfile(true); // Forzar refresco
    console.log("Perfil cargado en HomeView:", profile);
  }
})

// Métodos
const openLoginModal = () => {
  showLoginModal.value = true
}

const handleLoginSuccess = async () => {
  // Cargar perfil después del inicio de sesión exitoso
  await profileStore.fetchUserProfile()
  console.log('Inicio de sesión exitoso')
}

const handleRegisterSuccess = () => {
  // El perfil ya no se crea en el proceso de registro - mostramos formulario
  console.log('Registro exitoso')
  // Mostramos el formulario de perfil al usuario
  showProfileForm.value = true
}

const handleProfileSaved = async () => {
  // Refrescar el perfil después de guardar
  await profileStore.fetchUserProfile(true)
  showProfileForm.value = false
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    // Limpiar el perfil al cerrar sesión
    profileStore.clearProfile()
    console.log('Sesión cerrada')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Sección de bienvenida -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Bienvenido a nuestra plataforma</h1>

        <div v-if="authStore.isAuthenticated" class="mb-6">
          <div v-if="profileStore.profile" class="mb-4">
            <h2 class="text-lg font-semibold text-gray-700">
              ¡Hola, {{ profileStore.profile.firstName }} {{ profileStore.profile.lastName }}!
            </h2>
            <p class="text-gray-600 mt-2">
              Número: {{ authStore.userPhone }}
            </p>
            <p v-if="profileStore.profile.documentNumber" class="text-gray-600">
              Documento: {{ profileStore.profile.documentNumber }}
            </p>
            <p v-if="profileStore.profile.email" class="text-gray-600">
              Email: {{ profileStore.profile.email }}
            </p>
          </div>
          <div v-else-if="profileStore.loading" class="mb-4">
            <p class="text-gray-600">Cargando información de perfil...</p>
          </div>
          <div v-else class="mb-4">
            <p class="text-gray-600">
              Estás conectado con el número {{ authStore.userPhone }}
            </p>
          </div>

          <button @click="handleLogout" class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
            Cerrar sesión
          </button>
        </div>

        <div v-else class="mb-6">
          <p class="text-lg text-gray-700">
            Para acceder a todas las funciones de nuestra plataforma, por favor inicia sesión o regístrate.
          </p>
          <button @click="openLoginModal" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            Iniciar sesión / Registrarse
          </button>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Perfil de Usuario</h2>
        <div v-if="authStore.isAuthenticated && profileStore.profile" class="space-y-4">
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-2">Información Personal</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Nombre completo</p>
                <p class="font-medium">{{ profileStore.profile.firstName }} {{ profileStore.profile.lastName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Documento de identidad</p>
                <p class="font-medium">{{ profileStore.profile.documentNumber || 'No especificado' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Teléfono</p>
                <p class="font-medium">{{ profileStore.profile.phone }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-medium">{{ profileStore.profile.email || 'No especificado' }}</p>
              </div>
            </div>
          </div>

          <div v-if="profileStore.profile.address">
            <h3 class="text-lg font-medium text-gray-800 mb-2">Dirección</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Dirección</p>
                <p class="font-medium">{{ profileStore.profile.address }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Ciudad</p>
                <p class="font-medium">{{ profileStore.profile.city || 'No especificada' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Región/Estado</p>
                <p class="font-medium">{{ profileStore.profile.state || 'No especificada' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Código postal</p>
                <p class="font-medium">{{ profileStore.profile.zipCode || 'No especificado' }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <button @click="showProfileForm = true"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Editar perfil
            </button>
          </div>
        </div>

        <div v-else-if="authStore.isAuthenticated && profileStore.loading" class="py-8 text-center">
          <p class="text-gray-600">Cargando información de perfil...</p>
        </div>

        <div v-else-if="authStore.isAuthenticated" class="py-4 text-center">
          <p class="text-gray-600 mb-4">No se ha encontrado información de perfil.</p>
          <button @click="showProfileForm = true"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
            Completar mi perfil
          </button>
        </div>

        <div v-else class="py-8 text-center">
          <p class="text-gray-600">Inicia sesión para ver tu perfil.</p>
        </div>
      </div>
    </div>

    <!-- Modal de login -->
    <LoginModal v-model:showModal="showLoginModal" @login-success="handleLoginSuccess"
      @register-success="handleRegisterSuccess" />

    <!-- Formulario de perfil -->
    <div v-if="showProfileForm" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showProfileForm = false"></div>
      <div class="relative w-full max-w-3xl mx-auto z-10">
        <ProfileForm :is-editing="!!profileStore.profile" @saved="handleProfileSaved"
          @cancel="showProfileForm = false" />
      </div>
    </div>
  </main>
</template>
