import { defineStore } from 'pinia'

export const useStatStore = defineStore('stats', {
  state: () => ({
    loading: false,
    totalWithdraw: 0,
    totalRecharge: 0,
    totalRecompenseParrainage: 0, // ✅ AJOUT ICI
    usersWithoutGrade: 0,
    usersWithGrade: 0,
    usersByGrade: [] as { grade_name: string; total: number }[]
  }),

  actions: {
    async loadStats() {
      if (this.loading) return
      this.loading = true
      console.log('📊 loadStats appelé') // debug

      try {
        const { data, error } = await useFetch('/api/stats')
        if (error.value) {
          console.error('Erreur API stats:', error.value)
        } else if (data.value) {
          console.log('✅ Stats API récupérées :', data.value)
          this.totalWithdraw = data.value.totalWithdrawSuccess || 0
          this.totalRecharge = data.value.totalRecharges || 0
          this.totalRecompenseParrainage = data.value.totalRecompenseParrainage || 0 
          this.usersWithGrade = data.value.usersWithGrade || 0
          this.usersWithoutGrade = data.value.usersWithoutGrade || 0
          this.usersByGrade = data.value.usersByGrade || []
        }
      } catch (err) {
        console.error('❌ Erreur chargement stats:', err)
      } finally {
        this.loading = false
      }
    }
  },

  persist: true
})
