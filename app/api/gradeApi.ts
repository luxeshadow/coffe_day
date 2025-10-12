import { useNuxtApp } from '#app'
import type { Grade } from '../models/Grade'

const gradeApi = {
  createGrade: async (grade: Grade) => {
    const { $supabase } = useNuxtApp()

    const { data, error } = await $supabase
      .from('grades')
      .insert([{
        grade_name: grade.grade_name,
        amounts: grade.amounts ?? 0,
        daily_income: grade.daily_income ?? 0,
        description: grade.description ?? null
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

assignGradeToUser: async (id_grade: number) => {
  const { $supabase } = useNuxtApp()
  console.log('--- Début assignGradeToUser ---')

  try {
    // 1️⃣ Récupérer le user connecté
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    console.log('User connecté via auth:', user, userError)
    if (userError || !user) {
      console.error('Utilisateur non authentifié')
      return { success: false, error: 'Utilisateur non authentifié' }
    }

    // 2️⃣ Récupérer le user dans la table users
    const { data: currentUser, error: currentUserError } = await $supabase
      .from('users')
      .select('id, auth_id, parent_invitecode, phone')
      .eq('auth_id', user.id)
      .single()
    console.log('Utilisateur récupéré dans users:', currentUser, currentUserError)
    if (currentUserError || !currentUser) {
      console.error("Utilisateur introuvable dans 'users'")
      return { success: false, error: "Utilisateur introuvable" }
    }

    // 3️⃣ Assigner le grade
    const { data: assignData, error: assignError } = await $supabase
      .from('assigne_user_grade')
      .insert([{ id_user: currentUser.auth_id, id_grade }])
      .select()
    console.log('Résultat insertion grade:', assignData, assignError)
    if (assignError) {
      return { success: false, error: assignError.message }
    }

    // 4️⃣ Vérifier s'il y a un parrain
    if (!currentUser.parent_invitecode) {
      console.log('Pas de parent_invitecode, pas de reward')
      return { success: true }
    }

    // 5️⃣ Chercher le parrain
    const { data: parentUser, error: parentError } = await $supabase
      .from('users')
      .select('auth_id, phone')
      .eq('invitecode', currentUser.parent_invitecode)
      .single()
    console.log('Parrain trouvé:', parentUser, parentError)
    if (parentError || !parentUser) {
      console.log('Aucun parrain trouvé ou erreur')
      return { success: true }
    }

    // 6️⃣ Vérifier si reward existe déjà
    const { data: existingReward, error: rewardError } = await $supabase
      .from('referral_rewards')
      .select('*')
      .eq('user_auth_id', currentUser.auth_id)
      .eq('parent_auth_id', parentUser.auth_id)
      .maybeSingle()
    console.log('Reward existante:', existingReward, rewardError)
    if (rewardError) console.error('Erreur vérification reward:', rewardError)

    // 7️⃣ Créer reward si pas existante
    if (!existingReward) {
      const { data: rewardData, error: rewardInsertError } = await $supabase
        .from('referral_rewards')
        .insert([{
          user_auth_id: currentUser.auth_id,
          parent_auth_id: parentUser.auth_id,
          reward_amount: 1000
        }])
        .select()
      console.log('Reward insérée:', rewardData, rewardInsertError)
      if (rewardInsertError) console.error('Erreur insertion reward:', rewardInsertError)

      // 8️⃣ Crédite recharge du parrain
      const { data: rechargeData, error: rechargeError } = await $supabase
        .from('recharges')
        .insert([{
          id_user: parentUser.auth_id,
          amount: 1000,
          phone: parentUser.phone,
          methode: 'Recompense parrainage',
          reference: `reward_${currentUser.auth_id}`
        }])
        .select()
      console.log('Recharge créée pour le parrain:', rechargeData, rechargeError)
      if (rechargeError) console.error('Erreur insertion recharge:', rechargeError)
    } else {
      console.log('Reward déjà existante, pas de double reward')
    }

    console.log('--- Fin assignGradeToUser ---')
    return { success: true }
  } catch (err: any) {
    console.error('Erreur assignGradeToUser:', err)
    return { success: false, error: err.message || 'Erreur inconnue' }
  }
},



  getAllGrades: async (): Promise<Grade[]> => {
    const { $supabase } = useNuxtApp()

    const { data, error } = await $supabase
      .from('grades')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw error
    return data as Grade[]
  },

  getUserGrades: async (): Promise<Grade[]> => {
    const { $supabase } = useNuxtApp()

    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    const { data, error } = await $supabase
      .from('assigne_user_grade')
      .select('id_grade, grades(*)')
      .eq('id_user', user.id)

    if (error) throw error
    if (!data) return []

    return data.map((row: any) => row.grades) as Grade[]
  },

  getUserDailyIncomeAndTopGrade: async () => {
    const { $supabase } = useNuxtApp()

    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    const { data: assignedGrades, error } = await $supabase
      .from('assigne_user_grade')
      .select('id_grade, grades(*)')
      .eq('id_user', user.id)

    if (error) throw error
    if (!assignedGrades || assignedGrades.length === 0) {
      return { dailyIncome: 0, topGradeName: null }
    }

    const grades: Grade[] = assignedGrades.map((row: any) => row.grades)

    const dailyIncome = grades.reduce((sum, g) => sum + (g.daily_income ?? 0), 0)

    const topGrade = grades.reduce((prev, curr) => {
      return (curr.daily_income ?? 0) > (prev.daily_income ?? 0) ? curr : prev
    }, grades[0])

    return {
      dailyIncome,
      topGradeName: topGrade.grade_name
    }
  }
}

export default gradeApi
