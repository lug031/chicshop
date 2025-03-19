<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import LoginModal from '../components/LoginModal.vue'
</script>

<template>
  <main>
    <div class="flex justify-end p-4">
      <LoginModal />
    </div>
    <TheWelcome />
  </main>
</template>
