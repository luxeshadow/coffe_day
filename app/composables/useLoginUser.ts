import { ref } from 'vue'
import { useRouter, useNuxtApp } from '#app'  // ✅ Utiliser ceux de Nuxt
import { loginValidate } from '../validations/authValidation'
import authService from '../services/authService'
import { useAuthStore } from '../stores/authStore'

export function useLoginUser() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const user = ref<any>(null)
  const router = useRouter()
  const toast = useNuxtApp().$toast
  const authStore = useAuthStore()

  const loginUser = async (formData: { phone: string; password: string }) => {
    loading.value = true
    error.value = null

    try {
      loginValidate(formData)

      const data = await authService.login(formData.phone, formData.password)
      if (!data.session) throw new Error('Échec de la connexion.')

      const token = data.session.access_token
      const userInfo = data.user || data.session.user

      authStore.setAuth({
        user_name: userInfo.user_name || userInfo.email,
        token,
        phone: userInfo.user_metadata?.phone || ''
      })

      user.value = userInfo

      toast({
        text: 'Connexion réussie !',
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)'
      })

      // Debug navigation
      console.log('Attempting to navigate to /home')
      if (process.client) {
        try {
          await router.push('/home')
          console.log('Navigation to /home successful')
        } catch (navError) {
          console.error('Navigation error:', navError)
          throw new Error('Failed to navigate to /home')
        }
      } else {
        console.warn('Navigation attempted on server-side, skipping router.push')
      }

      return userInfo
    } catch (err: any) {
      console.error('Erreur login :', err)

      let message = 'Erreur inconnue'
      if (err.message?.includes('Invalid login')) {
        message = 'Numéro de téléphone ou mot de passe incorrect.'
      } else if (err.message) {
        message = err.message
      }

      error.value = message
      toast({
        text: message,
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)'
      })
      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, user, loginUser }
}
