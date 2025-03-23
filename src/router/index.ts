// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importaciones con importación dinámica para mejor rendimiento
const MainLayout = () => import('@/layouts/MainLayout.vue')
const AuthenticatedLayout = () => import('@/layouts/AuthenticatedLayout.vue')
const TiendaView = () => import('@/views/TiendaView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas con layout principal
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: TiendaView,
          meta: {
            title: 'Tienda',
          },
        },
        {
          path: 'tienda',
          name: 'tienda',
          component: TiendaView,
          meta: {
            title: 'Tienda',
          },
        },
        {
          path: 'novedades',
          name: 'novedades',
          component: TiendaView, // Podría ser un componente específico para Novedades
          meta: {
            title: 'Novedades',
          },
        },
        {
          path: 'mujer',
          name: 'mujer',
          component: TiendaView, // Filtrado para mujer
          meta: {
            title: 'Mujer',
            category: 'mujer',
          },
        },
        {
          path: 'hombre',
          name: 'hombre',
          component: TiendaView, // Filtrado para hombre
          meta: {
            title: 'Hombre',
            category: 'hombre',
          },
        },
        {
          path: 'accesorios',
          name: 'accesorios',
          component: TiendaView, // Filtrado para accesorios
          meta: {
            title: 'Accesorios',
            category: 'accesorios',
          },
        },
        // Otras rutas públicas...
      ],
    },
    // Rutas autenticadas con layout específico
    {
      path: '/',
      component: AuthenticatedLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView,
          meta: {
            title: 'Mi Cuenta',
          },
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: {
            title: 'Mi Perfil',
          },
        },
        /*{
          path: 'pedidos',
          name: 'pedidos',
          component: () => import('@/views/PedidosView.vue'), // Carga bajo demanda
          meta: {
            title: 'Mis Pedidos',
          },
        },
        {
          path: 'wishlist',
          name: 'wishlist',
          component: () => import('@/views/WishlistView.vue'), // Carga bajo demanda
          meta: {
            title: 'Lista de Deseos',
          },
        },*/
        // Añade más rutas autenticadas aquí
      ],
    },
    // Ruta de 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: 'Página no encontrada',
      },
    },
  ],
})

// Guardia de navegación
router.beforeEach(async (to, from, next) => {
  // Establecer el título de la página
  document.title = `${to.meta.title || 'Aplicación'} | CHIC SHOP`

  const authStore = useAuthStore()
  await authStore.checkAuth()

  // Verificar si la ruta requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      // Si no está autenticado, mostrar el modal de login en la página actual
      // y guardar la ruta a la que quería ir para redirección posterior
      next({
        path: '/',
        query: { showLogin: 'true', redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
