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
  const { $supabase } = useNuxtApp() // plus de $toast ici
  try {
    // 1️⃣ Récupérer le user connecté
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) return { success: false, error: 'Utilisateur non authentifié' }

    // 2️⃣ Récupérer le user dans la table users
    const { data: currentUser, error: currentUserError } = await $supabase
      .from('users')
      .select('id, auth_id, parent_invitecode, phone')
      .eq('auth_id', user.id)
      .single()
    if (currentUserError || !currentUser) return { success: false, error: "Utilisateur introuvable" }

    // 3️⃣ Assigner le grade
    const { data: assignData, error: assignError } = await $supabase
      .from('assigne_user_grade')
      .insert([{ id_user: currentUser.auth_id, id_grade }])
      .select()
    if (assignError) return { success: false, error: assignError.message }

    // 🔹 Récupérer le grade complet
    const { data: grade, error: gradeError } = await $supabase
      .from('grades')
      .select('*')
      .eq('id', id_grade)
      .single()
    if (gradeError || !grade) return { success: false, error: "Grade introuvable" }

    // 4️⃣ Créer le retrait
    const { error: withdrawError } = await $supabase
      .from('withdrawls')
      .insert([{
        id_user: currentUser.auth_id,
        amount: grade.amounts,
        status: 'Achat de boite'
      }])
    if (withdrawError) return { success: false, error: withdrawError.message }

    // 5️⃣ Gestion parrain/reward
    if (currentUser.parent_invitecode) {
      const { data: parentUser, error: parentError } = await $supabase
        .from('users')
        .select('auth_id, phone')
        .eq('invitecode', currentUser.parent_invitecode)
        .single()
      if (parentUser) {
        const { data: existingReward } = await $supabase
          .from('referral_rewards')
          .select('*')
          .eq('user_auth_id', currentUser.auth_id)
          .eq('parent_auth_id', parentUser.auth_id)
          .maybeSingle()
        if (!existingReward) {
          await $supabase.from('referral_rewards').insert([{
            user_auth_id: currentUser.auth_id,
            parent_auth_id: parentUser.auth_id,
            reward_amount: 1000
          }])
          await $supabase.from('recharges').insert([{
            id_user: parentUser.auth_id,
            amount: 1000,
            phone: parentUser.phone,
            methode: 'Recompense parrainage',
            reference: `reward_${currentUser.auth_id}`
          }])
        }
      }
    }

    return { success: true }

  } catch (err: any) {
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

  // ✅ Récupérer auth_id dans ta table users
  const { data: currentUser, error: profileError } = await $supabase
    .from('users')
    .select('auth_id')
    .eq('auth_id', user.id)
    .single()

  if (profileError || !currentUser) throw new Error("Utilisateur introuvable")

  const { data, error } = await $supabase
    .from('assigne_user_grade')
    .select('id_grade, grades(*)')
    .eq('id_user', currentUser.auth_id) // ✅ Correction ici

  if (error) throw error
  if (!data) return []

  return data.map((row: any) => row.grades) as Grade[]
},

getUserDailyIncomeAndTopGrade: async () => {
  const { $supabase } = useNuxtApp()

  const { data: { user }, error: userError } = await $supabase.auth.getUser()
  if (userError || !user) throw new Error('Utilisateur non authentifié')

  // ✅ Récupérer auth_id dans ta table users
  const { data: currentUser, error: profileError } = await $supabase
    .from('users')
    .select('auth_id')
    .eq('auth_id', user.id)
    .single()

  if (profileError || !currentUser) throw new Error("Utilisateur introuvable")

  const { data: assignedGrades, error } = await $supabase
    .from('assigne_user_grade')
    .select('id_grade, grades(*)')
    .eq('id_user', currentUser.auth_id) // ✅ Correction ici

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
},


 
}

export default gradeApi
