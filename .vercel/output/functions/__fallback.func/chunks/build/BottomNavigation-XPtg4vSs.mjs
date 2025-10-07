import { _ as __nuxt_component_0 } from './nuxt-link-BO7K9PTb.mjs';
import { mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = {
  __name: "BottomNavigation",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bottom-nav" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/home",
        class: "nav-item",
        "active-class": "active",
        exact: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="nav-icon"${_scopeId}><i class="fi fi-rr-house-blank"${_scopeId}></i></div><span${_scopeId}>Accueil</span>`);
          } else {
            return [
              createVNode("div", { class: "nav-icon" }, [
                createVNode("i", { class: "fi fi-rr-house-blank" })
              ]),
              createVNode("span", null, "Accueil")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/activity",
        class: "nav-item",
        "active-class": "active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="nav-icon"${_scopeId}><i class="fi fi-rr-recycle"${_scopeId}></i></div><span${_scopeId}>Recycler</span>`);
          } else {
            return [
              createVNode("div", { class: "nav-icon" }, [
                createVNode("i", { class: "fi fi-rr-recycle" })
              ]),
              createVNode("span", null, "Recycler")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/profile",
        class: "nav-item",
        "active-class": "active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="nav-icon"${_scopeId}><i class="fi fi-rr-user"${_scopeId}></i></div><span${_scopeId}>Profil</span>`);
          } else {
            return [
              createVNode("div", { class: "nav-icon" }, [
                createVNode("i", { class: "fi fi-rr-user" })
              ]),
              createVNode("span", null, "Profil")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BottomNavigation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=BottomNavigation-XPtg4vSs.mjs.map
