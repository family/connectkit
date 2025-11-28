export interface UserAccountResponse {
  id: string
  providerId: string
  createdAt: string
  updatedAt: string
  accountId: string
  scopes: string[]
  [key: string]: any
}
// OPT_TODO: Wallet type from openfort-js. this could break client if not updated
