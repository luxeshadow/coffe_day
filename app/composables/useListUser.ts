// composables/useListUser.ts
import { ref } from 'vue'
import userService from '../services/userService'
import type { User } from '../models/User'

export function useListUser() {
  const users = ref<User[]>([])
  const error = ref<string | null>(null)
  const loading = ref(false)

  const loadUsers = async () => {
    loading.value = true
    try {
      const data = await userService.getUsers()
      users.value = data
    } catch (err: any) {
      console.error('Erreur lors du chargement des utilisateurs :', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loadUsers,
    error,
    loading
  }
}