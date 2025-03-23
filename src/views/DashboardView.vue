<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const isLoading = ref(true)
const recentOrders = ref([
  { id: 'ORD-2458', date: 'Hace 2 días', amount: 'S/.89.99', status: 'Entregado' },
  { id: 'ORD-2357', date: 'Hace 1 semana', amount: 'S/.124.50', status: 'En camino' }
])
const wishlistItems = ref(3)
const availableCoupons = ref(2)
const loyaltyPoints = ref(450)

// Cargar datos del dashboard cuando se monta el componente
onMounted(async () => {
  try {
    // Comprobar si el perfil ya está cargado
    if (!profileStore.profile) {
      await profileStore.fetchUserProfile()
    }

    // Aquí podrías cargar cualquier dato adicional para el dashboard
    // Ejemplo: pedidos recientes, estadísticas, notificaciones, etc.

    // Simular carga de datos
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error)
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
      <p class="text-gray-600 mt-2">Gestiona tus pedidos, devoluciones y datos personales</p>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="py-16 flex justify-center">
      <div class="animate-pulse flex flex-col items-center">
        <div class="h-10 w-10 bg-black rounded-full"></div>
        <p class="mt-4 text-gray-600">Cargando datos...</p>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Navegación lateral -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center">
              <div
                class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-lg font-bold">
                {{ profileStore.profile?.firstName?.[0] || authStore.userEmail?.[0] || '?' }}
              </div>
              <div class="ml-4">
                <h2 class="font-medium text-gray-900">
                  {{ profileStore.profile?.firstName || authStore.userEmail?.split('@')[0] }}
                </h2>
                <p class="text-sm text-gray-500">{{ authStore.userEmail }}</p>
              </div>
            </div>
          </div>
          <nav class="py-2">
            <RouterLink to="/dashboard"
              class="flex items-center px-6 py-3 text-gray-900 bg-gray-100 border-l-4 border-black">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Resumen
            </RouterLink>
            <RouterLink to="/pedidos"
              class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Mis Pedidos
            </RouterLink>
            <RouterLink to="/devoluciones"
              class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Devoluciones
            </RouterLink>
            <RouterLink to="/wishlist"
              class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Lista de Deseos
            </RouterLink>
            <RouterLink to="/cupones"
              class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Cupones
            </RouterLink>
            <RouterLink to="/profile"
              class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mi Perfil
            </RouterLink>
          </nav>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="lg:col-span-3">
        <!-- Tarjeta de bienvenida -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 class="text-xl font-medium text-gray-900 mb-2">
            Bienvenido, {{ profileStore.profile?.firstName || authStore.userEmail?.split('@')[0] }}
          </h2>
          <p class="text-gray-600">
            Desde tu panel de cuenta puedes ver tus pedidos recientes, gestionar tus direcciones de envío y facturación,
            y editar tu contraseña y detalles de cuenta.
          </p>
        </div>

        <!-- Tarjetas de estadísticas -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="flex flex-col items-center">
              <div class="p-2 rounded-full bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p class="text-xs text-gray-500 mt-2">Pedidos</p>
              <p class="text-lg font-medium text-gray-900">2</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="flex flex-col items-center">
              <div class="p-2 rounded-full bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p class="text-xs text-gray-500 mt-2">Lista de Deseos</p>
              <p class="text-lg font-medium text-gray-900">{{ wishlistItems }}</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="flex flex-col items-center">
              <div class="p-2 rounded-full bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <p class="text-xs text-gray-500 mt-2">Cupones</p>
              <p class="text-lg font-medium text-gray-900">{{ availableCoupons }}</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="flex flex-col items-center">
              <div class="p-2 rounded-full bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-xs text-gray-500 mt-2">Puntos</p>
              <p class="text-lg font-medium text-gray-900">{{ loyaltyPoints }}</p>
            </div>
          </div>
        </div>

        <!-- Pedidos recientes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div class="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Pedidos Recientes</h3>
            <RouterLink to="/pedidos" class="text-sm font-medium text-black hover:text-gray-700">
              Ver todos
            </RouterLink>
          </div>
          <div v-if="recentOrders.length > 0" class="divide-y divide-gray-200">
            <div v-for="order in recentOrders" :key="order.id" class="p-6">
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-900">{{ order.id }}</h4>
                <span class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="order.status === 'Entregado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                  {{ order.status }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <p class="text-gray-500">{{ order.date }}</p>
                <p class="font-medium text-gray-900">{{ order.amount }}</p>
              </div>
            </div>
          </div>
          <div v-else class="p-6 text-center">
            <p class="text-gray-500">No hay pedidos recientes.</p>
            <RouterLink to="/" class="mt-2 inline-block text-sm font-medium text-black hover:text-gray-700">
              Explorar productos
            </RouterLink>
          </div>
        </div>

        <!-- Recomendaciones -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Recomendado para ti</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="i in 3" :key="i" class="group">
                <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden">
                  <div class="h-48 bg-gray-200"></div>
                </div>
                <div class="mt-2">
                  <h4 class="text-sm font-medium text-gray-900 group-hover:text-black">
                    Producto Recomendado {{ i }}
                  </h4>
                  <p class="text-sm text-gray-500">S/.{{ 39.99 + (i * 10) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
