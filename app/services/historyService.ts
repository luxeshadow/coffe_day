// services/historyService.ts
import historyApi from '../api/historyApi'

const historyService = {
  getUserRecharges: async () => {
    return historyApi.getUserRecharges()
  },

  getUserWithdrawls: async () => {
    return historyApi.getUserWithdrawls()
  }
}

export default historyService
