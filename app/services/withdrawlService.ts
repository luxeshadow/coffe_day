// services/withdrawlService.ts
import withdrawlApi from '../api/withdrawlApi' 
interface WithdrawlFormData {
  montant: number
  password: string
}

class WithdrawlService {
  /**
   * Crée un nouveau retrait après validation
   */
  async createWithdrawl(formData: WithdrawlFormData) {

    return withdrawlApi.createWithdrawl({
      amount: formData.montant,
      password: formData.password
    })
  }

  async getUserWithdrawls() {
    return withdrawlApi.getUserWithdrawls()
  }

  async getWithdrawlsPaid() {
    return withdrawlApi.getWithdrawlsPaid()
  }

  async getWithdrawlsPending() {
    return withdrawlApi.getWithdrawlsPending()
  }

  async getAllWithdrawls() {
    return withdrawlApi.getAllWithdrawls()
  }
}

export default new WithdrawlService()
