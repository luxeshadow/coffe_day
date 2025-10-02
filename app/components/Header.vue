<template>
  <div class="app-header">
    <div class="header-left">
      <i style="font-size:32px;" class="fi fi-rr-coffee"></i>
      <div class="header-logo">
        <span>EcoBoost</span>
      </div>
    </div>

    <div class="header-right">
      <div class="header-icon">
        <i class="fi fi-rr-bell"></i>
      </div>

      <div class="header-icon user-menu" @click="toggleDropdown">
        <i class="fi fi-rr-user"></i>
        <div v-if="dropdownOpen" class="dropdown desktop">
          <ul>
            <li @click.stop="goProfile">Mon profil</li>
            <li class="logout" @click.stop="handleLogout">Déconnexion</li>
          </ul>
        </div>
        <div v-if="dropdownOpen" class="dropdown mobile">
          <div class="dropdown-header">
            <span>Menu utilisateur</span>
            <button @click.stop="toggleDropdown">✖</button>
          </div>
          <ul>
            <li @click.stop="goProfile">Mon profil</li>
            <li class="logout" @click.stop="handleLogout">Déconnexion</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/authService'
import '~/assets/css/header.css'

const dropdownOpen = ref(false)
const router = useRouter()

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleLogout = async () => {
  try {
    await AuthService.logout()
    dropdownOpen.value = false
    router.push('/') // redirection après logout
  } catch (err) {
    console.error('Erreur lors du logout :', err)
  }
}

// Exemple navigation vers profil
const goProfile = () => {
  dropdownOpen.value = false
  router.push('/profile')
}
</script>


<style scoped>
.user-menu {
  position: relative;
  cursor: pointer;
}

/* --- Menu Desktop --- */
.dropdown.desktop {
  position: absolute;
  font-size: 17px;
  top: 120%;
  right: 0;
  background: white;
  color: var(--text);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  min-width: 160px;
  z-index: 200;
}

.dropdown.desktop ul {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

.dropdown.desktop li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown.desktop li:hover {
  background: var(--cream);
}

/* --- Menu Mobile --- */
.dropdown.mobile {
  display: none;
}

@media (max-width: 768px) {
  .dropdown.desktop {
    display: none;
  }

  .dropdown.mobile {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40vh;  
    overflow-y: auto;   
    background: white;
    color: var(--text);
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -2px 12px rgba(0,0,0,0.25);
    z-index: 9999;
    padding-bottom: 20px; 
    animation: slideUp 0.3s ease;
  }
  .dropdown.mobile ul {
    list-style: none;
    margin: 0;
    padding: 10px 0;
  }
  .dropdown.mobile li {
    padding: 12px 17px;
    cursor: pointer;
    border-bottom: 1px solid #f1f1f1;
  }


  .dropdown.mobile .logout {
    color: #ff4d4d;
    font-weight: bold;
  }

  .dropdown.mobile .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px;
    border-bottom: 1px solid #eee;
    font-weight: bold;
  }
}


/* Animation menu mobile */
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.dropdown .logout {
  color: #c00;
  font-weight: bold;
}
</style>

