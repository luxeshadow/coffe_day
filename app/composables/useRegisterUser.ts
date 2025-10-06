import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '../models/User'
import { registerValidate } from '../validations/authValidation'
import authService from '../services/authService'

export function useCreateUser() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const user = ref<User | null>(null)
  const router = useRouter()

  const createUser = async (formData: {
    user_name: string
    phone: string
    countryCode: string
    password: string
    confirmPassword: string
    parent_invitecode?: string
  }) => {
    loading.value = true
    error.value = null
    const toast = useNuxtApp().$toast

    try {
      const fullPhone = `${formData.countryCode}${formData.phone}`

      const newUser: User = {
        user_name: formData.user_name.trim(),
        phone: fullPhone,
        password: formData.password,
        parent_invitecode: formData.parent_invitecode?.trim() || ''
      }

      console.log('Payload envoyé à registerValidate :', JSON.stringify({
        ...newUser,
        confirmPassword: formData.confirmPassword,
        countryCode: formData.countryCode
      }, null, 2))

      registerValidate({ ...newUser, confirmPassword: formData.confirmPassword, countryCode: formData.countryCode })

      const registeredUser = await authService.register(newUser)
      user.value = registeredUser

      toast({ text: 'Inscription réussie !', backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)' })
      router.push('/')

      return registeredUser

    } catch (err: any) {
      console.error('Erreur création utilisateur :', err)
      let message = 'Erreur inconnue'
      if (err.message?.includes('users_user_name_key')) {
        message = 'Ce nom d’utilisateur est déjà pris. Veuillez en choisir un autre.'
      } else if (err.message?.includes('users_phone_key')) {
        message = 'Ce numéro de téléphone est déjà utilisé.'
      } else if (err.message) {
        message = err.message
      }

      error.value = message
      toast({ text: message, backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)' })

      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, user, createUser }
}
