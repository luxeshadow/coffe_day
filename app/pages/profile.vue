<template>
  <!-- En-tête avec numéro et grade -->
  <div class="profil-header">
    <div class="profil-phone-number">{{ phone }}</div>
    <div class="profil-grade">{{ gradeStore.topGradeName ?? 'Collect 0' }}</div>
  </div>

  <div class="profil-container">
    <!-- Section info -->
    <div class="profil-info-section">
      <div class="profil-info-icon">i</div>
      <div class="profil-info-text">
        Gérez facilement votre compte pour suivre vos investissements, consulter vos gains et personnaliser vos
        paramètres en toute sécurité.
      </div>
    </div>

    <!-- Carte solde -->
    <div class="profil-balance-card">
      <div class="profil-balance-amount">{{ formatCurrency(gainStore.walletBalance) }}</div>
      <div class="profil-balance-label">Solde disponible</div>
      <div class="profil-stats-row">
        <div class="profil-stat-item">
          <div class="profil-stat-value">{{ formatCurrency(gainStore.totalRecharges) }}</div>
          <div class="profil-stat-label">Investis</div>
        </div>
        <div class="profil-stat-item">
          <div class="profil-stat-value">{{ formatCurrency(gainStore.totalGradeGains) }}</div>
          <div class="profil-stat-label">Gains</div>
        </div>
      </div>
    </div>

    <!-- Section des gains -->
    <div class="profil-earnings-section">
      <div class="profil-earning-card">
        <div class="profil-earning-title">Gains Journaliers</div>
        <div class="profil-earning-amount">{{ formatCurrency(gradeStore.dailyIncome) }}</div>
      </div>
      <div class="profil-earning-card">
        <div class="profil-earning-title">Gains Hebdomadaires</div>
        <div class="profil-earning-amount weekly">{{ formatCurrency(weeklyIncome) }}</div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="profil-actions-section">
      <h2 class="profil-section-title">
        <i class="fi fi-rr-bolt"></i> Actions Rapides
      </h2>
      <div class="profil-action-grid">
        <NuxtLink to="/recharge">
          <div class="profil-action-card">
            <div class="profil-action-icon"><i class="fi fi-rr-rotate-right"></i></div>
            <div class="profil-action-title">Recharge</div>
          </div>
        </NuxtLink>

        <NuxtLink to="/retrait">
          <div class="profil-action-card">
            <div class="profil-action-icon"><i class="fi fi-rr-chart-mixed-up-circle-dollar"></i></div>
            <div class="profil-action-title">Retrait</div>
          </div>
        </NuxtLink>

        <NuxtLink to="/create-wallet">
          <div class="profil-action-card">
            <div class="profil-action-icon"><i class="fi fi-rr-coins"></i></div>
            <div class="profil-action-title">Portefeuille</div>
          </div>
        </NuxtLink>

        <NuxtLink to="/history">
          <div class="profil-action-card">
            <div class="profil-action-icon"><i class="fi fi-rr-rectangle-history-circle-plus"></i></div>
            <div class="profil-action-title">Historique</div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Section de parrainage -->
    <div class="referral-section">
      <div class="referral-card">
        <div class="referral-header">
          <i class="fi fi-rr-gift"></i>
          <h3>Votre lien de parrainage</h3>
        </div>

        <p class="referral-description">
          Partagez votre lien avec vos amis et gagnez des récompenses pour chaque inscription validée.
        </p>

        <!-- Section lien parrainage -->
<div class="referral-link-container">
  <label class="referral-label" for="referralInput">Lien à partager :</label>
  <div class="referral-input-group">
    <input
      id="referralInput"
      class="referral-input"
      type="text"
      :value="referralStore.loading ? 'Chargement...' : referralStore.referralLink"
      readonly
      @click="copyReferral"
    />
    <button class="copy-button" @click="copyReferral" :disabled="referralStore.loading">
      <i class="fi fi-rr-copy"></i>
    </button>
  </div>
</div>


        <div class="referral-benefits">
          <div style="margin-bottom:10px;" class="benefit-item">
            <i class="fi fi-rr-plus"></i>
            Vous avez parrainé {{ referralStore.referralCount }}
          </div>
        </div>
      
