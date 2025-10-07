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
  const role = ref('user') // valeur par défaut

  // ✅ Définir les infos utilisateur après login
  const setAuth = (payload: AuthState) => {
    console.log('[authStore] setAuth called with:', payload)

    user_name.value = payload.user_name || ''
    phone.value = payload.phone || ''
    role.value = payload.role || 'user'
    token.value = payload.token || ''

    if (process.client) {
      localStorage.setItem('auth.user_name', user_name.value)
      localStorage.setItem('auth.phone', phone.value)
      localStorage.setItem('auth.role', role.value)
      localStorage.setItem('auth.token', token.value)
    }
  }

  // ✅ Nettoyer le store
  const clearAuth = () => {
    user_name.value = ''
    phone.value = ''
    role.value = 'user'
    token.value = ''
  }

  // ✅ Logout complet
  const logout = () => {
    clearAuth()
    if (process.client) {
      localStorage.removeItem('auth.user_name')
      localStorage.removeItem('auth.phone')
      localStorage.removeItem('auth.role')
      localStorage.removeItem('auth.token')
    }
  }

  // ✅ Charger depuis le localStorage (utile pour middleware)
  const loadFromLocalStorage = () => {
    if (process.client) {
      user_name.value = localStorage.getItem('auth.user_name') || ''
      phone.value = localStorage.getItem('auth.phone') || ''
      role.value = localStorage.getItem('auth.role') || 'user'
      token.value = localStorage.getItem('auth.token') || ''
    }
  }

  return { user_name, phone, role, token, setAuth, clearAuth, logout, loadFromLocalStorage }
}, {
  persist: {
    storage: process.client ? localStorage : undefined,
    paths: ['user_name', 'phone', 'role', 'token']
  }
})
