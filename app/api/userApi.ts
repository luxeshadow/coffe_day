// api/userApi.ts
import { useNuxtApp } from '#app'

interface UserGrade {
  id_grade: number
  date_creation: string
  grade?: {
    id: number
    grade_name: string
    daily_income: number
  }
}

interface UserChild {
  id: number
  user_name: string
  phone: string
}

interface UserWithdraw {
  id_user: number
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

    const { data: usersData, error: usersError, count } = await $supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range(from, to)

    if (usersError) throw usersError
    if (!usersData) return { users: [], total: 0 }

    const authIds = usersData.map(u => u.auth_id)

    // 2. Grades
    const { data: allUserGrades = [] } = await $supabase
      .from('assigne_user_grade')
      .select('id_user, id_grade, date_creation')
      .in('id_user', authIds)

    const gradeIds = [...new Set(allUserGrades.map(g => g.id_grade))]
    const { data: gradesData = [] } = await $supabase
      .from('grades')
      .select('id, grade_name, daily_income')
      .in('id', gradeIds)

    const gradeMap = new Map(gradesData.map(g => [g.id, g]))

    // 3. Filleuls
    const inviteCodes = usersData.map(u => u.invitecode)
    const { data: childrenData = [] } = await $supabase
      .from('users')
      .select('id, user_name, phone, parent_invitecode')
      .in('parent_invitecode', inviteCodes)

    // 4. Recharges + retraits
    const { data: rechargesData = [] } = await $supabase
      .from('recharges')
      .select('id_user, amount')
      .in('id_user', authIds)

    const { data: withdrawsData = [] } = await $supabase
      .from('withdrawls')
      .select('id_user, amount')
      .in('id_user', authIds)

    // 5. Construction finale
    const users = usersData.map(user => {
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

      const today = new Date()
      const totalGradeGains = gradesWithInfo.reduce((sum, g) => {
        const d1 = new Date(g.date_creation.replace(' ', 'T'))
        const days = (today.getTime() - d1.getTime()) / (1000 * 3600 * 24)
        return sum + days * (g.grade?.daily_income || 0)
      }, 0)

      return {
        ...user,
        grades: gradesWithInfo,
        children: userChildren,
        walletBalance: totalRecharges + totalGradeGains - totalWithdrawals
      }
    })

    return {
      users,
      total: count || 0,
      page,
      limit
    }
  }

  // 🔹 Nouvelle fonction pour récupérer les retraits payés par utilisateur
  const getPaidWithdrawals = async (userIds: number[]) => {
    if (!userIds.length) return {}

    const { data: withdrawsData = [], error } = await $supabase
      .from('withdrawls')
      .select('id_user, amount, status')
      .in('id_user', userIds)
      .eq('status', 'Payé')

    if (error) throw error

    const withdrawalsMap = userIds.reduce<Record<number, UserWithdraw[]>>((acc, id) => {
      acc[id] = withdrawsData.filter(w => w.id_user === id)
      return acc
    }, {})

    return withdrawalsMap
  }

  return { getUsers, getPaidWithdrawals }
}

export default userApi
