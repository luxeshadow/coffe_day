import type { User } from '../models/User'
import { useNuxtApp } from '#app'

const authApi = {
  // -------------------- REGISTER --------------------
  register: async (user: User) => {
    const { $supabase } = useNuxtApp()

    // Supprime l'indicatif pays pour créer un email factice
    const phoneWithoutCode = user.phone.replace(/^\+\d{1,3}/, '')
    const email = phoneWithoutCode + '@dummy.com'

    const { data: authData, error: authError } = await $supabase.auth.signUp({
      email,
      password: user.password,
      options: {
        data: {
          last_name: user.last_name,
          first_name: user.first_name,
          phone: user.phone,
          parent_invitecode: user.parent_invitecode
        }
      }
    })

    if (authError) throw authError

    // Insertion des informations dans la table "users"
    const { error: insertError } = await $supabase
      .from('users')
      .insert([{
        last_name: user.last_name,
        first_name: user.first_name,
        user_name: user.user_name,
        phone: user.phone,
        parent_invitecode: user.parent_invitecode
      }])

    if (insertError) throw insertError

    // Retourne les données d'authentification (JWT, user, etc.)
    return authData
  },

  // -------------------- LOGIN --------------------
  login: async (phone: string, password: string) => {
    const { $supabase } = useNuxtApp()

    const phoneWithoutCode = phone.replace(/^\+\d{1,3}/, '')
    const email = phoneWithoutCode + '@dummy.com'
    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
     
      throw new Error(error.message)
    }

    return data
  },

  // -------------------- LOGOUT --------------------
  logout: async () => {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.auth.signOut()
    if (error) throw error
  }
}

export default authApi
