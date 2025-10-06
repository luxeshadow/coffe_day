import walletApi from '../api/walletApi'
import type { Wallet } from '../models/Wallet'

const walletService = {
  createWallet: (wallet: Wallet) => walletApi.createWallet(wallet),
  getUserWallets: () => walletApi.getUserWallets()
}

export default walletService
