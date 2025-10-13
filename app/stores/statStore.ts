// stores/statStore.ts
import { defineStore } from 'pinia'

export const useStatStore = defineStore('stats', {
  state: () => ({
    loading: false,
    totalWithdraw: 0,
    totalRecharge: 0,
    usersWithoutGrade: 0,
    usersWithGrade: 0,
    usersByGrade: [] as { grade_name: string; total: number }[]
  }),

  actions: {
    async loadStats() {
      if (this.loading) return
      this.loading = true
      try {
        const data = await $fetch('/api/stats') // UN SEUL APPEL
        if (!data.error) {
          this.totalWithdraw = data.totalWithdrawSuccess
          this.totalRecharge = data.totalRecharges
          this.usersWithGrade = data.usersWithGrade
          this.usersWithoutGrade = data.usersWithoutGrade
          this.usersByGrade = data.usersByGrade
        } else {
          console.error('Erreur API stats:', data.error)
        }
      } catch (err) {
        console.error('Erreur chargement stats:', err)
      } finally {
        this.loading = false
      }
    }
  },

  persist: true
})
