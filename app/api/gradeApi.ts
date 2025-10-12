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

  // 1️⃣ Récupérer l'utilisateur connecté via Supabase Auth
  const { data: { user } } = await $supabase.auth.getUser()
  if (!user) throw new Error('Utilisateur non authentifié')

  // 2️⃣ Récupérer l'utilisateur dans ta table users
  const { data: currentUser } = await $supabase
    .from('users')
    .select('id, auth_id, parent_invitecode, phone')
    .eq('auth_id', user.id)
    .single()
  if (!currentUser) throw new Error("Utilisateur introuvable dans 'users'")

  // 3️⃣ Assigner le grade
  await $supabase.from('assigne_user_grade').insert([{
    id_user: currentUser.auth_id,
    id_grade
  }])

  // 4️⃣ Vérifier si l'utilisateur a un parrain
  if (!currentUser.parent_invitecode) return

  // 5️⃣ Chercher le parrain via invitecode
  const { data: parentUser } = await $supabase
    .from('users')
    .select('auth_id, phone')
    .eq('invitecode', currentUser.parent_invitecode)
    .single()
  if (!parentUser) return

  // 6️⃣ Vérifier si la récompense existe déjà
  const { data: existingReward } = await $supabase
    .from('referral_rewards')
    .select('*')
    .eq('user_auth_id', currentUser.auth_id)
    .eq('parent_auth_id', parentUser.auth_id)
    .maybeSingle()

  // 7️⃣ Créer la reward et la recharge si jamais existante
  if (!existingReward) {
    await $supabase.from('referral_rewards').insert([{
      user_auth_id: currentUser.auth_id,
      parent_auth_id: parentUser.auth_id,
      reward_amount: 1000
    }])

    await $supabase.from('recharges').insert([{
      id_user: parentUser.auth_id, // ✅ correspond à ta colonne auth_id
      amount: 1000,
      phone: parentUser.phone,
      methode: 'Recompense parrainage',
      reference: `reward_${currentUser.auth_id}`
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