<!-- Liste des utilisateurs parrainés -->
<div v-if="referralStore.referrals.length" class="referral-users-box">
  <h4 class="referral-users-title">Utilisateurs parrainés</h4>
  <ul class="referral-users-list">
    <li v-for="(user, index) in referralStore.referrals" :key="index" class="referral-user-item">
      <div class="referral-user-info">
        <span class="user-name">{{ user.user_name }}</span>
        <span class="user-phone">{{ user.phone }}</span>
      </div>
    </li>
  </ul>
</div>

<!-- Aucun parrainé -->
<div v-else class="no-referral-users">
  <p>Aucun utilisateur parrainé pour le moment.</p>
</div>

      </div>
    </div>
  </div>

  <BottomNavigation />
</template>


<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useGainStore } from '../stores/gainStore'
import { useGradeStore } from '../stores/gradeStore'
import { useReferralStore } from '../stores/referralStore'
import { useNuxtApp } from '#app'

const authStore = useAuthStore()
const gainStore = useGainStore()
const gradeStore = useGradeStore()
const referralStore = useReferralStore()
const { $toast } = useNuxtApp()

const phone = computed(() => authStore.phone)
const weeklyIncome = computed(() => gradeStore.dailyIncome * 7)

const formatCurrency = (amount: number) => {
  const rounded = Math.floor(amount)
  return new Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(rounded) + ' XOF'
}

const copyReferral = async () => {
  if (!referralStore.referralLink) return
  try {
    await navigator.clipboard.writeText(referralStore.referralLink)
    $toast({
      text: 'Lien de parrainage copié avec succès !',
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
    })
  } catch {
    $toast({
      text: 'Impossible de copier le lien.',
      backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
    })
  }
}

onMounted(async () => {
  await gainStore.fetchUserGains()
  await gradeStore.fetchUserDailyIncome()
  await referralStore.loadReferralData()
})
</script>


<style scoped>

.referral-section {
  margin: 1.5rem 0;
}

.referral-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.referral-header i {
  color: var(--accent);
  font-size: 1.2rem;
}

.referral-header h3 {
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.referral-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border: 1px solid rgba(139, 109, 109, 0.1);
}

.referral-description {
  color: var(--text);
  font-size: 0.9rem;
  margin-bottom: 1.2rem;
  text-align: center;
  line-height: 1.4;
}

.referral-link-container {
  margin-bottom: 1.2rem;
}

.referral-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.referral-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.referral-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--cream);
  border-radius: 12px;
  background: var(--cream);
  font-size: 0.85rem;
  color: var(--text);
  outline: none;
  transition: all 0.3s ease;
}

.referral-input:focus {
  border-color: var(--accent);
  background: white;
}

.referral-input:read-only {
  cursor: pointer;
}

.copy-button {
  background: linear-gradient(135deg, var(--accent), #e6c12d);
  border: none;
  border-radius: 12px;
  padding: 0 1rem;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.copy-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.copy-button:active {
  transform: translateY(0);
}

.copy-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.copy-button i {
  font-size: 1rem;
}

/* Bénéfices du parrainage */
.referral-benefits {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(139, 109, 109, 0.1);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--coffee);
}

.benefit-item i {
  color: var(--accent);
  font-size: 0.9rem;
}
/*liste parainage*/
.referral-users-box {
  margin-top: 1rem;
   margin-bottom: 1.5rem;
  background: var(--cream);
  padding: 0.5rem;
  border-radius: 12px;

}

.referral-users-title {
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.8rem;
  text-align: center;
  font-size: 1rem;
}

.referral-users-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.referral-user-item {
  display: flex;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  background: white;
  border-radius: 10px;
  margin-bottom: 0.6rem;
  transition: all 0.2s ease;
}

.referral-user-item:hover {
  transform: translateY(-2px);
 
}

.referral-user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--primary);
  font-size: 0.9rem;
}

.user-phone {
  font-size: 0.85rem;
  color: var(--coffee);
}

