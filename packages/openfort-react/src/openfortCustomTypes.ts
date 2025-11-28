export interface UserAccountResponse {
  id: string
  providerId: string
  createdAt: string
  updatedAt: string
  accountId: string
  scopes: string[]
  [key: string]: any
}
// OTP_TODO: Export from openfort-js: RecoveryMethod enum
