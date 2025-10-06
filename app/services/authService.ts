// services/authService.ts
import type { User } from '../models/User'
import authApi from '../api/authApi'
import { useAuthStore } from '../stores/authStore'

class AuthService {
  async register(user: User) {
    return authApi.register(user)
  }

  async login(phone: string, password: string) {
    return authApi.login(phone, password)
  }

  async logout() {
    try {
      await authApi.logout()
    } finally {
      const authStore = useAuthStore()
      authStore.logout()
    }
  }
}

export default new AuthService()
