import { _ as __nuxt_component_0 } from './nuxt-link-BO7K9PTb.mjs';
import { defineComponent, reactive, mergeProps, unref, withCtx, createVNode, createTextVNode, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { b as useNuxtApp, d as useRuntimeConfig } from './server.mjs';
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
import 'vue-router';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const rechargeApi = {
  createRecharge: async (recharge2) => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const userId = user.id;
    const { data: existingRecharges, error: existingError } = await $supabase.from("recharges").select("id").eq("id_user", userId);
    if (existingError) throw existingError;
    if (!existingRecharges || existingRecharges.length === 0) {
      if (recharge2.amount < 1e4) {
        throw new Error("Le premier dépôt ne peut pas être inférieur à 10 000 XOF.");
      }
    }
    const { data, error } = await $supabase.from("recharges").insert([{
      id_user: userId,
      amount: recharge2.amount,
      phone: recharge2.phone,
      methode: recharge2.methode ?? null,
      reference: recharge2.reference ?? null,
      identifier: recharge2.identifier ?? null
    }]).select().single();
    if (error) throw error;
    return data;
  },
  // Récupérer toutes les recharges d’un utilisateur
  getUserRecharges: async () => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const userId = user.id;
    const { data, error } = await $supabase.from("recharges").select("*").eq("id_user", userId).order("id", { ascending: false });
    if (error) throw error;
    return data;
  }
};
const rechargeService = {
  createRecharge: async (recharge2) => {
    return rechargeApi.createRecharge(recharge2);
  },
  getUserRecharges: async () => {
    return rechargeApi.getUserRecharges();
  }
};
const rechargeValidate = (recharge2) => {
  if (!recharge2.phone || recharge2.phone.trim().length < 8) {
    throw new Error("Le numéro de téléphone est invalide (minimum 8 chiffres).");
  }
  if (!recharge2.amount || recharge2.amount < 1) {
    throw new Error("Le montant minimum est de 1 XOF.");
  }
  if (!recharge2.methode || !["tmoney", "flooz"].includes(recharge2.methode)) {
    throw new Error("Veuillez sélectionner une méthode de paiement valide (TMoney ou Flooz).");
  }
  return true;
};
const paygateService = {
  // Créer un paiement
  async createPayment(payload) {
    const config = useRuntimeConfig();
    const authToken = config.public.PAYGATE_KEY;
    const response = await fetch("https://paygateglobal.com/api/v1/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        ...payload,
        network: payload.network.toUpperCase()
      })
    });
    if (!response.ok) throw new Error(`Erreur PayGate: ${response.statusText}`);
    return await response.json();
  },
  // Vérifier le statut d'un paiement
  async checkPaymentStatus(tx_reference) {
    const config = useRuntimeConfig();
    const authToken = config.public.PAYGATE_KEY;
    const response = await fetch("https://paygateglobal.com/api/v1/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        tx_reference
      })
    });
    if (!response.ok) throw new Error(`Erreur vérification PayGate: ${response.statusText}`);
    return await response.json();
  }
};
function useRecharge() {
  const loading = ref(false);
  const error = ref(null);
  const { $toast } = useNuxtApp();
  const createRecharge = async ({
    phone,
    amount,
    paymentMethod
  }) => {
    loading.value = true;
    error.value = null;
    try {
      rechargeValidate({
        phone,
        amount,
        methode: paymentMethod
      });
      const identifier = `TX-${Date.now()}`;
      const paygateRes = await paygateService.createPayment({
        phone_number: phone,
        amount,
        network: paymentMethod === "flooz" ? "FLOOZ" : "TMONEY",
        description: "Recharge de compte",
        identifier
      });
      console.log("TX_REFERENCE PayGate:", paygateRes.tx_reference);
      if (!paygateRes.tx_reference) {
        throw new Error("tx_reference non reçu de PayGate");
      }
      await new Promise((resolve) => setTimeout(resolve, 3e4));
      const statusRes = await paygateService.checkPaymentStatus(String(paygateRes.tx_reference));
      console.log("Statut du paiement:", statusRes);
      if (statusRes.status !== 0) {
        throw new Error(statusRes.message || "Échec du paiement PayGate");
      }
      const recharge2 = {
        phone,
        amount,
        methode: paymentMethod,
        identifier,
        reference: paygateRes.tx_reference
      };
      const saved = await rechargeService.createRecharge(recharge2);
      $toast({
        text: "Recharge initiée avec succès !",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
      });
      return saved;
    } catch (err) {
      console.error("Erreur recharge :", err);
      error.value = err.message || "Erreur inconnue";
      $toast({
        text: "Erreur : " + (err.message || "Erreur inconnue"),
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };
  return { loading, error, createRecharge };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "recharge",
  __ssrInlineRender: true,
  setup(__props) {
    const { loading } = useRecharge();
    const formData = reactive({
      phone: "",
      amount: 1,
      paymentMethod: "tmoney"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "recharge-page" }, _attrs))} data-v-0df45458><div class="recharge-container" data-v-0df45458><div class="recharge-header" data-v-0df45458><h2 class="recharge-title" data-v-0df45458>Formulaire de Recharge</h2><p class="recharge-subtitle" data-v-0df45458> Rechargez votre compte en quelques étapes simples </p></div><form class="recharge-form" data-v-0df45458><div class="recharge-form-group" data-v-0df45458><label for="telephone" class="recharge-label" data-v-0df45458><i class="fi fi-rr-mobile-notch" data-v-0df45458></i> Numéro de téléphone </label><input type="tel" id="telephone"${ssrRenderAttr("value", formData.phone)} class="recharge-input" required pattern="[0-9]{8,15}" placeholder="Ex: 98765432" data-v-0df45458></div><div class="recharge-form-group" data-v-0df45458><label for="montant" class="recharge-label" data-v-0df45458><i class="fi fi-rr-send-money" data-v-0df45458></i> Montant à recharger </label><input type="number" id="montant"${ssrRenderAttr("value", formData.amount)} class="recharge-input" min="1" required placeholder="Entré montant à recharger" data-v-0df45458></div><div class="recharge-payment-methods" data-v-0df45458><h3 class="recharge-payment-title" data-v-0df45458><i class="fas fa-wallet" data-v-0df45458></i> Méthode de paiement </h3><div class="recharge-payment-options" data-v-0df45458><div class="${ssrRenderClass([{ active: formData.paymentMethod === "tmoney" }, "recharge-payment-option"])}" data-v-0df45458><i class="fas fa-mobile-alt" data-v-0df45458></i><span data-v-0df45458>TMoney</span></div><div class="${ssrRenderClass([{ active: formData.paymentMethod === "flooz" }, "recharge-payment-option"])}" data-v-0df45458><i class="fas fa-sim-card" data-v-0df45458></i><span data-v-0df45458>Flooz</span></div></div></div><button type="submit" class="recharge-submit-btn"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-0df45458><i class="fas fa-check-circle" data-v-0df45458></i> ${ssrInterpolate(unref(loading) ? "Traitement en cours..." : "Valider la recharge")}</button></form>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/profile",
        class: "recharge-back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-arrow-left" data-v-0df45458${_scopeId}></i>Retour au profil `);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/recharge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const recharge = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0df45458"]]);

export { recharge as default };
//# sourceMappingURL=recharge-BPzAUi0X.mjs.map
