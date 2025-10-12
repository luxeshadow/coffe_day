import gradeApi from '../api/gradeApi'
import gainApi from '../api/gainApi'
import type { Grade } from '../models/Grade'

export function useAssigneGrade() {
  const { $toast } = useNuxtApp()

  const assignGrade = async (grade: Grade) => {
    try {
      // 1️⃣ Vérifie le solde
      const { walletBalance } = await gainApi.getUserGains()
      if (walletBalance < (grade.amounts ?? 0)) {
        $toast({
          text: 'Solde insuffisant pour ce grade',
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        })
        return false
      }

      // 2️⃣ Appelle l'API pour assigner le grade et gérer la reward
      const res = await gradeApi.assignGradeToUser(grade.id)

      if (!res?.success) {
        $toast({
          text: 'Impossible d’assigner le grade',
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        })
        return false
      }

      $toast({
        text: `Grade ${grade.grade_name} acheté avec succès !`,
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      })

      return true
    } catch (err: any) {
      console.error('Erreur assignGrade :', err)
      $toast({
        text: 'Erreur : ' + (err.message || 'Erreur inconnue'),
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      })
      return false
    }
  }

  return { assignGrade }
}
