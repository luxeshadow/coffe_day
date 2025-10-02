// services/paygateService.ts
import { useRuntimeConfig } from '#app'

export interface PaygateResponse {
  status: string | number
  tx_reference: string
  identifier?: string
  payment_reference?: string
  datetime?: string
  message?: string
}

export interface PaygatePayload {
  phone_number: string
  amount: number
  network: 'FLOOZ' | 'TMONEY'
  description?: string
  identifier: string
}

export const paygateService = {
  // Créer un paiement
  async createPayment(payload: PaygatePayload): Promise<PaygateResponse> {
    const config = useRuntimeConfig()

    const response = await fetch('https://paygateglobal.com/api/v1/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: config.public.paygateKey,
        ...payload,
        network: payload.network.toUpperCase(),
      }),
    })

    if (!response.ok) throw new Error(`Erreur PayGate: ${response.statusText}`)
    return await response.json()
  },

  // Vérifier le statut d'un paiement
  async checkPaymentStatus(tx_reference: string): Promise<PaygateResponse> {
    const config = useRuntimeConfig()
    const response = await fetch('https://paygateglobal.com/api/v1/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: config.public.paygateKey,
        tx_reference,
      }),
    })

    if (!response.ok) throw new Error(`Erreur vérification PayGate: ${response.statusText}`)
    return await response.json()
  },
}
