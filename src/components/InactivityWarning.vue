<script setup lang="ts">
import { computed } from 'vue'
import { useInactivity } from '@/composables/useInactivity'

// Usar el composable
const { isWarningVisible, remainingSeconds, extendSession } = useInactivity()

// Formatear el tiempo restante
const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
    <div v-if="isWarningVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Alerta de inactividad</h2>
        <div class="mb-6">
          <p class="text-gray-600 mb-2">
            Tu sesión está a punto de expirar debido a inactividad.
          </p>
          <p class="text-gray-800 font-semibold">
            Tiempo restante: <span class="text-red-600">{{ formattedTime }}</span>
          </p>
        </div>
        <div class="flex justify-end">
          <button @click="extendSession"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Mantener sesión activa
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
