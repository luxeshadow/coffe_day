import rechargeApi from '../api/rechargeApi'
import type { Recharge } from '../models/Recharge'

const rechargeService = {
  createRecharge: async (recharge: Recharge) => {
    return rechargeApi.createRecharge(recharge)
  },
  getUserRecharges: async () => {
    return rechargeApi.getUserRecharges()
  }
}

export default rechargeService
