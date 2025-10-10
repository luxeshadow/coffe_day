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

  const getUsers = async (): Promise<User[]> => {
    const { data: usersData, error: usersError } = await $supabase
      .from('users')
      .select('*')
    if (usersError) throw usersError
    if (!usersData) return []

    const users: User[] = []

    for (const u of usersData) {
      // Grades
      const { data: userGrades, error: userGradesError } = await $supabase
        .from('assigne_user_grade')
        .select('id_grade, date_creation')
        .eq('id_user', u.auth_id)
      if (userGradesError) throw userGradesError

      let gradesWithInfo: UserGrade[] = []
      if (userGrades?.length) {
        const gradeIds = userGrades.map(g => g.id_grade)
        const { data: gradesData, error: gradesError } = await $supabase
          .from('grades')
          .select('id, grade_name, daily_income')
          .in('id', gradeIds)
        if (gradesError) throw gradesError

        const gradeMap = new Map<number, { grade_name: string, daily_income: number }>()
        gradesData.forEach(g => gradeMap.set(g.id, { grade_name: g.grade_name, daily_income: Number(g.daily_income) }))

        gradesWithInfo = userGrades.map(ug => ({
          ...ug,
          grade: gradeMap.get(ug.id_grade)
        }))
      }

      // Children / filleuls
      const { data: childrenData, error: childrenError } = await $supabase
        .from('users')
        .select('id, user_name, phone')
        .eq('parent_invitecode', u.invitecode)
      if (childrenError) throw childrenError

      // Gains calculation (recharges + grades - withdrawals)
      const { data: rechargesData } = await $supabase
        .from('recharges')
        .select('amount')
        .eq('id_user', u.auth_id)
      const totalRecharges = rechargesData?.reduce((sum, r) => sum + Number(r.amount), 0) ?? 0

      const { data: withdrawalsData } = await $supabase
        .from('withdrawls')
        .select('amount')
        .eq('id_user', u.auth_id)
      const totalWithdrawals = withdrawalsData?.reduce((sum, w) => sum + Number(w.amount), 0) ?? 0

      let totalGradeGains = 0
      const today = new Date()
      for (const ug of gradesWithInfo) {
        const dailyIncome = ug.grade?.daily_income ?? 0
        const activationDate = new Date(ug.date_creation.replace(' ', 'T'))
        const days = (today.getTime() - activationDate.getTime()) / (1000 * 60 * 60 * 24)
        totalGradeGains += dailyIncome * days
      }

      const walletBalance = totalRecharges + totalGradeGains - totalWithdrawals

      users.push({
        ...u,
        grades: gradesWithInfo,
        children: childrenData ?? [],
        walletBalance
      })
    }

    return users
  }

  return {
    getUsers
  }
}

export default userApi