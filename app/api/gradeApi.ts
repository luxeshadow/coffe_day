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
}
