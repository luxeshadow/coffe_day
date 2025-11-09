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

interface Withdraw {
  id: number
  id_user: string
  amount: number
  date_creation: string
  status?: string
}

interface User {
  id: number
  user_name: string
  phone: string
  invitecode: string
  parent_invitecode?: string
  grades: UserGrade[]
  children: UserChild[]
  withdraws: Withdraw[]
  walletBalance: number
}

const userApi = () => {
  const { $supabase } = useNuxtApp()

  const buildUserData = async (usersData: any[]) => {
    if (!usersData.length) return []

    const authIds = usersData.map(u => u.auth_id)

    // ✅ Grades
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

    // ✅ Filleuls
    const inviteCodes = usersData.map(u => u.invitecode)
    const { data: childrenData = [] } = await $supabase
      .from('users')
      .select('id, user_name, phone, parent_invitecode')
      .in('parent_invitecode', inviteCodes)

    // ✅ Recharges
    const { data: rechargesData = [] } = await $supabase
      .from('recharges')
      .select('id_user, amount')
      .in('id_user', authIds)

    // ✅ Retraits (liste complète)
    const { data: withdrawsData = [] } = await $supabase
      .from('withdrawls')
      .select('id, id_user, amount, date_creation, status')
      .in('id_user', authIds)

    const today = new Date()

    return usersData.map(user => {
      const userGrades = allUserGrades.filter(g => g.id_user === user.auth_id)
      const gradesWithInfo = userGrades.map(g => ({
        ...g,
        grade: gradeMap.get(g.id_grade)
      }))

      const userChildren = childrenData.filter(c => c.parent_invitecode === user.invitecode)

      const userWithdraws = withdrawsData.filter(w => w.id_user === user.auth_id)

      const totalRecharges = rechargesData
        .filter(r => r.id_user === user.auth_id)
        .reduce((s, r) => s + Number(r.amount), 0)

      const totalWithdrawals = userWithdraws
        .reduce((s, w) => s + Number(w.amount), 0)

      const totalGradeGains = gradesWithInfo.reduce((sum, g) => {
        const d1 = new Date(g.date_creation.replace(' ', 'T'))
        const days = (today.getTime() - d1.getTime()) / (1000 * 3600 * 24)
        return sum + days * (g.grade?.daily_income || 0)
      }, 0)

      return {
        ...user,
        grades: gradesWithInfo,
        children: userChildren,
        withdraws: userWithdraws,
        walletBalance: totalRecharges + totalGradeGains - totalWithdrawals
      }
    })
  }

  const getUsers = async (page = 1, limit = 30) => {
    const from = (page - 1) * limit
    const to = from + limit - 1
    const { data: usersData, error, count } = await $supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range(from, to)

    if (error) throw error
    const users = await buildUserData(usersData || [])
    return { users, total: count || 0, page, limit }
  }

  const searchUsers = async (term: string) => {
    const { data, error } = await $supabase
      .from('users')
      .select('*')
      .or(`user_name.ilike.%${term}%,phone.ilike.%${term}%`)

    if (error) throw error
    const users = await buildUserData(data || [])
    return users
  }

  return { getUsers, searchUsers }
}

export default userApi
