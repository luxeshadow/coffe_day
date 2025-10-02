// types/nuxt.d.ts
import { SupabaseClient } from '@supabase/supabase-js'
import { ToastOptions } from 'toastify-js'

declare module '#app' {
  interface NuxtApp {
    $supabase: SupabaseClient
    $toast: (options: ToastOptions) => void
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $supabase: SupabaseClient
    $toast: (options: ToastOptions) => void
  }
}
