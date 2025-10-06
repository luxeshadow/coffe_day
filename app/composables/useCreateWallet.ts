import { ref } from 'vue'
import walletService from '../services/walletService'
import type { Wallet } from '../models/Wallet'
import { walletValidate } from '../validations/walletValidation'
import { useNuxtApp } from '#app'

export function useCreateWallet() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { $toast } = useNuxtApp()

  const createWallet = async (wallet: Wallet) => {
    loading.value = true
    error.value = null

    try {
      // 1️⃣ Validation front
      walletValidate(wallet)

      // 2️⃣ Création du wallet via le service
      const saved = await walletService.createWallet(wallet)

      // 3️⃣ Toast de succès
      $toast({
        text: 'Portefeuille créé avec succès !',
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      })

      return saved
    } catch (err: any) {
      // Interception de l'erreur "duplicate key"
      if (err.message?.includes('duplicate key value') || err?.code === '23505') {
        error.value = "Vous avez déjà un portefeuille."
      } else {
        error.value = err.message || 'Erreur inconnue'
      }

      // Toast d'erreur
      $toast({
        text: 'Erreur : ' + error.value,
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      })

      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, error, createWallet }
}
