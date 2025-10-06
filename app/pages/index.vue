<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h1>Log in</h1>
      <p>Access your account to continue supporting a greener future!</p>

      <form @submit.prevent="handleLogin" id="login-form">
        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            type="text"
            id="phone"
            v-model="form.phone"
            placeholder="Enter your phone number"
            required
            aria-required="true"
          />
        </div>

        <!-- Password -->
        <div class="form-group password-group">
          <label for="password">Password</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              placeholder="Enter your password"
              required
              aria-required="true"
            />
            <i
              :class="showPassword ? 'fi fi-rr-eye' : 'fi fi-rr-eye-crossed'"
              class="toggle-password"
              @click="showPassword = !showPassword"
            ></i>
          </div>
        </div>

        <button type="submit" :disabled="loading || loadingStores">
          <i v-if="loading || loadingStores" class="fas fa-spinner fa-spin mr-2"></i>
          {{ loading || loadingStores ? 'Logging in...' : 'Log in' }}
        </button>
      </form>

      <p class="login-link">
        Don't have an account? <NuxtLink to="/register">Sign up</NuxtLink>.
      </p>
    </div>

    <!-- Overlay de chargement des stores -->
    <div v-if="loadingStores" class="loading-overlay">
      <div class="spinner"></div>
      <p>Chargement de vos données...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLoginUser } from '../composables/useLoginUser'
import { useGainStore } from '../stores/gainStore'
import { useGradeStore } from '../stores/gradeStore'
import { useRouter } from 'vue-router'

const form = ref({
  phone: '',
  password: ''
})
const showPassword = ref(false)

const { loginUser, loading } = useLoginUser()
const gainStore = useGainStore()
const gradeStore = useGradeStore()
const router = useRouter()

const loadingStores = ref(false)

const handleLogin = async () => {

  try {
    const payload = {
      phone: form.value.phone,
      password: form.value.password
    }

    const user = await loginUser(payload)
    if (user) {
      console.log('✅ Utilisateur connecté :', user)

      // 🔥 Charger toutes les données liées aux gains et grades
      loadingStores.value = true
      try {
        await Promise.all([
          gainStore.fetchUserGains(),
          gradeStore.fetchGrades(),
          gradeStore.fetchUserGrades(),
          gradeStore.fetchUserDailyIncome()
        ])
      } catch (err) {
        console.error('Erreur lors du chargement des données utilisateur:', err)
      } finally {
        loadingStores.value = false
      }
      router.push('/home')
    }
  } catch (err) {
    console.error('Erreur login:', err)
  }
}
</script>

<style scoped>

.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fdf7ee;
  padding: 10px;
}

.login-container {
  width: 100%;
  max-width: 400px;
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

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #6b4e31;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
}

input:focus {
  border-color: #d4af37;
  box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
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

.login-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
}

.login-link a {
  color: #d4af37;
  font-weight: 600;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
