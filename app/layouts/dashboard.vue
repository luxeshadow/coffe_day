<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside id="sidebar" :class="['sidebar', { 'sidebar-open': isSidebarOpen }]">

      <div class="sidebar-header flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img src="https://i.postimg.cc/MTZBmtyx/coffee-cup.png" alt="CEET" class="w-8 h-8 object-contain" />
          <span>EconNest</span>
        </div>
        <button class="close-sidebar" @click="closeSidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <nav class="nav-dasho">
        <ul class="space-y-1-dash">
          <li>
            <NuxtLink to="/admin/user/stat" class="flex items-center" @click="closeSidebarOnMobile" replace>
              <i class="fi fi-rr-chart-kanban"></i>
              Statistiques
            </NuxtLink>
          </li>

          <!-- Gestion Ressources -->

          <li>
            <NuxtLink to="/admin/user/user-list" class="flex items-center" @click="closeSidebarOnMobile" replace>
              <i class="fas fa-plus mr-3 text-sm"></i> Gestion des Utilisateurs
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/user/withdrawal" class="flex items-center" @click="closeSidebarOnMobile" replace>
              <i class="fas fa-plus mr-3 text-sm"></i> Gestion des Retraits
            </NuxtLink>
          </li>

         
        </ul>
      </nav>
    </aside>

    <!-- Overlay mobile -->
    <div v-if="isSidebarOpen" class="backdrop" @click="closeSidebar"></div>

    <!-- Main content -->
    <div class="main-content" :class="{ 'sidebar-open': isSidebarOpen }">

      <header>
        <div class="header-container">
          <div class="header-inner">
            <div class="flex items-center space-x-3">
              <button class="menu-toggle" @click="toggleSidebar">
                <i class="fi fi-rr-bars-sort"></i>
              </button>

            </div>
            <span class="mone">{{ pageTitle }}</span>
            <div class="header-actions">
              <div class="relative">
                <button class="notification-btn">
                  <i class="fi fi-rr-messages"></i>
                  <span class="notification-badge">3</span>
                </button>
              </div>
              <div class="user-menu">
                <button class="user-btn" @click="toggleDropdown('profile')">
                  <a href="#" class="user-deconnexion" @click="logout">
                    <i class="fas fa-sign-out-alt mr-2"></i>
                  </a>
                </button>



              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '~/services/authService' // adapte le chemin si besoin

const isSidebarOpen = ref(false)
const openDropdown = ref(null)
const pageTitle = 'Tableau de Bord'
const router = useRouter()

// Sidebar
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value)
const closeSidebar = () => (isSidebarOpen.value = false)
const closeSidebarOnMobile = () => { if (window.innerWidth < 768) closeSidebar() }

// ✅ Nouveau logout propre
const logout = async () => {
  try {
    // Déconnexion backend si API disponible
    await AuthService.logout?.().catch(() => { })

    // On vide le localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.clear()

    // Ferme le dropdown
    openDropdown.value = null

    // Redirection login
    router.push('/')
  } catch (e) {
    console.error('Erreur logout:', e)
  }
}

// Gestion clic extérieur
const handleClickOutside = (event) => {
  const sidebarDropdowns = ['submenu', 'dropdown-trigger', 'user-menu']
  const clickedInside = sidebarDropdowns.some(cls => event.target.closest(`.${cls}`))
  if (!clickedInside) openDropdown.value = null
}

// Backdrop
const backdropClasses = ref('')
watch(isSidebarOpen, (val) => {
  backdropClasses.value = val ? 'backdrop-visible' : ''
})

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>




