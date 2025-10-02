<template>
  <div class="hero-carousel">
    <!-- Cartes -->
    <div
      class="hero-card"
      :class="{ active: currentIndex === index }"
      v-for="(card, index) in cards"
      :key="index"
    >
      <div class="hero-content">
        <h2 class="hero-title">{{ card.title }}</h2>
        <p class="hero-desc">{{ card.description }}</p>
        <button class="hero-button">
          {{ card.buttonText }}
          <Icon name="heroicons:arrow-right-solid" style="width:16px; height:16px; margin-left:5px;" />
        </button>
      </div>
    </div>

    <!-- Contrôles -->
    <div class="carousel-control prev" @click="prevCard">
      <Icon name="heroicons:chevron-left-solid" style="width:20px; height:20px;" />
    </div>
    <div class="carousel-control next" @click="nextCard">
      <Icon name="heroicons:chevron-right-solid" style="width:20px; height:20px;" />
    </div>

    <!-- Indicateurs -->
    <div class="carousel-indicators">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="carousel-indicator"
        :class="{ active: currentIndex === index }"
        @click="setCurrentIndex(index)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import '~/assets/css/slider.css'

const currentIndex = ref(0)
const cards = ref([
  {
    title: "Découvrez notre nouveau café premium",
    description: "Une expérience sensorielle unique avec des arômes riches et une texture veloutée qui éveillera vos papilles.",
    buttonText: "Explorer maintenant"
  },
  {
    title: "Offre spéciale -20% sur tous les cafés",
    description: "Profitez de notre promotion exceptionnelle sur toute la gamme de cafés jusqu'à la fin du mois.",
    buttonText: "Profiter de l'offre"
  },
  {
    title: "Ateliers de dégustation chaque weekend",
    description: "Rejoignez-nous pour apprendre les subtilités de la dégustation de café avec nos experts.",
    buttonText: "Réserver une place"
  }
])

const setCurrentIndex = (index) => currentIndex.value = index
const nextCard = () => currentIndex.value = (currentIndex.value + 1) % cards.value.length
const prevCard = () => currentIndex.value = (currentIndex.value - 1 + cards.value.length) % cards.value.length

let autoScrollInterval
onMounted(() => {
  autoScrollInterval = setInterval(nextCard, 5000)
})
onBeforeUnmount(() => clearInterval(autoScrollInterval))
</script>

