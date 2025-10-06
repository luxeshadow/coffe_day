// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface AuthState {
  user_name: string
  token: string
  phone: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user_name = ref('')
  const token = ref('')
  const phone = ref('')
  const role = ref('user') // 'user' par défaut

  // ✅ Définir les infos utilisateur après connexion
  const setAuth = (payload: AuthState) => {
    user_name.value = payload.user_name
    token.value = payload.token
    phone.value = payload.phone
    role.value = payload.role || 'user'
  }

  // ✅ Nettoyer la session (store uniquement)
  const clearAuth = () => {
    user_name.value = ''
    token.value = ''
    phone.value = ''
    role.value = 'user'
  }

  // ✅ Nettoyage complet (store + stockage local)
  const logout = () => {
    clearAuth()
    if (process.client) {
      // Efface uniquement les clés liées à ton authStore
      localStorage.removeItem('auth.token')
      localStorage.removeItem('auth.user_name')
      localStorage.removeItem('auth.phone')
      localStorage.removeItem('auth.role')
    }
  }

  // ✅ Rechargement manuel depuis le localStorage (utile pour middleware)
  const loadFromLocalStorage = () => {
    if (process.client) {
      token.value = localStorage.getItem('auth.token') || ''
      user_name.value = localStorage.getItem('auth.user_name') || ''
      phone.value = localStorage.getItem('auth.phone') || ''
      role.value = localStorage.getItem('auth.role') || 'user'
    }
  }

  return { user_name, token, phone, role, setAuth, clearAuth, logout, loadFromLocalStorage }
}, {
  persist: {
    storage: process.client ? localStorage : undefined,
    paths: ['token', 'user_name', 'phone', 'role']
  }
})
