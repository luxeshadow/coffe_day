import { _ as __nuxt_component_0 } from './nuxt-link-BO7K9PTb.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderDynamicModel, ssrRenderClass, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { a as useRouter$1, b as useNuxtApp, c as useAuthStore } from './server.mjs';
import { l as loginValidate, a as authService } from './authValidation-C9e88gIV.mjs';
import { u as useGainStore } from './gainStore-Ds-26nhl.mjs';
import { u as useGradeStore } from './gradeStore-hozZWqTP.mjs';
import { useRouter } from 'vue-router';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

function useLoginUser() {
  const loading = ref(false);
  const error = ref(null);
  const user = ref(null);
  useRouter$1();
  const toast = useNuxtApp().$toast;
  const authStore = useAuthStore();
  const loginUser = async (formData) => {
    loading.value = true;
    error.value = null;
    try {
      loginValidate(formData);
      const data = await authService.login(formData.phone, formData.password);
      if (!data.session) throw new Error("Échec de la connexion.");
      const token = data.session.access_token;
      const userInfo = data.user || data.session.user;
      authStore.setAuth({
        user_name: userInfo.user_name || userInfo.email,
        token,
        phone: userInfo.user_metadata?.phone || ""
      });
      user.value = userInfo;
      toast({
        text: "Connexion réussie !",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
      });
      console.log("Attempting to navigate to /home");
      if (false) ;
      else {
        console.warn("Navigation attempted on server-side, skipping router.push");
      }
      return userInfo;
    } catch (err) {
      console.error("Erreur login :", err);
      let message = "Erreur inconnue";
      if (err.message?.includes("Invalid login")) {
        message = "Numéro de téléphone ou mot de passe incorrect.";
      } else if (err.message) {
        message = err.message;
      }
      error.value = message;
      toast({
        text: message,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
      });
      return null;
    } finally {
      loading.value = false;
    }
  };
  return { loading, error, user, loginUser };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const form = ref({
      phone: "",
      password: ""
    });
    const showPassword = ref(false);
    const { loading } = useLoginUser();
    useGainStore();
    useGradeStore();
    useRouter();
    const loadingStores = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-wrapper" }, _attrs))} data-v-cecd7c8c><div class="login-container" data-v-cecd7c8c><h1 data-v-cecd7c8c>Log in</h1><p data-v-cecd7c8c>Access your account to continue supporting a greener future!</p><form id="login-form" data-v-cecd7c8c><div class="form-group" data-v-cecd7c8c><label for="phone" data-v-cecd7c8c>Phone</label><input type="text" id="phone"${ssrRenderAttr("value", form.value.phone)} placeholder="Enter your phone number" required aria-required="true" data-v-cecd7c8c></div><div class="form-group password-group" data-v-cecd7c8c><label for="password" data-v-cecd7c8c>Password</label><div class="password-wrapper" data-v-cecd7c8c><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")} id="password"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", form.value.password, null)} placeholder="Enter your password" required aria-required="true" data-v-cecd7c8c><i class="${ssrRenderClass([showPassword.value ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed", "toggle-password"])}" data-v-cecd7c8c></i></div></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading) || loadingStores.value) ? " disabled" : ""} data-v-cecd7c8c>`);
      if (unref(loading) || loadingStores.value) {
        _push(`<i class="fas fa-spinner fa-spin mr-2" data-v-cecd7c8c></i>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(loading) || loadingStores.value ? "Logging in..." : "Log in")}</button></form><p class="login-link" data-v-cecd7c8c> Don&#39;t have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/register" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Sign up`);
          } else {
            return [
              createTextVNode("Sign up")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`. </p></div>`);
      if (loadingStores.value) {
        _push(`<div class="loading-overlay" data-v-cecd7c8c><div class="spinner" data-v-cecd7c8c></div><p data-v-cecd7c8c>Chargement de vos données...</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cecd7c8c"]]);

export { index as default };
//# sourceMappingURL=index-BwvFAGfV.mjs.map
