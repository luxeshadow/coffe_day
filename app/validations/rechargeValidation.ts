import type { Recharge } from '../models/Recharge'

export const rechargeValidate = (recharge: Recharge) => {
  
  if (!recharge.phone || recharge.phone.trim().length < 8) {
    throw new Error("Le numéro de téléphone est invalide (minimum 8 chiffres).")
  }


  if (!recharge.amount || recharge.amount < 1000) {
    throw new Error("Le montant minimum est de 1000 XOF.")
  }

 
  if (!recharge.methode || !['tmoney', 'flooz'].includes(recharge.methode)) {
    throw new Error("Veuillez sélectionner une méthode de paiement valide (TMoney ou Flooz).")
  }

  return true
}
