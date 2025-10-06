import { ref, computed } from 'vue'
import { useHistoryStore } from '../stores/historyStore'

export function useListeHistory() {
  const historyStore = useHistoryStore()
  const loading = ref(false)
  const error = ref(null)

  const fetchHistory = async () => {
    if (historyStore.recharges.length && historyStore.withdrawls.length) return

    loading.value = true
    error.value = null
    try {
      await Promise.all([
        historyStore.fetchRecharges(),
        historyStore.fetchWithdrawls()
      ])
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de l’historique'
    } finally {
      loading.value = false
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0') // mois 0-11
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  const allOperations = computed(() => {
    const rechargesOps = historyStore.recharges.map(r => ({
      type: 'Recharge',
      info: r.methode ? `Via ${r.methode}` : 'Via Mobile Money',
      date: formatDate(r.created_at || ''),
      amount: r.amount,
      status: 'Réussi' // texte fixe pour les recharges
    }))

    const withdrawOps = historyStore.withdrawls.map(w => ({
      type: 'Retrait',
      info: w.telephone_withdrawls ? `Vers ${w.telephone_withdrawls}` : 'xxxx',
      date: formatDate(w.created_at || ''),
      amount: -w.amount,
      status: w.status // statut réel pour les retraits
    }))

    return [...rechargesOps, ...withdrawOps].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  })

  return {
    loading,
    error,
    fetchHistory,
    allOperations
  }
}
