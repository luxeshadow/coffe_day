<template>
  <div class="roles-page">
    <!-- En-tête de page avec bouton d'ajout -->
    <div class="page-header">
      <h2>Gestion des Rôles</h2>
      <button class="btn-add" @click="openAddModal">
        <i class="fas fa-plus"></i>
        Ajouter un rôle
      </button>
    </div>

    <!-- Tableau des rôles -->
    <div class="table-container">
      <table class="roles-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom du rôle</th>
            <th>Description</th>
            <th>Permissions</th>
            <th>Date de création</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id">
            <td>{{ role.id }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>
              <span class="permission-badge" v-for="perm in role.permissions.slice(0, 2)" :key="perm">
                {{ perm }}
              </span>
              <span v-if="role.permissions.length > 2" class="more-permissions">
                +{{ role.permissions.length - 2 }} autres
              </span>
            </td>
            <td>{{ formatDate(role.createdAt) }}</td>
            <td>
              <span class="status-badge" :class="role.status">
                {{ role.status === 'active' ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="actions">
              <button class="btn-edit" @click="editRole(role)" title="Modifier">
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn-delete" 
                @click="confirmDelete(role)"
                title="Supprimer"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Message si aucun rôle -->
      <div v-if="roles.length === 0" class="empty-state">
        <i class="fas fa-users-cog"></i>
        <p>Aucun rôle n'a été créé pour le moment</p>
        <button class="btn-add" @click="openAddModal">
          <i class="fas fa-plus"></i>
          Ajouter votre premier rôle
        </button>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div class="modal-overlay" :class="{ active: showModal }" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? 'Modifier le rôle' : 'Ajouter un nouveau rôle' }}</h3>
          <button class="btn-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-group">
            <label for="roleName">Nom du rôle *</label>
            <input
              id="roleName"
              v-model="form.name"
              type="text"
              required
              placeholder="Ex: Administrateur"
            >
          </div>
          
          <div class="form-group">
            <label for="roleDescription">Description</label>
            <textarea
              id="roleDescription"
              v-model="form.description"
              placeholder="Description du rôle..."
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Permissions</label>
            <div class="permissions-grid">
              <label v-for="permission in availablePermissions" :key="permission.id" class="permission-checkbox">
                <input
                  type="checkbox"
                  :value="permission.id"
                  v-model="form.permissions"
                >
                <span class="checkmark"></span>
                {{ permission.name }}
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label class="status-toggle">
              <input type="checkbox" v-model="form.status" true-value="active" false-value="inactive">
              <span class="slider"></span>
              <span class="status-label">
                {{ form.status === 'active' ? 'Rôle actif' : 'Rôle inactif' }}
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

    <!-- Modal de confirmation de suppression -->
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
          <p>Êtes-vous sûr de vouloir supprimer le rôle <strong>"{{ roleToDelete?.name }}"</strong> ?</p>
          <p class="warning-text">Cette action est irréversible.</p>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeDeleteModal">
            Annuler
          </button>
          <button class="btn-delete-confirm" @click="deleteRole">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Données réactives
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const roleToDelete = ref(null)

// Formulaire
const form = ref({
  id: null,
  name: '',
  description: '',
  permissions: [],
  status: 'active'
})

// Données de test
const roles = ref([
  {
    id: 1,
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: ['users.read', 'users.write', 'roles.manage', 'settings.manage'],
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: 2,
    name: 'Modérateur',
    description: 'Gestion des utilisateurs et contenu',
    permissions: ['users.read', 'content.moderate'],
    createdAt: '2024-01-20',
    status: 'active'
  },
  {
    id: 3,
    name: 'Utilisateur',
    description: 'Accès basique à la plateforme',
    permissions: ['profile.manage'],
    createdAt: '2024-02-01',
    status: 'active'
  }
])

const availablePermissions = ref([
  { id: 'users.read', name: 'Lecture utilisateurs' },
  { id: 'users.write', name: 'Écriture utilisateurs' },
  { id: 'roles.manage', name: 'Gestion des rôles' },
  { id: 'settings.manage', name: 'Gestion des paramètres' },
  { id: 'content.moderate', name: 'Modération du contenu' },
  { id: 'profile.manage', name: 'Gestion du profil' }
])

// Méthodes
const openAddModal = () => {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

const editRole = (role) => {
  form.value = {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: [...role.permissions],
    status: role.status
  }
  isEditing.value = true
  showModal.value = true
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    description: '',
    permissions: [],
    status: 'active'
  }
}
definePageMeta({
  layout: 'dashboard'
})
const closeModal = () => {
  showModal.value = false
  setTimeout(resetForm, 300)
}

const submitForm = () => {
  if (isEditing.value) {
    // Modification d'un rôle existant
    const index = roles.value.findIndex(r => r.id === form.value.id)
    if (index !== -1) {
      roles.value[index] = { ...form.value }
    }
  } else {
    // Ajout d'un nouveau rôle
    const newRole = {
      id: Math.max(...roles.value.map(r => r.id)) + 1,
      ...form.value,
      createdAt: new Date().toISOString().split('T')[0]
    }
    roles.value.push(newRole)
  }
  
  closeModal()
}

const confirmDelete = (role) => {
  roleToDelete.value = role
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  roleToDelete.value = null
}

const deleteRole = () => {
  if (roleToDelete.value) {
    roles.value = roles.value.filter(r => r.id !== roleToDelete.value.id)
    closeDeleteModal()
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}
</script>

<style scoped>
.roles-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--light-accent);
}

