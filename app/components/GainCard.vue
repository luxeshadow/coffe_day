<template>
  <div class="gain-card animate__animated animate__fadeInUp">
    <img src="/img/coffee/coffee1.png" alt="stake image" class="gain-stake-image" />

    <div class="gain-content">
      <!-- Titre -->
      <div class="gain-title">
        <i class="fi fi-rr-trophy"></i>
        Votre Gain
      </div>
      
      <!-- Montant + Toggle -->
      <div class="gain-amount-container">
        <span class="gain-amount">
          <template v-if="gainStore.loading">Chargement...</template>
          <template v-else>{{ masked ? "**** XOF" : walletBalanceFormatted }}</template>
        </span>

        <button style="margin-top:-5px" class="gain-mask-toggle" @click="toggleMask">
          <i style="margin-top:4px" v-if="masked" class="fi fi-rr-eye"></i>
          <i style="margin-top:4px" v-else class="fi fi-rr-eye-crossed"></i>
        </button>
      </div>

      <!-- Bouton -->
      <NuxtLink to="/retrait" class="gain-button">
        Retirer
      </NuxtLink>

      <!-- Optionnel : Error -->
      <div v-if="gainStore.error" class="gain-error">{{ gainStore.error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '~/assets/css/gain-card.css'
import { ref, computed } from 'vue'
import { useGainStore } from '../stores/gainStore'

const masked = ref(false)
const toggleMask = () => {
  masked.value = !masked.value
}

// Store Pinia
const gainStore = useGainStore()
const walletBalanceFormatted = computed(() => {
  const amount = gainStore.walletBalance ?? 0
  return Math.floor(amount).toLocaleString() + ' XOF'
})
</script>

