import { _ as __nuxt_component_0 } from './nuxt-link-BO7K9PTb.mjs';
import { _ as _sfc_main$1 } from './BottomNavigation-XPtg4vSs.mjs';
import { defineComponent, computed, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { c as useAuthStore, b as useNuxtApp } from './server.mjs';
import { u as useGainStore } from './gainStore-Ds-26nhl.mjs';
import { u as useGradeStore } from './gradeStore-hozZWqTP.mjs';
import { defineStore } from 'pinia';
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
import 'vue-router';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const referralApi = {
  // 🔹 Récupérer le code d’invitation de l’utilisateur connecté
  getMyInviteCode: async () => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const { data, error } = await $supabase.from("users").select("invitecode").eq("auth_id", user.id).single();
    if (error) throw error;
    return data?.invitecode || null;
  },
  // 🔹 Récupérer le lien de parrainage complet
  getReferralLink: async () => {
    const inviteCode = await referralApi.getMyInviteCode();
    return inviteCode ? `${(void 0).location.origin}/register?ref=${inviteCode}` : null;
  },
  getMyReferrals: async () => {
    const { $supabase } = useNuxtApp();
    const myInviteCode = await referralApi.getMyInviteCode();
    if (!myInviteCode) throw new Error("Aucun code de parrainage trouvé pour cet utilisateur");
    const { data, error } = await $supabase.from("users").select("id, user_name, phone, parent_invitecode").eq("parent_invitecode", myInviteCode);
    if (error) throw error;
    return data || [];
  }
};
const useReferralStore = defineStore("referralStore", {
  state: () => ({
    inviteCode: null,
    referralLink: null,
    referrals: [],
    // <- ici
    loading: false,
    error: null
  }),
  actions: {
    async loadReferralData() {
      this.loading = true;
      this.error = null;
      try {
        const saved = localStorage.getItem("referralData");
        if (saved) {
          const parsed = JSON.parse(saved);
          this.inviteCode = parsed.inviteCode || null;
          this.referralLink = parsed.referralLink || null;
          this.referrals = parsed.referrals || [];
        }
        const apiInviteCode = await referralApi.getMyInviteCode();
        this.inviteCode = apiInviteCode || null;
        this.referralLink = apiInviteCode ? `${(void 0).location.origin}/register?ref=${apiInviteCode}` : null;
        const apiReferrals = await referralApi.getMyReferrals() || [];
        this.referrals = Array.isArray(apiReferrals) ? apiReferrals : [];
        localStorage.setItem(
          "referralData",
          JSON.stringify({
            inviteCode: this.inviteCode,
            referralLink: this.referralLink,
            referrals: this.referrals
          })
        );
      } catch (err) {
        console.error("Erreur parrainage:", err);
        this.error = err.message || "Erreur chargement données de parrainage";
        this.referrals = [];
      } finally {
        this.loading = false;
      }
    },
    clearReferralData() {
      this.inviteCode = null;
      this.referralLink = null;
      this.referrals = [];
      localStorage.removeItem("referralData");
    }
  },
  getters: {
    referralCount: (state) => state.referrals.length,
    hasReferrals: (state) => state.referrals.length > 0
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const gainStore = useGainStore();
    const gradeStore = useGradeStore();
    const referralStore = useReferralStore();
    const { $toast } = useNuxtApp();
    const phone = computed(() => authStore.phone);
    const weeklyIncome = computed(() => gradeStore.dailyIncome * 7);
    const formatCurrency = (amount) => {
      const rounded = Math.floor(amount);
      return new Intl.NumberFormat("fr-FR", { style: "decimal" }).format(rounded) + " XOF";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_BottomNavigation = _sfc_main$1;
      _push(`<!--[--><div class="profil-header" data-v-65f57283><div class="profil-phone-number" data-v-65f57283>${ssrInterpolate(phone.value)}</div><div class="profil-grade" data-v-65f57283>${ssrInterpolate(unref(gradeStore).topGradeName ?? "Collect 0")}</div></div><div class="profil-container" data-v-65f57283><div class="profil-info-section" data-v-65f57283><div class="profil-info-icon" data-v-65f57283>i</div><div class="profil-info-text" data-v-65f57283> Gérez facilement votre compte pour suivre vos investissements, consulter vos gains et personnaliser vos paramètres en toute sécurité. </div></div><div class="profil-balance-card" data-v-65f57283><div class="profil-balance-amount" data-v-65f57283>${ssrInterpolate(formatCurrency(unref(gainStore).walletBalance))}</div><div class="profil-balance-label" data-v-65f57283>Solde disponible</div><div class="profil-stats-row" data-v-65f57283><div class="profil-stat-item" data-v-65f57283><div class="profil-stat-value" data-v-65f57283>${ssrInterpolate(formatCurrency(unref(gainStore).totalRecharges))}</div><div class="profil-stat-label" data-v-65f57283>Investis</div></div><div class="profil-stat-item" data-v-65f57283><div class="profil-stat-value" data-v-65f57283>${ssrInterpolate(formatCurrency(unref(gainStore).totalGradeGains))}</div><div class="profil-stat-label" data-v-65f57283>Gains</div></div></div></div><div class="profil-earnings-section" data-v-65f57283><div class="profil-earning-card" data-v-65f57283><div class="profil-earning-title" data-v-65f57283>Gains Journaliers</div><div class="profil-earning-amount" data-v-65f57283>${ssrInterpolate(formatCurrency(unref(gradeStore).dailyIncome))}</div></div><div class="profil-earning-card" data-v-65f57283><div class="profil-earning-title" data-v-65f57283>Gains Hebdomadaires</div><div class="profil-earning-amount weekly" data-v-65f57283>${ssrInterpolate(formatCurrency(weeklyIncome.value))}</div></div></div><div class="profil-actions-section" data-v-65f57283><h2 class="profil-section-title" data-v-65f57283><i class="fi fi-rr-bolt" data-v-65f57283></i> Actions Rapides </h2><div class="profil-action-grid" data-v-65f57283>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/recharge" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="profil-action-card" data-v-65f57283${_scopeId}><div class="profil-action-icon" data-v-65f57283${_scopeId}><i class="fi fi-rr-rotate-right" data-v-65f57283${_scopeId}></i></div><div class="profil-action-title" data-v-65f57283${_scopeId}>Recharge</div></div>`);
          } else {
            return [
              createVNode("div", { class: "profil-action-card" }, [
                createVNode("div", { class: "profil-action-icon" }, [
                  createVNode("i", { class: "fi fi-rr-rotate-right" })
                ]),
                createVNode("div", { class: "profil-action-title" }, "Recharge")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/retrait" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="profil-action-card" data-v-65f57283${_scopeId}><div class="profil-action-icon" data-v-65f57283${_scopeId}><i class="fi fi-rr-chart-mixed-up-circle-dollar" data-v-65f57283${_scopeId}></i></div><div class="profil-action-title" data-v-65f57283${_scopeId}>Retrait</div></div>`);
          } else {
            return [
              createVNode("div", { class: "profil-action-card" }, [
                createVNode("div", { class: "profil-action-icon" }, [
                  createVNode("i", { class: "fi fi-rr-chart-mixed-up-circle-dollar" })
                ]),
                createVNode("div", { class: "profil-action-title" }, "Retrait")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/create-wallet" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="profil-action-card" data-v-65f57283${_scopeId}><div class="profil-action-icon" data-v-65f57283${_scopeId}><i class="fi fi-rr-coins" data-v-65f57283${_scopeId}></i></div><div class="profil-action-title" data-v-65f57283${_scopeId}>Portefeuille</div></div>`);
          } else {
            return [
              createVNode("div", { class: "profil-action-card" }, [
                createVNode("div", { class: "profil-action-icon" }, [
                  createVNode("i", { class: "fi fi-rr-coins" })
                ]),
                createVNode("div", { class: "profil-action-title" }, "Portefeuille")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/history" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="profil-action-card" data-v-65f57283${_scopeId}><div class="profil-action-icon" data-v-65f57283${_scopeId}><i class="fi fi-rr-rectangle-history-circle-plus" data-v-65f57283${_scopeId}></i></div><div class="profil-action-title" data-v-65f57283${_scopeId}>Historique</div></div>`);
          } else {
            return [
              createVNode("div", { class: "profil-action-card" }, [
                createVNode("div", { class: "profil-action-icon" }, [
                  createVNode("i", { class: "fi fi-rr-rectangle-history-circle-plus" })
                ]),
                createVNode("div", { class: "profil-action-title" }, "Historique")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="referral-section" data-v-65f57283><div class="referral-card" data-v-65f57283><div class="referral-header" data-v-65f57283><i class="fi fi-rr-gift" data-v-65f57283></i><h3 data-v-65f57283>Votre lien de parrainage</h3></div><p class="referral-description" data-v-65f57283> Partagez votre lien avec vos amis et gagnez des récompenses pour chaque inscription validée. </p><div class="referral-link-container" data-v-65f57283><label class="referral-label" for="referralInput" data-v-65f57283>Lien à partager :</label><div class="referral-input-group" data-v-65f57283><input id="referralInput" class="referral-input" type="text"${ssrRenderAttr("value", unref(referralStore).loading ? "Chargement..." : unref(referralStore).referralLink)} readonly data-v-65f57283><button class="copy-button"${ssrIncludeBooleanAttr(unref(referralStore).loading) ? " disabled" : ""} data-v-65f57283><i class="fi fi-rr-copy" data-v-65f57283></i></button></div></div><div class="referral-benefits" data-v-65f57283><div style="${ssrRenderStyle({ "margin-bottom": "10px" })}" class="benefit-item" data-v-65f57283><i class="fi fi-rr-plus" data-v-65f57283></i> Vous avez parrainé ${ssrInterpolate(unref(referralStore).referralCount)}</div></div>`);
      if (unref(referralStore).referrals.length) {
        _push(`<div class="referral-users-box" data-v-65f57283><h4 class="referral-users-title" data-v-65f57283>Utilisateurs parrainés</h4><ul class="referral-users-list" data-v-65f57283><!--[-->`);
        ssrRenderList(unref(referralStore).referrals, (user, index) => {
          _push(`<li class="referral-user-item" data-v-65f57283><div class="referral-user-info" data-v-65f57283><span class="user-name" data-v-65f57283>${ssrInterpolate(user.user_name)}</span><span class="user-phone" data-v-65f57283>${ssrInterpolate(user.phone)}</span></div></li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<div class="no-referral-users" data-v-65f57283><p data-v-65f57283>Aucun utilisateur parrainé pour le moment.</p></div>`);
      }
      _push(`</div></div></div>`);
      _push(ssrRenderComponent(_component_BottomNavigation, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-65f57283"]]);

export { profile as default };
//# sourceMappingURL=profile-CAm2AQFt.mjs.map
