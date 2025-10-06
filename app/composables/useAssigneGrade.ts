// composables/useAssigneGrade.ts
import gainApi from '../api/gainApi'
import type { Grade } from '../models/Grade'

export function useAssigneGrade() {

  const assignGrade = async (grade: Grade) => {
    const { $supabase, $toast } = useNuxtApp() // <-- déplacé ici

    try {
      // 1️⃣ Vérifie le gain de l'utilisateur
      const { walletBalance } = await gainApi.getUserGains()
      
      if (walletBalance < (grade.amounts ?? 0)) {
        $toast({
          text: 'Solde insuffisant pour ce grade',
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        })
        return false
      }

      // 2️⃣ Récupère l'utilisateur connecté
      const { data: { user }, error: userError } = await $supabase.auth.getUser()
      if (userError || !user) throw new Error('Utilisateur non authentifié')
      const userId = user.id

      // 3️⃣ Enregistre le grade assigné
      const { error: assignError } = await $supabase
        .from('assigne_user_grade')
        .insert([{
          id_user: userId,
          id_grade: grade.id
        }])
      if (assignError) throw assignError

      // 4️⃣ Crée un retrait sur ce gain
      const { error: withdrawError } = await $supabase
        .from('withdrawls')
        .insert([{
          id_user: userId,
          amount: grade.amounts,
          status: 'Achat de boite'
        }])
      if (withdrawError) throw withdrawError

      $toast({
        text: `Grade ${grade.grade_name} acheté avec succès !`,
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      })

      return true
    } catch (err: any) {
      console.error('Erreur assignation grade :', err)
      $toast({
        text: 'Erreur : ' + (err.message || 'Erreur inconnue'),
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      })
      return false
    }
  }

  return { assignGrade }
}
