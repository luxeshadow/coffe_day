// services/userService.ts
import type { User } from '../models/User'
import userApi from '../api/userApi'

class UserService {
  async getUsers(): Promise<User[]> {
    return userApi().getUsers()
  }
}

export default new UserService()