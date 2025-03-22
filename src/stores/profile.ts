// src/stores/profile.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Schema } from '../../amplify/data/resource'
import type { CreateProfileInput, Profile, UpdateProfileInput } from '@/types/profile.types'
import { generateClient } from 'aws-amplify/data'
import { useAuthStore } from './auth'

const authClient = generateClient<Schema>({
  authMode: 'userPool',
})

export const useProfileStore = defineStore('profile', () => {
  const authStore = useAuthStore()

  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUserProfile = async (forceRefresh = false) => {
    // Si ya tenemos el perfil y no queremos forzar la recarga, retornamos
    if (profile.value && !forceRefresh) return profile.value

    // Verificamos si hay un usuario autenticado
    if (!authStore.isAuthenticated) {
      profile.value = null
      return null
    }

    loading.value = true
    try {
      // Obtener el userID del usuario actual autenticado
      const userID = authStore.user?.userId

      if (!userID) {
        throw new Error('No se encontró ID de usuario')
      }

      console.log('Buscando perfil para userID:', userID)

      // Consultar perfiles filtrando por userID
      const { data: profiles } = await authClient.models.Profile.list({
        filter: {
          userID: {
            eq: userID,
          },
        },
      })

      console.log('Perfiles encontrados:', profiles)

      if (profiles && profiles.length > 0) {
        profile.value = profiles[0] as unknown as Profile
        return profile.value
      } else {
        profile.value = null
        return null
      }
    } catch (err) {
      error.value = 'Error al cargar perfil'
      console.error('Error al cargar perfil:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createProfile = async (profileData: CreateProfileInput) => {
    loading.value = true
    try {
      const now = new Date().toISOString()

      // Crear el perfil
      const { data: newProfile } = await authClient.models.Profile.create({
        ...profileData,
        createdAt: now,
        updatedAt: now,
      })

      profile.value = newProfile as unknown as Profile
      return profile.value
    } catch (err) {
      error.value = 'Error al crear perfil'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (updateData: UpdateProfileInput) => {
    if (!profile.value) {
      throw new Error('No hay perfil para actualizar')
    }

    loading.value = true
    try {
      const now = new Date().toISOString()

      // Actualizar el perfil
      const { data: updatedProfile } = await authClient.models.Profile.update({
        ...updateData,
        id: updateData.id,
        updatedAt: now,
      })

      profile.value = updatedProfile as unknown as Profile
      return profile.value
    } catch (err) {
      error.value = 'Error al actualizar perfil'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearProfile = () => {
    profile.value = null
  }

  return {
    profile,
    loading,
    error,
    fetchUserProfile,
    createProfile,
    updateProfile,
    clearProfile,
  }
})