<style>
h1,
h2,
h3,
h4,
h5,
h6 {

  font-weight: 700;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Sidebar styles */
aside {
  width: 100%;
  max-width: 16rem;
  background-color: white;
  border-right: 1px solid #f3f4f6;
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
  z-index: 100;
}

aside.sidebar-open {
  transform: translateX(0);
}


@media (max-width: 768px) {
  aside {
    transform: translateX(-100%);
  }

  aside.sidebar-open {
    transform: translateX(0);
    width: 80%;
    max-width: none;
  }

  body.sidebar-open::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;

  gap: 0.25rem;
}

.sidebar-header img {
  width: 2rem;
  height: 2rem;
  object-fit: contain;

}

.sidebar-header span {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;

}

.close-sidebar {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #374151;
  cursor: pointer;
}

@media (max-width: 768px) {
  .close-sidebar {
    display: block;
  }
}

.nav-dash-dash {
  padding: 1rem;


}

.nav-dasho ul {
  list-style: none;

}

.nav-dasho li {
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.nav-dasho a,
.nav-dasho button {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s, color 0.2s;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-dasho a:hover,
.nav-dasho button:hover {
  background-color: var(--ceet-gray);
  color: var(--ceet-blue);
}

.nav-dasho a.active {
  background-color: var(--ceet-gray);
  color: var(--ceet-blue);
  font-weight: 600;
}

.nav-dasho i {
  margin-right: 0.75rem;
  width: 1.25rem;
  text-align: center;
}

.submenu {
  max-height: 1px;
  overflow: hidden;
  padding-left: 1.5rem;
  margin-top: 0.25rem;
  transition: max-height 0.3s ease-in-out;
}

.submenu.active {
  max-height: 400px;
}

.submenu li {
  margin-bottom: 0.25rem;
}

.submenu a {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: #4b5563;
}

.submenu a:hover {
  background-color: #f3f4f6;
}

.submenu i {
  font-size: 0.75rem;
}

/* Main content styles */
.main-content {
  flex: 1;
  margin-left: 0;
  transition: margin-left 0.3s ease-in-out;
}

@media (min-width: 769px) {
  .main-content {
    margin-left: 16rem;
  }
}

/* Header styles */
header {
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid #f3f4f6;
}

.header-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #374151;
  cursor: pointer;


}

.menu-icon {
  width: 35px;
  height: 35px;
  object-fit: contain;
  margin-top: 12px;
  margin-left: -12px;
}

.user-btn i {
  font-size: 21px;

}



@media (max-width: 768px) {
  .menu-toggle {
    display: block;

  }
}

.notification-btn {
  position: relative;
  color: #6b7280;
  background: none;
  border: none;
  font-size: 1.25rem;
}

.notification-btn:hover {
  color: var(--ceet-blue);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #dc2626;
  color: white;
  font-size: 0.625rem;
  font-weight: bold;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.user-btn img {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
}

.user-btn span {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.user-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  width: 12rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s, transform 0.2s;
  transform: translateY(10px);
  z-index: 50;
}

.user-dropdown-active {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}



.user-dropdown a {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
}



.user-dropdown i {
  margin-right: 0.5rem;
  width: 1rem;
}

/* Main styles */
main {
  flex: 1;
  padding: 1.5rem;
}

.main-container {
  max-width: 80rem;
  margin: 0 auto;
}

.main-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 1.5rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

select,
input[type="date"] {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  flex: 1;
  min-width: 120px;
}

select:focus,
input[type="date"]:focus {
  outline: none;
  border-color: var(--ceet-blue);
  box-shadow: 0 0 0 2px rgba(13, 27, 42, 0.1);
}

.filter-btn {
  padding: 0.5rem 1rem;
  background-color: var(--ceet-blue);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.filter-btn:hover {
  background-color: var(--ceet-blue-dark);
}

/* Table styles */
.table-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f9fafb;
}

th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 1rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

tbody tr {
  border-top: 1px solid #e5e7eb;
}

tbody tr:hover {
  background-color: #f9fafb;
}

.status-select {
  padding: 0.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
  font-size: 0.875rem;
}

.status-unresolved {
  color: #dc2626;
}

.status-resolved {
  color: #16a34a;
}

.action-btn {
  color: var(--ceet-blue);
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 1rem;
}

.action-btn:hover {
  color: var(--ceet-blue-dark);
}

.action-btn.delete {
  color: #dc2626;
}

.action-btn.delete:hover {
  color: #b91c1c;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.page-btn:hover {
  background-color: var(--ceet-gray);
}

.page-btn.active {
  background-color: var(--ceet-blue);
  color: white;
  border-color: var(--ceet-blue);
}

/* Modal styles */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 32rem;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #374151;
  cursor: pointer;
}

.modal-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.response-list {
  margin-bottom: 1rem;
}

.response-item {
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.submit-response {
  padding: 0.5rem 1rem;
  background-color: var(--ceet-blue);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.submit-response:hover {
  background-color: var(--ceet-blue-dark);
}

.mone {
  display: none;
}

/* Responsive styles */
@media (max-width: 768px) {

  /* Supprimer les marges et paddings globaux */
  body,
  html {
    margin: 0;
    padding: 0;
  }

  /* Main content */
  .main-content {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  /* Containers internes */
  .main-container,
  .header-container {
    max-width: 100%;
    margin: 0;
    padding: 0 1rem;
    /* Optionnel : un petit padding si besoin */
  }

  /* Ajuster le padding du main */
  main {
    padding: 0.5rem;
    /* ou 0 si tu veux aucun espace */
  }

  /* Affichage spécifique */
  .mone {
    display: block;
  }

  .header-inner {
    gap: 0.5rem;
  }

  .filters {
    flex-direction: column;
  }

  .footer-inner {
    flex-direction: column;
    align-items: center;
  }

  .footer-copyright {
    text-align: center;
  }
}


@media (min-width: 769px) {
  aside {
    transform: translateX(0);
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

/* Utility classes */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.space-x-3>*+* {
  margin-left: 0.75rem;
}

.space-x-2>*+* {
  margin-left: 0.5rem;
}

.space-x-4>*+* {
  margin-left: 1rem;
}

.space-y-1-dash>*+* {
  margin-top: 0.25rem;
}

.submenu {
  padding-left: 1.5rem;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
}

.backdrop-visible {
  opacity: 1;
  pointer-events: auto;
}

.user-deconnexion {
  color: red;
}
</style>
