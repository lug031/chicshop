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
import { jwtDecode } from 'jwt-decode'
import type { DecodedToken, LoginResponse, AuthState } from '@/types/auth.types'
//import { useCartStore } from "./cart";

const USER_PHONE_PUBLIC_USER = 'userPhone'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
    isAdminUser: false,
    userAttributes: null,
  }),

  actions: {
    resetUserState() {
      this.user = null
      this.isAdminUser = false
      this.userAttributes = null
    },

    resetUIState() {
      this.loading = false
      this.error = null
    },

    async updateAdminStatus(): Promise<void> {
      try {
        const token = await this.getAuthToken()
        if (!token) {
          this.isAdminUser = false
          return
        }

        const decoded = jwtDecode<DecodedToken>(token)
        this.isAdminUser = decoded['cognito:groups']?.includes('admin') || false
      } catch (error) {
        console.error('Error updating admin status:', error)
        this.isAdminUser = false
      }
    },

    async login(phone: string, password: string): Promise<LoginResponse> {
      this.loading = true
      this.error = null

      this.resetUserState()
      try {
        // Asegurarse de que el teléfono tenga el formato correcto con prefijo internacional
        const formattedPhone = this.formatPhoneNumber(phone)

        const result = await signIn({
          username: formattedPhone,
          password,
        })

        if (!result) {
          throw new Error('Sign in failed - no result returned')
        }

        if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          return {
            requiresNewPassword: true,
            phone: formattedPhone,
            temporaryPassword: password,
          }
        }

        if (result.isSignedIn) {
          try {
            const user = await getCurrentUser()
            this.user = user
            const attributes = await fetchUserAttributes()
            this.userAttributes = attributes
            await this.updateAdminStatus()
          } catch (error) {
            throw new Error(
              `Signed in but failed to get user details: ${
                error instanceof Error ? error.message : String(error)
              }`,
            )
          }
        }

        return {
          requiresNewPassword: false,
          phone: formattedPhone,
          temporaryPassword: '',
          ...result,
          nextStep: result.nextStep ? { signInStep: result.nextStep.signInStep } : undefined,
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        this.error = errorMessage
        throw new Error(`Login failed: ${errorMessage}`)
      } finally {
        this.loading = false
      }
    },

    // Función para formatear el número de teléfono
    formatPhoneNumber(phone: string): string {
      // Eliminar espacios y guiones
      let cleanPhone = phone.replace(/[\s-]/g, '')

      // Si no comienza con +, agregar el prefijo para Argentina
      if (!cleanPhone.startsWith('+')) {
        // Si comienza con 0, eliminarlo
        if (cleanPhone.startsWith('0')) {
          cleanPhone = cleanPhone.substring(1)
        }

        // Si comienza con 15, eliminarlo y agregar 9
        if (cleanPhone.startsWith('15')) {
          cleanPhone = '9' + cleanPhone.substring(2)
        } else if (!cleanPhone.startsWith('9')) {
          // Si no comienza con 9, agregarlo
          cleanPhone = '9' + cleanPhone
        }

        // Agregar prefijo de Argentina
        cleanPhone = '+54' + cleanPhone
      }

      return cleanPhone
    },

    async completeNewPasswordChallenge(
      phone: string,
      temporaryPassword: string,
      newPassword: string,
    ) {
      this.loading = true
      this.error = null
      try {
        const formattedPhone = this.formatPhoneNumber(phone)

        const result = await signIn({
          username: formattedPhone,
          password: temporaryPassword,
          options: {
            authFlowType: 'USER_PASSWORD_AUTH',
          },
        })

        if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          await this.handleConfirmPasswordChallenge(newPassword)
          const user = await getCurrentUser()
          this.user = user
          return true
        }
        return false
      } catch (error) {
        this.error = (error as Error).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async handleConfirmPasswordChallenge(newPassword: string) {
      try {
        const response = await confirmSignIn({
          challengeResponse: newPassword,
        })
        return response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new Error('Error al confirmar la nueva contraseña')
      }
    },

    async register(phone: string, password: string, email?: string) {
      this.loading = true
      this.error = null
      try {
        const formattedPhone = this.formatPhoneNumber(phone)

        // Preparar los atributos del usuario
        const userAttributes: Record<string, string> = {
          phone_number: formattedPhone,
        }

        // Agregar email si está presente
        if (email) {
          userAttributes.email = email
        }

        const { isSignUpComplete, userId, nextStep } = await signUp({
          username: formattedPhone,
          password,
          options: {
            userAttributes,
          },
        })

        return { isSignUpComplete, userId, nextStep }
      } catch (error) {
        this.error = (error as Error).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getAuthToken(): Promise<string | null> {
      try {
        const session = await fetchAuthSession()
        return session.tokens?.accessToken?.toString() || null
      } catch (error) {
        console.error('Error getting auth token:', error)
        return null
      }
    },

    async checkAdmin(): Promise<boolean> {
      try {
        const token = await this.getAuthToken()
        if (!token) return false

        const decoded = jwtDecode<DecodedToken>(token)
        return decoded['cognito:groups']?.includes('admin') || false
      } catch (error) {
        console.error('Error checking admin status:', error)
        return false
      }
    },

    async confirmSignUp(phone: string, code: string) {
      this.loading = true
      this.error = null
      try {
        const formattedPhone = this.formatPhoneNumber(phone)

        const { isSignUpComplete } = await confirmSignUp({
          username: formattedPhone,
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
        /*const cartStore = useCartStore();
        cartStore.resetCart();*/

        localStorage.setItem(USER_PHONE_PUBLIC_USER, JSON.stringify([]))
        this.resetUserState()
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
        await this.updateAdminStatus()
      } catch {
        this.user = null
        this.userAttributes = null
        this.isAdminUser = false
      }
    },
  },

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    userName: (state): string => {
      return (state.userAttributes?.name as string) || 'Usuario'
    },
    userPhone: (state): string | undefined =>
      (state.userAttributes?.phone_number as string) || state.user?.signInDetails?.loginId,
    isAdmin: (state): boolean => state.isAdminUser,
  },
})
