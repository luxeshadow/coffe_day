import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '../stores/authStore'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // ✅ Routes publiques
  const publicRoutes = ['/', '/register']

  // Autoriser aussi /register/, /register?ref=xxx, etc.
  const isPublicRoute =
    publicRoutes.includes(to.path) ||
    to.path.startsWith('/register')

  // ✅ Si utilisateur NON connecté → accès OK seulement aux pages publiques
  if (!authStore.token && !isPublicRoute) {
    return navigateTo('/')
  }

  // ✅ Si utilisateur connecté
  if (authStore.token) {
    // Bloquer accès à / et /register une fois connecté
    if (isPublicRoute) {
      return navigateTo('/home')
    }

    // ✅ Gestion des rôles
    if (authStore.role === 'admin' && !to.path.startsWith('/admin')) {
      return navigateTo('/admin/user/stat')
    }

    if (authStore.role !== 'admin' && to.path.startsWith('/admin')) {
      return navigateTo('/home')
    }
  }
})
