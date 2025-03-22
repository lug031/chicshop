// src/types/auth.types.ts

import type { AuthUser, FetchUserAttributesOutput } from 'aws-amplify/auth'

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
  userAttributes: FetchUserAttributesOutput | null
}

export interface LoginResponse {
  isSignedIn?: boolean
  nextStep?: {
    signInStep: string
    [key: string]: unknown
  }
  email?: string
  requiresNewPassword?: boolean
  temporaryPassword?: string
}
