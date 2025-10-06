// stores/historyStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import historyService from '../services/historyService'

export const useHistoryStore = defineStore('history', () => {
  const recharges = ref([])
  const withdrawls = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchRecharges = async () => {
    loading.value = true
    error.value = null
    try {
      recharges.value = await historyService.getUserRecharges()
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des recharges'
    } finally {
      loading.value = false
    }
  }

  const fetchWithdrawls = async () => {
    loading.value = true
    error.value = null
    try {
      withdrawls.value = await historyService.getUserWithdrawls()
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des retraits'
    } finally {
      loading.value = false
    }
  }

  return {
    recharges,
    withdrawls,
    loading,
    error,
    fetchRecharges,
    fetchWithdrawls
  }
})
