import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Category: a
    .model({
      name: a.string(),
      description: a.string(),
      active: a.boolean(),
      type: a.enum(['gender', 'productType', 'collection', 'season']),
      products: a.hasMany('ProductCategory', 'categoryID'),
      image: a.string(),
      displayOrder: a.integer(),
      featured: a.boolean(),
      // Hierarchical categories (optional)
      parentCategoryID: a.string(),
      parentCategory: a.belongsTo('Category', 'parentCategoryID'),
      subCategories: a.hasMany('Category', 'parentCategoryID'),
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  Profile: a
    .model({
      userID: a.string().required(), // ID de Cognito (owner)
      firstName: a.string(),
      lastName: a.string(),
      documentNumber: a.string(),
      email: a.string(),
      phone: a.string(),
      // Dirección
      address: a.string(),
      city: a.string(),
      state: a.string(),
      zipCode: a.string(),
      // Preferencias y otros datos
      preferences: a.string(), // JSON con preferencias
      avatarUrl: a.string(),
      // Timestamps
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      // Referencias a otros modelos
      orders: a.hasMany('Order', 'userID'),
      wishlist: a.hasMany('Wishlist', 'userID'),
      cart: a.belongsTo('Cart', 'userID'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'update']), // El propietario puede leer y actualizar
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']), // Admins tienen control total
    ]),

  Brand: a
    .model({
      name: a.string(),
      description: a.string(),
      logo: a.string(),
      active: a.boolean(),
      products: a.hasMany('Product', 'brandID'),
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
      discount: a.integer(),
      stock: a.integer(),
      active: a.boolean(),
      featured: a.boolean(),
      // Relationships
      categories: a.hasMany('ProductCategory', 'productID'),
      brandID: a.string(),
      brand: a.belongsTo('Brand', 'brandID'),
      // Basic clothing attributes
      gender: a.enum(['women', 'men', 'unisex']),
      productType: a.string(), // E.g: "dress", "pants", etc.
      season: a.string(), // E.g: "spring-summer", "all-year"
      // Variants as JSON
      sizes: a.string(), // JSON: ["S", "M", "L"]
      colors: a.string(), // JSON: [{"name": "Red", "code": "#FF0000"}]
      // Images
      mainImage: a.string(),
      additionalImages: a.string(), // JSON array
      // Related items
      cartItems: a.hasMany('CartItem', 'productID'),
      wishlistItems: a.hasMany('Wishlist', 'productID'),
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
      profile: a.hasOne('Profile', 'userID'), // Add this line to establish the relationship
      items: a.hasMany('CartItem', 'cartID'),
      status: a.enum(['active', 'processing', 'abandoned', 'completed']),
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
      size: a.string(),
      color: a.string(),
      price: a.float(),
      discount: a.integer(),
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  Order: a
    .model({
      // Customer
      userID: a.string(),
      profile: a.belongsTo('Profile', 'userID'), // Add this line to establish the relationship
      email: a.string(),
      firstName: a.string(),
      lastName: a.string(),
      phone: a.string(),
      documentNumber: a.string(),

      // Shipping
      address: a.string(),
      city: a.string(),
      state: a.string(),
      zipCode: a.string(),
      shippingMethod: a.string(),

      // Summary
      items: a.string(), // JSON with products and quantities
      subtotal: a.float(),
      shipping: a.float(),
      tax: a.float(),
      discount: a.float(),
      total: a.float(),

      // Status
      status: a.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']),
      tracking: a.string(), // Tracking number or URL

      // Payment
      paymentMethod: a.string(),
      paymentStatus: a.enum(['pending', 'authorized', 'paid', 'refunded', 'failed']),
      paymentLink: a.string(),

      // Dates
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read', 'create']),
      allow.publicApiKey().to(['read', 'create']),
    ]),

  Wishlist: a
    .model({
      userID: a.string(),
      profile: a.belongsTo('Profile', 'userID'), // Add this line to establish the relationship
      productID: a.string(),
      product: a.belongsTo('Product', 'productID'),
      createdAt: a.datetime(),
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
