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

  // 1️⃣ Récupérer le user connecté
  const { data: { user }, error: userError } = await $supabase.auth.getUser()
  if (userError || !user) throw new Error('Utilisateur non authentifié')

  // 2️⃣ Assigner le grade
  const { data: assignedGrade, error } = await $supabase
    .from('assigne_user_grade')
    .insert([{ id_user: user.id, id_grade }])
    .select()
    .single()
  if (error) throw error

  // 3️⃣ Récupérer le parrain
 // ✅ Correct
const { data: parentUser } = await $supabase
  .from('users')
  .select('id, auth_id, phone')
  .eq('invitecode', user.parent_invitecode) // on garde ça car parent_invitecode contient le code parent
  .single()

  if (parentUser) {
    // 4️⃣ Vérifier si la reward existe déjà
    const { data: existingReward } = await $supabase
      .from('referral_rewards')
      .select('*')
      .eq('user_auth_id', user.id)
      .eq('parent_auth_id', parentUser.auth_id)
      .single()

    if (!existingReward) {
      // 5️⃣ Créer la reward pour le parrain
      await $supabase.from('referral_rewards').insert([{
        user_auth_id: user.id,
        parent_auth_id: parentUser.auth_id,
        reward_amount: 1000,
        rewarded_at: new Date().toISOString()
      }])

      // 6️⃣ Créer la recharge de 1000 pour le parrain
      await $supabase.from('recharges').insert([{
        id_user: parentUser.id,
        amount: 1000,
        phone: parentUser.phone,
        methode: 'Recompense',
        reference: `reward_from_${user.id}`,
        identifier: null,
        created_at: new Date().toISOString()
      }])
    }
  }
}, // <-- ici tu fermes assignGradeToUser avec une virgule


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
