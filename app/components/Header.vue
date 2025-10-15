<template>
  <div class="app-header">
    <div class="header-left">
      <i style="font-size:32px;" class="fi fi-rr-coffee"></i>
      <div class="header-logo">
        <span>EcoNest</span>
      </div>
    </div>

    <div class="header-right">
      <!-- Notification bell -->
      <div class="header-icon notif" @click="toggleNotifModal">
        <i class="fi fi-rr-bell"></i>
        <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount }}</span>
      </div>

      <!-- User menu -->
      <div class="header-icon user-menu" @click="toggleDropdown">
        <i class="fi fi-rr-user"></i>

        <!-- Desktop dropdown -->
        <div v-if="dropdownOpen" class="dropdown desktop">
          <ul>
            <li @click.stop="goProfile">Mon profil</li>
            <li class="logout" @click.stop="handleLogout">Déconnexion</li>
          </ul>
        </div>

        <!-- Mobile dropdown -->
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

    <div v-if="notifModalOpen" class="notif-modal">
      <div class="notif-modal-content">
        <div class="notif-modal-header">
          <h3>Notifications</h3>
          <button @click="toggleNotifModal">✖</button>
        </div>
        <ul>
          <li v-for="notif in notifications" :key="notif.id">
            <strong>{{ notif.type }}:</strong> {{ notif.texte }}
          </li>
          <li v-if="notifications.length === 0">Aucune notification</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/authService'
import { useListNotification } from '../composables/useListNotification'
import '~/assets/css/header.css'

const dropdownOpen = ref(false)
const notifModalOpen = ref(false)
const router = useRouter()

// Notifications
const { notifications, loadNotifications } = useListNotification()

// Charger les notifications au montage
onMounted(() => {
  loadNotifications()
})

// Badge: nombre de notifications "Info"
const unreadCount = computed(() => {
  const list = notifications.value ?? []
  return list.filter(n => n.type?.toLowerCase() === 'info').length
})

// Toggle user dropdown
const toggleDropdown = () => { dropdownOpen.value = !dropdownOpen.value }

// Toggle notification modal
const toggleNotifModal = () => { notifModalOpen.value = !notifModalOpen.value }

// Logout
const handleLogout = async () => {
  try {
    await AuthService.logout()
    dropdownOpen.value = false
    router.push('/')
  } catch (err) {
    console.error('Erreur lors du logout :', err)
  }
}

// Navigation vers le profil
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

/* --- Desktop Dropdown --- */
.dropdown.desktop {
  position: absolute;
  font-size: 17px;
  top: 120%;
  right: 0;
  background: white;
  color: var(--text);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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

/* --- Mobile Dropdown --- */
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
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.25);
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

/* --- Notifications --- */
.notif-badge {
  position: absolute;
  top: 20px;
  right: 48px;
  min-width: 14px;
  height: 14px;
  background: red;
  color: white;
  font-size: 10px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.notif-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.notif-modal-content {
  background: white;
  width: 90%;
  max-width: 400px;
  color: #8a6d6d;
  border-radius: 12px;
  overflow: hidden;
}

.notif-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.notif-modal-content ul {
  list-style: none;
  margin: 0;
  padding: 8px 16px;
  max-height: 300px;
  overflow-y: auto;
}

.notif-modal-content li {
  padding: 8px 0;
  border-bottom: 1px solid #f1f1f1;
}
</style>
