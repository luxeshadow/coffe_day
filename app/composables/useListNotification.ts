// composables/useListNotification.ts
import { ref } from 'vue'
import notificationService from '../services/notificationService'
import type { Notification } from '../models/Notification'

export function useListNotification() {
  const notifications = ref<Notification[]>([])
  const error = ref<string | null>(null)
  const loading = ref(false)

  const loadNotifications = async () => {
    loading.value = true
    try {
      const data = await notificationService.getNotifications()
      notifications.value = data
    } catch (err: any) {
      console.error('Erreur lors du chargement des notifications :', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    notifications,
    loadNotifications,
    error,
    loading
  }
}
