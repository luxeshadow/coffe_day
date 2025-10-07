import { ssrRenderAttrs } from 'vue/server-renderer';
import { ref, useSSRContext } from 'vue';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {
  __name: "user-list",
  __ssrInlineRender: true,
  setup(__props) {
    ref([
      { id: "users.read", name: "Lecture utilisateurs" },
      { id: "users.write", name: "Écriture utilisateurs" },
      { id: "roles.manage", name: "Gestion des rôles" },
      { id: "settings.manage", name: "Gestion des paramètres" },
      { id: "content.moderate", name: "Modération du contenu" },
      { id: "profile.manage", name: "Gestion du profil" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<h2${ssrRenderAttrs(_attrs)} data-v-0babddfe>Gestion des Rôles</h2>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/user/user-list.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const userList = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0babddfe"]]);

export { userList as default };
//# sourceMappingURL=user-list-Bs_oXMw5.mjs.map
