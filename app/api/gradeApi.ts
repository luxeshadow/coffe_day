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

    // On récupère directement le user connecté depuis auth
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    // On insère dans assigne_user_grade avec user.id (UUID)
    const { data, error } = await $supabase
      .from('assigne_user_grade')
      .insert([{
        id_user: user.id,
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
