<template>
  <!-- Withdrawal Marquee -->
  <div class="withdrawal-container">
    <div class="withdrawal-title">
      <i class="fi fi-rr-arrow-trend-up"></i>
      Derniers retraits
    </div>
    <div class="marquee-wrapper">
      <div class="marquee-content">
        <div
          v-for="(item, index) in repeatedWithdrawals"
          :key="`${item}-${index}`"
          class="withdrawal-item"
        >
          <i class="fi fi-rr-user"></i>
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '~/assets/css/withdrawal.css'
import { ref, onMounted } from 'vue'

const withdrawals = [
  "228****1234 a retiré 5 000 XOF",
  "228****5678 a retiré 12 000 XOF",
  "228****4321 a retiré 7 000 XOF"
]

const repeatedWithdrawals = ref([])

onMounted(() => {
  repeatedWithdrawals.value = Array.from({ length: 30 }, (_, i) => {
    return withdrawals[i % withdrawals.length]
  })
})
</script>
