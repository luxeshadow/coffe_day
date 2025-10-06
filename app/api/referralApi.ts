// api/referralApi.ts
import { useNuxtApp } from '#app'

const referralApi = {
  // 🔹 Récupérer le code d’invitation de l’utilisateur connecté
  getMyInviteCode: async () => {
    const { $supabase } = useNuxtApp()

    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    // On compare avec auth_id (UUID)
    const { data, error } = await $supabase
      .from('users')
      .select('invitecode')
      .eq('auth_id', user.id)
      .single()

    if (error) throw error
    return data?.invitecode || null
  },

  // 🔹 Récupérer le lien de parrainage complet
  getReferralLink: async () => {
    const inviteCode = await referralApi.getMyInviteCode()
    return inviteCode ? `${window.location.origin}/register?ref=${inviteCode}` : null
  },

 getMyReferrals: async () => {
  const { $supabase } = useNuxtApp()

  const myInviteCode = await referralApi.getMyInviteCode()
  if (!myInviteCode) throw new Error('Aucun code de parrainage trouvé pour cet utilisateur')

  // 🔹 Récupérer les utilisateurs qui ont utilisé mon code
  const { data, error } = await $supabase
    .from('users')
    .select('id, user_name, phone, parent_invitecode') // pas de created_at ni fullname
    .eq('parent_invitecode', myInviteCode)
  
  if (error) throw error
  return data || []
}

}

export default referralApi
