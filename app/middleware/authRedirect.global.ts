// middleware/authGuard.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '../stores/authStore'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const { $supabase } = useNuxtApp()

  // Charger depuis localStorage
  authStore.loadFromLocalStorage()

  
  // Vérifier session Supabase
  const { data: { session }, error } = await $supabase.auth.getSession()

  if (!session || error) {
    
    authStore.logout() // vider tous les stores
    return navigateTo('/') // rediriger vers login
  }

  const publicRoutes = ['/', '/register']
  
  if (!authStore.token && !publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }

  // Gestion rôle
  if (authStore.token) {
    if (publicRoutes.includes(to.path)) return navigateTo('/home')
    if (authStore.role === 'admin' && !to.path.startsWith('/admin')) return navigateTo('/admin/user/stat')
    if (authStore.role !== 'admin' && to.path.startsWith('/admin')) return navigateTo('/home')
  }
})
