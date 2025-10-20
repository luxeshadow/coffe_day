// services/userService.ts
import type { User } from '../models/User'
import userApi from '../api/userApi'

class UserService {
  // 🔹 Passer page et limit à l'API
  async getUsers(page = 1, limit = 10): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    return userApi().getUsers(page, limit)
  }
}

export default new UserService()