.no-referral-users {
  text-align: center;
  font-size: 0.85rem;
  color: #777;
  margin-top: 1rem;
}

/* Animation de confirmation */
.copy-success {
  animation: copyPulse 0.6s ease-in-out;
}

@keyframes copyPulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .referral-card {
    padding: 1.2rem;
  }

  .referral-input-group {
    flex-direction: column;
  }

  .copy-button {
    padding: 0.75rem;
    min-width: auto;
  }

  .referral-benefits {
    flex-direction: column;
    gap: 0.75rem;
  }

  .benefit-item {
    justify-content: center;
  }
}

/* État de chargement */
.referral-input:placeholder-shown {
  color: #999;
  font-style: italic;
}

:root {
  --primary: #3b2f2f;
  --secondary: #6b4e31;
  --accent: #d4af37;
  --success: #4CAF50;
  --light: #f8f5f0;
  --dark: #2c2c2c;
  --text: #333333;
  --coffee: #8a6d6d;
  --cream: #fff9f0;
  --card-bg: #ffffff;
  --header-height: 60px;
  --nav-height: 70px;
  --border-radius: 16px;
  --shadow: 0 4px 15px rgba(59, 47, 47, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.profil-container {

  margin: 5px;

}

/* En-tête avec numéro et grade */
.profil-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  height: 70px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.profil-phone-number {
  font-size: 1.2rem;
  font-weight: 600;
}

.profil-grade {
  background-color: var(--accent);
  color: var(--primary);
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: capitalize;
}

/* Section d'information */
.profil-info-section {
  display: flex;
  align-items: flex-start;
  background-color: var(--cream);
  padding: 16px;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  box-shadow: var(--shadow);
  border-left: 4px solid var(--accent);
}

.profil-info-icon {
  background-color: var(--accent);
  color: var(--primary);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.profil-info-text {
  font-size: 0.9rem;
  color: var(--text);
  line-height: 1.5;
}

/* Carte solde */
.profil-balance-card {
  background: linear-gradient(135deg, var(--secondary), var(--coffee));
  color: white;
  padding: 24px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.profil-balance-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(25deg);
}

.profil-balance-amount {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}

.profil-balance-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}

.profil-stats-row {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.profil-stat-item {
  text-align: center;
}

.profil-stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.profil-stat-label {
  font-size: 0.8rem;
  opacity: 0.9;
}

/* Section des gains */
.profil-earnings-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
}

.profil-earning-card {
  flex: 1;
  background: var(--card-bg);
  padding: 20px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  border-top: 4px solid var(--accent);
}

.profil-earning-title {
  font-size: 0.9rem;
  color: var(--coffee);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.profil-earning-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--success);
}

.profil-earning-amount.weekly {
  color: var(--accent);
}

/* Actions rapides */
.profil-actions-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.profil-section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.profil-action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 15px;
}

.profil-action-card {
  background: var(--cream);
  padding: 16px 12px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(139, 109, 109, 0.1);
}

.profil-action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, var(--secondary), var(--primary));
  color: white;
}

.profil-action-icon {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: var(--coffee);
}

.profil-action-card:hover .profil-action-icon {
  color: white;
}

.profil-action-title {
  font-size: 0.85rem;
  font-weight: 500;
}



/* Responsive */
@media (max-width: 480px) {
  .profil-container {
    margin-bottom: 65px;
  }

  .profil-header {
    padding: 12px;
  }

  .profil-balance-card {
    padding: 20px 16px;
  }

  .profil-balance-amount {
    font-size: 1.8rem;
  }

  .profil-earning-card {
    padding: 16px 12px;
  }

  .profil-earning-amount {
    font-size: 1.3rem;
  }

  .profil-action-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .profil-actions-section {
    padding: 16px;
  }
}

/* Animations */
.profil-action-card {
  animation: fadeInUp 0.5s ease-out;
}

.profil-earning-card {
  animation: fadeInUp 0.6s ease-out;
}

.profil-balance-card {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* États de chargement */
.profil-loading {
  position: relative;
  overflow: hidden;
}

.profil-loading::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0));
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>