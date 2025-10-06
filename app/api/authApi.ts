import type { User } from '../models/User'
import { useNuxtApp } from '#app'

const authApi = {
  // -------------------- REGISTER --------------------
  register: async (user: User) => {
    const { $supabase } = useNuxtApp()

    // Supprime l'indicatif pays pour créer un email factice
    const phoneWithoutCode = user.phone.replace(/^\+\d{1,3}/, '')
    const email = phoneWithoutCode + '@dummy.com'

    // Création de l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await $supabase.auth.signUp({
      email,
      password: user.password,
      options: {
        data: {
          phone: user.phone,
          parent_invitecode: user.parent_invitecode
        }
      }
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Utilisateur non créé dans Supabase Auth')

    // Insertion dans la table "users"
    const { error: insertError } = await $supabase
      .from('users')
      .insert([{
        auth_id: authData.user.id,
        user_name: user.user_name,
        phone: user.phone,
        parent_invitecode: user.parent_invitecode
      }])

    if (insertError) throw insertError

    return authData
  },

  // -------------------- LOGIN --------------------
  login: async (phone: string, password: string) => {
    const { $supabase } = useNuxtApp()

    const phoneWithoutCode = phone.replace(/^\+\d{1,3}/, '')
    const email = phoneWithoutCode + '@dummy.com'

    // 1️⃣ Connexion Supabase Auth
    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Utilisateur non trouvé.')

    // 2️⃣ Récupération du rôle depuis "users" + jointure "roles"
    const { data: userData, error: userError } = await $supabase
      .from('users')
      .select(`
        id,
        user_name,
        phone,
        auth_id,
        id_role,
        roles (role_name)
      `)
      .eq('auth_id', data.user.id)
      .single()

    if (userError || !userData) throw new Error("Impossible de récupérer les informations utilisateur.")

    // 3️⃣ Retourne les infos essentielles
    return {
      session: data.session,
      user: {
        auth_id: userData.auth_id,
        user_name: userData.user_name,
        phone: userData.phone,
        role: userData.roles?.role_name || 'user'
      }
    }
  },

  // -------------------- LOGOUT --------------------
  logout: async () => {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.auth.signOut()
    if (error) throw error
  }
}

export default authApi
