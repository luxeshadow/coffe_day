import { useNuxtApp } from '#app'

export const statApi = {
  // ✅ Total des retraits succès
  async getTotalWithdrawSuccess() {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('withdrawls')
      .select('amount')
      .eq('status', 'Payé')

    if (error) throw error
    return (data || []).reduce((sum, w) => sum + Number(w.amount), 0)
  },

  // ✅ Total des recharges
  async getTotalRecharges() {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('recharges')
      .select('amount')

    if (error) throw error
    return (data || []).reduce((sum, r) => sum + Number(r.amount), 0)
  },

  // ✅ Recharges par semaine
  async getWeeklyRecharges() {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase.rpc('recharges_per_week', {}, { head: false })
    if (error) throw error
    return data || []
  },

  // ✅ Retraits par semaine (correction 404)
  async getWeeklyWithdraws() {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase.rpc('withdraws_per_week', {}, { head: false })
    if (error) throw error
    return data || []
  },

  // ✅ Users AVEC grade
  async getUsersWithGrade() {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('assigne_user_grade')
      .select('id_user')

    if (error) throw error
    return (data || []).map(u => u.id_user)
  },

  // ✅ Users SANS grade
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
      .select('id_grade, id_user')

    if (error) throw error

    const result: Record<number, number> = {}
    data?.forEach((row: any) => {
      result[row.id_grade] = (result[row.id_grade] || 0) + 1
    })

    const gradeIds = Object.keys(result)
    if (gradeIds.length === 0) return []

    const { data: gradesData, error: gradeError } = await $supabase
      .from('grades')
      .select('id, grade_name')
      .in('id', gradeIds)

    if (gradeError) throw gradeError

    return gradesData.map((g: any) => ({
      grade_name: g.grade_name,
      total: result[g.id] || 0
    }))
  }
}
