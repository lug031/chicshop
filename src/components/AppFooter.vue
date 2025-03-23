<script setup lang="ts">
//import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Props para personalizar el footer en diferentes contextos
defineProps({
  brand: {
    type: String,
    default: 'CHIC SHOP'
  }
})

// Estado para el formulario de newsletter
/*const email = ref('')
const subscribed = ref(false)
const subscribing = ref(false)

// Método para suscribirse al newsletter
const subscribe = () => {
  if (!email.value || !email.value.includes('@')) return

  subscribing.value = true

  // Simulación de envío (reemplazar con lógica real)
  setTimeout(() => {
    subscribing.value = false
    subscribed.value = true
    email.value = ''

    // Ocultar mensaje después de unos segundos
    setTimeout(() => {
      subscribed.value = false
    }, 5000)
  }, 1000)
}*/
</script>

<template>
  <footer class="bg-black text-white">
    <!-- Sección pre-footer con suscripción destacada -->
    <!-- <div class="border-b border-gray-800">
      <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
          <h3 class="text-xl font-bold">Únete a nuestra newsletter</h3>
          <p class="mt-2 md:mt-0 md:ml-4 text-sm text-gray-400 max-w-md">
            Recibe novedades, inspiración y ofertas exclusivas directamente en tu bandeja de entrada
          </p>
          <div class="mt-4 md:mt-0 md:ml-6 flex-1 max-w-md">
            <div class="relative">
              <input v-model="email" type="email" placeholder="Tu email"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                :disabled="subscribing || subscribed" @keyup.enter="subscribe" />
              <button @click="subscribe"
                class="absolute right-1 top-1 bottom-1 px-4 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-70"
                :disabled="subscribing || subscribed || !email || !email.includes('@')">
                <span v-if="!subscribing && !subscribed">Suscribirme</span>
                <span v-else-if="subscribing" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Procesando
                </span>
                <span v-else>¡Suscrito!</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>-->

    <!-- Contenido principal del footer -->
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Columna 1: Sobre Nosotros -->
        <div>
          <div class="flex items-center mb-6">
            <h3 class="text-xl font-bold">{{ brand }}</h3>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">
            Moda sostenible diseñada para el estilo de vida contemporáneo. Desde 2010 ofrecemos prendas de calidad
            con un compromiso con la elegancia, el diseño y la responsabilidad.
          </p>

          <div class="mt-6 flex space-x-5">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <span class="sr-only">Instagram</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <span class="sr-only">Pinterest</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Columna 2: Enlaces de Compra -->
        <div>
          <h3 class="text-base font-bold text-white uppercase tracking-wider mb-4">Comprar</h3>
          <ul class="space-y-3">
            <li>
              <RouterLink to="/tienda" class="text-gray-400 hover:text-white transition-colors">
                Ver todo
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/novedades" class="text-gray-400 hover:text-white transition-colors">
                Novedades
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/mujer" class="text-gray-400 hover:text-white transition-colors">
                Mujer
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/hombre" class="text-gray-400 hover:text-white transition-colors">
                Hombre
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/accesorios" class="text-gray-400 hover:text-white transition-colors">
                Accesorios
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/ofertas" class="text-gray-400 hover:text-white transition-colors">
                Rebajas
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Columna 3: Información -->
        <div>
          <h3 class="text-base font-bold text-white uppercase tracking-wider mb-4">Información</h3>
          <ul class="space-y-3">
            <li>
              <RouterLink to="/sobre-nosotros" class="text-gray-400 hover:text-white transition-colors">
                Sobre CHIC SHOP
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/sostenibilidad" class="text-gray-400 hover:text-white transition-colors">
                Sostenibilidad
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/blog" class="text-gray-400 hover:text-white transition-colors">
                Blog
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/tiendas" class="text-gray-400 hover:text-white transition-colors">
                Tiendas físicas
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/empleo" class="text-gray-400 hover:text-white transition-colors">
                Trabaja con nosotros
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Columna 4: Ayuda -->
        <div>
          <h3 class="text-base font-bold text-white uppercase tracking-wider mb-4">Ayuda</h3>
          <ul class="space-y-3">
            <li>
              <RouterLink to="/contacto" class="text-gray-400 hover:text-white transition-colors">
                Contacto
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/envios" class="text-gray-400 hover:text-white transition-colors">
                Envío y entregas
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/devoluciones" class="text-gray-400 hover:text-white transition-colors">
                Devoluciones
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/guia-tallas" class="text-gray-400 hover:text-white transition-colors">
                Guía de tallas
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/faqs" class="text-gray-400 hover:text-white transition-colors">
                Preguntas frecuentes
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Parte inferior del footer -->
      <div class="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-400">© {{ new Date().getFullYear() }} {{ brand }}. Todos los derechos reservados.
        </p>
        <div class="flex flex-wrap justify-center space-x-6 mt-4 md:mt-0">
          <RouterLink to="/privacidad" class="text-sm text-gray-400 hover:text-white transition-colors">
            Política de privacidad
          </RouterLink>
          <RouterLink to="/terminos" class="text-sm text-gray-400 hover:text-white transition-colors">
            Términos y condiciones
          </RouterLink>
          <RouterLink to="/cookies" class="text-sm text-gray-400 hover:text-white transition-colors">
            Política de cookies
          </RouterLink>
          <RouterLink to="/accesibilidad" class="text-sm text-gray-400 hover:text-white transition-colors">
            Accesibilidad
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
