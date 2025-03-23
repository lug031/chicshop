<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// Estado
const isLoading = ref(true)
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  image: string;
  categories: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  isNew: boolean;
}

const products = ref<Product[]>([])
const categories = ref([
  { id: 'all', name: 'Todos' },
  { id: 'new', name: 'Novedades' },
  { id: 'popular', name: 'Populares' },
  { id: 'sale', name: 'Rebajas' }
])
const selectedCategory = ref('all')
const priceRange = ref([0, 500])
const sizes = ref([
  { id: 'xs', label: 'XS', selected: false },
  { id: 's', label: 'S', selected: false },
  { id: 'm', label: 'M', selected: false },
  { id: 'l', label: 'L', selected: false },
  { id: 'xl', label: 'XL', selected: false }
])
const colors = ref([
  { id: 'black', color: 'bg-black', selected: false },
  { id: 'white', color: 'bg-white border border-gray-300', selected: false },
  { id: 'gray', color: 'bg-gray-400', selected: false },
  { id: 'red', color: 'bg-red-500', selected: false },
  { id: 'blue', color: 'bg-blue-500', selected: false },
  { id: 'green', color: 'bg-green-500', selected: false }
])
const showFilters = ref(false)
const sortOptions = ref([
  { id: 'newest', name: 'Más recientes' },
  { id: 'price-asc', name: 'Precio: Menor a mayor' },
  { id: 'price-desc', name: 'Precio: Mayor a menor' },
  { id: 'name-asc', name: 'Nombre: A-Z' },
  { id: 'name-desc', name: 'Nombre: Z-A' }
])
const selectedSort = ref('newest')

const route = useRoute()

// Cargar productos (simulados)
onMounted(async () => {
  try {
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 800))

    // Generar productos de muestra
    products.value = generateSampleProducts(32)

    // Comprobar si hay categoría en la URL
    const categoryParam = route.query.category
    if (categoryParam && categories.value.some(cat => cat.id === categoryParam)) {
      selectedCategory.value = categoryParam as string
    }

    isLoading.value = false
  } catch (error) {
    console.error('Error al cargar productos:', error)
    isLoading.value = false
  }
})

// Filtrar y ordenar productos
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Filtrar por categoría
  if (selectedCategory.value !== 'all') {
    result = result.filter(product => product.categories.includes(selectedCategory.value))
  }

  // Filtrar por precio
  result = result.filter(product =>
    product.price >= priceRange.value[0] && product.price <= priceRange.value[1]
  )

  // Filtrar por tallas
  const selectedSizes = sizes.value.filter(size => size.selected).map(size => size.id)
  if (selectedSizes.length > 0) {
    result = result.filter(product =>
      product.sizes.some(size => selectedSizes.includes(size))
    )
  }

  // Filtrar por colores
  const selectedColors = colors.value.filter(color => color.selected).map(color => color.id)
  if (selectedColors.length > 0) {
    result = result.filter(product =>
      product.colors.some(color => selectedColors.includes(color))
    )
  }

  // Ordenar productos
  switch (selectedSort.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'newest':
    default:
      result.sort((a, b) => b.id - a.id)
      break
  }

  return result
})

// Métodos
const toggleCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const toggleSize = (sizeId: string) => {
  const size = sizes.value.find(s => s.id === sizeId)
  if (size) {
    size.selected = !size.selected
  }
}

const toggleColor = (colorId: string) => {
  const color = colors.value.find(c => c.id === colorId)
  if (color) {
    color.selected = !color.selected
  }
}

