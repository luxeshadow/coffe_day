import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '../stores/authStore'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const publicRoutes = ['/', '/register']
  const adminRoutes = ['/admin']

  // Si non connecté et page privée -> redirige vers login
  if (!authStore.token && !publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }

  // Si connecté
  if (authStore.token) {
    // Empêcher accès aux pages publiques pour un user normal
    if (publicRoutes.includes(to.path)) {
      return navigateTo('/home')
    }

    // Redirection selon rôle
    if (authStore.role === 'admin' && !to.path.startsWith('/admin')) {
      // un admin qui essaie d’aller sur /home ou autre
      return navigateTo('/admin/user/stat')
    }

    if (authStore.role !== 'admin' && to.path.startsWith('/admin')) {
      // un user normal qui tente une page admin
      return navigateTo('/home')
    }
  }
})
