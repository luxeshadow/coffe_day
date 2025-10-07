import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';

const _sfc_main = {
  __name: "gestion-grade",
  __ssrInlineRender: true,
  setup(__props) {
    const showModal = ref(false);
    const showDeleteModal = ref(false);
    const isEditing = ref(false);
    const gradeToDelete = ref(null);
    const form = ref({
      id: null,
      name: "",
      description: "",
      level: "",
      status: "active"
    });
    const grades = ref([
      { id: 1, name: "Directeur", description: "Responsable principal", level: 1, createdAt: "2024-01-15", status: "active" },
      { id: 2, name: "Manager", description: "Gestion d’équipe", level: 2, createdAt: "2024-01-20", status: "active" },
      { id: 3, name: "Employé", description: "Membre du personnel", level: 3, createdAt: "2024-02-01", status: "inactive" }
    ]);
    const formatDate = (date) => new Date(date).toLocaleDateString("fr-FR");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "roles-page" }, _attrs))}><div class="page-header"><h2>Gestion des Grades</h2><button class="btn-add"><i class="fas fa-plus"></i> Ajouter un grade </button></div><div class="table-container"><table class="roles-table"><thead><tr><th>ID</th><th>Nom du grade</th><th>Description</th><th>Niveau</th><th>Date de création</th><th>Statut</th><th>Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(grades), (grade) => {
        _push(`<tr><td>${ssrInterpolate(grade.id)}</td><td>${ssrInterpolate(grade.name)}</td><td>${ssrInterpolate(grade.description)}</td><td>${ssrInterpolate(grade.level)}</td><td>${ssrInterpolate(formatDate(grade.createdAt))}</td><td><span class="${ssrRenderClass([grade.status, "status-badge"])}">${ssrInterpolate(grade.status === "active" ? "Actif" : "Inactif")}</span></td><td class="actions"><button class="btn-edit" title="Modifier"><i class="fas fa-edit"></i></button><button class="btn-delete" title="Supprimer"><i class="fas fa-trash"></i></button></td></tr>`);
      });
      _push(`<!--]--></tbody></table>`);
      if (unref(grades).length === 0) {
        _push(`<div class="empty-state"><i class="fas fa-graduation-cap"></i><p>Aucun grade n’a encore été créé</p><button class="btn-add"><i class="fas fa-plus"></i> Ajouter votre premier grade </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="${ssrRenderClass([{ active: unref(showModal) }, "modal-overlay"])}"><div class="modal"><div class="modal-header"><h3>${ssrInterpolate(unref(isEditing) ? "Modifier le grade" : "Ajouter un nouveau grade")}</h3><button class="btn-close"><i class="fas fa-times"></i></button></div><form class="modal-form"><div class="form-group"><label for="gradeName">Nom du grade *</label><input id="gradeName"${ssrRenderAttr("value", unref(form).name)} type="text" required placeholder="Ex: Directeur"></div><div class="form-group"><label for="gradeDescription">Description</label><textarea id="gradeDescription" placeholder="Description du grade..." rows="3">${ssrInterpolate(unref(form).description)}</textarea></div><div class="form-group"><label for="gradeLevel">Niveau</label><input id="gradeLevel"${ssrRenderAttr("value", unref(form).level)} type="number" placeholder="Ex: 1, 2, 3..."></div><div class="form-group"><label class="status-toggle"><input type="checkbox"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).status, "active")) ? " checked" : ""}><span class="slider"></span><span class="status-label">${ssrInterpolate(unref(form).status === "active" ? "Grade actif" : "Grade inactif")}</span></label></div><div class="modal-actions"><button type="button" class="btn-cancel"> Annuler </button><button type="submit" class="btn-submit"${ssrIncludeBooleanAttr(!unref(form).name) ? " disabled" : ""}>${ssrInterpolate(unref(isEditing) ? "Modifier" : "Ajouter")}</button></div></form></div></div><div class="${ssrRenderClass([{ active: unref(showDeleteModal) }, "modal-overlay"])}"><div class="modal delete-modal"><div class="modal-header"><h3>Confirmer la suppression</h3><button class="btn-close"><i class="fas fa-times"></i></button></div><div class="modal-content"><i class="fas fa-exclamation-triangle warning-icon"></i><p>Supprimer le grade <strong>&quot;${ssrInterpolate(unref(gradeToDelete)?.name)}&quot;</strong> ?</p><p class="warning-text">Cette action est irréversible.</p></div><div class="modal-actions"><button class="btn-cancel">Annuler</button><button class="btn-delete-confirm">Supprimer</button></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/grade/gestion-grade.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=gestion-grade-BY1HiceZ.mjs.map
