import { _ as __nuxt_component_0$1 } from './Header-CRfZVNOR.mjs';
import __nuxt_component_0$2 from './index-CYEr2IJN.mjs';
import { defineComponent, useSSRContext, ref, computed, mergeProps, unref, withCtx, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { _ as __nuxt_component_4 } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-BO7K9PTb.mjs';
import { e as publicAssetsURL } from '../_/nitro.mjs';
import { u as useGainStore } from './gainStore-Ds-26nhl.mjs';
import { _ as _sfc_main$6 } from './BottomNavigation-XPtg4vSs.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:fs';
import 'node:path';

const _sfc_main$5 = {
  __name: "Sliders",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const currentIndex = ref(0);
    const cards = ref([
      {
        title: "Découvrez notre nouveau café premium",
        description: "Une expérience sensorielle unique avec des arômes riches et une texture veloutée qui éveillera vos papilles.",
        buttonText: "Explorer maintenant"
      },
      {
        title: "Offre spéciale -20% sur tous les cafés",
        description: "Profitez de notre promotion exceptionnelle sur toute la gamme de cafés jusqu'à la fin du mois.",
        buttonText: "Profiter de l'offre"
      },
      {
        title: "Ateliers de dégustation chaque weekend",
        description: "Rejoignez-nous pour apprendre les subtilités de la dégustation de café avec nos experts.",
        buttonText: "Réserver une place"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "hero-carousel" }, _attrs))}><!--[-->`);
      ssrRenderList(cards.value, (card, index) => {
        _push(`<div class="${ssrRenderClass([{ active: currentIndex.value === index }, "hero-card"])}"><div class="hero-content"><h2 class="hero-title">${ssrInterpolate(card.title)}</h2><p class="hero-desc">${ssrInterpolate(card.description)}</p><button class="hero-button">${ssrInterpolate(card.buttonText)} `);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:arrow-right-solid",
          style: { "width": "16px", "height": "16px", "margin-left": "5px" }
        }, null, _parent));
        _push(`</button></div></div>`);
      });
      _push(`<!--]--><div class="carousel-control prev">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:chevron-left-solid",
        style: { "width": "20px", "height": "20px" }
      }, null, _parent));
      _push(`</div><div class="carousel-control next">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:chevron-right-solid",
        style: { "width": "20px", "height": "20px" }
      }, null, _parent));
      _push(`</div><div class="carousel-indicators"><!--[-->`);
      ssrRenderList(cards.value, (card, index) => {
        _push(`<div class="${ssrRenderClass([{ active: currentIndex.value === index }, "carousel-indicator"])}"></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sliders.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "StatGrid",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "stats-grid" }, _attrs))}><div class="stat-row"><div class="stat-card animate__animated animate__fadeIn"><div class="stat-item"><div class="stat-icon"><i class="fi fi-rr-users"></i></div><div class="stat-content"><div class="stat-value">2K</div><div class="stat-label">Participants</div></div></div></div><div class="stat-card animate__animated animate__fadeIn" style="${ssrRenderStyle({ "animation-delay": "0.1s" })}"><div class="stat-item"><div class="stat-icon"><i class="fi fi-rr-money-bill-wave"></i></div><div class="stat-content"><div class="stat-value">12M</div><div class="stat-label">XOF</div></div></div></div></div><div class="stat-row"><div class="stat-card animate__animated animate__fadeIn" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}"><div class="stat-item"><div class="stat-icon"><i class="fi fi-rr-coffee-pot"></i></div><div class="stat-content"><div class="stat-value">58K</div><div class="stat-label">Gobelets</div></div></div></div><div class="stat-card animate__animated animate__fadeIn" style="${ssrRenderStyle({ "animation-delay": "0.3s" })}"><div class="stat-item"><div class="stat-icon"><i class="fi fi-rr-tree"></i></div><div class="stat-content"><div class="stat-value">42T</div><div class="stat-label">CO₂</div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatGrid.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _imports_0 = publicAssetsURL("/img/coffee/coffee1.png");
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "GainCard",
  __ssrInlineRender: true,
  setup(__props) {
    const masked = ref(false);
    const gainStore = useGainStore();
    const walletBalanceFormatted = computed(() => {
      const amount = gainStore.walletBalance ?? 0;
      return Math.floor(amount).toLocaleString() + " XOF";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gain-card animate__animated animate__fadeInUp" }, _attrs))}><img${ssrRenderAttr("src", _imports_0)} alt="stake image" class="gain-stake-image"><div class="gain-content"><div class="gain-title"><i class="fi fi-rr-trophy"></i> Votre Gain </div><div class="gain-amount-container"><span class="gain-amount">`);
      if (unref(gainStore).loading) {
        _push(`<!--[-->Chargement...<!--]-->`);
      } else {
        _push(`<!--[-->${ssrInterpolate(masked.value ? "**** XOF" : walletBalanceFormatted.value)}<!--]-->`);
      }
      _push(`</span><button style="${ssrRenderStyle({ "margin-top": "-5px" })}" class="gain-mask-toggle">`);
      if (masked.value) {
        _push(`<i style="${ssrRenderStyle({ "margin-top": "4px" })}" class="fi fi-rr-eye"></i>`);
      } else {
        _push(`<i style="${ssrRenderStyle({ "margin-top": "4px" })}" class="fi fi-rr-eye-crossed"></i>`);
      }
      _push(`</button></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/retrait",
        class: "gain-button"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Retirer `);
          } else {
            return [
              createTextVNode(" Retirer ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(gainStore).error) {
        _push(`<div class="gain-error">${ssrInterpolate(unref(gainStore).error)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GainCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$3, { __name: "GainCard" });
const _sfc_main$2 = {
  __name: "Process",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div style="${ssrRenderStyle({ "margin-top": "10px" })}" class="section-title"><i class="fi fi-rr-process"></i> Comment ça marche </div><div class="process-scroll"><div class="process-card"><div class="process-icon"><i class="fi fi-rr-coffee-beans"></i></div><div class="process-name">Collectez</div><div class="process-desc">Rassemblez vos gobelets NESCAFÉ usagés</div></div><div class="process-card"><div class="process-icon"><i class="fi fi-rr-qrcode"></i></div><div class="process-name">Scannez</div><div class="process-desc">Utilisez l&#39;application pour scanner</div></div><div class="process-card"><div class="process-icon"><i class="fi fi-rr-gift"></i></div><div class="process-name">Gagnez</div><div class="process-desc">Recevez des récompenses instantanées</div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Process.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "Testimonial",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="section-title"><i class="fi fi-rr-comment"></i> Témoignages </div><div class="testimonial-scroll"><div class="testimonial-card"><div class="testimonial-text"> &quot;Recycler avec NESCAFÉ est simple et gratifiant. J&#39;ai déjà gagné 10 000 XOF !&quot; </div><div class="testimonial-author"><div class="author-avatar"><i class="fi fi-rr-user"></i></div><div class="author-name">Aminata K.</div></div></div><div class="testimonial-card"><div class="testimonial-text"> &quot;Cette initiative m&#39;a motivé à adopter des habitudes plus écologiques.&quot; </div><div class="testimonial-author"><div class="author-avatar"><i class="fi fi-rr-user"></i></div><div class="author-name">Kofi A.</div></div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Testimonial.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Header = __nuxt_component_0$1;
  const _component_Sliders = _sfc_main$5;
  const _component_StatGrid = _sfc_main$4;
  const _component_GainCard = __nuxt_component_3;
  const _component_ClientOnly = __nuxt_component_4;
  const _component_Process = _sfc_main$2;
  const _component_Testimonial = _sfc_main$1;
  const _component_BottomNavigation = _sfc_main$6;
  _push(`<!--[--><div class="main-content">`);
  _push(ssrRenderComponent(_component_Header, null, null, _parent));
  _push(ssrRenderComponent(_component_Sliders, null, null, _parent));
  _push(ssrRenderComponent(_component_StatGrid, null, null, _parent));
  _push(ssrRenderComponent(_component_GainCard, null, null, _parent));
  _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
  _push(ssrRenderComponent(_component_Process, null, null, _parent));
  _push(ssrRenderComponent(_component_Testimonial, null, null, _parent));
  _push(`</div>`);
  _push(ssrRenderComponent(_component_BottomNavigation, null, null, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const home = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { home as default };
//# sourceMappingURL=home-UBRrw_3O.mjs.map
