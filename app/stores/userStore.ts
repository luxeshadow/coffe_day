// stores/userStore.ts
import { defineStore } from 'pinia'
import type { User } from '../models/User'
import userService from '../services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loadUsers() {
      if (this.loading) return
      this.loading = true
      this.error = null
      try {
        const data = await userService.getUsers()
        this.users = data
      } catch (err: any) {
        console.error('Erreur lors du chargement des utilisateurs :', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    clearUsers() {
      this.users = []
      this.error = null
    }
  },

  persist: true // facultatif, active si tu veux garder les données en mémoire
})
