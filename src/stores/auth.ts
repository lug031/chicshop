import { defineStore } from 'pinia'
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  confirmSignUp,
  confirmSignIn,
  fetchAuthSession,
  fetchUserAttributes,
} from 'aws-amplify/auth'
import type { AuthState, LoginResponse } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
    userAttributes: null,
  }),

  actions: {
    resetState() {
      this.user = null
      this.loading = false
      this.error = null
      this.userAttributes = null
    },

    formatPeruPhoneNumber(phone: string): string {
      // Eliminar espacios y guiones
      let cleanPhone = phone.replace(/[\s-]/g, '')

      // Si no comienza con +, agregar el prefijo para Perú
      if (!cleanPhone.startsWith('+')) {
        // Si comienza con 0, eliminarlo
        if (cleanPhone.startsWith('0')) {
          cleanPhone = cleanPhone.substring(1)
        }

        // Asegurarse que tenga 9 dígitos para celulares de Perú
        if (cleanPhone.length === 9) {
          // Agregar prefijo de Perú +51
          cleanPhone = '+51' + cleanPhone
        } else {
          // Si falta el 9 inicial de los celulares de Perú
          if (cleanPhone.length === 8) {
            cleanPhone = '+519' + cleanPhone
          } else {
            // Si ya tiene el 9 inicial pero falta el código del país
            cleanPhone = '+51' + cleanPhone
          }
        }
      }

      return cleanPhone
    },

    async login(email: string, password: string): Promise<LoginResponse> {
      this.loading = true
      this.error = null

      try {
        const result = await signIn({
          username: email,
          password,
        })
        console.log('Resultado del signIn:', JSON.stringify(result, null, 2))

        if (!result) {
          throw new Error('Error en el inicio de sesión')
        }

        if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          return {
            requiresNewPassword: true,
            email: email,
            temporaryPassword: password,
            ...result,
            nextStep: { signInStep: result.nextStep.signInStep },
          }
        }

        if (result.isSignedIn) {
          const user = await getCurrentUser()
          this.user = user
          const attributes = await fetchUserAttributes()
          this.userAttributes = attributes
        }

        return {
          requiresNewPassword: false,
          email: email,
          ...result,
          nextStep: result.nextStep ? { signInStep: result.nextStep.signInStep } : undefined,
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        this.error = errorMessage
        throw new Error(`Error de inicio de sesión: ${errorMessage}`)
      } finally {
        this.loading = false
      }
    },

    async completeNewPasswordChallenge(
      email: string,
      temporaryPassword: string,
      newPassword: string,
    ): Promise<boolean> {
      this.loading = true
      this.error = null
      try {
        const result = await signIn({
          username: email,
          password: temporaryPassword,
          options: {
            authFlowType: 'USER_PASSWORD_AUTH',
          },
        })

        if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          const confirmResult = await confirmSignIn({
            challengeResponse: newPassword,
          })

          if (confirmResult.isSignedIn) {
            const user = await getCurrentUser()
            this.user = user
            const attributes = await fetchUserAttributes()
            this.userAttributes = attributes
            return true
          }
        }
        return false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al cambiar la contraseña'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(
      email: string,
      password: string,
      profileData?: {
        firstName?: string
        lastName?: string
        phone?: string
        documentNumber?: string
      },
    ) {
      this.loading = true
      this.error = null

      try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email: email,
              ...(profileData?.phone
                ? { phone_number: this.formatPeruPhoneNumber(profileData.phone) }
                : {}),
            },
          },
        })

        // Guardar los datos del perfil en localStorage para usarlos después de la confirmación
        if (profileData) {
          localStorage.setItem(
            `profile_data_${email}`,
            JSON.stringify({
              ...profileData,
              email: email,
              password: password, // Guardar la contraseña para iniciar sesión automáticamente después
              userId: userId,
            }),
          )
        }

        return { isSignUpComplete, userId, nextStep }
      } catch (error) {
        this.error = (error as Error).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async confirmSignUp(email: string, code: string) {
      this.loading = true
      this.error = null

      try {
        const { isSignUpComplete } = await confirmSignUp({
          username: email,
          confirmationCode: code,
        })

        return isSignUpComplete
      } catch (error) {
        this.error = (error as Error).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        await signOut()
        this.resetState()
      } catch (error) {
        this.error = (error as Error).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkAuth() {
      try {
        const user = await getCurrentUser()
        this.user = user
        const attributes = await fetchUserAttributes()
        this.userAttributes = attributes
      } catch {
        this.user = null
        this.userAttributes = null
      }
    },

    async getAuthToken(): Promise<string | null> {
      try {
        const session = await fetchAuthSession()
        return session.tokens?.accessToken?.toString() || null
      } catch (error) {
        console.error('Error al obtener token:', error)
        return null
      }
    },
  },

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    userEmail: (state): string | undefined =>
      (state.userAttributes?.email as string) || state.user?.signInDetails?.loginId,
  },
})
