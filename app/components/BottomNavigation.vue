<template>
  <!-- Bottom Navigation -->
  <div class="bottom-nav">
    <!-- Accueil -->
    <NuxtLink to="/home" class="nav-item" active-class="active" exact>
      <div class="nav-icon">
       <i class="fi fi-rr-house-blank"></i>
      </div>
      <span>Accueil</span>
    </NuxtLink>

    <!-- Recycler -->
    <NuxtLink to="/activity" class="nav-item" active-class="active">
      <div class="nav-icon">
        <i class="fi fi-rr-recycle"></i>
      </div>
      <span>Recycler</span>
    </NuxtLink>

    <!-- Profil -->
    <NuxtLink to="/profile" class="nav-item" active-class="active">
      <div class="nav-icon">
        <i class="fi fi-rr-user"></i>
      </div>
      <span>Profil</span>
    </NuxtLink>
  </div>
</template>

<script setup>
import '~/assets/css/bottom-navigation.css'
</script>
