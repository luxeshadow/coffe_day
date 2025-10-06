// validations/notificationValidation.ts
import type { Notification } from '../models/Notification'

export function notificationValidate(notification: Notification) {
  if (!notification.texte || notification.texte.trim().length === 0) {
    throw new Error('Le texte de la notification est obligatoire.')
  }

  if (notification.type && !['alert', 'info'].includes(notification.type)) {
    throw new Error('Le statut de la notification est invalide.')
  }
}
