import { useNuxtApp } from '#app'
import type { Wallet } from '../models/Wallet'

const walletApi = {
  createWallet: async (wallet: Wallet) => {
    const { $supabase } = useNuxtApp()

    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    const { data, error } = await $supabase
      .from('wallets')
      .insert([{
        id_user: user.id,
        password: wallet.password,
        telephone_withdrawls: wallet.telephone_withdrawls,
        methode_withdrawls: wallet.methode_withdrawls
      }])
      .select()
      .single()

    if (error) throw error
    return data as Wallet
  },

  getUserWallets: async () => {
    const { $supabase } = useNuxtApp()
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    const { data, error } = await $supabase
      .from('wallets')
      .select('*')
      .eq('id_user', user.id)
      .order('id', { ascending: false })

    if (error) throw error
    return data as Wallet[]
  }
}

export default walletApi
