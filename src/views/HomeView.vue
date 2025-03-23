<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import LoginModal from '@/components/LoginModal.vue'
import ProfileForm from '@/components/ProfileForm.vue'

// Estados
const showLoginModal = ref(false)
const showProfileForm = ref(false)
const profileLoading = ref(false)
const authStore = useAuthStore()
const profileStore = useProfileStore()
const router = useRouter()

// Comprobar si el usuario ya está autenticado
authStore.checkAuth()

// Si el usuario está autenticado, redirigir a Dashboard
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await loadUserProfile()
    router.push('/dashboard')
  }
})

// Función para cargar el perfil con reintentos
const loadUserProfile = async (retries = 3) => {
  if (!authStore.isAuthenticated) return null;

  profileLoading.value = true;

  try {
    // Intenta cargar el perfil
    const profile = await profileStore.fetchUserProfile(true);

    // Si no hay perfil y aún tenemos reintentos
    if (!profile && retries > 0) {
      // Esperar un segundo y reintentar
      await new Promise(resolve => setTimeout(resolve, 1000));
      return loadUserProfile(retries - 1);
    }

    return profile;
  } catch (error) {
    console.error("Error al cargar perfil:", error);
    return null;
  } finally {
    profileLoading.value = false;
  }
};

// Observar cambios en el estado de autenticación
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    await loadUserProfile();
    router.push('/dashboard');
  } else {
    // Si el usuario cierra sesión, limpiar el perfil
    profileStore.clearProfile();
  }
});

// Métodos
const openLoginModal = () => {
  showLoginModal.value = true
}

const handleLoginSuccess = async () => {
  // Cargar perfil después del inicio de sesión exitoso
  await loadUserProfile();
  router.push('/dashboard');
}

const handleRegisterSuccessProfileNeeded = () => {
  // Mostrar inmediatamente el formulario de perfil
  showProfileForm.value = true
}

const handleRegisterSuccess = () => {
  // Intentamos cargar el perfil primero
  loadUserProfile().then(profile => {
    if (!profile) {
      // Si no hay perfil, mostramos el formulario
      showProfileForm.value = true;
    } else {
      router.push('/dashboard');
    }
  });
}

const handleProfileSaved = async () => {
  // Refrescar el perfil después de guardar
  await loadUserProfile();
  showProfileForm.value = false;
  router.push('/dashboard');
}
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <!-- Hero section -->
    <div class="relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600">
      <div class="relative pt-16 pb-20 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            <span class="block">Mi Aplicación</span>
            <span class="block text-blue-200 mt-2">Plataforma de Gestión</span>
          </h1>
          <p class="mt-6 max-w-lg mx-auto text-xl text-blue-100 sm:max-w-3xl">
            Bienvenido a nuestra plataforma. Inicia sesión para acceder a todas nuestras funcionalidades.
          </p>
          <div class="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div class="space-y-4 sm:space-y-0 sm:mx-auto">
              <button @click="openLoginModal"
                class="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Características -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Características</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Una mejor forma de gestionar
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Nuestra plataforma ofrece una experiencia completa para la gestión de tus datos.
          </p>
        </div>

        <div class="mt-10">
          <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <!-- Icono placeholder -->
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Característica 1</p>
              <p class="mt-2 ml-16 text-base text-gray-500">
                Descripción detallada de la primera característica destacada de la plataforma.
              </p>
            </div>

            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <!-- Icono placeholder -->
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Característica 2</p>
              <p class="mt-2 ml-16 text-base text-gray-500">
                Descripción detallada de la segunda característica destacada de la plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de login -->
    <LoginModal v-model:showModal="showLoginModal" @login-success="handleLoginSuccess"
      @register-success="handleRegisterSuccess" @register-success-profile-needed="handleRegisterSuccessProfileNeeded" />

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
