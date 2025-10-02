<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>

    <!-- Feedback -->
    <div v-if="message" :class="messageType" class="mb-4 p-2 rounded">
      {{ message }}
    </div>

    <!-- Ajouter un user -->
    <form @submit.prevent="addUser" class="mb-6 flex gap-2">
      <input v-model="newUser.name" placeholder="Nom" class="border p-2 rounded" />
      <input v-model="newUser.email" placeholder="Email" class="border p-2 rounded" />
      <button type="submit" class="bg-blue-500 text-white px-4 rounded">Ajouter</button>
    </form>

    <hr class="my-4" />

    <!-- Liste des users -->
    <ul>
      <li v-for="user in users" :key="user.id" class="flex justify-between items-center mb-2">
        <span>{{ user.name }} - {{ user.email }}</span>
        <div class="flex gap-2">
          <button @click="updateUser(user.id)" class="bg-yellow-400 px-2 rounded">Modifier</button>
          <button @click="deleteUser(user.id)" class="bg-red-500 px-2 text-white rounded">Supprimer</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const { $supabase } = useNuxtApp()

const users = ref<User[]>([])
const newUser = ref({ name: '', email: '' })

// Feedback utilisateur
const message = ref<string | null>(null)
const messageType = ref<string>('')

// Fonction pour afficher message
function showMessage(text: string, type: 'success' | 'error' = 'success') {
  message.value = text
  messageType.value = type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  setTimeout(() => message.value = null, 3000)
}

// Récupérer les users (Read)
async function getUsers() {
  try {
    const { data, error } = await $supabase.from('users').select('*')
    if (error) throw error
    users.value = data as User[]
  } catch (err: any) {
    console.error('Erreur GET:', err.message)
    showMessage(err.message, 'error')
  }
}

// Ajouter un user (Create)
async function addUser() {
  if (!newUser.value.name || !newUser.value.email) {
    showMessage('Nom et email sont requis', 'error')
    return
  }
  try {
    const { error } = await $supabase.from('users').insert([newUser.value])
    if (error) throw error
    newUser.value = { name: '', email: '' }
    showMessage('Utilisateur ajouté avec succès')
    getUsers()
  } catch (err: any) {
    console.error('Erreur INSERT:', err.message)
    showMessage(err.message, 'error')
  }
}

// Modifier un user (Update)
async function updateUser(id: number) {
  const newName = prompt('Entrez le nouveau nom:')
  if (!newName) return
  try {
    const { error } = await $supabase.from('users').update({ name: newName }).eq('id', id)
    if (error) throw error
    showMessage('Utilisateur modifié avec succès')
    getUsers()
  } catch (err: any) {
    console.error('Erreur UPDATE:', err.message)
    showMessage(err.message, 'error')
  }
}

// Supprimer un user (Delete)
async function deleteUser(id: number) {
  if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return
  try {
    const { error } = await $supabase.from('users').delete().eq('id', id)
    if (error) throw error
    showMessage('Utilisateur supprimé avec succès')
    getUsers()
  } catch (err: any) {
    console.error('Erreur DELETE:', err.message)
    showMessage(err.message, 'error')
  }
}

onMounted(() => {
  getUsers()
})
</script>
