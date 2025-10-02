<template>
    <Header/>
  <div class="history-container">
    <div class="history-header">
     
      <div class="filter-options">
        <button 
          class="filter-btn" 
          :class="{ active: activeFilter === 'all' }"
          @click="setFilter('all')"
        >
          Tous
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: activeFilter === '30d' }"
          @click="setFilter('30d')"
        >
          30j
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: activeFilter === '7d' }"
          @click="setFilter('7d')"
        >
          7j
        </button>
      </div>
    </div>

    <ul class="history-list" v-if="filteredOperations.length > 0">
      <li 
        class="history-item" 
        :class="op.type.toLowerCase()" 
        v-for="(op, index) in filteredOperations" 
        :key="index"
      >
        <div class="history-content">
          <span class="history-type" :class="op.type.toLowerCase()">{{ op.type }}</span>
          <span class="history-info">{{ op.info }}</span>
          <span class="history-date">{{ op.date }}</span>
        </div>
        <span class="history-amount" :class="op.amount > 0 ? 'positive' : 'negative'">
          {{ op.amount > 0 ? '+' : '' }}{{ formatAmount(op.amount) }} XOF
        </span>
      </li>
    </ul>

    <div v-else class="history-empty">
      <i class="fas fa-receipt"></i>
      <p>Aucune opération pour le moment.</p>
      <small>Vos transactions apparaîtront ici</small>
    </div>

    <NuxtLink to="/profile" class="history-back">
      <i class="fas fa-arrow-left"></i> Retour au profil
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeFilter = ref('all');

const operations = ref([
  {
    type: "Recharge",
    info: "Via Mobile Money",
    date: "25 août 2025, 10:15",
    amount: 10000
  },
  {
    type: "Investissement",
    info: "Acheté Boite collecte 2",
    date: "24 août 2025, 17:42",
    amount: -20000
  },
  {
    type: "Retrait",
    info: "Vers 228****4545",
    date: "23 août 2025, 09:30",
    amount: -5000
  },
  {
    type: "Gain",
    info: "Crédités (jour 1)",
    date: "23 août 2025, 23:59",
    amount: 600
  }
]);

const setFilter = (filter) => {
  activeFilter.value = filter;
  // Ici vous pourriez ajouter une logique de filtrage plus avancée
};

const filteredOperations = computed(() => {
  // Pour l'exemple, nous retournons toutes les opérations
  // Dans une vraie application, vous filtreriez selon activeFilter.value
  return operations.value;
});

const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(Math.abs(amount));
};
</script>

<style scoped>
.history-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 25px;
  margin: 20px auto;
  max-width: 700px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: -20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.history-title {
  font-family: 'Playfair Display', serif;
  color: #3A2E26;
  font-size: 1.8rem;
  margin: 0;
}

.filter-options {
  display: flex;
  gap: 8px;
}

.filter-btn {
  background: #F5F0E6;
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn.active {
  background: #D4AF37;
  color: white;
  font-weight: 600;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0 0 25px 0;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  margin-bottom: 10px;
  border-radius: 12px;
  background: #fafafa;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.history-item:hover {
  transform: translateY(-2px);
  background: #f5f5f5;
}

.history-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
}

.history-item.recharge::before {
  background: #2E8B57;
}

.history-item.investissement::before {
  background: #5BC0DE;
}

.history-item.retrait::before {
  background: #D9534F;
}

.history-item.gain::before {
  background: #D4AF37;
}

.history-content {
  flex: 1;
}

.history-type {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.history-type.recharge {
  background: rgba(46, 139, 87, 0.15);
  color: #2E8B57;
}

.history-type.investissement {
  background: rgba(91, 192, 222, 0.15);
  color: #5BC0DE;
}

.history-type.retrait {
  background: rgba(217, 83, 79, 0.15);
  color: #D9534F;
}

.history-type.gain {
  background: rgba(212, 175, 55, 0.15);
  color: #D4AF37;
}

.history-info {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 3px;
  color: #333333;
}

.history-date {
  font-size: 0.75rem;
  color: #888;
}

.history-amount {
  font-weight: 700;
  font-size: 0.95rem;
}

.history-amount.positive {
  color: #2E8B57;
}

.history-amount.negative {
  color: #D9534F;
}

.history-empty {
  text-align: center;
  padding: 40px 20px;
  color: #888;
}

.history-empty i {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #ddd;
}

.history-empty p {
  font-size: 1rem;
  margin-bottom: 10px;
}

.history-back {
  display: inline-flex;
  align-items: center;
  color: #3A2E26;
  text-decoration: none;
  font-weight: 600;
  margin-top: 10px;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.history-back:hover {
  color: #D4AF37;
}

/* Animation d'entrée */
.history-item {
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
}

.history-item:nth-child(1) { animation-delay: 0.05s; }
.history-item:nth-child(2) { animation-delay: 0.1s; }
.history-item:nth-child(3) { animation-delay: 0.15s; }
.history-item:nth-child(4) { animation-delay: 0.2s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .history-container {
    padding: 20px 15px;
  }
  
  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .filter-options {
    width: 100%;
    justify-content: center;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .history-amount {
    align-self: flex-end;
  }
}
</style>