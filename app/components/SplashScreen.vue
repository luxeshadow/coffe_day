<template>
  <div class="splash-container" v-cloak>
    <!-- Texte animé -->
    <div class="logo-text">
      <div 
  v-for="(letter, index) in letters" 
  :key="index" 
  class="letter"
  :class="{ space: letter === '' }"
  :style="{ 
    animationDelay: `${index * 0.1}s`,
    color: index <= 2 ? '#4CAF50' : '#f8f5f0' 
  }"
>
  {{ letter }}
</div>

    </div>
    

    <!-- Logo -->
    <div class="logo">
      <i class="fi fi-rr-coffee"></i>
    </div>

    <!-- Tagline -->
    <div class="tagline">L'énergie durable à portée de main</div>

    <!-- Barre de chargement -->
    <div class="loading-bar">
      <div class="loading-progress" :style="{ width: progressWidth }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const letters = ref(['E','C','O','N','E','S','T'])
const progressWidth = ref('0%')

onMounted(() => {
  const container = document.querySelector('.splash-container')
  if (container) {
    requestAnimationFrame(() => {
      container.classList.add('ready')
    })
  }

  setTimeout(() => {
    progressWidth.value = '100%'
  }, 100)
})
</script>

<style>
/* Masquer le HTML tant que Vue n’est pas monté */
[v-cloak] {
  display: none;
}

/* --- Container --- */
.splash-container {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b2f2f, #2c2c2c);
  color: #f8f5f0;
  z-index: 9999;
  padding: 5vw;
  text-align: center;

  opacity: 0; /* Masqué par défaut */
  transition: opacity 0.5s ease-in-out;
}

.splash-container.ready {
  opacity: 1; /* Apparition douce */
}

/* --- Lettres --- */
.logo-text {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 5vh;
}
.letter {
  font-size: clamp(1.8rem, 6vw, 3.5rem);
  font-weight: 800;
  opacity: 0;
  transform: translateY(-100vh);
  animation: fall 0.6s ease-out forwards;
}
.space {
  width: clamp(8px, 2vw, 15px);
}

/* --- Logo --- */
.logo {
  opacity: 0;
  transform: scale(0);
  width: clamp(70px, 20vw, 120px);
  height: clamp(70px, 20vw, 120px);
  margin-bottom: 4vh;
  background: linear-gradient(135deg, #6b4e31, #d4af37);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: logoAppear 0.8s ease-out 1.8s forwards;
}
.logo i {
  font-size: clamp(30px, 8vw, 60px);
  color: #fff9f0;
}

/* --- Tagline --- */
.tagline {
  margin-top: 3vh;
  font-size: clamp(0.9rem, 3vw, 1.2rem);
  color: #8a6d6d;
  opacity: 0;
  animation: fadeIn 1s ease-out 2.2s forwards;
  line-height: 1.4;
  padding: 0 10px;
}

/* --- Loading bar --- */
.loading-bar {
  width: 80%;
  max-width: 250px;
  height: 6px;
  background: rgba(136, 109, 109, 0.3);
  border-radius: 4px;
  margin-top: 5vh;
  overflow: hidden;
}
.loading-progress {
  height: 100%;
  background: linear-gradient(to right, #6b4e31, #d4af37);
  border-radius: 4px;
  transition: width 2s ease-in-out;
}

/* --- Animations --- */
@keyframes fall {
  0%   { opacity: 0; transform: translateY(-100vh); }
  60%  { transform: translateY(20px); }
  80%  { transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes logoAppear {
  0%   { opacity: 0; transform: scale(0) rotate(-180deg); }
  70%  { transform: scale(1.1) rotate(10deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* --- Extra mobile fix --- */
@media (max-width: 480px) {
  .logo-text {
    margin-bottom: 3vh;
  }
  .loading-bar {
    height: 4px;
  }
}
</style>
