// api/historyApi.ts
import { useNuxtApp } from '#app'

const historyApi = {
  // ✅ Recharges de l'utilisateur connecté
  getUserRecharges: async () => {
    const { $supabase } = useNuxtApp()

    // Récupération de l'utilisateur connecté
    const { data: userData, error: userError } = await $supabase.auth.getUser()
    if (userError || !userData?.user) {
      throw new Error('Utilisateur non connecté')
    }

    const userId = userData.user.id

    // Requêter uniquement les recharges de cet utilisateur
    const { data, error } = await $supabase
      .from('recharges')
      .select('*')
      .eq('id_user', userId) // Utilisation correcte de la colonne UUID
      .order('id', { ascending: false })

    if (error) throw error
    return data || []
  },

  // ✅ Retraits de l'utilisateur connecté
  getUserWithdrawls: async () => {
    const { $supabase } = useNuxtApp()

    const { data: userData, error: userError } = await $supabase.auth.getUser()
    if (userError || !userData?.user) {
      throw new Error('Utilisateur non connecté')
    }

    const userId = userData.user.id

    const { data, error } = await $supabase
      .from('withdrawls')
      .select('*')
      .eq('id_user', userId) // Utilisation correcte de la colonne UUID
      .order('id', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export default historyApi
