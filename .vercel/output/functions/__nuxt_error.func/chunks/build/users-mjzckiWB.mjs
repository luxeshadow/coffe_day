import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { b as useNuxtApp } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:fs';
import 'node:path';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "users",
  __ssrInlineRender: true,
  setup(__props) {
    const { $supabase } = useNuxtApp();
    const users = ref([]);
    const newUser = ref({ name: "", email: "" });
    const message = ref(null);
    const messageType = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4" }, _attrs))}><h1 class="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>`);
      if (message.value) {
        _push(`<div class="${ssrRenderClass([messageType.value, "mb-4 p-2 rounded"])}">${ssrInterpolate(message.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="mb-6 flex gap-2"><input${ssrRenderAttr("value", newUser.value.name)} placeholder="Nom" class="border p-2 rounded"><input${ssrRenderAttr("value", newUser.value.email)} placeholder="Email" class="border p-2 rounded"><button type="submit" class="bg-blue-500 text-white px-4 rounded">Ajouter</button></form><hr class="my-4"><ul><!--[-->`);
      ssrRenderList(users.value, (user) => {
        _push(`<li class="flex justify-between items-center mb-2"><span>${ssrInterpolate(user.name)} - ${ssrInterpolate(user.email)}</span><div class="flex gap-2"><button class="bg-yellow-400 px-2 rounded">Modifier</button><button class="bg-red-500 px-2 text-white rounded">Supprimer</button></div></li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/users.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=users-mjzckiWB.mjs.map
