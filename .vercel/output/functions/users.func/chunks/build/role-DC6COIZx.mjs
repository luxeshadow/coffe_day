import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {
  __name: "role",
  __ssrInlineRender: true,
  setup(__props) {
    const showModal = ref(false);
    const showDeleteModal = ref(false);
    const isEditing = ref(false);
    const roleToDelete = ref(null);
    const form = ref({
      id: null,
      name: "",
      description: "",
      permissions: [],
      status: "active"
    });
    const roles = ref([
      {
        id: 1,
        name: "Administrateur",
        description: "Accès complet à toutes les fonctionnalités",
        permissions: ["users.read", "users.write", "roles.manage", "settings.manage"],
        createdAt: "2024-01-15",
        status: "active"
      },
      {
        id: 2,
        name: "Modérateur",
        description: "Gestion des utilisateurs et contenu",
        permissions: ["users.read", "content.moderate"],
        createdAt: "2024-01-20",
        status: "active"
      },
      {
        id: 3,
        name: "Utilisateur",
        description: "Accès basique à la plateforme",
        permissions: ["profile.manage"],
        createdAt: "2024-02-01",
        status: "active"
      }
    ]);
    const availablePermissions = ref([
      { id: "users.read", name: "Lecture utilisateurs" },
      { id: "users.write", name: "Écriture utilisateurs" },
      { id: "roles.manage", name: "Gestion des rôles" },
      { id: "settings.manage", name: "Gestion des paramètres" },
      { id: "content.moderate", name: "Modération du contenu" },
      { id: "profile.manage", name: "Gestion du profil" }
    ]);
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("fr-FR");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "roles-page" }, _attrs))} data-v-3c8aaaee><div class="page-header" data-v-3c8aaaee><h2 data-v-3c8aaaee>Gestion des Rôles</h2><button class="btn-add" data-v-3c8aaaee><i class="fas fa-plus" data-v-3c8aaaee></i> Ajouter un rôle </button></div><div class="table-container" data-v-3c8aaaee><table class="roles-table" data-v-3c8aaaee><thead data-v-3c8aaaee><tr data-v-3c8aaaee><th data-v-3c8aaaee>ID</th><th data-v-3c8aaaee>Nom du rôle</th><th data-v-3c8aaaee>Description</th><th data-v-3c8aaaee>Permissions</th><th data-v-3c8aaaee>Date de création</th><th data-v-3c8aaaee>Statut</th><th data-v-3c8aaaee>Actions</th></tr></thead><tbody data-v-3c8aaaee><!--[-->`);
      ssrRenderList(unref(roles), (role2) => {
        _push(`<tr data-v-3c8aaaee><td data-v-3c8aaaee>${ssrInterpolate(role2.id)}</td><td data-v-3c8aaaee>${ssrInterpolate(role2.name)}</td><td data-v-3c8aaaee>${ssrInterpolate(role2.description)}</td><td data-v-3c8aaaee><!--[-->`);
        ssrRenderList(role2.permissions.slice(0, 2), (perm) => {
          _push(`<span class="permission-badge" data-v-3c8aaaee>${ssrInterpolate(perm)}</span>`);
        });
        _push(`<!--]-->`);
        if (role2.permissions.length > 2) {
          _push(`<span class="more-permissions" data-v-3c8aaaee> +${ssrInterpolate(role2.permissions.length - 2)} autres </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td data-v-3c8aaaee>${ssrInterpolate(formatDate(role2.createdAt))}</td><td data-v-3c8aaaee><span class="${ssrRenderClass([role2.status, "status-badge"])}" data-v-3c8aaaee>${ssrInterpolate(role2.status === "active" ? "Actif" : "Inactif")}</span></td><td class="actions" data-v-3c8aaaee><button class="btn-edit" title="Modifier" data-v-3c8aaaee><i class="fas fa-edit" data-v-3c8aaaee></i></button><button class="btn-delete" title="Supprimer" data-v-3c8aaaee><i class="fas fa-trash" data-v-3c8aaaee></i></button></td></tr>`);
      });
      _push(`<!--]--></tbody></table>`);
      if (unref(roles).length === 0) {
        _push(`<div class="empty-state" data-v-3c8aaaee><i class="fas fa-users-cog" data-v-3c8aaaee></i><p data-v-3c8aaaee>Aucun rôle n&#39;a été créé pour le moment</p><button class="btn-add" data-v-3c8aaaee><i class="fas fa-plus" data-v-3c8aaaee></i> Ajouter votre premier rôle </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="${ssrRenderClass([{ active: unref(showModal) }, "modal-overlay"])}" data-v-3c8aaaee><div class="modal" data-v-3c8aaaee><div class="modal-header" data-v-3c8aaaee><h3 data-v-3c8aaaee>${ssrInterpolate(unref(isEditing) ? "Modifier le rôle" : "Ajouter un nouveau rôle")}</h3><button class="btn-close" data-v-3c8aaaee><i class="fas fa-times" data-v-3c8aaaee></i></button></div><form class="modal-form" data-v-3c8aaaee><div class="form-group" data-v-3c8aaaee><label for="roleName" data-v-3c8aaaee>Nom du rôle *</label><input id="roleName"${ssrRenderAttr("value", unref(form).name)} type="text" required placeholder="Ex: Administrateur" data-v-3c8aaaee></div><div class="form-group" data-v-3c8aaaee><label for="roleDescription" data-v-3c8aaaee>Description</label><textarea id="roleDescription" placeholder="Description du rôle..." rows="3" data-v-3c8aaaee>${ssrInterpolate(unref(form).description)}</textarea></div><div class="form-group" data-v-3c8aaaee><label data-v-3c8aaaee>Permissions</label><div class="permissions-grid" data-v-3c8aaaee><!--[-->`);
      ssrRenderList(unref(availablePermissions), (permission) => {
        _push(`<label class="permission-checkbox" data-v-3c8aaaee><input type="checkbox"${ssrRenderAttr("value", permission.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).permissions) ? ssrLooseContain(unref(form).permissions, permission.id) : unref(form).permissions) ? " checked" : ""} data-v-3c8aaaee><span class="checkmark" data-v-3c8aaaee></span> ${ssrInterpolate(permission.name)}</label>`);
      });
      _push(`<!--]--></div></div><div class="form-group" data-v-3c8aaaee><label class="status-toggle" data-v-3c8aaaee><input type="checkbox"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).status, "active")) ? " checked" : ""} data-v-3c8aaaee><span class="slider" data-v-3c8aaaee></span><span class="status-label" data-v-3c8aaaee>${ssrInterpolate(unref(form).status === "active" ? "Rôle actif" : "Rôle inactif")}</span></label></div><div class="modal-actions" data-v-3c8aaaee><button type="button" class="btn-cancel" data-v-3c8aaaee> Annuler </button><button type="submit" class="btn-submit"${ssrIncludeBooleanAttr(!unref(form).name) ? " disabled" : ""} data-v-3c8aaaee>${ssrInterpolate(unref(isEditing) ? "Modifier" : "Ajouter")}</button></div></form></div></div><div class="${ssrRenderClass([{ active: unref(showDeleteModal) }, "modal-overlay"])}" data-v-3c8aaaee><div class="modal delete-modal" data-v-3c8aaaee><div class="modal-header" data-v-3c8aaaee><h3 data-v-3c8aaaee>Confirmer la suppression</h3><button class="btn-close" data-v-3c8aaaee><i class="fas fa-times" data-v-3c8aaaee></i></button></div><div class="modal-content" data-v-3c8aaaee><i class="fas fa-exclamation-triangle warning-icon" data-v-3c8aaaee></i><p data-v-3c8aaaee>Êtes-vous sûr de vouloir supprimer le rôle <strong data-v-3c8aaaee>&quot;${ssrInterpolate(unref(roleToDelete)?.name)}&quot;</strong> ?</p><p class="warning-text" data-v-3c8aaaee>Cette action est irréversible.</p></div><div class="modal-actions" data-v-3c8aaaee><button class="btn-cancel" data-v-3c8aaaee> Annuler </button><button class="btn-delete-confirm" data-v-3c8aaaee> Supprimer </button></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/user/role.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const role = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3c8aaaee"]]);

export { role as default };
//# sourceMappingURL=role-DC6COIZx.mjs.map
