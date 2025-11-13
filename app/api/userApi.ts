// api/userApi.ts
import { useNuxtApp } from '#app'

interface UserGrade {
  id: number
  id_user: string
  id_grade: number
  date_creation: string
  expired?: boolean
  grade?: {
    id: number
    grade_name: string
    daily_income: number
    amounts: number
  }
}

interface UserChild {
  id: number
  user_name: string
  phone: string
}

interface UserWithdraw {
  id_user: string
  amount: number
  status: string
}

interface User {
  id: number
  user_name: string
  phone: string
  invitecode: string
  parent_invitecode?: string
  grades: UserGrade[]
  children: UserChild[]
  walletBalance: number
}

const userApi = () => {
  const { $supabase } = useNuxtApp()

  // ✅ Récupère les utilisateurs et calcule le wallet
  const getUsers = async (page = 1, limit = 30) => {
    const from = (page - 1) * limit
    const to = from + limit - 1

    // --- 1. Utilisateurs ---
    const { data: usersData, error: usersError, count } = await $supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range(from, to)

    if (usersError) throw usersError
    if (!usersData) return { users: [], total: 0 }

    const authIds = usersData.map(u => u.auth_id)

    // --- 2. Grades assignés ---
    const { data: allUserGrades = [] } = await $supabase
      .from('assigne_user_grade')
      .select('id, id_user, id_grade, date_creation, expired')
      .in('id_user', authIds)

    const gradeIds = [...new Set(allUserGrades.map(g => g.id_grade))]

    const { data: gradesData = [] } = await $supabase
      .from('grades')
      .select('id, grade_name, daily_income, amounts')
      .in('id', gradeIds)

    const gradeMap = new Map(gradesData.map(g => [g.id, g]))

    // --- 3. Filleuls ---
    const inviteCodes = usersData.map(u => u.invitecode)
    const { data: childrenData = [] } = await $supabase
      .from('users')
      .select('id, user_name, phone, parent_invitecode')
      .in('parent_invitecode', inviteCodes)

    // --- 4. Recharges et retraits ---
    const { data: rechargesData = [] } = await $supabase
      .from('recharges')
      .select('id_user, amount')
      .in('id_user', authIds)

    const { data: withdrawsData = [] } = await $supabase
      .from('withdrawls')
      .select('id_user, amount')
      .in('id_user', authIds)

    // --- 5. Construction utilisateur ---
    const today = new Date()

    const users = await Promise.all(
      usersData.map(async user => {
        const userGrades = allUserGrades.filter(g => g.id_user === user.auth_id)
        const gradesWithInfo = userGrades.map(g => ({
          ...g,
          grade: gradeMap.get(g.id_grade)
        }))

        const userChildren = childrenData.filter(c => c.parent_invitecode === user.invitecode)

        const totalRecharges = rechargesData
          .filter(r => r.id_user === user.auth_id)
          .reduce((s, r) => s + Number(r.amount), 0)

        const totalWithdrawals = withdrawsData
          .filter(w => w.id_user === user.auth_id)
          .reduce((s, w) => s + Number(w.amount), 0)

        // --- 🔹 Calcul des gains de grade ---
        let totalGradeGains = 0

        for (const ug of gradesWithInfo) {
          const gradeInfo = ug.grade
          if (!gradeInfo) continue

          const activationDate = new Date(ug.date_creation.replace(' ', 'T'))
          let daysActive = (today.getTime() - activationDate.getTime()) / (1000 * 60 * 60 * 24)

          // 🔸 Si +20 jours → expire
          if (daysActive >= 20 && !ug.expired) {
            await $supabase
              .from('assigne_user_grade')
              .update({ expired: true })
              .eq('id', ug.id)
            daysActive = 20
          }

          const gain = gradeInfo.daily_income * Math.min(daysActive, 20)
          const plafond = gradeInfo.amounts * 1.2

          // 🔸 Expiration par plafond
          if (gain >= plafond && !ug.expired) {
            await $supabase
              .from('assigne_user_grade')
              .update({ expired: true })
              .eq('id', ug.id)
          }

          if (ug.expired) {
            totalGradeGains += gradeInfo.daily_income * 20 // maximum 20 jours
          } else {
            totalGradeGains += gain
          }
        }

        const walletBalance = totalRecharges + totalGradeGains - totalWithdrawals

        return {
          ...user,
          grades: gradesWithInfo,
          children: userChildren,
          walletBalance
        }
      })
    )

    return {
      users,
      total: count || 0,
      page,
      limit
    }
  }

  // 🔹 Requêtes retraits payés
  const getPaidWithdrawals = async (userIds: string[]) => {
    if (!userIds.length) return {}

    const { data: withdrawsData = [], error } = await $supabase
      .from('withdrawls')
      .select('id_user, amount, status')
      .in('id_user', userIds)
      .eq('status', 'Payé')

    if (error) throw error

    const withdrawalsMap = userIds.reduce<Record<string, UserWithdraw[]>>((acc, id) => {
      acc[id] = withdrawsData.filter(w => w.id_user === id)
      return acc
    }, {})

    return withdrawalsMap
  }

  return { getUsers, getPaidWithdrawals }
}

export default userApi
