import { defineStore } from 'pinia'
import { statApi } from '../api/statApi'

export const useStatStore = defineStore('stats', {
  state: () => ({
    loading: false,
    totalWithdraw: 0,
    totalRecharge: 0,
    weeklyRecharges: [],
    weeklyWithdraws: [],
    usersWithoutGrade: 0,
    usersWithGrade: 0,
    usersByGrade: []
  }),

  actions: {
    async loadStats() {
      if (this.loading) return
      this.loading = true
      try {
        this.totalWithdraw = await statApi.getTotalWithdrawSuccess()
        this.totalRecharge = await statApi.getTotalRecharges()
        this.weeklyRecharges = await statApi.getWeeklyRecharges()
        this.weeklyWithdraws = await statApi.getWeeklyWithdraws()
        this.usersWithoutGrade = await statApi.getUsersWithoutGrade()
        this.usersWithGrade = await statApi.getUsersWithGrade()
        this.usersByGrade = await statApi.getUsersByGrade()
      } catch (err) {
        console.error('Erreur chargement stats:', err)
      } finally {
        this.loading = false
      }
    }
  },

  persist: true
})