.page-header h2 {
  color: var(--primary-dark);
  font-size: 1.8rem;
}

.btn-add {
  background-color: var(--accent);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-add:hover {
  background-color: #c19b2a;
}

.table-container {
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.roles-table {
  width: 100%;
  border-collapse: collapse;
}

.roles-table th {
  background-color: var(--light-bg);
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: var(--primary-dark);
  border-bottom: 2px solid var(--light-accent);
}

.roles-table td {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.roles-table tr:hover {
  background-color: var(--light-cream);
}

.permission-badge {
  background-color: var(--light-bg);
  color: var(--medium-dark);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-right: 5px;
  display: inline-block;
}

.more-permissions {
  color: var(--light-accent);
  font-size: 0.8rem;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.active {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.status-badge.inactive {
  background-color: #ffebee;
  color: #c62828;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-edit, .btn-delete {
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-edit {
  background-color: var(--light-bg);
  color: var(--secondary-dark);
}

.btn-edit:hover {
  background-color: #e0e0e0;
}

.btn-delete {
  background-color: #ffebee;
  color: #c62828;
}

.btn-delete:hover {
  background-color: #ffcdd2;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--light-accent);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 1.1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal {
  background: var(--white);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.9);
  transition: transform 0.3s;
}

.modal-overlay.active .modal {
  transform: scale(1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  color: var(--primary-dark);
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--light-accent);
}

.btn-close:hover {
  color: var(--primary-dark);
}

.modal-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: var(--primary-dark);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.permission-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.permission-checkbox:hover {
  background-color: var(--light-bg);
}

.status-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.slider {
  position: relative;
  width: 50px;
  height: 24px;
  background-color: #ccc;
  border-radius: 24px;
  transition: background-color 0.3s;
}

.slider:before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

input[type="checkbox"]:checked + .slider {
  background-color: var(--accent);
}

input[type="checkbox"]:checked + .slider:before {
  transform: translateX(26px);
}

input[type="checkbox"] {
  display: none;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn-cancel, .btn-submit, .btn-delete-confirm {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-cancel {
  background-color: var(--light-bg);
  color: var(--medium-dark);
}

.btn-submit {
  background-color: var(--accent);
  color: var(--white);
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-delete-confirm {
  background-color: #d32f2f;
  color: white;
}

.delete-modal .modal-content {
  padding: 20px;
  text-align: center;
}

.warning-icon {
  font-size: 3rem;
  color: #ff9800;
  margin-bottom: 15px;
}

.warning-text {
  color: #d32f2f;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .roles-table {
    font-size: 0.9rem;
  }
  
  .roles-table th,
  .roles-table td {
    padding: 10px 5px;
  }
  
  .permissions-grid {
    grid-template-columns: 1fr;
  }
}
</style>