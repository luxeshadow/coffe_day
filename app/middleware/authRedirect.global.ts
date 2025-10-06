// middleware/authRedirect.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '../stores/authStore'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const publicRoutes = ['/', '/register']

  // Si l'utilisateur est connecté et tente d'aller sur une page publique
  if (authStore.token && publicRoutes.includes(to.path)) {
    return navigateTo('/home')
  }

  // Si l'utilisateur n'est pas connecté et tente d'aller sur une page privée
  if (!authStore.token && !publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})
