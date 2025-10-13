import { useNuxtApp } from '#app'

export const statApi = {
  // ✅ Total des retraits succès pour tout le monde
  async getTotalWithdrawSuccess() {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('withdrawls')
      .select('amount')
      .eq('status', 'Payé') // filtre uniquement par statut

    if (error) throw error
    return (data || []).reduce((sum, w) => sum + Number(w.amount), 0)
  },

  // ✅ Total des recharges pour tout le monde
  async getTotalRecharges() {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('recharges')
      .select('amount') // aucun filtre user

    if (error) throw error
    return (data || []).reduce((sum, r) => sum + Number(r.amount), 0)
  },

  // ✅ Tous les users avec grade (sans filtrer sur user)
  async getUsersWithGrade() {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('assigne_user_grade')
      .select('id_user') // pas de eq ici

    if (error) throw error
    return (data || []).map(u => u.id_user)
  },

  // ✅ Nombre de users sans grade
  async getUsersWithoutGrade() {
    const { $supabase } = useNuxtApp()
    const { data: users, error: userError } = await $supabase
      .from('users')
      .select('auth_id')

    if (userError) throw userError

    const withGradeIds = await this.getUsersWithGrade()
    return (users || []).filter(u => !withGradeIds.includes(u.auth_id)).length
  },

  // ✅ Users par grade
  async getUsersByGrade() {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('assigne_user_grade')
      .select('id_grade, id_user') // pas de filtre user

    if (error) throw error

    const counts: Record<number, number> = {}
    data?.forEach((row: any) => {
      counts[row.id_grade] = (counts[row.id_grade] || 0) + 1
    })

    const gradeIds = Object.keys(counts)
    if (!gradeIds.length) return []

    const { data: gradesData, error: gradeError } = await $supabase
      .from('grades')
      .select('id, grade_name')
      .in('id', gradeIds)

    if (gradeError) throw gradeError

    return gradesData.map((g: any) => ({
      grade_name: g.grade_name,
      total: counts[g.id] || 0
    }))
  }
}
