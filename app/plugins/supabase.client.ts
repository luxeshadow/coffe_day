import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'vue-router'
import { useGainStore } from '../stores/gainStore'
import { useGradeStore } from '../stores/gradeStore'
import { useAuthStore } from '../stores/authStore'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.SUPABASE_URL
  const supabaseKey = config.public.SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL ou Key manquants')
    return
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)
  const router = useRouter()
  const gainStore = useGainStore()
  const gradeStore = useGradeStore()
  const authStore = useAuthStore()

  const publicPaths = ['/', '/register', '/login'] // Pages accessibles sans session

  // ✅ Écouteur global de session Supabase
  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session && !publicPaths.includes(router.currentRoute.value.path)) {
      console.warn('⚠️ Session Supabase expirée → logout global')
      gainStore.clearStore()
      gradeStore.clearStore()
      authStore.logout()
      router.push('/') // Redirige uniquement si pas sur une page publique
    }
  })

  // ✅ Intercepteur sécurisé pour requêtes Supabase
  const supabaseWithAuth = async (fn: Function, ...args: any[]) => {
    const { data, error } = await fn(...args)
    if (error?.status === 401) {
      console.warn('⚠️ 401 détecté → session expirée → purge immédiate')
      gainStore.clearStore()
      gradeStore.clearStore()
      authStore.logout()
      if (!publicPaths.includes(router.currentRoute.value.path)) {
        router.push('/')
      }
    }
    return { data, error }
  }

  nuxtApp.provide('supabase', supabase)
  nuxtApp.provide('supabaseWithAuth', supabaseWithAuth)
})
