<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-indigo-600">404</h1>
        <h2 class="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Página no encontrada</h2>
        <p class="mt-3 text-xl text-gray-500">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        <div class="mt-8 flex justify-center space-x-4">
          <button @click="goBack"
            class="px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Volver atrás
          </button>
          <button @click="goHome"
            class="px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
