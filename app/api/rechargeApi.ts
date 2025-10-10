
//api/rechargeApi
import { useNuxtApp } from '#app'
import type { Recharge } from '../models/Recharge'

const rechargeApi = {

createRecharge: async (recharge: Recharge) => {
  const { $supabase } = useNuxtApp()

  // 🔹 Vérification immédiate de la session
  const { data: { user }, error: userError } = await $supabase.auth.getUser()
  if (userError || !user) throw new Error('Utilisateur non authentifié')
  const userId = user.id

  // Vérifier si c’est la première recharge et montant ≥ 10 000
  const { data: existingRecharges, error: existingError } = await $supabase
    .from('recharges')
    .select('id')
    .eq('id_user', userId)
  if (existingError) throw existingError

  if (!existingRecharges || existingRecharges.length === 0) {
    if (recharge.amount < 10000) {
      throw new Error('Le premier dépôt ne peut pas être inférieur à 10 000 XOF.')
    }
  }

  // Sauvegarde la recharge dans Supabase
  const { data, error } = await $supabase
    .from('recharges')
    .insert([{
      id_user: userId,
      amount: recharge.amount,
      phone: recharge.phone,
      methode: recharge.methode ?? null,
      reference: recharge.reference ?? null,
      identifier: recharge.identifier ?? null,
    }])
    .select()
    .single()

  if (error) throw error
  return data as Recharge
},


  // Récupérer toutes les recharges d’un utilisateur
  getUserRecharges: async () => {
    const { $supabase } = useNuxtApp()
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    const userId = user.id

    const { data, error } = await $supabase
      .from('recharges')
      .select('*')
      .eq('id_user', userId)
      .order('id', { ascending: false })

    if (error) throw error
    return data as Recharge[]
  }
}

export default rechargeApi
