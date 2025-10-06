// api/notificationApi.ts
import { useNuxtApp } from '#app'
import type { Notification } from '../models/Notification'

const notificationApi = {
  // ➕ Créer une notification
  createNotification: async (notification: Notification) => {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('notification')
      .insert([{ texte: notification.texte, type: notification.type || 'info' }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 🔁 Récupérer toutes les notifications
  getNotifications: async () => {
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase
      .from('notification')
      .select('*')
      .order('id', { ascending: false })

    if (error) throw error
    return data
  },
}

export default notificationApi
