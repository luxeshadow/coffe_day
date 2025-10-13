// server/api/stats.get.ts
import { defineEventHandler } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_SERVER_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export default defineEventHandler(async () => {
  try {
    // 🔹 Total des recharges
    const { data: rechargesData = [], error: rechargesError } = await supabaseAdmin
      .from('recharges')
      .select('amount')
    if (rechargesError) throw rechargesError
    const totalRecharges = rechargesData.reduce((sum, r: any) => sum + Number(r.amount), 0)

    // 🔹 Total des retraits payés
    const { data: withdrawsData = [], error: withdrawsError } = await supabaseAdmin
      .from('withdrawls')
      .select('amount')
      .eq('status', 'Payé')
    if (withdrawsError) throw withdrawsError
    const totalWithdrawSuccess = withdrawsData.reduce((sum, w: any) => sum + Number(w.amount), 0)

    // 🔹 Users avec et sans grade
    const { data: userGradesData = [], error: userGradesError } = await supabaseAdmin
      .from('assigne_user_grade')
      .select('id_user')
    if (userGradesError) throw userGradesError
    const usersWithGrade = userGradesData.map((u: any) => u.id_user)

    const { data: usersData = [], error: usersError } = await supabaseAdmin
      .from('users')
      .select('auth_id')
    if (usersError) throw usersError
    const usersWithoutGrade = usersData.filter((u: any) => !usersWithGrade.includes(u.auth_id)).length

    // 🔹 Users par grade
    const { data: assigneGrades = [], error: assigneError } = await supabaseAdmin
      .from('assigne_user_grade')
      .select('id_grade, id_user')
    if (assigneError) throw assigneError

    const gradeCountMap: Record<number, number> = {}
    assigneGrades.forEach((row: any) => {
      gradeCountMap[row.id_grade] = (gradeCountMap[row.id_grade] || 0) + 1
    })

    let usersByGrade: { grade_name: string; total: number }[] = []
    if (Object.keys(gradeCountMap).length > 0) {
      const { data: gradesData = [], error: gradesError } = await supabaseAdmin
        .from('grades')
        .select('id, grade_name')
        .in('id', Object.keys(gradeCountMap))
      if (gradesError) throw gradesError

      usersByGrade = gradesData.map((g: any) => ({
        grade_name: g.grade_name,
        total: gradeCountMap[g.id] || 0
      }))
    }

    return {
      totalRecharges,
      totalWithdrawSuccess,
      usersWithGrade: usersWithGrade.length,
      usersWithoutGrade,
      usersByGrade
    }
  } catch (error: any) {
    return { error: error.message || 'Erreur inconnue' }
  }
})
