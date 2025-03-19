import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
  name: 'tiendaRopaStorage',
  access: (allow) => ({
    'products/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admin']).to(['read', 'write', 'delete']),
    ],
    'brands/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['admin']).to(['read', 'write', 'delete']),
    ],
    'order-images/*': [
      allow.guest.to(['read', 'write']),
      allow.authenticated.to(['read', 'write']),
      allow.groups(['admin']).to(['read', 'write', 'delete']),
    ],
  }),
})
