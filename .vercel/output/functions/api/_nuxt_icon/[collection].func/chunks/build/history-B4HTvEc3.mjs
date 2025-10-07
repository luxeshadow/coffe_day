import { _ as __nuxt_component_0 } from './Header-CRfZVNOR.mjs';
import { defineComponent, ref, computed, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { defineStore } from 'pinia';
import { b as useNuxtApp } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'vue-router';
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
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const historyApi = {
  // ✅ Recharges de l'utilisateur connecté
  getUserRecharges: async () => {
    const { $supabase } = useNuxtApp();
    const { data: userData, error: userError } = await $supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error("Utilisateur non connecté");
    }
    const userId = userData.user.id;
    const { data, error } = await $supabase.from("recharges").select("*").eq("id_user", userId).order("id", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  // ✅ Retraits de l'utilisateur connecté
  getUserWithdrawls: async () => {
    const { $supabase } = useNuxtApp();
    const { data: userData, error: userError } = await $supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error("Utilisateur non connecté");
    }
    const userId = userData.user.id;
    const { data, error } = await $supabase.from("withdrawls").select("*").eq("id_user", userId).order("id", { ascending: false });
    if (error) throw error;
    return data || [];
  }
};
const historyService = {
  getUserRecharges: async () => {
    return historyApi.getUserRecharges();
  },
  getUserWithdrawls: async () => {
    return historyApi.getUserWithdrawls();
  }
};
const useHistoryStore = defineStore("history", () => {
  const recharges = ref([]);
  const withdrawls = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const fetchRecharges = async () => {
    loading.value = true;
    error.value = null;
    try {
      recharges.value = await historyService.getUserRecharges();
    } catch (err) {
      error.value = err.message || "Erreur lors de la récupération des recharges";
    } finally {
      loading.value = false;
    }
  };
  const fetchWithdrawls = async () => {
    loading.value = true;
    error.value = null;
    try {
      withdrawls.value = await historyService.getUserWithdrawls();
    } catch (err) {
      error.value = err.message || "Erreur lors de la récupération des retraits";
    } finally {
      loading.value = false;
    }
  };
  return {
    recharges,
    withdrawls,
    loading,
    error,
    fetchRecharges,
    fetchWithdrawls
  };
});
function useListeHistory() {
  const historyStore = useHistoryStore();
  const loading = ref(false);
  const error = ref(null);
  const fetchHistory = async () => {
    if (historyStore.recharges.length && historyStore.withdrawls.length) return;
    loading.value = true;
    error.value = null;
    try {
      await Promise.all([
        historyStore.fetchRecharges(),
        historyStore.fetchWithdrawls()
      ]);
    } catch (err) {
      error.value = err.message || "Erreur lors du chargement de l’historique";
    } finally {
      loading.value = false;
    }
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const allOperations = computed(() => {
    const rechargesOps = historyStore.recharges.map((r) => ({
      type: "Recharge",
      info: r.methode ? `Via ${r.methode}` : "Via Mobile Money",
      date: formatDate(r.created_at || ""),
      amount: r.amount,
      status: "Réussi"
      // texte fixe pour les recharges
    }));
    const withdrawOps = historyStore.withdrawls.map((w) => ({
      type: "Retrait",
      info: w.telephone_withdrawls ? `Vers ${w.telephone_withdrawls}` : "xxxx",
      date: formatDate(w.created_at || ""),
      amount: -w.amount,
      status: w.status
      // statut réel pour les retraits
    }));
    return [...rechargesOps, ...withdrawOps].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });
  return {
    loading,
    error,
    fetchHistory,
    allOperations
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "history",
  __ssrInlineRender: true,
  setup(__props) {
    const activeFilter = ref("all");
    const { allOperations, loading, error } = useListeHistory();
    const filteredOperations = computed(() => {
      if (activeFilter.value === "recharge") return allOperations.value.filter((op) => op.type.toLowerCase() === "recharge");
      if (activeFilter.value === "retrait") return allOperations.value.filter((op) => op.type.toLowerCase() === "retrait");
      return allOperations.value;
    });
    const formatAmount = (amount) => new Intl.NumberFormat("fr-FR").format(Math.abs(amount));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = __nuxt_component_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Header, null, null, _parent));
      _push(`<div class="history-container" data-v-e21b8c6b><div class="history-header" data-v-e21b8c6b><div class="filter-options" data-v-e21b8c6b><button class="${ssrRenderClass([{ active: activeFilter.value === "all" }, "filter-btn"])}" data-v-e21b8c6b>Tous</button><button class="${ssrRenderClass([{ active: activeFilter.value === "recharge" }, "filter-btn"])}" data-v-e21b8c6b>Recharges</button><button class="${ssrRenderClass([{ active: activeFilter.value === "retrait" }, "filter-btn"])}" data-v-e21b8c6b>Retraits</button></div></div>`);
      if (!unref(loading) && filteredOperations.value.length) {
        _push(`<ul class="history-list" data-v-e21b8c6b><!--[-->`);
        ssrRenderList(filteredOperations.value, (op, index) => {
          _push(`<li class="${ssrRenderClass([op.type.toLowerCase(), "history-item"])}" data-v-e21b8c6b><div class="history-content" data-v-e21b8c6b><span class="${ssrRenderClass([op.type.toLowerCase(), "history-type"])}" data-v-e21b8c6b>${ssrInterpolate(op.type)}</span><span class="history-info" data-v-e21b8c6b>${ssrInterpolate(op.info)}</span><span class="history-date" data-v-e21b8c6b>${ssrInterpolate(op.date)}</span>`);
          if (op.status) {
            _push(`<span style="${ssrRenderStyle({ "margin-left": "5px" })}" class="${ssrRenderClass([op.status, "history-status"])}" data-v-e21b8c6b>${ssrInterpolate(op.status)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="${ssrRenderClass([op.amount > 0 ? "positive" : "negative", "history-amount"])}" data-v-e21b8c6b>${ssrInterpolate(op.amount > 0 ? "+" : "")}${ssrInterpolate(formatAmount(op.amount))} XOF </span></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="history-loading" data-v-e21b8c6b><i class="fas fa-spinner fa-spin" data-v-e21b8c6b></i> Chargement de l&#39;historique... </div>`);
      } else if (!filteredOperations.value.length) {
        _push(`<div class="history-empty" data-v-e21b8c6b><i class="fas fa-receipt" data-v-e21b8c6b></i><p data-v-e21b8c6b>Aucune opération pour le moment.</p><small data-v-e21b8c6b>Vos transactions apparaîtront ici</small></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(error)) {
        _push(`<div class="history-error" data-v-e21b8c6b>${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/history.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const history = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e21b8c6b"]]);

export { history as default };
//# sourceMappingURL=history-B4HTvEc3.mjs.map
