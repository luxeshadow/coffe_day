// composables/useManageProfile.ts
import { ref } from 'vue'
import ProfileService from '../services/profileService'

export function useManageProfile() {
  const userProfile = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUserProfile = async () => {
    loading.value = true
    error.value = null
    try {
      const profile = await ProfileService.getUserProfile()
      userProfile.value = profile
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération du profil'
    } finally {
      loading.value = false
    }
  }

  const refreshProfile = async () => {
    await fetchUserProfile()
  }

  return {
    userProfile,
    loading,
    error,
    fetchUserProfile,
    refreshProfile
  }
}
