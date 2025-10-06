import { defineStore } from 'pinia'
import referralApi from '../api/referralApi'

export const useReferralStore = defineStore('referralStore', {
 state: () => ({
  inviteCode: null as string | null,
  referralLink: null as string | null,
  referrals: [] as any[], // <- ici
  loading: false,
  error: null as string | null,
}),

  actions: {
    async loadReferralData() {
      this.loading = true
      this.error = null

      try {
        // Charger depuis le localStorage si présent
        const saved = localStorage.getItem('referralData')
        if (saved) {
          const parsed = JSON.parse(saved)
          this.inviteCode = parsed.inviteCode || null
          this.referralLink = parsed.referralLink || null
          this.referrals = parsed.referrals || []
        }

        // Actualiser depuis l'API
        const apiInviteCode = await referralApi.getMyInviteCode()
        this.inviteCode = apiInviteCode || null
        this.referralLink = apiInviteCode ? `${window.location.origin}/register?ref=${apiInviteCode}` : null

        const apiReferrals = (await referralApi.getMyReferrals()) || []
        this.referrals = Array.isArray(apiReferrals) ? apiReferrals : []

        // Sauvegarder dans localStorage
        localStorage.setItem(
          'referralData',
          JSON.stringify({
            inviteCode: this.inviteCode,
            referralLink: this.referralLink,
            referrals: this.referrals,
          })
        )
      } catch (err: any) {
        console.error('Erreur parrainage:', err)
        this.error = err.message || 'Erreur chargement données de parrainage'
        this.referrals = [] // fallback si erreur
      } finally {
        this.loading = false
      }
    },

    clearReferralData() {
      this.inviteCode = null
      this.referralLink = null
      this.referrals = []
      localStorage.removeItem('referralData')
    },
  },

  getters: {
    referralCount: (state) => state.referrals.length,
    hasReferrals: (state) => state.referrals.length > 0,
  },
})
