import { defineNuxtPlugin } from '#app'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL ou Key manquants')
    return
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

  // Injection => accessible via useNuxtApp().$supabase
  nuxtApp.provide('supabase', supabase)
})
