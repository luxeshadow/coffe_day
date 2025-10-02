// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  nitro: {
    preset: 'netlify'
  },

  runtimeConfig: {
    public: {
      supabaseUrl: 'https://hubxvgpqhurrzqonulap.supabase.co', 
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Ynh2Z3BxaHVycnpxb251bGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDUyNDgsImV4cCI6MjA3NDIyMTI0OH0.qZYF377Buq15svHZw909RgNfG7b4CMXw0HJwYViBTzo',

      // PayGate API Key
      paygateKey: '7200ed15-c944-4c1c-a025-2379213ac043',
    },
  },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
        }
      ]
    }
  }
})