const clearFilters = () => {
  selectedCategory.value = 'all'
  priceRange.value = [0, 500]
  sizes.value.forEach(size => size.selected = false)
  colors.value.forEach(color => color.selected = false)
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

// Funciones auxiliares
function generateSampleProducts(count: number) {
  const productTypes = ['Camiseta', 'Pantalón', 'Vestido', 'Chaqueta', 'Zapatos', 'Camisa', 'Sudadera', 'Abrigo']
  const adjectives = ['Premium', 'Clásico', 'Moderno', 'Elegante', 'Casual', 'Slim fit', 'Oversize', 'Básico']
  const sampleProducts = []

  for (let i = 1; i <= count; i++) {
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)]
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomCategories = []

    // Asignar categorías aleatorias
    if (Math.random() > 0.7) randomCategories.push('new')
    if (Math.random() > 0.7) randomCategories.push('popular')
    if (Math.random() > 0.8) randomCategories.push('sale')

    // Asegurar que tiene al menos una categoría
    if (randomCategories.length === 0) {
      randomCategories.push(categories.value[Math.floor(Math.random() * (categories.value.length - 1)) + 1].id)
    }

    // Generar tallas aleatorias
    const availableSizes: string[] = []
    sizes.value.forEach(size => {
      if (Math.random() > 0.3) availableSizes.push(size.id)
    })

    // Generar colores aleatorios
    const availableColors = []
    colors.value.forEach(color => {
      if (Math.random() > 0.5) availableColors.push(color.id)
    })

    // Asegurar que tiene al menos un color
    if (availableColors.length === 0) {
      availableColors.push(colors.value[Math.floor(Math.random() * colors.value.length)].id)
    }

    // Calcular precio base por tipo de producto
    let basePrice = 0
    switch (productType) {
      case 'Camiseta':
      case 'Camisa':
        basePrice = 25 + Math.floor(Math.random() * 20)
        break
      case 'Pantalón':
      case 'Sudadera':
        basePrice = 40 + Math.floor(Math.random() * 30)
        break
      case 'Vestido':
        basePrice = 50 + Math.floor(Math.random() * 50)
        break
      case 'Chaqueta':
      case 'Abrigo':
        basePrice = 80 + Math.floor(Math.random() * 80)
        break
      case 'Zapatos':
        basePrice = 60 + Math.floor(Math.random() * 60)
        break
    }

    // Aplicar descuento si está en rebajas
    let finalPrice = basePrice
    let discountPercent = null

    if (randomCategories.includes('sale')) {
      discountPercent = Math.floor(Math.random() * 4) * 10 + 10 // 10%, 20%, 30% o 40%
      finalPrice = Math.round(basePrice * (1 - discountPercent / 100))
    }

    // Crear el producto
    sampleProducts.push({
      id: i,
      name: `${adjective} ${productType}`,
      price: finalPrice,
      originalPrice: discountPercent ? basePrice : null,
      discountPercent: discountPercent,
      image: `https://placehold.co/300x400?text=${productType}`,
      categories: randomCategories,
      sizes: availableSizes,
      colors: availableColors,
      rating: Math.floor(Math.random() * 5) + 1,
      isNew: randomCategories.includes('new')
    })
  }

  return sampleProducts
}
</script>

