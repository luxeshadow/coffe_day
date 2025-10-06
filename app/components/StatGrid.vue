<template>
  <div class="stats-grid">
    <div class="stat-row">
      <div class="stat-card animate__animated animate__fadeIn">
        <div class="stat-item">
          <div class="stat-icon">
            <i class="fi fi-rr-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">2K</div>
            <div class="stat-label">Participants</div>
          </div>
        </div>
      </div>

      <div class="stat-card animate__animated animate__fadeIn" style="animation-delay: 0.1s;">
        <div class="stat-item">
          <div class="stat-icon">
            <i class="fi fi-rr-money-bill-wave"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">12M</div>
            <div class="stat-label">XOF</div>
          </div>
        </div>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-card animate__animated animate__fadeIn" style="animation-delay: 0.2s;">
        <div class="stat-item">
          <div class="stat-icon">
            <i class="fi fi-rr-coffee-pot"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">58K</div>
            <div class="stat-label">Gobelets</div>
          </div>
        </div>
      </div>

      <!-- 🟢 Carte modifiée : bouton installation PWA -->
      <div class="stat-card animate__animated animate__fadeIn" style="animation-delay: 0.3s;">
        <div class="stat-item">
            <div class="stat-icon">
                <i class="fi fi-rr-tree"></i>
            </div>
            <div class="stat-content">
                <div class="stat-value">42T</div>
                <div class="stat-label">CO₂</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '~/assets/css/stat-grid.css'
</script>


