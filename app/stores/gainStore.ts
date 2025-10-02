import { defineStore } from 'pinia'
import { ref } from 'vue'
import gainApi from '../api/gainApi'

interface UserGain {
  totalRecharges: number
  totalWithdrawals: number
  totalGradeGains: number
  walletBalance: number
}

export const useGainStore = defineStore('gain', () => {
  const totalRecharges = ref(0)
  const totalWithdrawals = ref(0)
  const totalGradeGains = ref(0)
  const walletBalance = ref(0)

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Action pour récupérer les gains de l'utilisateur
  const fetchUserGains = async () => {
    loading.value = true
    error.value = null
    try {
      const data: UserGain = await gainApi.getUserGains()
      totalRecharges.value = data.totalRecharges
      totalWithdrawals.value = data.totalWithdrawals
      totalGradeGains.value = data.totalGradeGains
      walletBalance.value = data.walletBalance
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des gains'
    } finally {
      loading.value = false
    }
    console.log('GainStore state:', {
      totalRecharges: totalRecharges.value,
      totalWithdrawals: totalWithdrawals.value,
      totalGradeGains: totalGradeGains.value,
      walletBalance: walletBalance.value,
      loading: loading.value,
      error: error.value
    })
  }

  return {
    totalRecharges,
    totalWithdrawals,
    totalGradeGains,
    walletBalance,
    loading,
    error,
    fetchUserGains
  }
})
