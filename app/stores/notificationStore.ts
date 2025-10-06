import { defineStore } from 'pinia'
import { ref } from 'vue'
import notificationService from '../services/notificationService'
import type { Notification } from '../models/Notification'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)

  const fetchNotifications = async () => {
    if (notifications.value.length > 0) return 

    loading.value = true
    try {
      const data = await notificationService.getNotifications()
      notifications.value = data
      localStorage.setItem('notifications', JSON.stringify(data))
    } catch (err) {
      console.error('Erreur chargement notifications :', err)
    } finally {
      loading.value = false
    }
  }

  return {
    notifications,
    loading,
    fetchNotifications,
   
  }
})
