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
       <button class="hero-button" @click="goProfile">
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
import { useRouter } from 'vue-router'
import '~/assets/css/slider.css'

const router = useRouter()

const currentIndex = ref(0)
const cards = ref([
  {
  title: "Investissez dans le recyclage avec des revenus quotidiens",
  description: "Chaque boîte de collecte finance une équipe terrain qui récupère des déchets recyclables. Ces déchets sont ensuite revendus à l’industrie, générant des revenus transparents pour les investisseurs.",
  buttonText: "Commencer maintenant"
},
{
  title: "Des revenus calculés et sécurisés",
  description: "Investissez dès 10 000 F CFA et recevez des gains journaliers proportionnels à votre investissement. Votre capital travaille pour vous tout en soutenant l’environnement.",
  buttonText: "Découvrir les packs"
},
{
  title: "Impact environnemental réel",
  description: "Votre investissement contribue à réduire les déchets et à soutenir les collecteurs locaux, tout en générant un revenu stable et transparent.",
  buttonText: "Rejoindre le projet"
}

])

const setCurrentIndex = (index) => currentIndex.value = index
const nextCard = () => currentIndex.value = (currentIndex.value + 1) % cards.value.length
const prevCard = () => currentIndex.value = (currentIndex.value - 1 + cards.value.length) % cards.value.length

// Auto-scroll
let autoScrollInterval
onMounted(() => {
  autoScrollInterval = setInterval(nextCard, 5000)
})
onBeforeUnmount(() => clearInterval(autoScrollInterval))

// Navigation bouton
const goProfile = () => router.push('/profile')
</script>