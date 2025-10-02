//services/authService.ts
import type { User } from '..//models/User'
import authApi from '../api/authApi'



class AuthService {
async register(user: User) {
    return authApi.register(user) 
  }
  async login(phone: string, password: string) {
    return authApi.login(phone, password)
  }

  async logout() {
    return authApi.logout()
  }
}

export default new AuthService()
