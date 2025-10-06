export interface Wallet {
  id?: number
  id_user?: string
  password: string                // correspond à password dans la table
  telephone_withdrawls: string    // numéro de retrait
  methode_withdrawls: 'flooz' | 'tmoney' | string
  created_at?: string
  updated_at?: string
}