<template>
  <div class="bg-gray-50">
    <!-- Hero Banner -->
    <div class="relative">
      <div class="h-64 sm:h-80 lg:h-96 w-full bg-gray-300 flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
        <img src="https://placehold.co/1920x600?text=CHIC SHOP+COLLECTION" alt="CHIC SHOP Collection"
          class="w-full h-full object-cover">
        <div class="absolute z-20 text-center text-white">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">NUEVA COLECCIÓN</h1>
          <p class="text-lg sm:text-xl mb-6">Descubre las últimas tendencias</p>
          <button class="bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors">
            COMPRAR AHORA
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Título y Filtro Móvil -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Tienda</h2>
        <button @click="toggleFilters" class="sm:hidden flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
        </button>
      </div>

      <!-- Categorías -->
      <div class="mb-8">
        <div class="flex overflow-x-auto pb-2 -mx-4 px-4 sm:px-0 scrollbar-hide">
          <div class="flex space-x-4">
            <button v-for="category in categories" :key="category.id" @click="toggleCategory(category.id)"
              class="px-4 py-2 whitespace-nowrap font-medium rounded-md transition-colors" :class="selectedCategory === category.id
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'">
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filtros - Desktop -->
        <div class="hidden sm:block">
          <div class="bg-white shadow-sm rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-900">Filtros</h3>
              <button @click="clearFilters" class="text-sm text-gray-500 hover:text-black">
                Limpiar todo
              </button>
            </div>

            <!-- Filtro: Precio -->
            <div class="border-t border-gray-200 py-4">
              <h4 class="font-medium text-gray-900 mb-3">Precio</h4>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-500">€{{ priceRange[0] }}</span>
                <span class="text-sm text-gray-500">€{{ priceRange[1] }}</span>
              </div>
              <input type="range" min="0" max="500" step="10" v-model.number="priceRange[0]" class="w-full">
              <input type="range" min="0" max="500" step="10" v-model.number="priceRange[1]" class="w-full">
            </div>

            <!-- Filtro: Tallas -->
            <div class="border-t border-gray-200 py-4">
              <h4 class="font-medium text-gray-900 mb-3">Tallas</h4>
              <div class="grid grid-cols-5 gap-2">
                <button v-for="size in sizes" :key="size.id" @click="toggleSize(size.id)"
                  class="flex items-center justify-center w-10 h-10 text-sm font-medium border rounded-md transition-colors"
                  :class="size.selected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'">
                  {{ size.label }}
                </button>
              </div>
            </div>

            <!-- Filtro: Colores -->
            <div class="border-t border-gray-200 py-4">
              <h4 class="font-medium text-gray-900 mb-3">Colores</h4>
              <div class="flex flex-wrap gap-2">
                <button v-for="color in colors" :key="color.id" @click="toggleColor(color.id)"
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-transform"
                  :class="[color.color, color.selected ? 'ring-2 ring-offset-2 ring-black scale-110' : '']">
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros - Móvil -->
        <div v-if="showFilters" class="fixed inset-0 z-40 sm:hidden">
          <div class="fixed inset-0 bg-black bg-opacity-50" @click="toggleFilters"></div>
          <div class="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-bold text-lg text-gray-900">Filtros</h3>
              <button @click="toggleFilters" class="text-gray-500">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Filtro: Precio -->
            <div class="border-t border-gray-200 py-4">
              <h4 class="font-medium text-gray-900 mb-3">Precio</h4>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-500">€{{ priceRange[0] }}</span>
                <span class="text-sm text-gray-500">€{{ priceRange[1] }}</span>
              </div>
              <input type="range" min="0" max="500" step="10" v-model.number="priceRange[0]" class="w-full">
              <input type="range" min="0" max="500" step="10" v-model.number="priceRange[1]" class="w-full">
            </div>

            <!-- Filtro: Tallas -->
            <div class="border-t border-gray-200 py-4">
              <h4 class="font-medium text-gray-900 mb-3">Tallas</h4>
              <div class="grid grid-cols-5 gap-2">
                <button v-for="size in sizes" :key="size.id" @click="toggleSize(size.id)"
                  class="flex items-center justify-center w-10 h-10 text-sm font-medium border rounded-md transition-colors"
                  :class="size.selected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'">
                  {{ size.label }}
                </button>
              </div>
            </div>

            <!-- Filtro: Colores -->
            <div class="border-t border-gray-200 py-4">
              <h4 class="font-medium text-gray-900 mb-3">Colores</h4>
              <div class="flex flex-wrap gap-2">
                <button v-for="color in colors" :key="color.id" @click="toggleColor(color.id)"
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-transform"
                  :class="[color.color, color.selected ? 'ring-2 ring-offset-2 ring-black scale-110' : '']">
                </button>
              </div>
            </div>

            <div class="mt-6 flex space-x-2">
              <button @click="clearFilters"
                class="flex-1 bg-white text-gray-700 border border-gray-300 py-2 font-medium hover:bg-gray-50">
                Limpiar
              </button>
              <button @click="toggleFilters" class="flex-1 bg-black text-white py-2 font-medium hover:bg-gray-900">
                Aplicar
              </button>
            </div>
          </div>
        </div>

        <!-- Lista de productos -->
        <div class="lg:col-span-3">
          <!-- Ordenar y resultados -->
          <div class="flex justify-between items-center mb-6">
            <p class="text-sm text-gray-500">
              {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'resultado' : 'resultados' }}
            </p>

            <div class="flex items-center">
              <label for="sort" class="text-sm text-gray-500 mr-2">Ordenar por:</label>
              <select id="sort" v-model="selectedSort"
                class="rounded-md border-gray-300 text-sm focus:ring-black focus:border-black">
                <option v-for="option in sortOptions" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Estado de carga -->
          <div v-if="isLoading" class="py-16 flex justify-center">
            <div class="animate-pulse flex flex-col items-center">
              <div class="h-10 w-10 bg-black rounded-full"></div>
              <p class="mt-4 text-gray-600">Cargando productos...</p>
            </div>
          </div>

          <!-- Grid de productos -->
          <div v-else-if="filteredProducts.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            <div v-for="product in filteredProducts" :key="product.id" class="group">
              <div class="relative aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden">
                <img :src="product.image" :alt="product.name" class="w-full h-full object-cover object-center">
                <div class="absolute inset-x-0 top-0 p-2 flex justify-between">
                  <div v-if="product.isNew" class="bg-black text-white text-xs px-2 py-1 font-medium">Nuevo</div>
                  <div v-if="product.discountPercent" class="bg-red-600 text-white text-xs px-2 py-1 font-medium">
                    -{{ product.discountPercent }}%
                  </div>
                </div>
                <div
                  class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                  <button
                    class="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black font-medium py-2 px-4 rounded-md shadow-sm hover:bg-gray-100">
                    Ver producto
                  </button>
                </div>
              </div>
              <div class="mt-4">
                <h3 class="text-sm font-medium text-gray-900">{{ product.name }}</h3>
                <div class="mt-1 flex items-center">
                  <p class="font-medium text-gray-900">€{{ product.price.toFixed(2) }}</p>
                  <p v-if="product.originalPrice" class="ml-2 text-sm text-gray-500 line-through">
                    €{{ product.originalPrice.toFixed(2) }}
                  </p>
                </div>
                <div class="mt-1 flex space-x-1">
                  <div v-for="i in 5" :key="i" class="text-xs"
                    :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'">
                    ★
                  </div>
                </div>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span v-for="color in product.colors" :key="color" class="w-4 h-4 rounded-full"
                    :class="`bg-${color === 'white' ? 'white border border-gray-300' : color}`">
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- No hay resultados -->
          <div v-else class="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-600 mb-4">No se encontraron productos que coincidan con los filtros seleccionados.</p>
            <button @click="clearFilters"
              class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors">
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de categorías destacadas -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Categorías destacadas</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="relative h-80 rounded-lg overflow-hidden group">
          <img src="https://placehold.co/600x800?text=Mujer" alt="Categoría Mujer"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h3 class="text-white text-2xl font-bold mb-2">Mujer</h3>
            <p class="text-white text-sm mb-4">Ver nuestra colección para mujer</p>
            <a href="/mujer"
              class="text-white text-sm font-medium border-b border-white inline-block pb-1 transition-colors hover:text-gray-200 hover:border-gray-200">
              Descubrir →
            </a>
          </div>
        </div>

        <div class="relative h-80 rounded-lg overflow-hidden group">
          <img src="https://placehold.co/600x800?text=Hombre" alt="Categoría Hombre"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h3 class="text-white text-2xl font-bold mb-2">Hombre</h3>
            <p class="text-white text-sm mb-4">Ver nuestra colección para hombre</p>
            <a href="/hombre"
              class="text-white text-sm font-medium border-b border-white inline-block pb-1 transition-colors hover:text-gray-200 hover:border-gray-200">
              Descubrir →
            </a>
          </div>
        </div>

        <div class="relative h-80 rounded-lg overflow-hidden group">
          <img src="https://placehold.co/600x800?text=Accesorios" alt="Categoría Accesorios"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h3 class="text-white text-2xl font-bold mb-2">Accesorios</h3>
            <p class="text-white text-sm mb-4">Complementa tu look con nuestros accesorios</p>
            <a href="/accesorios"
              class="text-white text-sm font-medium border-b border-white inline-block pb-1 transition-colors hover:text-gray-200 hover:border-gray-200">
              Descubrir →
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
