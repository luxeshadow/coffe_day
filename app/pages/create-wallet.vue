<template>
  <div class="wallet-page">
    <div class="wallet-container">
      <div class="wallet-header">
        <h2 class="wallet-title">
          <i class="fas fa-wallet"></i> Mon Portefeuille
        </h2>
        <p class="wallet-subtitle">Configurez vos informations de retrait</p>
      </div>
      
      <form class="wallet-form" @submit.prevent="validerPortefeuille">
        <div class="wallet-form-group">
          <label for="nom" class="wallet-label">
            <i class="fas fa-user"></i> Nom complet
          </label>
          <input type="text" id="nom" v-model="formData.nom" class="wallet-input" required placeholder="Votre nom complet">
          <div v-if="errors.nom" class="wallet-error">
            <i class="fas fa-exclamation-circle"></i> {{ errors.nom }}
          </div>
        </div>
        
        <div class="wallet-form-group">
          <label class="wallet-label">
            <i class="fas fa-credit-card"></i> Moyen de paiement
          </label>
          
          <div class="wallet-payment-options">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              :class="['wallet-payment-option', { active: formData.moyen === method.id }]"
              @click="selectPaymentMethod(method.id)"
            >
              <img :src="method.image" :alt="method.name" class="wallet-img" />
              <div class="wallet-payment-name">{{ method.name }}</div>
            </div>
          </div>
          
          <select id="moyen" v-model="formData.moyen" class="wallet-select" required style="display: none;">
            <option value="">Sélectionnez</option>
            <option value="flooz">Moov Money</option>
            <option value="tmoney">MTN Money</option>
          </select>
        </div>
        
        <div class="wallet-form-group">
          <label for="numero" class="wallet-label">
            <i class="fas fa-phone"></i> Numéro de retrait
          </label>
          <input type="tel" id="numero" v-model="formData.numero" class="wallet-input" required pattern="[0-9]{8,15}" placeholder="Ex: 98765432">
          <div v-if="errors.numero" class="wallet-error">
            <i class="fas fa-exclamation-circle"></i> {{ errors.numero }}
          </div>
        </div>
        
        <div class="wallet-form-group">
          <label for="mdp_retrait" class="wallet-label">
            <i class="fas fa-lock"></i> Mot de passe de retrait
          </label>
         
            <input :type="showPassword ? 'text' : 'password'" id="mdp_retrait" v-model="formData.mdp_retrait" class="wallet-input" required placeholder="Mot de passe de retrait">
        
          <div v-if="errors.mdp_retrait" class="wallet-error">
            <i class="fas fa-exclamation-circle"></i> {{ errors.mdp_retrait }}
          </div>
        </div>
        
        <button type="submit" class="wallet-submit-btn" :disabled="loading">
          <i class="fas fa-save"></i> 
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </form>
      
      <NuxtLink to="/profile" class="wallet-back-link">
        <i class="fas fa-arrow-left"></i> Retour au profil
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      showPassword: false,
      formData: {
        nom: '',
        moyen: '',
        numero: '',
        mdp_retrait: ''
      },
      errors: {
        nom: '',
        moyen: '',
        numero: '',
        mdp_retrait: ''
      },
      paymentMethods: [
        { 
          id: 'flooz', 
          name: 'Moov Money', 
          image: '/img/reseaux/moov.jpg'
        },
        { 
          id: 'tmoney', 
          name: 'MTN Money', 
          image: '/img/reseaux/mix.jpg'
        }
      ]
    }
  },
  methods: {
    selectPaymentMethod(method) {
      this.formData.moyen = method;
      this.errors.moyen = '';
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async validerPortefeuille() {
      this.errors = { nom: '', moyen: '', numero: '', mdp_retrait: '' };
      let isValid = true;
      
      if (this.formData.nom.length < 3) {
        this.errors.nom = 'Veuillez entrer votre nom complet';
        isValid = false;
      }
      
      if (!this.formData.moyen) {
        this.errors.moyen = 'Veuillez sélectionner un moyen de paiement';
        isValid = false;
      }
      
      if (this.formData.numero.length < 8) {
        this.errors.numero = 'Veuillez entrer un numéro valide';
        isValid = false;
      }
      
      if (this.formData.mdp_retrait.length < 6) {
        this.errors.mdp_retrait = 'Le mot de passe doit contenir au moins 6 caractères';
        isValid = false;
      }
      
      if (!isValid) return;
      
      this.loading = true;
      
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.$toast.success('Vos informations de portefeuille ont été enregistrées avec succès!');
        setTimeout(() => {
          this.$router.push('/profil');
        }, 1500);
      } catch (error) {
        this.$toast.error('Une erreur est survenue lors de l\'enregistrement');
        console.error('Erreur portefeuille:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

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
