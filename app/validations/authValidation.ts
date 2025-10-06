///validation/authValidation.ts
import type { User } from '../models/User'


export const loginValidate = (user: Pick<User, 'phone' | 'password'>): true => {
  const { phone, password } = user

  if (!phone || !/^\+?[0-9]{7,15}$/.test(phone)) {
  throw new Error('Numéro de téléphone invalide (7 à 15 chiffres).')
}


  if (!password || password.length < 8) {
    throw new Error('Mot de passe trop court (8 caractères minimum).')
  }

  return true
}

export const registerValidate = (user: Partial<User> & { confirmPassword: string,countryCode: string }): true => {


  const countryCodeRegex = /^\+\d{1,4}$/
  if (!user.countryCode || !countryCodeRegex.test(user.countryCode)) {
    throw new Error('Indicatif pays invalide (ex: +228).')
  }

const phoneRegex = /^\+?[0-9]{7,15}$/
if (!user.phone || !phoneRegex.test(user.phone)) {
  throw new Error('Numéro de téléphone invalide (7 à 15 chiffres).')
}

  if (!user.password || user.password.length < 8) {
    throw new Error('Mot de passe trop court (8 caractères minimum).')
  }

  if (user.password !== user.confirmPassword) {
    throw new Error('Les mots de passe ne correspondent pas.')
  }

  if (user.parent_invitecode && user.parent_invitecode.trim().length !== 6) {
    throw new Error('Code de parrain invalide (6 chiffres).')
  }

  return true
}

