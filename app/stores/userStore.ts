// stores/userStore.ts
import { defineStore } from 'pinia'
import type { User } from '../models/User'
import userService from '../services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loadUsers(page = 1, limit = 10) {
      if (this.loading) return
      this.loading = true
      this.error = null
      try {
        // ✅ Appel à l'API
        const { users, total, page: currentPage, limit: pageLimit } = await userService.getUsers(page, limit)

        // ✅ Mise à jour du state
        this.users = users
        this.total = total
        this.page = currentPage
        this.limit = pageLimit

      } catch (err: any) {
        console.error('Erreur lors du chargement des utilisateurs :', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    clearUsers() {
      this.users = []
      this.total = 0
      this.page = 1
      this.error = null
    }
  },

  persist: true // Optionnel
})
