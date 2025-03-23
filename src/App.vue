<script setup lang="ts">
import { onMounted } from 'vue';
import Toast from './components/common/Toast.vue';
import InactivityWarning from './components/InactivityWarning.vue';
import { useAuthStore } from '@/stores/auth';

// Verificar autenticación al inicio
const authStore = useAuthStore();

onMounted(() => {
  // Verificar el estado de autenticación cuando se monta la aplicación
  authStore.checkAuth();
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Contenido principal con flex-grow para ocupar espacio disponible -->
    <div class="flex-grow">
      <Toast />
      <InactivityWarning />
      <RouterView />
    </div>
  </div>
</template>

<style>
/* Estilos adicionales para garantizar que el footer siempre esté abajo */
html,
body {
  height: 100%;
  margin: 0;
}
</style>
