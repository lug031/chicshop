import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Category: a
    .model({
      name: a.string(),
      description: a.string(),
      active: a.boolean(),
      products: a.hasMany('ProductCategory', 'categoryID'),
      tipo: a.enum([
        'genero',
        'temporada',
        'tipoProducto',
        'coleccion',
        'ocasion',
        'destacado',
        'otro',
      ]),
      parentCategoryID: a.string(),
      parentCategory: a.belongsTo('Category', 'parentCategoryID'),
      subCategories: a.hasMany('Category', 'parentCategoryID'),
      ordenVisualizacion: a.integer(),
      imageUrl: a.string(),
      esDestacado: a.boolean(),
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  Brand: a
    .model({
      name: a.string(),
      description: a.string(),
      logo: a.string(),
      active: a.boolean(),
      products: a.hasMany('Product', 'brandID'),
      country: a.string(), // País de origen de la marca
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  Product: a
    .model({
      name: a.string(),
      description: a.string(),
      price: a.float(),
      originalPrice: a.float(),
      discountPercentage: a.integer(),
      stock: a.integer(),
      active: a.boolean(),
      carousel: a.boolean(),
      isPromoted: a.boolean(),
      categories: a.hasMany('ProductCategory', 'productID'),
      brandID: a.string(),
      brand: a.belongsTo('Brand', 'brandID'),
      // Atributos específicos para ropa
      gender: a.enum(['mujer', 'hombre', 'unisex']),
      temporada: a.enum(['primavera-verano', 'otono-invierno', 'todo-el-ano', 'bano', 'halloween']),
      tipoProducto: a.enum([
        // Tops
        'camiseta',
        'blusa',
        'camisa',
        'sueter',
        'top',
        'crop-top',
        // Bottoms
        'pantalon',
        'jeans',
        'shorts',
        'falda',
        'leggins',
        // Full body
        'vestido',
        'jumpsuit',
        'enterizo',
        'conjunto',
        // Outerwear
        'chaqueta',
        'abrigo',
        'cardigan',
        'blazer',
        // Swimwear
        'traje-de-bano',
        'bikini',
        'salida-de-bano',
        // Lingerie & Sleepwear
        'lenceria',
        'pijama',
        'ropa-interior',
        'sosten',
        // Footwear
        'tenis',
        'botas',
        'sandalias',
        'tacones',
        'zapatos-planos',
        // Accessories
        'bolso',
        'cartera',
        'joyeria',
        'sombrero',
        'bufanda',
        'cinturon',
        'accesorio',
        // Halloween specific
        'disfraz',
        'accesorio-halloween',
        // Other
        'otro',
      ]),
      ocasion: a.enum([
        'casual',
        'trabajo',
        'fiesta',
        'formal',
        'deportiva',
        'playa',
        'halloween',
        'evento-especial',
        'diario',
        'otro',
      ]),
      material: a.string(),
      // Imágenes y variantes
      imageUrl: a.string(),
      additionalImages: a.string(), // JSON array con URLs adicionales
      // Información de tallas y colores disponibles (como JSON)
      tallas: a.string(), // JSON array con tallas disponibles
      colores: a.string(), // JSON array con colores disponibles
      // Promociones
      promotionStartDate: a.string(),
      promotionEndDate: a.string(),
      promotionType: a.string(),
      cartItems: a.hasMany('CartItem', 'productID'),
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  ProductCategory: a
    .model({
      productID: a.string(),
      categoryID: a.string(),
      product: a.belongsTo('Product', 'productID'),
      category: a.belongsTo('Category', 'categoryID'),
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  Cart: a
    .model({
      userID: a.string(),
      items: a.hasMany('CartItem', 'cartID'),
      status: a.enum(['active', 'checkout', 'abandoned', 'completed']),
      subtotal: a.float(),
      total: a.float(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  CartItem: a
    .model({
      cartID: a.string(),
      cart: a.belongsTo('Cart', 'cartID'),
      productID: a.string(),
      product: a.belongsTo('Product', 'productID'),
      quantity: a.integer(),
      // Atributos específicos para ropa
      size: a.string(),
      color: a.string(),
      variationID: a.string(), // ID para identificar combinación talla/color
      price: a.float(),
      originalPrice: a.float(),
      discountPercentage: a.integer(),
      isPromoted: a.boolean(),
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  Order: a
    .model({
      // Customer Info
      firstName: a.string(),
      lastName: a.string(),
      email: a.string(),
      documentType: a.string(),
      documentNumber: a.string(),
      phone: a.string(),

      // Información de entrega
      shippingMethod: a.string(),
      shippingAddress: a.string(),
      shippingCity: a.string(),
      shippingState: a.string(),
      shippingZip: a.string(),

      // Facturación
      invoiceType: a.string(),

      // Order Items como JSON string
      items: a.string(),

      userEmail: a.string(),

      // Order Totals
      subtotal: a.float(),
      shipping: a.float(),
      tax: a.float(), // Impuestos aplicables
      discount: a.float(), // Descuentos aplicados
      total: a.float(),

      // Status
      status: a.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']),

      // Seguimiento
      trackingNumber: a.string(),
      trackingUrl: a.string(),

      // Payment
      paymentMethod: a.string(),
      paymentStatus: a.enum(['pending', 'authorized', 'paid', 'refunded', 'failed']),
      linkPago: a.string(),
      linkShort: a.string(),

      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read', 'create']),
      allow.publicApiKey().to(['read', 'create']),
    ]),

  // Modelo para wishlist/favoritos
  Wishlist: a
    .model({
      userID: a.string(),
      productID: a.string(),
      product: a.belongsTo('Product', 'productID'),
      addedAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated().to(['read', 'create', 'delete'])]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
})
