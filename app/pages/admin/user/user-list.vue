<template>
  <section class="user-list">
    <!-- ✅ Header -->
    <div class="page-header">
      <h2>Liste des utilisateurs</h2>
      <input
        type="search"
        v-model="q"
        class="search-input"
        placeholder="Rechercher par nom ou téléphone..."
      />
    </div>

    <!-- ✅ Table responsive -->
    <div class="table-container">
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="error" class="error">Erreur: {{ error }}</div>

      <table v-else-if="filteredUsers.length" class="roles-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Grades</th>
            <th>Filleuls</th>
            <th>Wallet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.user_name || '—' }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <span
                v-for="g in user.grades"
                :key="g.id_grade"
                class="permission-badge"
              >
                {{ g.grade?.grade_name }} ({{ g.grade?.daily_income }}/j)
              </span>
            </td>
            <td> <ul>
                <li v-for="c in user.children" :key="c.id">{{ c.user_name }}</li>
              </ul></td>
            <td>
              <span class="status-badge active">
                {{ user.walletBalance.toFixed(2) }} F
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <i class="fas fa-user-slash"></i>
        <p>Aucun utilisateur trouvé...</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../../../stores/userStore'

definePageMeta({ layout: 'dashboard' })

const userStore = useUserStore()
const q = ref('')

const filteredUsers = computed(() => {
  if (!q.value) return userStore.users
  const term = q.value.toLowerCase()
  return userStore.users.filter(
    u =>
      (u.user_name?.toLowerCase().includes(term)) ||
      (u.phone.includes(q.value))
  )
})

onMounted(() => {
  if (!userStore.users.length) userStore.loadUsers()
})
</script>


<style scoped>
.user-list {
  max-width: 1150px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--light-accent);
}

.page-header h2 {
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--primary-dark);
}

.search-input {
  padding: 10px 12px;
  width: 260px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  transition: 0.3s;
}
.search-input:focus {
  outline: none;
  border-color: var(--accent);
}

/* ✅ TABLE RESPONSIVE */
.table-container {
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
}

.roles-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px; /* ✅ Important pour le responsive */
}

.roles-table th {
  background: var(--light-bg);
  padding: 12px;
  font-weight: 600;
  text-align: left;
  color: var(--primary-dark);
}

.roles-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.roles-table tr:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.table-container::-webkit-scrollbar {
  height: 6px;
}
.table-container::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

/* Badges */
.permission-badge {
  background-color: var(--light-bg);
  padding: 4px 8px;
  margin-right: 5px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-badge.active {
  background-color: #e8f5e8;
  color: #2e7d32;
  padding: 6px 10px;
  border-radius: 12px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #888;
}
.empty-state i {
  font-size: 2rem;
  opacity: 0.6;
}
</style>

