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
  "228****4821 a retiré 4 872 XOF",
  "228****7352 a retiré 5 122 XOF",
  "228****6194 a retiré 11 580 XOF",
  "228****9038 a retiré 12 115 XOF",
  "228****1576 a retiré 7 222 XOF",
  "228****2849 a retiré 6 890 XOF",
  "228****3472 a retiré 12 035 XOF",
  "228****4685 a retiré 11 730 XOF",
  "228****5913 a retiré 4 650 XOF",
  "228****6024 a retiré 5 320 XOF",
  "228****7189 a retiré 6 970 XOF",
  "228****8345 a retiré 7 100 XOF",
  "228****9271 a retiré 12 200 XOF",
  "228****1048 a retiré 4 950 XOF",
  "228****2159 a retiré 5 450 XOF",
  "228****3267 a retiré 11 800 XOF",
  "228****4376 a retiré 12 050 XOF",
  "228****5489 a retiré 7 400 XOF",
  "228****6593 a retiré 6 780 XOF",
  "228****7612 a retiré 5 600 XOF",
  "228****8724 a retiré 12 090 XOF",
  "228****9835 a retiré 7 010 XOF",
  "228****0946 a retiré 4 890 XOF",
  "228****1057 a retiré 5 300 XOF",
  "228****2168 a retiré 6 950 XOF",
  "228****3279 a retiré 11 950 XOF",
  "228****4380 a retiré 7 200 XOF",
  "228****5491 a retiré 5 120 XOF",
  "228****6502 a retiré 12 010 XOF",
  "228****7613 a retiré 6 880 XOF"
]

const repeatedWithdrawals = ref([])

onMounted(() => {
  repeatedWithdrawals.value = Array.from({ length: 30 }, (_, i) => {
    return withdrawals[i % withdrawals.length]
  })
})

</script>
