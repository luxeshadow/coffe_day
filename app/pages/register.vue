<template>
  <div class="register-wrapper">
    <div class="register-container">
      <h1>Sign up</h1>
      <p>Join our community and contribute to a greener future through smart recycling!</p>

      <form @submit.prevent="handleSubmit" id="signup-form">
       
        <!-- Username -->
        <div class="form-group">
          <label for="user-name">Username*</label>
          <input type="text" id="user-name" v-model="form.user_name" placeholder="johndoe123" required />
        </div>

        <!-- Phone -->
        <div class="form-group">
          <label for="phone">Enter your phone number*</label>
          <div class="phone-input">
            <select v-model="form.countryCode" class="country-select">
              <option v-for="country in countries" :key="country.code" :value="country.dial_code">
                {{ country.dial_code }} ({{ country.code }})
              </option>
            </select>
            <div class="phone-wrapper">
              <img :src="selectedCountry.flag" class="flag-inside-input" alt="Selected country flag" />
              <input type="tel" id="phone" v-model="form.phone" placeholder="e.g. 90123456" required />
            </div>
          </div>
        </div>

        <!-- Password -->
        <div class="form-group password-group">
          <label for="password">Enter your password*</label>
          <div class="password-wrapper">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" placeholder="Minimum 8 characters" required />
            <i :class="showPassword ? 'fi fi-rr-eye' : 'fi fi-rr-eye-crossed'" class="toggle-password" @click="showPassword = !showPassword"></i>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group password-group">
          <label for="confirm-password">Confirm your password*</label>
          <div class="password-wrapper">
            <input :type="showConfirmPassword ? 'text' : 'password'" id="confirm-password" v-model="form.confirmPassword" placeholder="Re-enter your password" required />
            <i :class="showConfirmPassword ? 'fi fi-rr-eye' : 'fi fi-rr-eye-crossed'" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword"></i>
          </div>
        </div>

        <!-- Invitation Code -->
        <div class="form-group">
          <label for="invitation-code">Invitation code</label>
          <input type="text" id="invitation-code" v-model="form.invitationCode" readonly placeholder="Auto-generated" />
        </div>

        <button type="submit" :disabled="loading">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          Sign up
        </button>
      </form>

      <p class="register-link">
        If you already have an account, <NuxtLink to="/">log in</NuxtLink>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCreateUser } from '../composables/useRegisterUser'

const route = useRoute()
const { createUser, loading } = useCreateUser()

const form = ref({
  user_name: '',
  phone: '',
  countryCode: '+228',
  password: '',
  confirmPassword: '',
  invitationCode: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const countries = [
  { code: 'CA', dial_code: '+237', flag: '/img/pays/cameroun.png' },
    { code: 'TG', dial_code: '+228', flag: '/img/pays/togo.png' },
  { code: 'BF', dial_code: '+226', flag: '/img/pays/burkina.png' },
  { code: 'BN', dial_code: '+229', flag: '/img/pays/benin.png' },
  { code: 'SN', dial_code: '+221', flag: '/img/pays/senegal.png' }
  
]

const selectedCountry = computed(() => countries.find(c => c.dial_code === form.value.countryCode) || countries[0])

// Récupère le code de parrainage s'il est présent dans l'URL
onMounted(() => {
  const referralCode = route.query.ref
  if (referralCode) {
    form.value.invitationCode = referralCode.toString()
  }
})

const handleSubmit = async () => {
  const payload = {
    user_name: form.value.user_name,
    phone: form.value.phone,
    countryCode: form.value.countryCode,
    password: form.value.password,
    confirmPassword: form.value.confirmPassword,
    parent_invitecode: form.value.invitationCode || null
  }

  try {
    await createUser(payload)
  } catch (err) {
    console.error('Erreur lors de la création:', err)
  }
}
</script>


<style scoped>
.register-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fdf7ee;
  padding: 10px;
}

.register-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 25px;
  background: #fff9f0;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #3b2f2f;
  margin-bottom: 8px;
  text-align: center;
}

p {
  color: #333;
  font-size: 0.95rem;
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  color: #6b4e31;
  margin-bottom: 8px;
}

/* Inputs normaux */
input[type="text"],
input[type="password"],
input[type="tel"],
input[readonly] {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #6b4e31;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
}
select {
  width: 100%;
  height:43px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #6b4e31;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
}


input:focus,
select:focus {
  border-color: #d4af37;
  box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
}

/* Téléphone */
.phone-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.country-select {
  width: 100px;
  background: #fffdfd;
  border-radius: 8px;
  border: 1px solid #6b4e31;
  padding: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.phone-wrapper {
  position: relative;
  flex: 1;
}

.flag-inside-input {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 16px;
  border-radius: 2px;
  pointer-events: none;
}

.phone-wrapper input {
  padding-left: 40px;
}

.error-message {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 5px;
}

/* Password toggle */
.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  width: 100%;
  padding-right: 35px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6b4e31;
  font-size: 1rem;
}

/* Button */
button {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  background: linear-gradient(135deg, #d4af37, #e6c75d);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.5);
  background: linear-gradient(135deg, #e6c75d, #d4af37);
}

.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
}

.register-link a {
  color: #d4af37;
  font-weight: 600;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
