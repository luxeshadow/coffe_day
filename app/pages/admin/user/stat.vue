<template>
  <section class="stat-dashboard p-4 md:p-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Statistiques générales</h2>

    <!-- Totaux -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
      <div class="card p-4 shadow rounded bg-white text-center">
        <h3 class="font-semibold mb-2">Total Recharges</h3>
        <p class="text-xl font-bold text-green-600">{{ totalRecharge.toLocaleString() }} F</p>
      </div>
      <div class="card p-4 shadow rounded bg-white text-center">
        <h3 class="font-semibold mb-2">Total Retraits Success</h3>
        <p class="text-xl font-bold text-red-600">{{ totalWithdraw.toLocaleString() }} F</p>
      </div>
    </div>

    <!-- Recharges vs Retraits globaux -->
    <div class="mb-6 p-4 bg-white shadow rounded">
      <h3 class="font-semibold mb-4 text-center">Recharges vs Retraits globaux</h3>
      <canvas ref="globalChartRef"></canvas>
    </div>

    <!-- Utilisateurs par grade -->
    <div class="mb-6 p-4 bg-white shadow rounded">
      <h3 class="font-semibold mb-4 text-center">Nombre d'utilisateurs par grade</h3>
      <canvas ref="gradeChartRef"></canvas>
    </div>

    <!-- Users avec / sans grade -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      <div class="card p-4 shadow rounded bg-white text-center">
        <h3 class="font-semibold mb-2">Utilisateurs avec grade</h3>
        <p class="text-xl font-bold">{{ usersWithGrade.length }}</p>
      </div>
      <div class="card p-4 shadow rounded bg-white text-center">
        <h3 class="font-semibold mb-2">Utilisateurs sans grade</h3>
        <p class="text-xl font-bold">{{ usersWithoutGrade }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStatStore } from '../../../stores/statStore'

const statStore = useStatStore()

const totalRecharge = ref(0)
const totalWithdraw = ref(0)
const usersWithGrade = ref<string[]>([])
const usersWithoutGrade = ref(0)
const usersByGrade = ref<any[]>([])

const globalChartRef = ref<HTMLCanvasElement | null>(null)
const gradeChartRef = ref<HTMLCanvasElement | null>(null)

onMounted(async () => {
  if (!statStore.totalRecharge && !statStore.totalWithdraw) {
    await statStore.loadStats()
  }

  totalRecharge.value = statStore.totalRecharge
  totalWithdraw.value = statStore.totalWithdraw
  usersWithGrade.value = statStore.usersWithGrade
  usersWithoutGrade.value = statStore.usersWithoutGrade
  usersByGrade.value = statStore.usersByGrade

  if (window.Chart) {
    renderGlobalChart()
    renderGradeChart()
  }
})

function renderGlobalChart() {
  if (!globalChartRef.value) return

  new window.Chart(globalChartRef.value, {
    type: 'bar',
    data: {
      labels: ['Total'],
      datasets: [
        { label: 'Recharges', data: [totalRecharge.value], backgroundColor: '#16a34a' },
        { label: 'Retraits Success', data: [totalWithdraw.value], backgroundColor: '#dc2626' }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  })
}

function renderGradeChart() {
  if (!gradeChartRef.value) return

  new window.Chart(gradeChartRef.value, {
    type: 'pie',
    data: {
      labels: usersByGrade.value.map(u => u.grade_name),
      datasets: [{
        label: 'Users par grade',
        data: usersByGrade.value.map(u => u.total),
        backgroundColor: ['#3b82f6','#f59e0b','#10b981','#ef4444','#8b5cf6','#f472b6']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  })
}

definePageMeta({ layout: 'dashboard' })
</script>

<style scoped>
.stat-dashboard h2 {
  color: #111827;
  text-align: center;
}

.card {
  border: 1px solid #e5e7eb;
}

canvas {
  max-width: 100%;
  height: 300px;
}

@media (max-width: 640px) {
  .stat-dashboard h2 { font-size: 1.5rem; }
  canvas { height: 250px; }
}
</style>
