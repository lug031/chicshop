<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import LoginModal from '@/components/LoginModal.vue'
import AppFooter from '@/components/AppFooter.vue'

// Stores
const authStore = useAuthStore()
const profileStore = useProfileStore()
const router = useRouter()
const route = useRoute()

// Estado
const showLoginModal = ref(false)
const showMobileMenu = ref(false)
const showUserMenu = ref(false)
const cartItemCount = ref(0) // Para notificaciones del carrito
const profileLoaded = ref(false) // Estado para controlar si el perfil ya se cargó

// Función para cargar el perfil del usuario
const loadUserProfile = async () => {
  try {
    if (authStore.isAuthenticated && !profileStore.profile && !profileLoaded.value) {
      console.log('Cargando perfil del usuario en el layout...')
      await profileStore.fetchUserProfile()
      profileLoaded.value = true
    }
  } catch (error) {
    console.error('Error al cargar el perfil del usuario:', error)
  }
}

// Verificar autenticación y cargar perfil
onMounted(async () => {
  await authStore.checkAuth()

  // Si está autenticado, cargar el perfil de usuario
  if (authStore.isAuthenticated) {
    await loadUserProfile()
  }

  // Verificar si se debe mostrar el modal de login por parámetro de URL
  if (route.query.showLogin === 'true') {
    showLoginModal.value = true
  }

  // Aquí podrías cargar el número de items en el carrito
  // Ejemplo: cartItemCount.value = await cartStore.getCartItemsCount()
})

// Vigilar cambios en la autenticación
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    // Si el usuario se autentica, cargar su perfil
    await loadUserProfile()

    // Verificar si hay una redirección pendiente
    const redirectPath = route.query.redirect as string
    if (redirectPath) {
      router.push(redirectPath)
    }
  } else {
    // Reiniciamos la bandera de perfil cargado
    profileLoaded.value = false
  }
})

