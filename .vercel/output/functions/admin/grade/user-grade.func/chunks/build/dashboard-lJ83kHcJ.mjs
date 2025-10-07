import { _ as __nuxt_component_0 } from './nuxt-link-BO7K9PTb.mjs';
import { ref, computed, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
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
import './server.mjs';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const pageTitle = "Tableau de Bord";
const _sfc_main = {
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const isSidebarOpen = ref(false);
    const openDropdown = ref(null);
    const closeSidebar = () => {
      isSidebarOpen.value = false;
    };
    const closeSidebarOnMobile = () => {
      if ((void 0).innerWidth < 768) closeSidebar();
    };
    const toggleDropdown = (dropdown) => {
      openDropdown.value = openDropdown.value === dropdown ? null : dropdown;
    };
    const sidebarClasses = computed(() => ({ "sidebar-open": isSidebarOpen.value }));
    const gestionSubmenuClasses = computed(() => ({
      submenu: true,
      active: openDropdown.value === "gestion"
    }));
    const gestionDropdownClasses = computed(() => [
      "fas",
      openDropdown.value === "gestion" ? "fa-chevron-up" : "fa-chevron-down",
      "text-sm"
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-container" }, _attrs))}><aside id="sidebar" class="${ssrRenderClass(sidebarClasses.value)}"><div class="sidebar-header flex items-center justify-between"><div class="flex items-center space-x-3"><img src="https://i.postimg.cc/kGXgkBsQ/ceet.jpg" alt="CEET" class="w-8 h-8 object-contain"><span>EcoBoost</span></div><button class="close-sidebar"><i class="fas fa-times"></i></button></div><div class="nav-dasho"><ul class="space-y-1-dash"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/role",
        class: "flex items-center",
        onClick: closeSidebarOnMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fi fi-rr-chart-kanban"${_scopeId}></i> Statistiques `);
          } else {
            return [
              createVNode("i", { class: "fi fi-rr-chart-kanban" }),
              createTextVNode(" Statistiques ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li><button class="flex items-center justify-between w-full"><span><i class="fi fi-rr-function-process"></i> Gestion Ressources</span><i class="${ssrRenderClass(gestionDropdownClasses.value)}"></i></button><ul class="${ssrRenderClass(gestionSubmenuClasses.value)}"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/role",
        class: "flex items-center",
        onClick: closeSidebarOnMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-plus mr-3 text-sm"${_scopeId}></i> Gestion des Utilisateur `);
          } else {
            return [
              createVNode("i", { class: "fas fa-plus mr-3 text-sm" }),
              createTextVNode(" Gestion des Utilisateur ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/role",
        class: "flex items-center",
        onClick: closeSidebarOnMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-plus mr-3 text-sm"${_scopeId}></i> Gestion des Retrais `);
          } else {
            return [
              createVNode("i", { class: "fas fa-plus mr-3 text-sm" }),
              createTextVNode(" Gestion des Retrais ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/role",
        class: "flex items-center",
        onClick: closeSidebarOnMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-plus mr-3 text-sm"${_scopeId}></i> Gestion Rôles `);
          } else {
            return [
              createVNode("i", { class: "fas fa-plus mr-3 text-sm" }),
              createTextVNode(" Gestion Rôles ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/role",
        class: "flex items-center",
        onClick: closeSidebarOnMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-plus mr-3 text-sm"${_scopeId}></i> Gestion des Grade `);
          } else {
            return [
              createVNode("i", { class: "fas fa-plus mr-3 text-sm" }),
              createTextVNode(" Gestion des Grade ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/role",
        class: "flex items-center",
        onClick: closeSidebarOnMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-plus mr-3 text-sm"${_scopeId}></i> Gestion des Avatar `);
          } else {
            return [
              createVNode("i", { class: "fas fa-plus mr-3 text-sm" }),
              createTextVNode(" Gestion des Avatar ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/role",
        class: "flex items-center",
        onClick: closeSidebarOnMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-plus mr-3 text-sm"${_scopeId}></i> Gestion des Notification `);
          } else {
            return [
              createVNode("i", { class: "fas fa-plus mr-3 text-sm" }),
              createTextVNode(" Gestion des Notification ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/role",
        class: "flex items-center",
        onClick: closeSidebarOnMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fi fi-rr-user"${_scopeId}></i> Assets `);
          } else {
            return [
              createVNode("i", { class: "fi fi-rr-user" }),
              createTextVNode(" Assets ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></aside>`);
      if (isSidebarOpen.value) {
        _push(`<div class="backdrop"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div id="main-content" class="${ssrRenderClass([sidebarClasses.value, "main-content"])}"><header><div class="header-container"><div class="header-inner"><div class="flex items-center space-x-3"><button class="menu-toggle"></button></div><span class="mone">${ssrInterpolate(pageTitle)}</span><div class="header-actions"><div class="relative"><button class="notification-btn"><i class="fi fi-rr-messages"></i><span class="notification-badge">3</span></button></div><div class="user-menu"><button class="user-btn"><i class="fi fi-rr-admin-alt"></i></button><div class="${ssrRenderClass([{ "user-dropdown-active": openDropdown.value === "profile" }, "user-dropdown"])}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/profile",
        class: "flex items-center",
        onClick: ($event) => toggleDropdown(null)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-user-edit mr-2"${_scopeId}></i> Modifier mon profil `);
          } else {
            return [
              createVNode("i", { class: "fas fa-user-edit mr-2" }),
              createTextVNode(" Modifier mon profil ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="#" class="user-deconnexion"><i class="fas fa-sign-out-alt mr-2"></i> Déconnexion </a></div></div></div></div></div></header><main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-lJ83kHcJ.mjs.map
