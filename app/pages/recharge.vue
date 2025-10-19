<template>
  <div class="recharge-page">
    <div class="recharge-container">
      <div class="recharge-header">
        <h2 class="recharge-title">Formulaire de Recharge</h2>
        <p class="recharge-subtitle">
          Rechargez votre compte en quelques étapes simples
        </p>
      </div>

      <form class="recharge-form" @submit.prevent="validerRecharge">
        <!-- Téléphone -->
        <div class="recharge-form-group">
          <label for="telephone" class="recharge-label">
            <i class="fi fi-rr-mobile-notch"></i> Numéro de téléphone
          </label>
          <input type="tel" id="telephone" v-model="formData.phone" class="recharge-input" required
            pattern="[0-9]{8,15}" placeholder="Ex: 98765432" />
        </div>

        <!-- Montant -->
        <div class="recharge-form-group">
          <label for="montant" class="recharge-label">
            <i class="fi fi-rr-send-money"></i> Montant à recharger
          </label>
          <input type="number" id="montant" v-model="formData.amount" class="recharge-input" required
            placeholder="Entré montant à recharger" />

          <!-- <div class="recharge-note">
            <i class="fas fa-info-circle"></i> Montant minimum : 1 000 XOF
          </div> -->
        </div>

        <!-- Méthodes de paiement -->
        <div class="recharge-payment-methods">
          <h3 class="recharge-payment-title">
            <i class="fas fa-wallet"></i> Méthode de paiement
          </h3>
          <div class="recharge-payment-options">
            <div class="recharge-payment-option" :class="{ active: formData.paymentMethod === 'tmoney' }"
              @click="selectPaymentMethod('tmoney')">
              <i class="fas fa-mobile-alt"></i>
              <span>TMoney</span>
            </div>
            <div class="recharge-payment-option" :class="{ active: formData.paymentMethod === 'flooz' }"
              @click="selectPaymentMethod('flooz')">
              <i class="fas fa-sim-card"></i>
              <span>Flooz</span>
            </div>
          </div>
        </div>

        <!-- Bouton valider -->
      <button type="submit" class="recharge-submit-btn" :disabled="loading">
  <i class="fas fa-check-circle"></i>
  {{ loading ? `Traitement en cours... (${countdown}s)` : "Valider la recharge" }}
</button>



      </form>

      <NuxtLink to="/profile" class="recharge-back-link">
        <i class="fas fa-arrow-left"></i>Retour au profil
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { useRecharge } from "../composables/useCreateRecharge"

// ✅ On récupère tout depuis le composable
const { loading, countdown, createRecharge } = useRecharge()

// ✅ Données du formulaire
const formData = reactive({
  phone: "",
  amount: 1000,
  paymentMethod: "tmoney",
})

// ✅ Sélection méthode de paiement
function selectPaymentMethod(method: string) {
  formData.paymentMethod = method
}

// ✅ Soumission du formulaire
async function validerRecharge() {
  try {
    await createRecharge({
      phone: formData.phone,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
    })
  } catch (err: any) {
    console.error("Erreur recharge:", err)
  }
}
</script>



<style scoped>
.recharge-page {
  background-color: #f8f5f0;
  ;
  color: #333333;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.recharge-container {
  background-color: #ffffff;
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(59, 47, 47, 0.1);
  position: relative;
  animation: fadeIn 0.5s ease-out;
}

.recharge-header {
  text-align: center;
  margin-bottom: 30px;
}

.recharge-title {
  color: #3b2f2f;
  font-size: 1.8rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.recharge-subtitle {
  color: #8a6d6d;
  font-size: 1rem;
}

.recharge-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recharge-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recharge-label {
  font-weight: 600;
  color: #3b2f2f;
  display: flex;
  align-items: center;
  gap: 8px;
}

.recharge-input {
  padding: 15px;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fff9f0;
}

.recharge-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
}

.recharge-note {
  font-size: 0.85rem;
  color: #8a6d6d;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.recharge-submit-btn {
  background: linear-gradient(135deg, #6b4e31, #3b2f2f);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.recharge-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(59, 47, 47, 0.2);
}

.recharge-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.recharge-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.recharge-back-link:hover {
  color: #3b2f2f;
}

.recharge-payment-methods {
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.recharge-payment-title {
  font-size: 1rem;
  color: #3b2f2f;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.recharge-payment-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
}

.recharge-payment-option {
  padding: 12px;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.recharge-payment-option:hover {
  border-color: #d4af37;
}

.recharge-payment-option.active {
  border-color: #d4af37;
  background-color: rgba(212, 175, 55, 0.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
