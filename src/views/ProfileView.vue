<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { RouterLink } from 'vue-router'
import ProfileForm from '@/components/ProfileForm.vue'

// Stores
const authStore = useAuthStore()
const profileStore = useProfileStore()

// Estado
const showProfileForm = ref(false)
const isLoading = ref(true)
const activeTab = ref('personal')

// Añadir carga inicial del perfil cuando se monta el componente
onMounted(async () => {
  try {
    // Comprobar si el perfil ya está cargado
    if (!profileStore.profile) {
      await profileStore.fetchUserProfile()
    }
    isLoading.value = false
  } catch (error) {
    console.error('Error al cargar datos del perfil:', error)
    isLoading.value = false
  }
})

const handleProfileSaved = async () => {
  // Refrescar el perfil después de guardar
  await profileStore.fetchUserProfile(true)
  showProfileForm.value = false
}

const setActiveTab = (tab: string) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mi Perfil</h1>
      <p class="text-gray-600 mt-2">Gestiona tus datos personales y preferencias</p>
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
              class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
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
              class="flex items-center px-6 py-3 text-gray-900 bg-gray-100 border-l-4 border-black">
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
        <div v-if="profileStore.loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-pulse flex flex-col items-center">
            <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
            <p class="mt-4 text-gray-600">Cargando información de perfil...</p>
          </div>
        </div>

        <div v-else-if="!profileStore.profile" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p class="text-gray-600 mb-6">No se ha encontrado información de perfil.</p>
          <button @click="showProfileForm = true"
            class="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-md transition-colors">
            Completar mi perfil
          </button>
        </div>

        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Tabs de navegación -->
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button @click="setActiveTab('personal')"
                class="py-4 px-6 text-center text-sm font-medium border-b-2 transition-colors"
                :class="activeTab === 'personal' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                Información Personal
              </button>
              <button @click="setActiveTab('direcciones')"
                class="py-4 px-6 text-center text-sm font-medium border-b-2 transition-colors"
                :class="activeTab === 'direcciones' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                Direcciones
              </button>
              <button @click="setActiveTab('seguridad')"
                class="py-4 px-6 text-center text-sm font-medium border-b-2 transition-colors"
                :class="activeTab === 'seguridad' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                Seguridad
              </button>
              <button @click="setActiveTab('preferencias')"
                class="py-4 px-6 text-center text-sm font-medium border-b-2 transition-colors"
                :class="activeTab === 'preferencias' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                Preferencias
              </button>
            </nav>
          </div>

          <!-- Tab: Información Personal -->
          <div v-if="activeTab === 'personal'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium text-gray-900">Información Personal</h3>
              <button @click="showProfileForm = true" class="text-sm text-black hover:text-gray-700 flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">Nombre completo</p>
                <p class="font-medium text-gray-800">{{ profileStore.profile.firstName }} {{
                  profileStore.profile.lastName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Correo electrónico</p>
                <p class="font-medium text-gray-800">{{ profileStore.profile.email || authStore.userEmail }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Teléfono</p>
                <p class="font-medium text-gray-800">{{ profileStore.profile.phone || 'No especificado' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Documento de identidad</p>
                <p class="font-medium text-gray-800">{{ profileStore.profile.documentNumber || 'No especificado' }}</p>
              </div>
            </div>
          </div>

          <!-- Tab: Direcciones -->
          <div v-if="activeTab === 'direcciones'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium text-gray-900">Mis Direcciones</h3>
              <button class="text-sm text-black hover:text-gray-700 flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Añadir dirección
              </button>
            </div>

            <div v-if="profileStore.profile.address" class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">Principal</span>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Facturación</span>
                </div>
                <div class="flex space-x-2">
                  <button class="text-gray-500 hover:text-gray-700">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button class="text-gray-500 hover:text-red-600">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-gray-500">Dirección</p>
                  <p class="font-medium text-gray-800">{{ profileStore.profile.address }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Ciudad</p>
                  <p class="font-medium text-gray-800">{{ profileStore.profile.city || 'No especificada' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Región/Estado</p>
                  <p class="font-medium text-gray-800">{{ profileStore.profile.state || 'No especificada' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Código postal</p>
                  <p class="font-medium text-gray-800">{{ profileStore.profile.zipCode || 'No especificado' }}</p>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p class="text-gray-600 mb-4">No tienes direcciones guardadas.</p>
              <button class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors">
                Añadir mi primera dirección
              </button>
            </div>
          </div>

          <!-- Tab: Seguridad -->
          <div v-if="activeTab === 'seguridad'" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-6">Seguridad de la cuenta</h3>

            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
              <h4 class="font-medium text-gray-900 mb-2">Cambiar contraseña</h4>
              <p class="text-sm text-gray-600 mb-4">Asegúrate de utilizar una contraseña segura que no uses en otros
                sitios.</p>
              <button class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors">
                Actualizar contraseña
              </button>
            </div>

            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 class="font-medium text-gray-900 mb-2">Autenticación de dos factores</h4>
              <p class="text-sm text-gray-600 mb-4">Añade una capa adicional de seguridad a tu cuenta con la
                autenticación de dos factores.</p>
              <button
                class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                Configurar autenticación
              </button>
            </div>
          </div>

          <!-- Tab: Preferencias -->
          <div v-if="activeTab === 'preferencias'" class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-6">Preferencias y comunicaciones</h3>

            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="newsletter" type="checkbox"
                    class="h-4 w-4 text-black focus:ring-black border-gray-300 rounded">
                </div>
                <div class="ml-3 text-sm">
                  <label for="newsletter" class="font-medium text-gray-700">Newsletter</label>
                  <p class="text-gray-500">Recibe nuestras últimas novedades, ofertas y tendencias de moda.</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="offers" type="checkbox"
                    class="h-4 w-4 text-black focus:ring-black border-gray-300 rounded">
                </div>
                <div class="ml-3 text-sm">
                  <label for="offers" class="font-medium text-gray-700">Promociones y ofertas</label>
                  <p class="text-gray-500">Recibe cupones de descuento y ofertas exclusivas.</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="orders" type="checkbox" class="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    checked>
                </div>
                <div class="ml-3 text-sm">
                  <label for="orders" class="font-medium text-gray-700">Estado de pedidos</label>
                  <p class="text-gray-500">Recibe actualizaciones sobre el estado de tus pedidos por email.</p>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
              <h4 class="font-medium text-gray-900 mb-4">Tallas preferidas</h4>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="size-top" class="block text-sm font-medium text-gray-700 mb-1">Parte superior</label>
                  <select id="size-top"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md">
                    <option>No seleccionada</option>
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>

                <div>
                  <label for="size-bottom" class="block text-sm font-medium text-gray-700 mb-1">Parte inferior</label>
                  <select id="size-bottom"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md">
                    <option>No seleccionada</option>
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>

                <div>
                  <label for="size-shoes" class="block text-sm font-medium text-gray-700 mb-1">Calzado</label>
                  <select id="size-shoes"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md">
                    <option>No seleccionada</option>
                    <option>36</option>
                    <option>37</option>
                    <option>38</option>
                    <option>39</option>
                    <option>40</option>
                    <option>41</option>
                    <option>42</option>
                    <option>43</option>
                    <option>44</option>
                  </select>
                </div>
              </div>

              <div class="mt-6">
                <button class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors">
                  Guardar preferencias
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de perfil modal -->
    <div v-if="showProfileForm" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showProfileForm = false"></div>
      <div class="relative w-full max-w-3xl mx-auto z-10">
        <div class="bg-white rounded-lg shadow-xl overflow-hidden">
          <div class="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 class="text-xl font-medium text-gray-900">
              {{ profileStore.profile ? 'Editar perfil' : 'Completar perfil' }}
            </h2>
            <button @click="showProfileForm = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ProfileForm :is-editing="!!profileStore.profile" @saved="handleProfileSaved"
            @cancel="showProfileForm = false" />
        </div>
      </div>
    </div>
  </div>
</template>
