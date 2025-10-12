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

// <-- ici tu fermes assignGradeToUser avec une virgule
assignGradeToUser: async (id_grade: number) => {
  const { $supabase } = useNuxtApp()

  // 1. Récupérer l'utilisateur connecté
  const { data: { user } } = await $supabase.auth.getUser()
  if (!user) throw new Error('Utilisateur non authentifié')

  // 2. Récupérer l'utilisateur dans ta table "users"
  const { data: currentUser, error: userError } = await $supabase
    .from('users')
    .select('id, parent_invitecode, phone')
    .eq('auth_id', user.id)
    .single()

  if (userError || !currentUser) throw new Error('Utilisateur introuvable')

  // 3. Assigner le grade
  await $supabase
    .from('assigne_user_grade')
    .insert([{ id_user: currentUser.id, id_grade }])

  // 4. Vérifier si l'utilisateur a un parrain
  if (!currentUser.parent_invitecode) return

  // 5. Trouver le parrain
  const { data: parentUser } = await $supabase
    .from('users')
    .select('id, phone')
    .eq('invitecode', currentUser.parent_invitecode)
    .single()

  if (!parentUser || parentUser.id === currentUser.id) return

  // 6. Vérifier si déjà récompensé
  const { data: existingReward } = await $supabase
    .from('referral_rewards')
    .select('*')
    .eq('user_auth_id', currentUser.id)
    .eq('parent_auth_id', parentUser.id)
    .maybeSingle()

  if (!existingReward) {
    // 7. Créer la reward
    await $supabase.from('referral_rewards').insert([{
      user_auth_id: currentUser.id,
      parent_auth_id: parentUser.id,
      reward_amount: 1000
    }])

    // 8. Crédite le compte du parrain
    await $supabase.from('recharges').insert([{
      id_user: parentUser.id,
      amount: 1000,
      phone: parentUser.phone,
      methode: 'Recompense de parrainage',
      reference: `reward_from_${currentUser.id}`,
      identifier: null
    }])
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
