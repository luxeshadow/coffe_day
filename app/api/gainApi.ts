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

    // 🔹 Utilisateur connecté
    const { data: { user }, error: userError } = await $supabase.auth.getUser()
    if (userError || !user) throw new Error('Utilisateur non authentifié')

    const userId = user.id

    // 🔹 Total des recharges
    const { data: rechargesData = [], error: rechargeError } = await $supabase
      .from('recharges')
      .select('amount')
      .eq('id_user', userId)
    if (rechargeError) throw rechargeError
    const totalRecharges = rechargesData.reduce((sum, r) => sum + Number(r.amount), 0)

    // 🔹 Total des retraits
    const { data: withdrawalsData = [], error: withdrawError } = await $supabase
      .from('withdrawls')
      .select('amount')
      .eq('id_user', userId)
    if (withdrawError) throw withdrawError
    const totalWithdrawals = withdrawalsData.reduce((sum, w) => sum + Number(w.amount), 0)

    // 🔹 Grades assignés
    const { data: userGrades = [], error: userGradesError } = await $supabase
      .from('assigne_user_grade')
      .select('id, id_grade, expired, date_creation')
      .eq('id_user', userId)
    if (userGradesError) throw userGradesError

    let totalGradeGains = 0
    const today = new Date()

    if (userGrades.length) {
      const gradeIds = userGrades.map(g => g.id_grade)
      const { data: gradesData = [], error: gradesError } = await $supabase
        .from('grades')
        .select('id, daily_income, amounts')
        .in('id', gradeIds)
      if (gradesError) throw gradesError

      const gradeMap = new Map<number, { daily_income: number; amounts: number }>()
      gradesData.forEach(g => gradeMap.set(g.id, { daily_income: g.daily_income, amounts: g.amounts }))

      for (const ug of userGrades) {
        const gradeInfo = gradeMap.get(ug.id_grade)
        if (!gradeInfo) continue

        const activationDate = new Date(ug.date_creation.replace(' ', 'T'))
        let daysActive = (today.getTime() - activationDate.getTime()) / (1000 * 60 * 60 * 24)

        // 🔹 Si plus de 20 jours, marquer comme expiré
        if (daysActive >= 20 && !ug.expired) {
          await $supabase
            .from('assigne_user_grade')
            .update({ expired: true })
            .eq('id', ug.id)
          daysActive = 20 // ne pas dépasser 20 jours de gain
        }

        // 🔹 Calcul du gain seulement si non expiré
        if (!ug.expired) {
          const gain = gradeInfo.daily_income * Math.min(daysActive, 20)
          const plafond = gradeInfo.amounts * 1.2

          if (gain >= plafond) {
            await $supabase
              .from('assigne_user_grade')
              .update({ expired: true })
              .eq('id', ug.id)
          } else {
            totalGradeGains += gain
          }
        } else {
          // 🔹 Même expiré, afficher les gains cumulés jusqu’à expiration (20 jours max)
          const gain = gradeInfo.daily_income * 20
          totalGradeGains += gain
        }
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
