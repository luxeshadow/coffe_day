import { ref } from 'vue'
import { useNuxtApp } from '#app'
import rechargeService from '../services/rechargeService'
import { rechargeValidate } from '../validations/rechargeValidation'
import { paygateService } from '../services/paygateService'
import type { Recharge } from '../models/Recharge'

export function useRecharge() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const countdown = ref(0)
  const { $toast } = useNuxtApp()
  let timer: any = null

  const startCountdown = (seconds = 30) => {
    countdown.value = seconds
    clearInterval(timer)
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  }

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
    startCountdown(30)

    try {
      // ✅ Validation du formulaire
      rechargeValidate({ phone, amount, methode: paymentMethod })

      // ✅ Vérifier si c'est la première recharge avant PayGate
      const existingRecharges = await rechargeService.getUserRecharges()
      if (!existingRecharges || existingRecharges.length === 0) {
        if (amount < 10000) {
          throw new Error('Le premier dépôt ne peut pas être inférieur à 10 000 XOF.')
        }
      }

      // ✅ Identifier pour PayGate
      const identifier = `TX-${Date.now()}`

      // ✅ Paiement PayGate
      const paygateRes = await paygateService.createPayment({
        phone_number: phone,
        amount,
        network: paymentMethod === 'flooz' ? 'FLOOZ' : 'TMONEY',
        description: 'Recharge de compte',
        identifier,
      })

      if (!paygateRes.tx_reference) {
        throw new Error('tx_reference non reçu de PayGate')
      }

      // ⏳ Attente
      await new Promise(resolve => setTimeout(resolve, 30000))

      // ✅ Vérifier le statut PayGate
      const statusRes = await paygateService.checkPaymentStatus(String(paygateRes.tx_reference))
      if (statusRes.status !== 0) {
        throw new Error(statusRes.message || 'Échec du paiement PayGate')
      }

      // ✅ Sauvegarde finale
      const recharge: Recharge = {
        phone,
        amount,
        methode: paymentMethod,
        identifier,
        reference: paygateRes.tx_reference
      }
      const saved = await rechargeService.createRecharge(recharge)

      $toast({
        text: 'Recharge initiée avec succès !',
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)'
      })

      return saved
    } catch (err: any) {
      console.error('Erreur recharge :', err)
      error.value = err.message || 'Erreur inconnue'
      $toast({
        text: 'Erreur : ' + (err.message || 'Erreur inconnue'),
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)'
      })
      throw err
    } finally {
      loading.value = false
      clearInterval(timer)
      countdown.value = 0
    }
  }

  return { loading, error, countdown, createRecharge }
}
