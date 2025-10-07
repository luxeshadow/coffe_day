import { _ as __nuxt_component_0 } from './Header-CRfZVNOR.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-BO7K9PTb.mjs';
import { defineComponent, ref, unref, withCtx, createBlock, createTextVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { u as useGradeStore } from './gradeStore-hozZWqTP.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as _sfc_main$2 } from './BottomNavigation-XPtg4vSs.mjs';
import 'vue-router';
import './server.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "InvestmentGrid",
  __ssrInlineRender: true,
  setup(__props) {
    const gradeStore = useGradeStore();
    const loadingGradesMap = ref(/* @__PURE__ */ new Set());
    const modalGrade = ref(null);
    const confirmActivateGrade = (grade) => {
      modalGrade.value = grade;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<!--[--><div class="info-sections" data-v-55ba5b52><div class="info-icon" data-v-55ba5b52>i</div><div class="info-text" data-v-55ba5b52> Investissez dans les initiatives écologiques NESCAFÉ et générez des revenus tout en soutenant le recyclage des gobelets. </div></div><div class="investment-grid" data-v-55ba5b52><!--[-->`);
      ssrRenderList(unref(gradeStore).grades, (grade) => {
        _push(`<div class="invest-card" data-v-55ba5b52><div class="card-image" data-v-55ba5b52><img${ssrRenderAttr("src", grade.img ?? "/img/coffee/boite2.png")}${ssrRenderAttr("alt", grade.grade_name)} data-v-55ba5b52></div><div class="card-content" data-v-55ba5b52><div class="invest-title" data-v-55ba5b52>Boite ${ssrInterpolate(grade.grade_name)}</div><div class="invest-details" data-v-55ba5b52><div class="invest-amount" data-v-55ba5b52><span class="invest-label" data-v-55ba5b52>Investissement:</span><span class="invest-value" data-v-55ba5b52>${ssrInterpolate(grade.amounts?.toLocaleString())} XOF</span></div><div class="invest-revenue" data-v-55ba5b52><span class="invest-label" data-v-55ba5b52>Revenus quotidiens:</span><span class="revenue-value" data-v-55ba5b52>${ssrInterpolate(grade.daily_income?.toLocaleString())} XOF</span></div></div>`);
        if (!unref(gradeStore).isGradeActivated(grade.id)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "#",
            class: "debut-button",
            onClick: ($event) => confirmActivateGrade(grade)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (loadingGradesMap.value.has(grade.id)) {
                  _push2(`<i class="fas fa-spinner fa-spin mr-2" data-v-55ba5b52${_scopeId}></i>`);
                } else {
                  _push2(`<i style="${ssrRenderStyle({ "margin-top": "4px" })}" class="fi fi-rr-play-circle" data-v-55ba5b52${_scopeId}></i>`);
                }
                _push2(` Activé `);
              } else {
                return [
                  loadingGradesMap.value.has(grade.id) ? (openBlock(), createBlock("i", {
                    key: 0,
                    class: "fas fa-spinner fa-spin mr-2"
                  })) : (openBlock(), createBlock("i", {
                    key: 1,
                    style: { "margin-top": "4px" },
                    class: "fi fi-rr-play-circle"
                  })),
                  createTextVNode(" Activé ")
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<div class="activated-badge" data-v-55ba5b52><i style="${ssrRenderStyle({ "margin-top": "2px" })}" class="fi fi-rr-badget-check-alt" data-v-55ba5b52></i> Actif... </div>`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div>`);
      if (modalGrade.value) {
        _push(`<div class="modal-overlay" data-v-55ba5b52><div class="modal-content" data-v-55ba5b52><h3 data-v-55ba5b52>Confirmer l&#39;activation</h3><p data-v-55ba5b52>Voulez-vous vraiment activer la boite <strong data-v-55ba5b52>${ssrInterpolate(modalGrade.value.grade_name)}</strong> ?</p><div class="modal-actions" data-v-55ba5b52><button class="btn-cancel" data-v-55ba5b52>Non</button><button class="btn-confirm" data-v-55ba5b52>Oui</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InvestmentGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-55ba5b52"]]), { __name: "InvestmentGrid" });
const _sfc_main = {
  __name: "activity",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = __nuxt_component_0;
      const _component_InvestmentGrid = __nuxt_component_1;
      const _component_BottomNavigation = _sfc_main$2;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Header, null, null, _parent));
      _push(ssrRenderComponent(_component_InvestmentGrid, null, null, _parent));
      _push(ssrRenderComponent(_component_BottomNavigation, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/activity.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=activity-CrZuF_sp.mjs.map
