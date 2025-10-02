<template>
  <div>
    <SplashScreen v-if="showSplash" />
    <template v-else>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showSplash = ref(true)

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css'
    }
  ]
})

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false
  }, 2000)
})
</script>
