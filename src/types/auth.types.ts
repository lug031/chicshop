// src/types/auth.types.ts

import type { AuthUser, FetchUserAttributesOutput } from 'aws-amplify/auth'

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
  isAdminUser: boolean
  userAttributes: FetchUserAttributesOutput | null
}

export interface DecodedToken {
  sub: string
  'cognito:groups'?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface LoginResponse {
  isSignedIn?: boolean
  nextStep?: {
    signInStep: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  requiresNewPassword?: boolean
  phone?: string
  temporaryPassword?: string
}
