// composable/useCreaterecharge
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import rechargeService from '../services/rechargeService'
import type { Recharge } from '../models/Recharge'
import { rechargeValidate } from '../validations/rechargeValidation'
import { paygateService } from '../services/paygateService'

export function useRecharge() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { $toast } = useNuxtApp()

  const createRecharge = async ({
    phone,
    amount,
    paymentMethod,
  }: {
    phone: string
    amount: number
    paymentMethod: string
  }) => {
    loading.value = true
    error.value = null

    try {
      // 1️⃣ Validation côté front
      rechargeValidate({
        phone,
        amount,
        methode: paymentMethod,
      })

      // 2️⃣ Génération de l'identifiant interne unique
      const identifier = `TX-${Date.now()}`

      // 3️⃣ Création du paiement sur PayGate
      const paygateRes = await paygateService.createPayment({
        phone_number: phone,
        amount,
        network: paymentMethod === 'flooz' ? 'FLOOZ' : 'TMONEY',
        description: 'Recharge de compte',
        identifier,
      })

      // 4️⃣ Vérification que tx_reference existe
      console.log('TX_REFERENCE PayGate:', paygateRes.tx_reference)
      if (!paygateRes.tx_reference) {
        throw new Error('tx_reference non reçu de PayGate')
      }

      // 5️⃣ Attente de 10 secondes avant de checker le statut
      await new Promise(resolve => setTimeout(resolve, 10000))

      // 6️⃣ Vérification du statut après délai
      const statusRes = await paygateService.checkPaymentStatus(String(paygateRes.tx_reference))
      console.log('Statut du paiement:', statusRes)

      if (statusRes.status !== 0) {
        throw new Error(statusRes.message || 'Échec du paiement PayGate')
      }

      // 7️⃣ Sauvegarde dans Supabase
      const recharge: Recharge = {
        phone,
        amount,
        methode: paymentMethod,
        identifier,
        reference: paygateRes.tx_reference,
      }

      const saved = await rechargeService.createRecharge(recharge)

      $toast({
        text: 'Recharge initiée avec succès !',
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      })

      return saved
    } catch (err: any) {
      console.error('Erreur recharge :', err)
      error.value = err.message || 'Erreur inconnue'
      $toast({
        text: 'Erreur : ' + (err.message || 'Erreur inconnue'),
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, error, createRecharge }
}
