// plugins/pinia-persistedstate.ts (ou le nom que vous utilisez)

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {

  if (nuxtApp.$pinia) {
      nuxtApp.$pinia.use(piniaPluginPersistedstate)
  }
})
