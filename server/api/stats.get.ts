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
    
    const { data: usersData = [], error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, auth_id')
      .eq('fake', false)
    if (usersError) throw usersError

    const realUserIds = usersData.map(u => u.auth_id)

    // 🔹 Total des recharges (uniquement vrais utilisateurs)
    const { data: rechargesData = [], error: rechargesError } = await supabaseAdmin
      .from('recharges')
      .select('amount, id_user')
      .in('id_user', realUserIds)
    if (rechargesError) throw rechargesError

    const totalRecharges = rechargesData.reduce((sum, r: any) => sum + Number(r.amount), 0)

    // 🔹 Total des retraits payés (uniquement vrais utilisateurs)
    const { data: withdrawsData = [], error: withdrawsError } = await supabaseAdmin
      .from('withdrawls')
      .select('amount, id_user, status')
      .in('id_user', realUserIds)
      .eq('status', 'Payé')
    if (withdrawsError) throw withdrawsError

    const totalWithdrawSuccess = withdrawsData.reduce((sum, w: any) => sum + Number(w.amount), 0)

    // 🔹 Users avec grade (EXCLURE fake)
    const { data: userGradesData = [], error: userGradesError } = await supabaseAdmin
      .from('assigne_user_grade')
      .select('id_user, id_grade')
      .in('id_user', realUserIds)
    if (userGradesError) throw userGradesError

    const usersWithGrade = userGradesData.map((u: any) => u.id_user)
    const usersWithoutGrade = usersData.filter((u: any) => !usersWithGrade.includes(u.auth_id)).length

    // 🔹 Users par grade
    const gradeCountMap: Record<number, number> = {}
    userGradesData.forEach((row: any) => {
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

    // 🔹 Total Recompense Parrainage (uniquement vrais utilisateurs)
    const { data: rewardsData = [], error: rewardsError } = await supabaseAdmin
      .from('recharges')
      .select('amount, id_user')
      .eq('methode', 'Recompense parrainage')
      .in('id_user', realUserIds)
    if (rewardsError) throw rewardsError

    const totalRecompenseParrainage = rewardsData.reduce(
      (sum, r: any) => sum + Number(r.amount),
      0
    )

    return {
      totalRecharges,
      totalWithdrawSuccess,
      usersWithGrade: usersWithGrade.length,
      usersWithoutGrade,
      usersByGrade,
      totalRecompenseParrainage
    }
  } catch (error: any) {
    return { error: error.message || 'Erreur inconnue' }
  }
})
