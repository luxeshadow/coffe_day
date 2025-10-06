// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],

  nitro: {
    preset: 'netlify'
  },

  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      SUPABASE_KEY: process.env.NUXT_PUBLIC_SUPABASE_KEY || '',
      PAYGATE_KEY: process.env.NUXT_PUBLIC_PAYGATE_KEY || ''
    }
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
        },
        {
          rel: 'manifest',
          href: '/manifest.webmanifest'
        }
      ],
      meta: [
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ]
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    strategies: 'generateSW',
    workbox: {
      cleanupOutdatedCaches: true,
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
      navigateFallback: '/',
      navigateFallbackDenylist: [
        /^\/api\//,                // exclut les API
        /^\/manifest\.webmanifest$/ // exclut le manifest
      ],
    },
    manifest: {
      name: 'EcoNest',
      short_name: 'EcoNest',
      description: 'Application de gestion EcoNest',
      start_url: '/',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#ffffff',
      theme_color: '#00A86B',
      icons: [
        {
          src: '/img/coffee/512x512.jpeg',
          sizes: '512x512',
          type: 'image/jpeg',
          purpose: 'any maskable'
        },
        {
          src: '/img/coffee/192x192.jpeg',
          sizes: '192x192',
          type: 'image/jpeg'
        }
      ]
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
