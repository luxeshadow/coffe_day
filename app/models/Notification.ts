// models/Notification.ts
export interface Notification {
  id?: number
  texte: string
  type?: 'alerte' | 'info'
}
