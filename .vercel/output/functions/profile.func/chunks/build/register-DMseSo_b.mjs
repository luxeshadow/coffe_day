import { _ as __nuxt_component_0 } from './nuxt-link-BO7K9PTb.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderDynamicModel, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { r as registerValidate, a as authService } from './authValidation-C9e88gIV.mjs';
import { b as useNuxtApp } from './server.mjs';
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

function useCreateUser() {
  const loading = ref(false);
  const error = ref(null);
  const user = ref(null);
  const router = useRouter();
  const createUser = async (formData) => {
    loading.value = true;
    error.value = null;
    const toast = useNuxtApp().$toast;
    try {
      const fullPhone = `${formData.countryCode}${formData.phone}`;
      const newUser = {
        user_name: formData.user_name.trim(),
        phone: fullPhone,
        password: formData.password,
        parent_invitecode: formData.parent_invitecode?.trim() || ""
      };
      console.log("Payload envoyé à registerValidate :", JSON.stringify({
        ...newUser,
        confirmPassword: formData.confirmPassword,
        countryCode: formData.countryCode
      }, null, 2));
      registerValidate({ ...newUser, confirmPassword: formData.confirmPassword, countryCode: formData.countryCode });
      const registeredUser = await authService.register(newUser);
      user.value = registeredUser;
      toast({ text: "Inscription réussie !", backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)" });
      router.push("/");
      return registeredUser;
    } catch (err) {
      console.error("Erreur création utilisateur :", err);
      let message = "Erreur inconnue";
      if (err.message?.includes("users_user_name_key")) {
        message = "Ce nom d’utilisateur est déjà pris. Veuillez en choisir un autre.";
      } else if (err.message?.includes("users_phone_key")) {
        message = "Ce numéro de téléphone est déjà utilisé.";
      } else if (err.message) {
        message = err.message;
      }
      error.value = message;
      toast({ text: message, backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)" });
      return null;
    } finally {
      loading.value = false;
    }
  };
  return { loading, error, user, createUser };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const { loading } = useCreateUser();
    const form = ref({
      user_name: "",
      phone: "",
      countryCode: "+228",
      password: "",
      confirmPassword: "",
      invitationCode: ""
    });
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const countries = [
      { code: "TG", dial_code: "+228", flag: "/img/pays/togo.png" },
      { code: "BF", dial_code: "+226", flag: "/img/pays/burkina.png" },
      { code: "BN", dial_code: "+229", flag: "/img/pays/benin.png" },
      { code: "SN", dial_code: "+221", flag: "/img/pays/senegal.png" }
    ];
    const selectedCountry = computed(() => countries.find((c) => c.dial_code === form.value.countryCode) || countries[0]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "register-wrapper" }, _attrs))} data-v-ae8713d2><div class="register-container" data-v-ae8713d2><h1 data-v-ae8713d2>Sign up</h1><p data-v-ae8713d2>Join our community and contribute to a greener future through smart recycling!</p><form id="signup-form" data-v-ae8713d2><div class="form-group" data-v-ae8713d2><label for="user-name" data-v-ae8713d2>Username*</label><input type="text" id="user-name"${ssrRenderAttr("value", form.value.user_name)} placeholder="johndoe123" required data-v-ae8713d2></div><div class="form-group" data-v-ae8713d2><label for="phone" data-v-ae8713d2>Enter your phone number*</label><div class="phone-input" data-v-ae8713d2><select class="country-select" data-v-ae8713d2><!--[-->`);
      ssrRenderList(countries, (country) => {
        _push(`<option${ssrRenderAttr("value", country.dial_code)} data-v-ae8713d2${ssrIncludeBooleanAttr(Array.isArray(form.value.countryCode) ? ssrLooseContain(form.value.countryCode, country.dial_code) : ssrLooseEqual(form.value.countryCode, country.dial_code)) ? " selected" : ""}>${ssrInterpolate(country.dial_code)} (${ssrInterpolate(country.code)}) </option>`);
      });
      _push(`<!--]--></select><div class="phone-wrapper" data-v-ae8713d2><img${ssrRenderAttr("src", selectedCountry.value.flag)} class="flag-inside-input" alt="Selected country flag" data-v-ae8713d2><input type="tel" id="phone"${ssrRenderAttr("value", form.value.phone)} placeholder="e.g. 90123456" required data-v-ae8713d2></div></div></div><div class="form-group password-group" data-v-ae8713d2><label for="password" data-v-ae8713d2>Enter your password*</label><div class="password-wrapper" data-v-ae8713d2><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")} id="password"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", form.value.password, null)} placeholder="Minimum 8 characters" required data-v-ae8713d2><i class="${ssrRenderClass([showPassword.value ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed", "toggle-password"])}" data-v-ae8713d2></i></div></div><div class="form-group password-group" data-v-ae8713d2><label for="confirm-password" data-v-ae8713d2>Confirm your password*</label><div class="password-wrapper" data-v-ae8713d2><input${ssrRenderAttr("type", showConfirmPassword.value ? "text" : "password")} id="confirm-password"${ssrRenderDynamicModel(showConfirmPassword.value ? "text" : "password", form.value.confirmPassword, null)} placeholder="Re-enter your password" required data-v-ae8713d2><i class="${ssrRenderClass([showConfirmPassword.value ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed", "toggle-password"])}" data-v-ae8713d2></i></div></div><div class="form-group" data-v-ae8713d2><label for="invitation-code" data-v-ae8713d2>Invitation code</label><input type="text" id="invitation-code"${ssrRenderAttr("value", form.value.invitationCode)} readonly placeholder="Auto-generated" data-v-ae8713d2></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-ae8713d2>`);
      if (unref(loading)) {
        _push(`<i class="fas fa-spinner fa-spin mr-2" data-v-ae8713d2></i>`);
      } else {
        _push(`<!---->`);
      }
      _push(` Sign up </button></form><p class="register-link" data-v-ae8713d2> If you already have an account, `);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`log in`);
          } else {
            return [
              createTextVNode("log in")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`. </p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ae8713d2"]]);

export { register as default };
//# sourceMappingURL=register-DMseSo_b.mjs.map
