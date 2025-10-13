import { useNuxtApp } from '#app'

interface UserGain {
  totalRecharges: number
  totalWithdrawals: number
  totalGradeGains: number
  walletBalance: number
}

const gainApi = {
  getUserGains: async (): Promise<UserGain> => {
    const { $supabase } = useNuxtApp()

    // ✅ Récupération de l'utilisateur connecté
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    // ✅ On récupère l'utilisateur dans TA table `users` pour obtenir son auth_id
    const { data: profile, error: profileError } = await $supabase
      .from('users')
      .select('auth_id')
      .eq('auth_id', user.id)
      .single()

    if (profileError || !profile) throw new Error('Profil utilisateur introuvable')

    const userId = profile.auth_id  // ✅ IMPORTANT

    // 🔹 Somme des recharges
    const { data: rechargesData, error: rechargeError } = await $supabase
      .from('recharges')
      .select('amount')
      .eq('id_user', userId)
    if (rechargeError) throw rechargeError
    const totalRecharges = rechargesData?.reduce((sum, r) => sum + Number(r.amount), 0) ?? 0

    // 🔹 Somme des retraits
    const { data: withdrawalsData, error: withdrawError } = await $supabase
      .from('withdrawls')
      .select('amount')
      .eq('id_user', userId)
    if (withdrawError) throw withdrawError
    const totalWithdrawals = withdrawalsData?.reduce((sum, w) => sum + Number(w.amount), 0) ?? 0

    // 🔹 Grades assignés
    const { data: userGrades, error: userGradesError } = await $supabase
      .from('assigne_user_grade')
      .select('id_grade, date_creation')
      .eq('id_user', userId)
    if (userGradesError) throw userGradesError

    let totalGradeGains = 0

    if (userGrades?.length) {
      const gradeIds = userGrades.map(g => g.id_grade)
      const { data: gradesData, error: gradesError } = await $supabase
        .from('grades')
        .select('id, daily_income')
        .in('id', gradeIds)
      if (gradesError) throw gradesError

      const gradeMap = new Map<number, number>()
      gradesData.forEach(g => gradeMap.set(g.id, Number(g.daily_income)))

      const today = new Date()

      userGrades.forEach(ug => {
        const dailyIncome = gradeMap.get(ug.id_grade) ?? 0
        const activationDate = new Date(ug.date_creation.replace(' ', 'T'))
        const days = (today.getTime() - activationDate.getTime()) / (1000 * 60 * 60 * 24)
        totalGradeGains += dailyIncome * days
      })
    }

    const walletBalance = totalRecharges + totalGradeGains - totalWithdrawals

    return {
      totalRecharges,
      totalWithdrawals,
      totalGradeGains,
      walletBalance
    }
  }
}

export default gainApi
