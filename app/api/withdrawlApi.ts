import { useNuxtApp } from '#app'
import gainApi from './gainApi'

interface Withdrawl {
  id: number
  id_user: string
  amount: number
  status: string
}

interface CreateWithdrawlPayload {
  amount: number
  password: string
}

const withdrawlApi = {
  // Créer un retrait
  createWithdrawl: async (payload: CreateWithdrawlPayload): Promise<Withdrawl> => {
    const { $supabase } = useNuxtApp()

    // Récupérer l'utilisateur
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')
    const userId = user.id

    // Vérifier existence du wallet
    const { data: wallet, error: walletError } = await $supabase
      .from('wallets')
      .select('*')
      .eq('id_user', userId)
      .single()
    
    if (walletError || !wallet) throw new Error('Vous devez d’abord créer un wallet')

    // Vérifier mot de passe du wallet
    if (wallet.password !== payload.password) throw new Error('Mot de passe du wallet incorrect')

    // Vérifier le solde via gainApi
    const userGains = await gainApi.getUserGains()
    if (payload.amount > userGains.walletBalance) throw new Error('Montant supérieur au solde disponible')

    // Créer le retrait
    const { data, error } = await $supabase
      .from('withdrawls')
      .insert([{
        id_user: userId,
        amount: payload.amount,
        status: 'pending',
      }])
      .select()
      .single()
    
    if (error) throw error
    return data as Withdrawl
  },

  // Récupérer tous les retraits de l'utilisateur
  getUserWithdrawls: async (): Promise<Withdrawl[]> => {
    const { $supabase } = useNuxtApp()
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')
    
    const { data, error } = await $supabase
      .from('withdrawls')
      .select('*')
      .eq('id_user', user.id)
      .order('id', { ascending: false })
    
    if (error) throw error
    return data as Withdrawl[]
  },

  // Récupérer retraits payés
  getWithdrawlsPaid: async (): Promise<Withdrawl[]> => {
    const all = await withdrawlApi.getUserWithdrawls()
    return all.filter(w => w.status === 'payed')
  },

  // Récupérer retraits en attente
  getWithdrawlsPending: async (): Promise<Withdrawl[]> => {
    const all = await withdrawlApi.getUserWithdrawls()
    return all.filter(w => w.status === 'pending')
  },

  // Récupérer tous les retraits (pour admin)
  getAllWithdrawls: async (): Promise<Withdrawl[]> => {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('withdrawls')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    return data as Withdrawl[]
  }
}

export default withdrawlApi
