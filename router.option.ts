import type { RouterConfig } from '@nuxt/schema'

// Configuration du router Nuxt
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Si l’utilisateur utilise le bouton retour/avant du navigateur
    if (savedPosition) {
      return savedPosition
    }

    // Si une ancre est spécifiée (#id)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }

    // Sinon, par défaut on revient en haut
    return { top: 0 }
  }
}
