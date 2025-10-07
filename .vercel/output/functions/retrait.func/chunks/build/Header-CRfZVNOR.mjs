import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { b as useNuxtApp } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const notificationApi = {
  // ➕ Créer une notification
  createNotification: async (notification) => {
    const { $supabase } = useNuxtApp();
    const { data, error } = await $supabase.from("notification").insert([{ texte: notification.texte, type: notification.type || "info" }]).select().single();
    if (error) throw error;
    return data;
  },
  // 🔁 Récupérer toutes les notifications
  getNotifications: async () => {
    const { $supabase } = useNuxtApp();
    const { data, error } = await $supabase.from("notification").select("*").order("id", { ascending: false });
    if (error) throw error;
    return data;
  }
};
function notificationValidate(notification) {
  if (!notification.texte || notification.texte.trim().length === 0) {
    throw new Error("Le texte de la notification est obligatoire.");
  }
  if (notification.type && !["alert", "info"].includes(notification.type)) {
    throw new Error("Le statut de la notification est invalide.");
  }
}
class NotificationService {
  async createNotification(notification) {
    notificationValidate(notification);
    return notificationApi.createNotification(notification);
  }
  // 🔁 Récupérer toutes les notifications
  async getNotifications() {
    return notificationApi.getNotifications();
  }
}
const notificationService = new NotificationService();
function useListNotification() {
  const notifications = ref([]);
  const error = ref(null);
  const loading = ref(false);
  const loadNotifications = async () => {
    loading.value = true;
    try {
      const data = await notificationService.getNotifications();
      notifications.value = data;
    } catch (err) {
      console.error("Erreur lors du chargement des notifications :", err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  return {
    notifications,
    loadNotifications,
    error,
    loading
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const dropdownOpen = ref(false);
    const notifModalOpen = ref(false);
    useRouter();
    const { notifications } = useListNotification();
    const unreadCount = computed(() => {
      const list = notifications.value ?? [];
      return list.filter((n) => n.type?.toLowerCase() === "info").length;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-header" }, _attrs))} data-v-7ce15186><div class="header-left" data-v-7ce15186><i style="${ssrRenderStyle({ "font-size": "32px" })}" class="fi fi-rr-coffee" data-v-7ce15186></i><div class="header-logo" data-v-7ce15186><span data-v-7ce15186>EcoNest</span></div></div><div class="header-right" data-v-7ce15186><div class="header-icon notif" data-v-7ce15186><i class="fi fi-rr-bell" data-v-7ce15186></i>`);
      if (unreadCount.value > 0) {
        _push(`<span class="notif-badge" data-v-7ce15186>${ssrInterpolate(unreadCount.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="header-icon user-menu" data-v-7ce15186><i class="fi fi-rr-user" data-v-7ce15186></i>`);
      if (dropdownOpen.value) {
        _push(`<div class="dropdown desktop" data-v-7ce15186><ul data-v-7ce15186><li data-v-7ce15186>Mon profil</li><li class="logout" data-v-7ce15186>Déconnexion</li></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      if (dropdownOpen.value) {
        _push(`<div class="dropdown mobile" data-v-7ce15186><div class="dropdown-header" data-v-7ce15186><span data-v-7ce15186>Menu utilisateur</span><button data-v-7ce15186>✖</button></div><ul data-v-7ce15186><li data-v-7ce15186>Mon profil</li><li class="logout" data-v-7ce15186>Déconnexion</li></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (notifModalOpen.value) {
        _push(`<div class="notif-modal" data-v-7ce15186><div class="notif-modal-content" data-v-7ce15186><div class="notif-modal-header" data-v-7ce15186><h3 data-v-7ce15186>Notifications</h3><button data-v-7ce15186>✖</button></div><ul data-v-7ce15186><!--[-->`);
        ssrRenderList(unref(notifications), (notif) => {
          _push(`<li data-v-7ce15186>${ssrInterpolate(notif.type)}</li>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(unref(notifications), (notif) => {
          _push(`<li data-v-7ce15186>${ssrInterpolate(notif.texte)}</li>`);
        });
        _push(`<!--]-->`);
        if (!(unref(notifications).length > 0)) {
          _push(`<li data-v-7ce15186>Aucune notification</li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-7ce15186"]]), { __name: "Header" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=Header-CRfZVNOR.mjs.map
