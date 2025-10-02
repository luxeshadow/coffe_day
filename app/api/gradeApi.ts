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

    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    const { data: userRow, error: userDbError } = await $supabase
      .from('users')
      .select('id')
      .eq('phone', user.user_metadata.phone)
      .single()

    if (userDbError || !userRow) throw new Error('Utilisateur introuvable dans la table users')

    const { data, error } = await $supabase
      .from('assigne_user_grade')
      .insert([{
        id_user: userRow.id,
        id_grade,
      }])
      .select()
      .single()

    if (error) throw error
    return data
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

    // Récupérer l'utilisateur connecté
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    // Chercher son id dans la table users
    const { data: userRow, error: userDbError } = await $supabase
      .from('users')
      .select('id')
      .eq('phone', user.user_metadata.phone)
      .single()
    if (userDbError || !userRow) throw new Error('Utilisateur introuvable dans la table users')

    // Récupérer les grades assignés
    const { data, error } = await $supabase
      .from('assigne_user_grade')
      .select('id_grade, grades(*)')
      .eq('id_user', userRow.id)
    
    if (error) throw error
    
    return data.map((row: any) => row.grades) as Grade[]
  },

  getUserDailyIncomeAndTopGrade: async () => {
  const { $supabase } = useNuxtApp()

  // Récupérer l'utilisateur connecté
  const { data: { user }, error: userError } = await $supabase.auth.getUser()
  if (userError || !user) throw new Error('Utilisateur non authentifié')

  // Chercher son id dans la table users
  const { data: userRow, error: userDbError } = await $supabase
    .from('users')
    .select('id')
    .eq('phone', user.user_metadata.phone)
    .single()
  if (userDbError || !userRow) throw new Error('Utilisateur introuvable dans la table users')

  // Récupérer les grades assignés
  const { data: assignedGrades, error } = await $supabase
    .from('assigne_user_grade')
    .select('id_grade, grades(*)')
    .eq('id_user', userRow.id)

  if (error) throw error
  if (!assignedGrades || assignedGrades.length === 0) return { dailyIncome: 0, topGradeName: null }

  const grades: Grade[] = assignedGrades.map((row: any) => row.grades)

  // Calcul du gain journalier total
  const dailyIncome = grades.reduce((sum, g) => sum + (g.daily_income ?? 0), 0)

  // Trouver le grade avec le daily_income le plus élevé
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
