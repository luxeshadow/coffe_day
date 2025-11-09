<template>
  <section class="user-list">
    <div class="page-header">
      <h2>Liste des utilisateurs</h2>
      <input
        type="search"
        v-model="searchTerm"
        class="search-input"
        placeholder="Rechercher par nom ou téléphone..."
      />
    </div>

    <div class="table-container">
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <table v-else-if="users.length" class="roles-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Grades</th>
            <th>Filleuls</th>
            <th>Retraits Payés</th>
            <th>Solde Wallet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.user_name || '—' }}</td>
            <td>{{ u.phone }}</td>
            <td>
              <span v-for="g in u.grades" :key="g.id_grade">
                {{ g.grade?.grade_name }} ({{ g.grade?.daily_income }}/j)
              </span>
            </td>
            <td>
              <ul>
                <li v-for="c in u.children" :key="c.id">{{ c.user_name }}</li>
              </ul>
            </td>
            <td>
              <ul>
                <li
                  v-for="w in u.withdraws.filter(w => w.status === 'paid')"
                  :key="w.id"
                >
                  {{ new Date(w.date_creation).toLocaleDateString() }} :
                  <strong>{{ w.amount.toFixed(2) }} F</strong>
                </li>
              </ul>
              <span
                v-if="!u.withdraws.some(w => w.status === 'paid')"
                class="no-withdraw"
              >
                Aucun retrait payé
              </span>
            </td>
            <td>{{ u.walletBalance.toFixed(2) }} F</td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">Aucun utilisateur trouvé...</div>
    </div>

    <div class="pagination" v-if="totalPages > 1 && !searchTerm">
      <button :disabled="currentPage === 1" @click="prevPage">« Précédent</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">Suivant »</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import userApi from '~/api/userApi'

const users = ref([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const searchTerm = ref('')
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value))

const fetchUsers = async () => {
  loading.value = true
  error.value = null
  try {
    if (searchTerm.value.trim()) {
      users.value = await userApi().searchUsers(searchTerm.value.trim())
      totalUsers.value = users.value.length
    } else {
      const { users: data, total } = await userApi().getUsers(currentPage.value, pageSize.value)
      users.value = data
      totalUsers.value = total
    }
  } catch (err: any) {
    console.error(err)
    error.value = err.message || 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}

const prevPage = () => currentPage.value > 1 && currentPage.value--
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++

definePageMeta({ layout: 'dashboard' })
watch([currentPage, searchTerm], fetchUsers, { immediate: true })
onMounted(fetchUsers)
</script>

<style scoped>
.no-withdraw {
  color: #999;
  font-size: 0.85rem;
}
</style>


<style scoped>
.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.pagination button {
  padding: 6px 12px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  transition: 0.3s;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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

