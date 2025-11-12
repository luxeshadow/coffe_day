<template>
  <div class="withdrawls-page">
    <div class="page-header">
      <h2>Gestion des retraits</h2>
      <div class="filters">
        <input v-model="searchPhone" placeholder="Rechercher par numéro de téléphone" class="search-input">
        <select v-model="filterStatus">
          <option value="">Tous</option>
          <option value="En cours...">En cours</option>
          <option value="Payé">Payé</option>
          <option value="Annulé">Annulé</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <table class="withdrawls-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Utilisateur</th>
            <th>Montant</th>
            <th>Status</th>
            <th>Méthode</th>
            <th>Téléphone</th>
            <th>Créé le</th>
            <th>Fake</th>
            <th>Retraits payés</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="w in withdrawls" :key="w.id">
            <td>{{ w.id }}</td>
            <td>{{ w.user_name }} ({{ w.phone }})</td>
            <td>{{ w.amount }}</td>
            <td>{{ w.status }}</td>
            <td>{{ w.wallet?.methode_withdrawls || '-' }}</td>
            <td>{{ w.wallet?.telephone_withdrawls || '-' }}</td>
            <td>{{ new Date(w.created_at).toLocaleString() }}</td>
            <td>
              <span v-if="w.fake">Oui</span>
              <span v-else>Non</span>
            </td>
            <td>
              <ul v-if="w.paidWithdrawals?.length">
                <li v-for="pw in w.paidWithdrawals" :key="pw.id">
                  {{ pw.amount }} FCFA - {{ new Date(pw.created_at).toLocaleDateString() }}
                </li>
              </ul>
              <span v-else>-</span>
            </td>
            <td>
              <button v-if="w.status === 'En cours...'" @click="confirmPayWithdrawl(w)" class="pay-button">
                Payer
              </button>
              <button v-if="w.status === 'En cours...'" @click="confirmCancelWithdrawl(w)" class="cancel-button">
                Annuler
              </button>
            </td>
          </tr>
          <tr v-if="withdrawls.length === 0">
            <td colspan="10" class="empty-state">Aucun retrait trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">Précédent</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">Suivant</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useNuxtApp } from '#app'

definePageMeta({ layout: 'dashboard' })

interface WithdrawlWithUser {
  id: number
  id_user: string
  amount: number
  status: string
  created_at: string
  user_name: string
  phone: string
  fake: boolean
  wallet: any
  paidWithdrawals?: { id: number, amount: number, created_at: string }[]
}

const withdrawls = ref<WithdrawlWithUser[]>([])
const filterStatus = ref('')
const searchPhone = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(5)
const { $supabase } = useNuxtApp()

// ------------------- Récupérer tous les retraits payés d'un utilisateur
const getPaidWithdrawals = async (userIds: string[]) => {
  if (!userIds.length) return {}

  const { data: withdrawsData = [], error } = await $supabase
    .from('withdrawls')
    .select('id, id_user, amount, created_at, status')
    .in('id_user', userIds)
    .eq('status', 'Payé')

  if (error) throw error

  // Regrouper par utilisateur
  const withdrawalsMap = userIds.reduce<Record<string, { id: number, amount: number, created_at: string }[]>>((acc, id) => {
    acc[id] = withdrawsData.filter(w => w.id_user === id)
    return acc
  }, {})

  return withdrawalsMap
}


const fetchWithdrawls = async () => {
  const from = (currentPage.value - 1) * pageSize.value

  const { data, error } = await $supabase.rpc('get_withdrawls_with_user', {
    p_status: filterStatus.value || null,
    p_phone: searchPhone.value || null,
    p_limit: pageSize.value,
    p_offset: from
  })

  if (error) {
    console.error('Erreur fetch:', error)
    return
  }

  withdrawls.value = (data || []).map((w: any) => ({
    ...w,
    id_user: w.wallet?.id_user ?? null
  }))

  const userIds = withdrawls.value.map(w => w.id_user).filter(Boolean)
  const paidWithdrawals = await getPaidWithdrawals(userIds)

  // Ajouter les retraits payés à chaque utilisateur
  withdrawls.value = withdrawls.value.map(w => ({
    ...w,
    paidWithdrawals: paidWithdrawals[w.id_user] || []
  }))
}

// ------------------- Actions de paiement / annulation
const confirmPayWithdrawl = async (w: WithdrawlWithUser) => {
  await $supabase.from('withdrawls').update({ status: 'Payé' }).eq('id', w.id)
  fetchWithdrawls()
}

const confirmCancelWithdrawl = async (w: WithdrawlWithUser) => {
  await $supabase.from('withdrawls').update({ status: 'Annulé' }).eq('id', w.id)

  if (w.id_user) {
    await $supabase.from('recharges').insert([{
      id_user: w.id_user,
      amount: w.amount,
      phone: w.phone,
      methode: 'Remboursement',
      reference: `cancel_${w.id}`
    }])
  }

  fetchWithdrawls()
}

// Auto refresh
watch([currentPage, filterStatus, searchPhone], () => fetchWithdrawls())
onMounted(() => fetchWithdrawls())
</script>


<style scoped>
.table-container {
  overflow-x: auto;
}

.withdrawls-table {
  width: 100%;
  border-collapse: collapse;
}

.withdrawls-table th,
.withdrawls-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.withdrawls-table th {
  background-color: #f5f5f5;
}

.withdrawls-table tr:hover {
  background-color: #f0f0f0;
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.search-input {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pay-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  margin-right: 5px;
}

.cancel-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #e53935;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #999;
}

.pagination {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-around;
}

.confirm-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #e53935;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
