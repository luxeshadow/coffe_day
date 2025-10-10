<template>
  <div class="section-title">
    <i class="fi fi-rr-comment"></i>
    Témoignages
  </div>
  <div class="testimonial-scroll">
    <div 
      class="testimonial-card" 
      v-for="(testimonial, index) in testimonials" 
      :key="index"
    >
      <div class="testimonial-text">{{ testimonial.text }}</div>
      <div class="testimonial-author">
        <div class="author-avatar">
          <i class="fi fi-rr-user"></i>
        </div>
        <div class="author-name">{{ testimonial.author }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '~/assets/css/testimonial.css'

const testimonials = [
  { text: "Recycler avec NESCAFÉ est simple et gratifiant. J'ai déjà gagné 10 000 XOF !", author: "Aminata K." },
  { text: "Cette initiative m'a motivé à adopter des habitudes plus écologiques.", author: "Kofi A." },
  { text: "Je participe chaque semaine et je vois déjà la différence dans ma communauté.", author: "Rober A." },
  { text: "Le programme de recyclage m'a appris à mieux trier mes déchets.", author: "Fatou B." },
  { text: "Je recommande à tous de rejoindre l'initiative pour un futur plus vert.", author: "Tchad M." },
  { text: "Grâce à NESCAFÉ, recycler est devenu une habitude amusante.", author: "Yao S." },
  { text: "Les récompenses m'encouragent à continuer à recycler régulièrement.", author: "Awa D." },
  { text: "J'ai convaincu mes voisins de participer et c'est bénéfique pour tous.", author: "Emmanuel K." },
  { text: "Chaque geste compte : recycler avec NESCAFÉ est simple et motivant.", author: "Sophie N." },
  { text: "Cette initiative m'aide à réduire mon impact environnemental quotidien.", author: "Ismaël T." }
]
</script>