// Métodos
const handleLoginSuccess = async () => {
  // Cargar perfil después del inicio de sesión exitoso
  console.log('Inicio de sesión exitoso en el layout, cargando perfil...')
  await profileStore.fetchUserProfile()
  profileLoaded.value = true

  // Verificar si hay una redirección pendiente
  const redirectPath = route.query.redirect as string
  if (redirectPath) {
    router.push(redirectPath)
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    // Limpiar el perfil al cerrar sesión
    profileStore.clearProfile()
    showUserMenu.value = false
    // Reiniciamos la bandera de perfil cargado
    profileLoaded.value = false
    console.log('Sesión cerrada')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const toggleUserMenu = () => {
  if (!authStore.isAuthenticated) {
    // Si no está autenticado, mostrar el modal de login en lugar del menú
    showLoginModal.value = true
  } else {
    // Si está autenticado, mostrar el menú de usuario
    showUserMenu.value = !showUserMenu.value
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Anuncio superior -->
    <div class="bg-black text-white text-center py-2 text-sm">
      <p>ENVÍO GRATIS EN PEDIDOS SUPERIORES A S/.50 | DEVOLUCIONES GRATUITAS EN 30 DÍAS</p>
    </div>

    <!-- Barra de navegación -->
    <nav class="bg-white shadow-sm sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Botón del menú móvil -->
            <button @click="toggleMobileMenu"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black sm:hidden">
              <span class="sr-only">Abrir menú</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <RouterLink to="/" class="font-bold text-2xl text-gray-900">
                CHIC SHOP
              </RouterLink>
            </div>

            <!-- Navegación principal - Desktop -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <!-- <RouterLink to="/tienda"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-black text-gray-900 border-b-2">
                TIENDA
              </RouterLink>-->
              <RouterLink to="/novedades"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-black text-gray-900 border-b-2">
                NOVEDADES
              </RouterLink>
              <RouterLink to="/mujer"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-black text-gray-900 border-b-2">
                MUJER
              </RouterLink>
              <RouterLink to="/hombre"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-black text-gray-900 border-b-2">
                HOMBRE
              </RouterLink>
              <RouterLink to="/accesorios"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-black text-gray-900 border-b-2">
                ACCESORIOS
              </RouterLink>
            </div>
          </div>

          <!-- Menú de usuario, búsqueda y carrito -->
          <div class="flex items-center">
            <!-- Búsqueda -->
            <button class="p-2 text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <!-- Área de usuario -->
            <div class="ml-3 relative">
              <div>
                <button @click="toggleUserMenu" type="button"
                  class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>

              <!-- Menú desplegable de usuario (solo visible si está autenticado y el menú está abierto) -->
              <div v-if="showUserMenu && authStore.isAuthenticated"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <p class="font-medium">
                    {{ profileStore.profile ? `${profileStore.profile.firstName} ${profileStore.profile.lastName}` :
                      authStore.userEmail }}
                  </p>
                  <p class="text-gray-500 text-xs mt-1">{{ authStore.userEmail }}</p>
                </div>
                <RouterLink to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem">Mi cuenta</RouterLink>
                <RouterLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem">Mi perfil</RouterLink>
                <RouterLink to="/pedidos" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem">Mis pedidos
                </RouterLink>
                <RouterLink to="/wishlist" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem">Lista de deseos
                </RouterLink>
                <button @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">Cerrar
                  sesión</button>
              </div>
            </div>

            <!-- Carrito -->
            <RouterLink to="/carrito" class="ml-3 p-2 text-gray-500 hover:text-gray-700 relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span v-if="cartItemCount > 0"
                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {{ cartItemCount }}
              </span>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Menú móvil -->
      <div v-if="showMobileMenu" class="sm:hidden bg-white border-t border-gray-200">
        <div class="pt-2 pb-3 space-y-1">
          <RouterLink to="/tienda"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            :class="$route.path === '/tienda' ? 'border-black text-gray-900 bg-gray-50' : 'border-transparent text-gray-500'"
            @click="showMobileMenu = false">
            TIENDA
          </RouterLink>
          <RouterLink to="/novedades"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            :class="$route.path === '/novedades' ? 'border-black text-gray-900 bg-gray-50' : 'border-transparent text-gray-500'"
            @click="showMobileMenu = false">
            NOVEDADES
          </RouterLink>
          <RouterLink to="/mujer"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            :class="$route.path === '/mujer' ? 'border-black text-gray-900 bg-gray-50' : 'border-transparent text-gray-500'"
            @click="showMobileMenu = false">
            MUJER
          </RouterLink>
          <RouterLink to="/hombre"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            :class="$route.path === '/hombre' ? 'border-black text-gray-900 bg-gray-50' : 'border-transparent text-gray-500'"
            @click="showMobileMenu = false">
            HOMBRE
          </RouterLink>
          <RouterLink to="/accesorios"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            :class="$route.path === '/accesorios' ? 'border-black text-gray-900 bg-gray-50' : 'border-transparent text-gray-500'"
            @click="showMobileMenu = false">
            ACCESORIOS
          </RouterLink>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div v-if="authStore.isAuthenticated" class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-600 font-medium">
                  {{ profileStore.profile?.firstName?.[0] || authStore.userEmail?.[0] || '?' }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">
                {{ profileStore.profile ? `${profileStore.profile.firstName} ${profileStore.profile.lastName}` :
                  authStore.userEmail }}
              </div>
              <div class="text-sm font-medium text-gray-500">{{ authStore.userEmail }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <template v-if="authStore.isAuthenticated">
              <RouterLink to="/dashboard" @click="showMobileMenu = false"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Mi cuenta
              </RouterLink>
              <RouterLink to="/profile" @click="showMobileMenu = false"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Mi perfil
              </RouterLink>
              <RouterLink to="/pedidos" @click="showMobileMenu = false"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Mis pedidos
              </RouterLink>
              <RouterLink to="/wishlist" @click="showMobileMenu = false"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Lista de deseos
              </RouterLink>
              <button @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-gray-100">
                Cerrar sesión
              </button>
            </template>
            <template v-else>
              <button @click="showLoginModal = true; showMobileMenu = false"
                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Iniciar sesión
              </button>
              <button @click="showLoginModal = true; showMobileMenu = false"
                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Registrarse
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="flex-grow">
      <RouterView />
    </main>

    <!-- Footer (ahora como componente) -->
    <AppFooter brand="CHIC SHOP" />

    <!-- Modal de login (visible cuando se solicita) -->
    <LoginModal v-model:showModal="showLoginModal" @login-success="handleLoginSuccess"
      @register-success="handleLoginSuccess" @register-success-profile-needed="handleLoginSuccess" />
  </div>
</template>
