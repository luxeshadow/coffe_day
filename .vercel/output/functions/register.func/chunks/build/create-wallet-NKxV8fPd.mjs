import { _ as __nuxt_component_0 } from './nuxt-link-BO7K9PTb.mjs';
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
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

const walletApi = {
  createWallet: async (wallet) => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const { data, error } = await $supabase.from("wallets").insert([{
      id_user: user.id,
      password: wallet.password,
      telephone_withdrawls: wallet.telephone_withdrawls,
      methode_withdrawls: wallet.methode_withdrawls
    }]).select().single();
    if (error) throw error;
    return data;
  },
  getUserWallets: async () => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const { data, error } = await $supabase.from("wallets").select("*").eq("id_user", user.id).order("id", { ascending: false });
    if (error) throw error;
    return data;
  }
};
const walletService = {
  createWallet: (wallet) => walletApi.createWallet(wallet),
  getUserWallets: () => walletApi.getUserWallets()
};
const walletValidate = (wallet) => {
  if (!wallet.telephone_withdrawls || wallet.telephone_withdrawls.trim().length < 8 || !/^\d+$/.test(wallet.telephone_withdrawls)) {
    throw new Error("Le numéro de retrait est invalide (minimum 8 chiffres, uniquement des chiffres).");
  }
  if (!wallet.password || wallet.password.trim().length < 4) {
    throw new Error("Le mot de passe doit contenir au moins 4 caractères.");
  }
  if (!wallet.methode_withdrawls || !["flooz", "tmoney"].includes(wallet.methode_withdrawls)) {
    throw new Error("Veuillez sélectionner un moyen de retrait valide (TMoney ou Flooz).");
  }
  return true;
};
function useCreateWallet() {
  const loading = ref(false);
  const error = ref(null);
  const { $toast } = useNuxtApp();
  const createWallet2 = async (wallet) => {
    loading.value = true;
    error.value = null;
    try {
      walletValidate(wallet);
      const saved = await walletService.createWallet(wallet);
      $toast({
        text: "Portefeuille créé avec succès !",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
      });
      return saved;
    } catch (err) {
      if (err.message?.includes("duplicate key value") || err?.code === "23505") {
        error.value = "Vous avez déjà un portefeuille.";
      } else {
        error.value = err.message || "Erreur inconnue";
      }
      $toast({
        text: "Erreur : " + error.value,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };
  return { loading, error, createWallet: createWallet2 };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create-wallet",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const { loading } = useCreateWallet();
    const formData = reactive({
      methode_withdrawls: "",
      telephone_withdrawls: "",
      password: ""
    });
    reactive({
      methode_withdrawls: "",
      telephone_withdrawls: "",
      password: ""
    });
    const showPassword = ref(false);
    const paymentMethods = [
      { id: "flooz", name: "Moov Money", image: "/img/reseaux/moov.jpg" },
      { id: "tmoney", name: "T Money", image: "/img/reseaux/mix.jpg" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wallet-page" }, _attrs))} data-v-3bb4bb13><div class="wallet-container" data-v-3bb4bb13><div class="wallet-header" data-v-3bb4bb13><h2 class="wallet-title" data-v-3bb4bb13><i class="fas fa-wallet" data-v-3bb4bb13></i> Mon Portefeuille</h2><p class="wallet-subtitle" data-v-3bb4bb13>Configurez vos informations de retrait</p></div><form class="wallet-form" data-v-3bb4bb13><div class="wallet-form-group" data-v-3bb4bb13><label class="wallet-label" data-v-3bb4bb13><i class="fas fa-credit-card" data-v-3bb4bb13></i> Moyen de paiement</label><div class="wallet-payment-options" data-v-3bb4bb13><!--[-->`);
      ssrRenderList(paymentMethods, (method) => {
        _push(`<div class="${ssrRenderClass(["wallet-payment-option", { active: formData.methode_withdrawls === method.id }])}" data-v-3bb4bb13><img${ssrRenderAttr("src", method.image)}${ssrRenderAttr("alt", method.name)} class="wallet-img" data-v-3bb4bb13><div class="wallet-payment-name" data-v-3bb4bb13>${ssrInterpolate(method.name)}</div></div>`);
      });
      _push(`<!--]--></div></div><div class="wallet-form-group" data-v-3bb4bb13><label for="numero" class="wallet-label" data-v-3bb4bb13><i class="fas fa-phone" data-v-3bb4bb13></i> Numéro de retrait</label><input type="tel" id="numero"${ssrRenderAttr("value", formData.telephone_withdrawls)} class="wallet-input" placeholder="Ex: +22898765432" data-v-3bb4bb13></div><div class="wallet-form-group" data-v-3bb4bb13><label for="mdp_retrait" class="wallet-label" data-v-3bb4bb13><i class="fas fa-lock" data-v-3bb4bb13></i> Mot de passe de retrait</label><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")} id="mdp_retrait"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", formData.password, null)} class="wallet-input" placeholder="Mot de passe de retrait" data-v-3bb4bb13><button type="button" data-v-3bb4bb13>${ssrInterpolate(showPassword.value ? "Masquer" : "Afficher")}</button></div><button type="submit" class="wallet-submit-btn"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-3bb4bb13><i class="fas fa-save" data-v-3bb4bb13></i> ${ssrInterpolate(unref(loading) ? "Enregistrement..." : "Enregistrer")}</button></form>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/profile",
        class: "recharge-back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-arrow-left" data-v-3bb4bb13${_scopeId}></i>Retour au profil `);
          } else {
            return [
              createVNode("i", { class: "fas fa-arrow-left" }),
              createTextVNode("Retour au profil ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/create-wallet.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const createWallet = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3bb4bb13"]]);

export { createWallet as default };
//# sourceMappingURL=create-wallet-NKxV8fPd.mjs.map
