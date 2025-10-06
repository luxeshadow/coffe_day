<template>
  <!-- Section d'information -->
  <div class="info-sections">
    <div class="info-icon">i</div>
    <div class="info-text">
      Investissez dans les initiatives écologiques NESCAFÉ et générez des revenus tout en soutenant le recyclage des gobelets.
    </div>
  </div>

  <!-- Grille des grades -->
  <div class="investment-grid">
    <div
      v-for="grade in gradeStore.grades"
      :key="grade.id"
      class="invest-card"
    >
      <div class="card-image">
        <img :src="grade.img ?? '/img/coffee/boite2.png'" :alt="grade.grade_name" />
      </div>
      <div class="card-content">
        <div class="invest-title">Boite {{ grade.grade_name }}</div>
        <div class="invest-details">
          <div class="invest-amount">
            <span class="invest-label">Investissement:</span>
            <span class="invest-value">{{ grade.amounts?.toLocaleString() }} XOF</span>
          </div>
          <div class="invest-revenue">
            <span class="invest-label">Revenus quotidiens:</span>
            <span class="revenue-value">{{ grade.daily_income?.toLocaleString() }} XOF</span>
          </div>
        </div>

        <!-- Bouton dynamique -->
        <NuxtLink
          v-if="!gradeStore.isGradeActivated(grade.id)"
          to="#"
          class="debut-button"
          @click.prevent="confirmActivateGrade(grade)"
        >
          <i v-if="loadingGradesMap.has(grade.id)" class="fas fa-spinner fa-spin mr-2"></i>
          <i style="margin-top:4px" v-else class="fi fi-rr-play-circle"></i>
          Activé
        </NuxtLink>

        <div v-else class="activated-badge">
          <i style="margin-top:2px" class="fi fi-rr-badget-check-alt"></i>
          Actif...
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de confirmation -->
  <div v-if="modalGrade" class="modal-overlay">
    <div class="modal-content">
      <h3>Confirmer l'activation</h3>
      <p>Voulez-vous vraiment activer la boite <strong>{{ modalGrade.grade_name }}</strong> ?</p>
      <div class="modal-actions">
        <button class="btn-cancel" @click="modalGrade = null">Non</button>
        <button class="btn-confirm" @click="activateGrade(modalGrade)">Oui</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGradeStore } from '../stores/gradeStore'
import { useAssigneGrade } from '../composables/useAssigneGrade'

const gradeStore = useGradeStore()
const { assignGrade } = useAssigneGrade()
const loadingGradesMap = ref<Set<number>>(new Set())
const modalGrade = ref(null)

const confirmActivateGrade = (grade) => {
  modalGrade.value = grade
}

const activateGrade = async (grade) => {
  modalGrade.value = null
  if (loadingGradesMap.value.has(grade.id)) return
  loadingGradesMap.value.add(grade.id)

  try {
    await assignGrade(grade)
    // Met à jour uniquement le store de l'utilisateur pour activer le grade
    gradeStore.userGrades.push(grade)
  } finally {
    loadingGradesMap.value.delete(grade.id)
  }
}
</script>


<style scoped>
:root {
  --primary: #3b2f2f;
  --secondary: #6b4e31;
  --accent: #d4af37;
  --success: #4caf50;
  --light: #f8f5f0;
  --dark: #2c2c2c;
  --text: #333333;
  --cream: #fff9f0;
  --card-bg: #ffffff;
}
.activated-badge {
  background: linear-gradient(135deg, var(--accent), #e6c75d);
  color: #fff;
  padding: 6px 10px;
  border-radius: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
  width: 100%;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
  animation: fadeInScale 0.4s ease;
}
.activated-badge i {
  font-size: 1.2rem;
  color: #4caf50;
}

/* Animation */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

    /* Section d'information */
.info-sections {
    display: flex;
    align-items: flex-start;
    background-color: var(--cream);
    padding: 16px;
    border-radius: var(--border-radius);
    margin: 20px 15px;
    border-left: 4px solid var(--accent);
}

.info-icon {
    background-color: var(--accent);
    color: var(--primary);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 12px;
    flex-shrink: 0;
}

.info-text {
    font-size: 0.9rem;
    color: var(--text);
    line-height: 1.5;
}
/* Grille */
.investment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 15px;
    padding-bottom: var(--nav-height, 80px); /* espace pour que le scroll n’empiète pas sur la nav */
}

/* Carte */
.invest-card {
  background: var(--cream);
  border-radius: 18px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(212,175,55,0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  margin:20px;
}

/* Image */
.card-image img {
  max-width: 120px;
  height: auto;
  border-radius: 12px;
  background: #fff;
  padding: 6px;
  transition: transform 0.3s ease;
}

.invest-card:hover .card-image img {
  transform: scale(1.05);
}

/* Contenu */
.card-content {
  text-align: center;
  margin-top: 14px;
}

.invest-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.invest-details {
  font-size: 0.95rem;
  color: var(--dark);
  margin-bottom: 14px;
  line-height: 1.4;
}

.invest-label {
  font-weight: 600;
  color: var(--secondary);
}

.invest-value, .revenue-value {
  color: var(--success);
  font-weight: bold;
  margin-left: 4px;
}

/* Bouton */
/* Bouton */
.debut-button {
  background: linear-gradient(135deg, var(--accent), #e6c75d);
  color: #fff;
  padding: 6px 10px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
  width: 100%; /* bouton étendu */
 
  transition: all 0.3s ease;
}

.debut-button:hover {
  background: linear-gradient(135deg, #e6c75d, var(--accent));
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(212, 175, 55, 0.5);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 20px 25px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.btn-cancel {
  background: #ccc;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn-confirm {
  background: #d4af37;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}



/* Responsive mobile */
@media (max-width: 768px) {
  .invest-card {
    flex-direction: row;
    align-items: center;
    padding: 15px;
    margin:5px;
  }
  .info-sections {
 margin:5px;
 margin-bottom:10px;
 margin-top:10px;
}

  .card-image {
    flex-shrink: 0;
    margin-right: 15px;
  }

  .card-content {
    text-align: left;
    margin-top: 0;
    flex: 1;
  }

  .invest-title {
    font-size: 1rem;
    margin-bottom: 5px;
  }

  .invest-details {
    font-size: 0.85rem;
  }
}
</style>

