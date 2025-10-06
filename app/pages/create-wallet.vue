<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateWallet } from '../composables/useCreateWallet'

const router = useRouter()
const { createWallet, loading } = useCreateWallet()

// Formulaire
const formData = reactive({
  methode_withdrawls: '',
  telephone_withdrawls: '',
  password: ''
})

// Erreurs par champ
const errors = reactive({
  methode_withdrawls: '',
  telephone_withdrawls: '',
  password: ''
})

// Gestion affichage mot de passe
const showPassword = ref(false)

// Moyens de paiement
const paymentMethods = [
  { id: 'flooz', name: 'Moov Money', image: '/img/reseaux/moov.jpg' },
  { id: 'tmoney', name: 'T Money', image: '/img/reseaux/mix.jpg' }
]

// Sélection d’un moyen de paiement
const selectPaymentMethod = (methodId: string) => {
  formData.methode_withdrawls = methodId
  errors.methode_withdrawls = ''
}

// Toggle affichage mot de passe
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Submit du formulaire
const validerPortefeuille = async () => {
  // Réinitialiser les erreurs

  try {
    await createWallet({
      methode_withdrawls: formData.methode_withdrawls,
      telephone_withdrawls: formData.telephone_withdrawls,
      password: formData.password
    })

    formData.methode_withdrawls = ''
    formData.telephone_withdrawls = ''
    formData.password = ''
    router.push('/profile')
  } catch (err: any) {
    console.error('Erreur portefeuille :', err)
  }
}
</script>

<template>
  <div class="wallet-page">
    <div class="wallet-container">
      <div class="wallet-header">
        <h2 class="wallet-title"><i class="fas fa-wallet"></i> Mon Portefeuille</h2>
        <p class="wallet-subtitle">Configurez vos informations de retrait</p>
      </div>

      <form class="wallet-form" @submit.prevent="validerPortefeuille">
        <!-- Moyen de paiement -->
        <div class="wallet-form-group">
          <label class="wallet-label"><i class="fas fa-credit-card"></i> Moyen de paiement</label>
          <div class="wallet-payment-options">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              :class="['wallet-payment-option', { active: formData.methode_withdrawls === method.id }]"
              @click="selectPaymentMethod(method.id)"
            >
              <img :src="method.image" :alt="method.name" class="wallet-img" />
              <div class="wallet-payment-name">{{ method.name }}</div>
            </div>
          </div>
         
        </div>

        <!-- Numéro de retrait -->
        <div class="wallet-form-group">
          <label for="numero" class="wallet-label"><i class="fas fa-phone"></i> Numéro de retrait</label>
          <input type="tel" id="numero" v-model="formData.telephone_withdrawls" class="wallet-input" placeholder="Ex: +22898765432">
        
        </div>

        <!-- Mot de passe de retrait -->
        <div class="wallet-form-group">
          <label for="mdp_retrait" class="wallet-label"><i class="fas fa-lock"></i> Mot de passe de retrait</label>
          <input :type="showPassword ? 'text' : 'password'" id="mdp_retrait" v-model="formData.password" class="wallet-input" placeholder="Mot de passe de retrait">
         
          <button type="button" @click="togglePasswordVisibility">
            {{ showPassword ? 'Masquer' : 'Afficher' }}
          </button>
        </div>

        <button type="submit" class="wallet-submit-btn" :disabled="loading">
          <i class="fas fa-save"></i> {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </form>
      
       <NuxtLink to="/profile" class="recharge-back-link">
         <i class="fas fa-arrow-left"></i>Retour au profil
      </NuxtLink>
    </div>
  </div>
</template>


<style scoped>
.wallet-page {
  background-color: var(--light);
  color: var(--text);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.wallet-container {
  background-color: var(--card-bg);
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  position: relative;
  animation: fadeIn 0.5s ease-out;
}

.wallet-header {
  text-align: center;
  margin-bottom: 30px;
}

.wallet-title {
  color: var(--primary);
  font-size: 1.8rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.wallet-subtitle {
  color: var(--coffee);
  font-size: 1rem;
}

.wallet-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wallet-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wallet-label {
  font-weight: 600;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.wallet-input {
  padding: 15px;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: var(--cream);
}

.wallet-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
}

.wallet-select {
  display: none;
}

.wallet-payment-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
}
.recharge-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  color: #8a6d6d;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}
.wallet-payment-option {
  padding: 15px;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 120px;
}

.wallet-payment-option:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
}

.wallet-payment-option.active {
  border-color: var(--accent);
  background-color: rgba(212, 175, 55, 0.1);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
}

.wallet-img {
  width: 80px;
  height: 50px;
  object-fit: contain;
  margin-bottom: 10px;
  border-radius: 5px;
}

.wallet-payment-name {
  font-weight: 600;
  color: var(--primary);
  margin-top: 5px;
}

.wallet-submit-btn {
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

.wallet-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.wallet-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  color: var(--coffee);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.wallet-back-link:hover {
  color: var(--primary);
}

.wallet-error {
  color: var(--error);
  font-size: 0.9rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .wallet-container {
    padding: 20px;
  }

  .wallet-payment-options {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: space-between;
  }

  .wallet-payment-option {
    flex: 1;
    min-width: 0;
  }

  .wallet-img {
    width: 70px;
    height: 45px;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
