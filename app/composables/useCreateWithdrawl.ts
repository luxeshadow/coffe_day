// composables/useCreateWithdrawl.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import WithdrawlService from '../services/withdrawlService'
import { validateWithdrawl } from '../validations/withdrawlValidation'

export function useCreateWithdrawl() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const withdrawl = ref<any | null>(null) // On peut typer avec Withdrawl si tu veux
  const router = useRouter()
  const toast = useNuxtApp().$toast

  const createWithdrawl = async (formData: { montant: number; password: string }) => {
    loading.value = true
    error.value = null

    try {
      // Validation côté front
      validateWithdrawl(formData)

      // Appel API pour créer le retrait
      const created = await WithdrawlService.createWithdrawl({
        montant: formData.montant,
        password: formData.password
      })
      withdrawl.value = created

      // Notification succès
      toast({
        text: `Votre demande de retrait de ${formData.montant.toLocaleString('fr-FR')} XOF est en cours ✅`,
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)'
      })

      // Redirection ou action complémentaire
      router.push('/profile')

      return created
    } catch (err: any) {
      console.error('Erreur création retrait :', err)
      const message = err.response?.data?.detail || err.message || 'Erreur inconnue'
      error.value = message

      toast({
        text: message,
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)'
      })

      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, withdrawl, createWithdrawl }
}
