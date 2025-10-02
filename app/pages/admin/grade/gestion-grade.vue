<template>
  <div class="roles-page">
    <!-- En-tête page -->
    <div class="page-header">
      <h2>Gestion des Grades</h2>
      <button class="btn-add" @click="openAddModal">
        <i class="fas fa-plus"></i>
        Ajouter un grade
      </button>
    </div>

    <!-- Tableau des grades -->
    <div class="table-container">
      <table class="roles-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom du grade</th>
            <th>Description</th>
            <th>Niveau</th>
            <th>Date de création</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="grade in grades" :key="grade.id">
            <td>{{ grade.id }}</td>
            <td>{{ grade.name }}</td>
            <td>{{ grade.description }}</td>
            <td>{{ grade.level }}</td>
            <td>{{ formatDate(grade.createdAt) }}</td>
            <td>
              <span class="status-badge" :class="grade.status">
                {{ grade.status === 'active' ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="actions">
              <button class="btn-edit" @click="editGrade(grade)" title="Modifier">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-delete" @click="confirmDelete(grade)" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Si aucun grade -->
      <div v-if="grades.length === 0" class="empty-state">
        <i class="fas fa-graduation-cap"></i>
        <p>Aucun grade n’a encore été créé</p>
        <button class="btn-add" @click="openAddModal">
          <i class="fas fa-plus"></i>
          Ajouter votre premier grade
        </button>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div class="modal-overlay" :class="{ active: showModal }" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? 'Modifier le grade' : 'Ajouter un nouveau grade' }}</h3>
          <button class="btn-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-group">
            <label for="gradeName">Nom du grade *</label>
            <input
              id="gradeName"
              v-model="form.name"
              type="text"
              required
              placeholder="Ex: Directeur"
            >
          </div>

          <div class="form-group">
            <label for="gradeDescription">Description</label>
            <textarea
              id="gradeDescription"
              v-model="form.description"
              placeholder="Description du grade..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="gradeLevel">Niveau</label>
            <input
              id="gradeLevel"
              v-model="form.level"
              type="number"
              placeholder="Ex: 1, 2, 3..."
            >
          </div>

          <div class="form-group">
            <label class="status-toggle">
              <input type="checkbox" v-model="form.status" true-value="active" false-value="inactive">
              <span class="slider"></span>
              <span class="status-label">
                {{ form.status === 'active' ? 'Grade actif' : 'Grade inactif' }}
              </span>
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">
              Annuler
            </button>
            <button type="submit" class="btn-submit" :disabled="!form.name">
              {{ isEditing ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal suppression -->
    <div class="modal-overlay" :class="{ active: showDeleteModal }" @click="closeDeleteModal">
      <div class="modal delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirmer la suppression</h3>
          <button class="btn-close" @click="closeDeleteModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p>Supprimer le grade <strong>"{{ gradeToDelete?.name }}"</strong> ?</p>
          <p class="warning-text">Cette action est irréversible.</p>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeDeleteModal">Annuler</button>
          <button class="btn-delete-confirm" @click="deleteGrade">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const gradeToDelete = ref(null)

const form = ref({
  id: null,
  name: '',
  description: '',
  level: '',
  status: 'active'
})

const grades = ref([
  { id: 1, name: 'Directeur', description: 'Responsable principal', level: 1, createdAt: '2024-01-15', status: 'active' },
  { id: 2, name: 'Manager', description: 'Gestion d’équipe', level: 2, createdAt: '2024-01-20', status: 'active' },
  { id: 3, name: 'Employé', description: 'Membre du personnel', level: 3, createdAt: '2024-02-01', status: 'inactive' }
])

const openAddModal = () => {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

const editGrade = (grade) => {
  form.value = { ...grade }
  isEditing.value = true
  showModal.value = true
}

const resetForm = () => {
  form.value = { id: null, name: '', description: '', level: '', status: 'active' }
}

const closeModal = () => {
  showModal.value = false
  setTimeout(resetForm, 300)
}

const submitForm = () => {
  if (isEditing.value) {
    const index = grades.value.findIndex(g => g.id === form.value.id)
    if (index !== -1) grades.value[index] = { ...form.value }
  } else {
    const newGrade = {
      id: grades.value.length ? Math.max(...grades.value.map(g => g.id)) + 1 : 1,
      ...form.value,
      createdAt: new Date().toISOString().split('T')[0]
    }
    grades.value.push(newGrade)
  }
  closeModal()
}

const confirmDelete = (grade) => {
  gradeToDelete.value = grade
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  gradeToDelete.value = null
}

const deleteGrade = () => {
  if (gradeToDelete.value) {
    grades.value = grades.value.filter(g => g.id !== gradeToDelete.value.id)
    closeDeleteModal()
  }
}

const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR')
</script>