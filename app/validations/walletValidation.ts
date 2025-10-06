import type { Wallet } from '../models/Wallet'

export const walletValidate = (wallet: Wallet) => {
  // Numéro de retrait
  if (!wallet.telephone_withdrawls || wallet.telephone_withdrawls.trim().length < 8 || !/^\d+$/.test(wallet.telephone_withdrawls)) {
    throw new Error("Le numéro de retrait est invalide (minimum 8 chiffres, uniquement des chiffres).")
  }

  // Mot de passe
  if (!wallet.password || wallet.password.trim().length < 4) {
    throw new Error("Le mot de passe doit contenir au moins 4 caractères.")
  }

  // Moyen de retrait
  if (!wallet.methode_withdrawls || !['flooz', 'tmoney'].includes(wallet.methode_withdrawls)) {
    throw new Error("Veuillez sélectionner un moyen de retrait valide (TMoney ou Flooz).")
  }

  return true
}
