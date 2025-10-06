// services/notificationService.ts
import notificationApi from '../api/notificationApi'
import { notificationValidate } from '../validations/notificationValidation'
import type { Notification } from '../models/Notification'

class NotificationService {

  async createNotification(notification: Notification): Promise<Notification> {
    notificationValidate(notification)
    return notificationApi.createNotification(notification)
  }

  // 🔁 Récupérer toutes les notifications
  async getNotifications(): Promise<Notification[]> {
    return notificationApi.getNotifications()
  }
}

export default new NotificationService()
