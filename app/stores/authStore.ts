// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface AuthState {
  user_name: string
  token: string
  phone: string
}

export const useAuthStore = defineStore('auth', () => {
  const user_name = ref(localStorage.getItem('user_name') || '')
  const token = ref(localStorage.getItem('token') || '')
  const phone = ref(localStorage.getItem('phone') || '')

  watch(user_name, (newVal) => localStorage.setItem('user_name', newVal))
  watch(token, (newVal) => localStorage.setItem('token', newVal))
  watch(phone, (newVal) => localStorage.setItem('phone', newVal))

  // Actions
  const setAuth = (payload: AuthState) => {
    user_name.value = payload.user_name
    token.value = payload.token
    phone.value = payload.phone
  }

  const clearAuth = () => {
    user_name.value = ''
    token.value = ''
    phone.value = ''
    localStorage.removeItem('user_name')
    localStorage.removeItem('token')
    localStorage.removeItem('phone')
  }
  return { user_name, token, phone, setAuth, clearAuth }
})
