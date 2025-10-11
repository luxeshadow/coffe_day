<template>
  <div class="withdrawls-page">
    <div class="page-header">
      <h2>Gestion des retraits</h2>
      <div class="filters">
        <input 
          v-model="searchPhone" 
          placeholder="Rechercher par numéro de téléphone" 
          class="search-input"
        >
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
              <button 
                v-if="w.status === 'En cours...'" 
                @click="confirmPayWithdrawl(w)" 
                class="pay-button"
              >
                Payer
              </button>
              <button 
                v-if="w.status === 'En cours...'" 
                @click="confirmCancelWithdrawl(w)" 
                class="cancel-button"
              >
                Annuler
              </button>
            </td>
          </tr>
          <tr v-if="withdrawls.length === 0">
            <td colspan="7" class="empty-state">Aucun retrait trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">Précédent</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">Suivant</button>
    </div>

    <!-- Modal de confirmation -->
    <div v-if="showConfirmModal" class="modal-backdrop">
      <div class="modal-content">
        <h3>{{ modalTitle }}</h3>
        <p>{{ modalText }}</p>
        <div class="modal-actions">
          <button @click="confirmModal(true)" class="confirm-btn">Oui</button>
          <button @click="confirmModal(false)" class="cancel-btn">Non</button>
        </div>
      </div>
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
  wallet: any
}

const withdrawls = ref<WithdrawlWithUser[]>([])
const filterStatus = ref('')
const searchPhone = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(5)
const { $supabase } = useNuxtApp()

// Modal
const showConfirmModal = ref(false)
const modalTitle = ref('')
const modalText = ref('')
let modalCallback: ((confirmed: boolean) => void) | null = null

const openConfirmModal = (title: string, text: string) => {
  modalTitle.value = title
  modalText.value = text
  showConfirmModal.value = true
  return new Promise<boolean>((resolve) => {
    modalCallback = (confirmed: boolean) => {
      resolve(confirmed)
      showConfirmModal.value = false
    }
  })
}

const confirmModal = (confirmed: boolean) => {
  modalCallback?.(confirmed)
  modalCallback = null
}

// ------------------- FETCH WITHDRAWLS (RPC)
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

  // On map pour récupérer id_user depuis le wallet
  withdrawls.value = (data || []).map((w: any) => ({
    ...w,
    id_user: w.wallet?.id_user ?? null
  }))
}

// ------------------- ACTIONS
const confirmPayWithdrawl = async (w: WithdrawlWithUser) => {
  const ok = await openConfirmModal(`Confirmer paiement`, `Payer ${w.amount} ?`)
  if (!ok) return

  await $supabase.from('withdrawls').update({ status: 'Payé' }).eq('id', w.id)
  fetchWithdrawls()
}

const confirmCancelWithdrawl = async (w: WithdrawlWithUser) => {
  const ok = await openConfirmModal(`Annuler retrait`, `Annuler ${w.amount} ?`)
  if (!ok) return

  // ✅ On change juste le statut au lieu de supprimer
  await $supabase.from('withdrawls').update({ status: 'Annulé' }).eq('id', w.id)

  if (w.id_user) {
    await $supabase.from('recharges').insert([{
      id_user: w.id_user,
      amount: w.amount,
      phone: w.phone,
      methode: 'Remboursement',
      reference: `cancel_${w.id}`
    }])
  } else {
    console.warn(`Impossible de créer la recharge: id_user manquant pour le retrait ${w.id}`)
  }

  fetchWithdrawls()
}

// Auto refresh
watch([currentPage, filterStatus, searchPhone], () => fetchWithdrawls())
onMounted(() => fetchWithdrawls())
</script>





<style scoped>
.table-container { overflow-x: auto; }
.withdrawls-table { width: 100%; border-collapse: collapse; }
.withdrawls-table th, .withdrawls-table td { padding: 10px; border: 1px solid #ddd; }
.withdrawls-table th { background-color: #f5f5f5; }
.withdrawls-table tr:hover { background-color: #f0f0f0; }
.filters { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
.search-input { padding: 5px; border: 1px solid #ddd; border-radius: 4px; }
.pay-button { padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; background-color: #4CAF50; color: white; margin-right: 5px; }
.cancel-button { padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; background-color: #e53935; color: white; }
.empty-state { text-align: center; padding: 20px; color: #999; }
.pagination { margin-top: 20px; display: flex; gap: 10px; align-items: center; justify-content: center; }
.pagination button { padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px; background-color: #fff; cursor: pointer; }
.pagination button:disabled { background-color: #f5f5f5; cursor: not-allowed; }

/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
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
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
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
