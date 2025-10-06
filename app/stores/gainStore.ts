import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import gainApi from '../api/gainApi'

interface UserGain {
  totalRecharges: number
  totalWithdrawals: number
  totalGradeGains: number
  walletBalance: number
}

export const useGainStore = defineStore('gain', () => {
  const totalRecharges = ref<number>(parseFloat(localStorage.getItem('totalRecharges') || '0'))
  const totalWithdrawals = ref<number>(parseFloat(localStorage.getItem('totalWithdrawals') || '0'))
  const totalGradeGains = ref<number>(parseFloat(localStorage.getItem('totalGradeGains') || '0'))
  const walletBalance = ref<number>(parseFloat(localStorage.getItem('walletBalance') || '0'))

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Synchronisation avec localStorage
  watch(totalRecharges, val => localStorage.setItem('totalRecharges', val.toString()))
  watch(totalWithdrawals, val => localStorage.setItem('totalWithdrawals', val.toString()))
  watch(totalGradeGains, val => localStorage.setItem('totalGradeGains', val.toString()))
  watch(walletBalance, val => localStorage.setItem('walletBalance', val.toString()))

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
  }

  const clearStore = () => {
    totalRecharges.value = 0
    totalWithdrawals.value = 0
    totalGradeGains.value = 0
    walletBalance.value = 0
    localStorage.removeItem('totalRecharges')
    localStorage.removeItem('totalWithdrawals')
    localStorage.removeItem('totalGradeGains')
    localStorage.removeItem('walletBalance')
  }

  return {
    totalRecharges,
    totalWithdrawals,
    totalGradeGains,
    walletBalance,
    loading,
    error,
    fetchUserGains,
    clearStore
  }
})
