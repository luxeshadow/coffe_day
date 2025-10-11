import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '../stores/authStore'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // ✅ Routes publiques accessibles sans connexion
  const publicRoutes = ['/', '/register']

  // ✅ On vérifie si la route actuelle correspond à une route publique
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

  // ⛔ Si pas connecté et route privée → redirige vers /
  if (!authStore.token && !isPublicRoute) {
    return navigateTo('/')
  }

  // ✅ Utilisateur connecté
  if (authStore.token) {
    // 🚫 Empêcher accès aux routes publiques pour les connectés
    if (isPublicRoute) {
      return navigateTo('/home')
    }

    // ✅ Redirection par rôle
    if (authStore.role === 'admin' && !to.path.startsWith('/admin')) {
      return navigateTo('/admin/user/stat')
    }

    if (authStore.role !== 'admin' && to.path.startsWith('/admin')) {
      return navigateTo('/home')
    }
  }
})
