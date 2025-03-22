// src/types/profile.types.ts

export interface Profile {
  id: string
  userID: string
  firstName: string
  lastName: string
  documentNumber?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone: string
  email?: string
  avatarUrl?: string
  preferences?: string // JSON string con preferencias
  createdAt: string
  updatedAt: string
}

export interface CreateProfileInput {
  userID: string
  firstName: string
  lastName: string
  documentNumber?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone: string
  email?: string
  avatarUrl?: string
  preferences?: string
}

export interface UpdateProfileInput {
  id: string
  firstName?: string
  lastName?: string
  documentNumber?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  email?: string
  avatarUrl?: string
  preferences?: string
}
