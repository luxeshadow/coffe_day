<template>
  <div class="retrait-page">
    <div class="retrait-container">
      <div class="retrait-header">
        <h2 class="retrait-title">
          <i class="fas fa-wallet"></i> Formulaire de Retrait
        </h2>
        <p class="retrait-subtitle">Retirez vos gains en toute sécurité</p>
      </div>

      <div class="retrait-balance-info">
        <div class="retrait-balance-label">
          <i class="fi fi-rr-send-money"></i> Solde disponible
        </div>
        <div class="retrait-balance-amount">{{ formatCurrency(walletBalance) }}</div>
      </div>
      
      <form class="retrait-form" @submit.prevent="validerRetrait">
        <div class="retrait-form-group">
          <label for="montant" class="retrait-label">
            <i class="fi fi-rr-coins"></i> Montant à retirer
          </label>
          <input type="number" id="montant" v-model="formData.montant" class="retrait-input" required placeholder="Minimum En fonction du grade">
          <div class="retrait-note">
            <i class="fi fi-rr-info"></i> Montant minimum : En fonction du grade
          </div>
        </div>
        
        <div class="retrait-form-group">
          <label for="password" class="retrait-label">
            <i class="fi fi-rr-lock"></i> Mot de passe
          </label>
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="formData.password" class="retrait-input" required placeholder="Votre mot de passe">
        </div>
        
        <button type="submit" class="retrait-submit-btn" :disabled="loading">
          <i class="fas fa-check-circle"></i> 
          {{ loading ? 'Traitement en cours...' : 'Valider le retrait' }}
        </button>
      </form>
      
      <NuxtLink to="/profile" class="retrait-back-link">
        <i class="fas fa-arrow-left"></i> Retour au profil
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGainStore } from '../stores/gainStore'
import { useCreateWithdrawl } from '../composables/useCreateWithdrawl'

const gainStore = useGainStore()
const { createWithdrawl, loading, error } = useCreateWithdrawl()

const formData = ref({ montant: null, password: '' })
const showPassword = ref(false)

const walletBalance = computed(() => gainStore.walletBalance)

onMounted(() => {
  gainStore.fetchUserGains()
})

const formatCurrency = (amount: number) =>
  `${Math.floor(amount)} XOF`


// Appel du composable pour créer le retrait
const validerRetrait = async () => {
  await createWithdrawl({
    montant: formData.value.montant,
    password: formData.value.password
  })
}
</script>


<style scoped>
/* Le CSS reste identique à la version HTML */
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
            --border-radius: 12px;
            --shadow: 0 4px 15px rgba(59, 47, 47, 0.1);
        }
.retrait-page {
  background-color: var(--light);
  color: var(--text);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.retrait-container {
  background-color: var(--card-bg);
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  position: relative;
}

.retrait-header {
  text-align: center;
  margin-bottom: 30px;
}

.retrait-title {
  color: var(--primary);
  font-size: 1.8rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.retrait-subtitle {
  color: var(--coffee);
  font-size: 1rem;
}

.retrait-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.retrait-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.retrait-label {
  font-weight: 600;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.retrait-input {
  padding: 15px;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: var(--cream);
}

.retrait-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
}

.retrait-input.error {
  border-color: var(--error);
}

.retrait-note {
  font-size: 0.85rem;
  color: var(--coffee);
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}



.retrait-balance-info {
  background-color: var(--cream);
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid var(--accent);
}

.retrait-balance-label {
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.retrait-balance-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--success);
}

.retrait-submit-btn {
  background: linear-gradient(135deg, var(--secondary), var(--primary));
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.retrait-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(59, 47, 47, 0.2);
}

.retrait-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.retrait-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.retrait-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  color: var(--coffee);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.retrait-back-link:hover {
  color: var(--primary);
}

.retrait-error {
  color: var(--error);
  font-size: 0.9rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.retrait-password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--coffee);
  cursor: pointer;
}

.retrait-password-container {
  position: relative;
}

@media (max-width: 600px) {
  .retrait-container {
    padding: 20px;
  }
  
  .retrait-amount-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.retrait-container {
  animation: fadeIn 0.5s ease-out;
}
</style>