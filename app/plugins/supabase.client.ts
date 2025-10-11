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

  // ✅ Écouteur global de session Supabase
  supabase.auth.onAuthStateChange((event, session) => {
    if (!session || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESH_FAILED') {
      console.warn('⚠️ Session Supabase expirée ou invalide → logout global')
      gainStore.$reset()
      gradeStore.$reset()
      authStore.logout() // propre + vide aussi localStorage
      router.push('/')
    }
  })

  // ✅ Intercepteur sécurisé
  const supabaseWithAuth = async (fn: Function, ...args: any[]) => {
    const { data, error } = await fn(...args)
    if (error?.status === 401) {
      console.warn('⚠️ 401 détecté → session expirée → purge immédiate')
      gainStore.$reset()
      gradeStore.$reset()
      authStore.logout()
      router.push('/')
    }
    return { data, error }
  }

  nuxtApp.provide('supabase', supabase)
  nuxtApp.provide('supabaseWithAuth', supabaseWithAuth)
})
