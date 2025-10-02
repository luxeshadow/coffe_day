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

    // Récupération de l'utilisateur connecté
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    const userId = user.id // UUID direct depuis auth.users

    // Somme des recharges
    const { data: rechargesData, error: rechargeError } = await $supabase
      .from('recharges')
      .select('amount')
      .eq('id_user', userId)
    if (rechargeError) throw rechargeError

    const totalRecharges = rechargesData?.reduce((sum, r) => sum + Number(r.amount), 0) ?? 0

    // Somme des retraits
    const { data: withdrawalsData, error: withdrawError } = await $supabase
      .from('withdrawls')
      .select('amount')
      .eq('id_user', userId)
    if (withdrawError) throw withdrawError

    const totalWithdrawals = withdrawalsData?.reduce((sum, w) => sum + Number(w.amount), 0) ?? 0

    // Gains des grades
    const { data: userGrades, error: userGradesError } = await $supabase
      .from('assigne_user_grade')
      .select('id_grade, date_creation') // j’ai remplacé par "date_creation" car ta table a ce champ
      .eq('id_user', userId)
    if (userGradesError) throw userGradesError

    let totalGradeGains = 0
    if (userGrades?.length) {
      for (const ug of userGrades) {
        const { data: gradeData, error: gradeError } = await $supabase
          .from('grades')
          .select('daily_income')
          .eq('id', ug.id_grade)
          .single()
        if (gradeError || !gradeData) continue

        const dailyIncome = Number(gradeData.daily_income)
        const activationDate = new Date(ug.date_creation) // utilisation de date_creation
        const today = new Date()

        const days = Math.floor(
          (today.getTime() - activationDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        totalGradeGains += dailyIncome * days
      }
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
