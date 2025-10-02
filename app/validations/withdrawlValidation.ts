// validations/withdrawlValidation.ts
import { useGradeStore } from '../stores/gradeStore'

interface WithdrawlFormData {
  montant: number
  password: string
}

interface WithdrawlErrors {
  montant?: string
  password?: string
}

export const validateWithdrawl = (formData: WithdrawlFormData): WithdrawlErrors => {
  const gradeStore = useGradeStore()
  const errors: WithdrawlErrors = {}

  // Calcul du montant minimum autorisé : dailyIncome * 10
  const minAmount = (gradeStore.dailyIncome ?? 0) * 10 || 0 // fallback si dailyIncome 0

  // Validation du montant
  if (formData.montant < minAmount) {
    errors.montant = `Le montant minimum de retrait pour votre grade est de ${minAmount} XOF`
  }

  // Validation du mot de passe
  if (!formData.password || formData.password.length < 4) {
    errors.password = 'Le mot de passe doit contenir au moins 4 caractères'
  }

  return errors
}
