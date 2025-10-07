import { _ as __nuxt_component_0 } from './nuxt-link-BO7K9PTb.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { u as useGainStore, g as gainApi } from './gainStore-Ds-26nhl.mjs';
import { useRouter } from 'vue-router';
import { b as useNuxtApp } from './server.mjs';
import { u as useGradeStore } from './gradeStore-hozZWqTP.mjs';
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

const withdrawlApi = {
  // Créer un retrait
  createWithdrawl: async (payload) => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const userId = user.id;
    const { data: wallet, error: walletError } = await $supabase.from("wallets").select("*").eq("id_user", userId).single();
    if (walletError || !wallet) throw new Error("Vous devez d’abord créer un wallet");
    if (wallet.password !== payload.password) throw new Error("Mot de passe du wallet incorrect");
    const userGains = await gainApi.getUserGains();
    if (payload.amount > userGains.walletBalance) throw new Error("Montant supérieur au solde disponible");
    const { data: assignedGrades, error: gradesError } = await $supabase.from("assigne_user_grade").select("id_grade, grades(daily_income)").eq("id_user", userId);
    if (gradesError || !assignedGrades || assignedGrades.length === 0) {
      throw new Error("Aucun grade assigné à l’utilisateur");
    }
    const maxGrade = assignedGrades.reduce((prev, curr) => {
      return curr.grades.daily_income > prev.grades.daily_income ? curr : prev;
    }, assignedGrades[0]);
    const minWithdraw = Number(maxGrade.grades.daily_income) * 10;
    if (payload.amount < minWithdraw) {
      throw new Error(`Le montant minimum pour un retrait est de ${minWithdraw}`);
    }
    const { data, error } = await $supabase.from("withdrawls").insert([{
      id_user: userId,
      amount: payload.amount,
      status: "En cours..."
    }]).select().single();
    if (error) throw error;
    return data;
  },
  // Récupérer tous les retraits de l'utilisateur
  getUserWithdrawls: async () => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const { data, error } = await $supabase.from("withdrawls").select("*").eq("id_user", user.id).order("id", { ascending: false });
    if (error) throw error;
    return data;
  },
  // Récupérer retraits payés
  getWithdrawlsPaid: async () => {
    const all = await withdrawlApi.getUserWithdrawls();
    return all.filter((w) => w.status === "payed");
  },
  // Récupérer retraits en attente
  getWithdrawlsPending: async () => {
    const all = await withdrawlApi.getUserWithdrawls();
    return all.filter((w) => w.status === "pending");
  },
  // Récupérer tous les retraits (pour admin)
  getAllWithdrawls: async () => {
    const { $supabase } = useNuxtApp();
    const { data, error } = await $supabase.from("withdrawls").select("*").order("id", { ascending: false });
    if (error) throw error;
    return data;
  }
};
class WithdrawlService {
  /**
   * Crée un nouveau retrait après validation
   */
  async createWithdrawl(formData) {
    return withdrawlApi.createWithdrawl({
      amount: formData.montant,
      password: formData.password
    });
  }
  async getUserWithdrawls() {
    return withdrawlApi.getUserWithdrawls();
  }
  async getWithdrawlsPaid() {
    return withdrawlApi.getWithdrawlsPaid();
  }
  async getWithdrawlsPending() {
    return withdrawlApi.getWithdrawlsPending();
  }
  async getAllWithdrawls() {
    return withdrawlApi.getAllWithdrawls();
  }
}
const WithdrawlService$1 = new WithdrawlService();
const validateWithdrawl = (formData) => {
  const gradeStore = useGradeStore();
  const errors = {};
  const minAmount = (gradeStore.dailyIncome ?? 0) * 10 || 0;
  if (formData.montant < minAmount) {
    errors.montant = `Le montant minimum de retrait pour votre grade est de ${minAmount} XOF`;
  }
  if (!formData.password || formData.password.length < 4) {
    errors.password = "Le mot de passe doit contenir au moins 4 caractères";
  }
  return errors;
};
function useCreateWithdrawl() {
  const loading = ref(false);
  const error = ref(null);
  const withdrawl = ref(null);
  const router = useRouter();
  const toast = useNuxtApp().$toast;
  const createWithdrawl = async (formData) => {
    loading.value = true;
    error.value = null;
    try {
      validateWithdrawl(formData);
      const created = await WithdrawlService$1.createWithdrawl({
        montant: formData.montant,
        password: formData.password
      });
      withdrawl.value = created;
      toast({
        text: `Votre demande de retrait de ${formData.montant.toLocaleString("fr-FR")} XOF est en cours ✅`,
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
      });
      router.push("/profile");
      return created;
    } catch (err) {
      console.error("Erreur création retrait :", err);
      const message = err.response?.data?.detail || err.message || "Erreur inconnue";
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
  return { loading, error, withdrawl, createWithdrawl };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "retrait",
  __ssrInlineRender: true,
  setup(__props) {
    const gainStore = useGainStore();
    const { loading } = useCreateWithdrawl();
    const formData = ref({ montant: null, password: "" });
    const showPassword = ref(false);
    const walletBalance = computed(() => gainStore.walletBalance);
    const formatCurrency = (amount) => `${Math.floor(amount)} XOF`;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "retrait-page" }, _attrs))} data-v-2bc67f7b><div class="retrait-container" data-v-2bc67f7b><div class="retrait-header" data-v-2bc67f7b><h2 class="retrait-title" data-v-2bc67f7b><i class="fas fa-wallet" data-v-2bc67f7b></i> Formulaire de Retrait </h2><p class="retrait-subtitle" data-v-2bc67f7b>Retirez vos gains en toute sécurité</p></div><div class="retrait-balance-info" data-v-2bc67f7b><div class="retrait-balance-label" data-v-2bc67f7b><i class="fi fi-rr-send-money" data-v-2bc67f7b></i> Solde disponible </div><div class="retrait-balance-amount" data-v-2bc67f7b>${ssrInterpolate(formatCurrency(walletBalance.value))}</div></div><form class="retrait-form" data-v-2bc67f7b><div class="retrait-form-group" data-v-2bc67f7b><label for="montant" class="retrait-label" data-v-2bc67f7b><i class="fi fi-rr-coins" data-v-2bc67f7b></i> Montant à retirer </label><input type="number" id="montant"${ssrRenderAttr("value", formData.value.montant)} class="retrait-input" required placeholder="Minimum En fonction du grade" data-v-2bc67f7b><div class="retrait-note" data-v-2bc67f7b><i class="fi fi-rr-info" data-v-2bc67f7b></i> Montant minimum : En fonction du grade </div></div><div class="retrait-form-group" data-v-2bc67f7b><label for="password" class="retrait-label" data-v-2bc67f7b><i class="fi fi-rr-lock" data-v-2bc67f7b></i> Mot de passe </label><input${ssrRenderAttr("type", showPassword.value ? "text" : "password")} id="password"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", formData.value.password, null)} class="retrait-input" required placeholder="Votre mot de passe" data-v-2bc67f7b></div><button type="submit" class="retrait-submit-btn"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-2bc67f7b><i class="fas fa-check-circle" data-v-2bc67f7b></i> ${ssrInterpolate(unref(loading) ? "Traitement en cours..." : "Valider le retrait")}</button></form>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/profile",
        class: "retrait-back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-arrow-left" data-v-2bc67f7b${_scopeId}></i> Retour au profil `);
          } else {
            return [
              createVNode("i", { class: "fas fa-arrow-left" }),
              createTextVNode(" Retour au profil ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/retrait.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const retrait = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2bc67f7b"]]);

export { retrait as default };
//# sourceMappingURL=retrait-Bn1WEDDj.mjs.map
