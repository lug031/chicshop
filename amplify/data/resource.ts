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
      imageUrl: a.string(), // Imagen de la categoría para el menú/banners
      esDestacado: a.boolean(), // Para destacar categorías en la página principal
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
      gender: a.enum(['men', 'women', 'unisex', 'boys', 'girls', 'baby']),
      size: a.string(), // Podría ser JSON si hay múltiples tallas disponibles
      color: a.string(), // Podría ser JSON si hay múltiples colores disponibles
      material: a.string(),
      season: a.enum(['spring-summer', 'autumn-winter', 'all-year']),
      productType: a.enum([
        'tshirt',
        'shirt',
        'blouse',
        'sweater',
        'jacket',
        'coat',
        'pants',
        'jeans',
        'shorts',
        'skirt',
        'dress',
        'sneakers',
        'boots',
        'sandals',
        'heels',
        'bag',
        'backpack',
        'accessory',
        'underwear',
        'swimwear',
        'other',
      ]),
      // Imágenes
      imageUrl: a.string(),
      additionalImages: a.string(), // JSON array con URLs adicionales
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

  // Modelo para variaciones de producto (tallas/colores)
  ProductVariation: a
    .model({
      productID: a.string(),
      product: a.belongsTo('Product', 'productID'),
      size: a.string(),
      color: a.string(),
      stock: a.integer(),
      sku: a.string(),
      isDefault: a.boolean(), // Para indicar la variación mostrada por defecto
      imageUrl: a.string(),
      additionalImages: a.string(), // JSON array con URLs adicionales
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
      variationID: a.string(), // Referencia a ProductVariation si se usa
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
