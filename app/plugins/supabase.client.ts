import { defineNuxtPlugin } from '#app'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'vue-router'
import { useGainStore } from '../stores/gainStore'
import { useGradeStore } from '../stores/gradeStore'
import { useAuthStore } from '../stores/authStore'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // 🔹 Variables Supabase depuis .env (en majuscules)
  const supabaseUrl = config.public.SUPABASE_URL
  const supabaseKey = config.public.SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL ou Key manquants')
    return
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

  // Intercepteur global pour les requêtes Supabase
  const router = useRouter()
  const gainStore = useGainStore()
  const gradeStore = useGradeStore()
  const authStore = useAuthStore()

  // Wrapper helper pour intercepter les erreurs 401
  const wrapWithAuthInterceptor = async (fn: Function, ...args: any[]) => {
    const { data, error } = await fn(...args)
    if (error?.status === 401) {
      console.warn('⚠️ Session expirée, déconnexion...')
      gainStore.$reset()
      gradeStore.$reset()
      authStore.$reset()
      router.push('/')
    }
    return { data, error }
  }

  // Injection Nuxt
  nuxtApp.provide('supabase', supabase)
  nuxtApp.provide('supabaseWithAuth', wrapWithAuthInterceptor)
})
