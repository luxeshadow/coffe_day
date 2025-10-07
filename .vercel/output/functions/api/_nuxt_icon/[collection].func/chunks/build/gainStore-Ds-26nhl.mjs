import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { b as useNuxtApp } from './server.mjs';

const gainApi = {
  getUserGains: async () => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const userId = user.id;
    const { data: rechargesData, error: rechargeError } = await $supabase.from("recharges").select("amount").eq("id_user", userId);
    if (rechargeError) throw rechargeError;
    const totalRecharges = rechargesData?.reduce((sum, r) => sum + Number(r.amount), 0) ?? 0;
    const { data: withdrawalsData, error: withdrawError } = await $supabase.from("withdrawls").select("amount").eq("id_user", userId);
    if (withdrawError) throw withdrawError;
    const totalWithdrawals = withdrawalsData?.reduce((sum, w) => sum + Number(w.amount), 0) ?? 0;
    const { data: userGrades, error: userGradesError } = await $supabase.from("assigne_user_grade").select("id_grade, date_creation").eq("id_user", userId);
    if (userGradesError) throw userGradesError;
    let totalGradeGains = 0;
    if (userGrades?.length) {
      const gradeIds = userGrades.map((g) => g.id_grade);
      const { data: gradesData, error: gradesError } = await $supabase.from("grades").select("id, daily_income").in("id", gradeIds);
      if (gradesError) throw gradesError;
      const gradeMap = /* @__PURE__ */ new Map();
      gradesData.forEach((g) => gradeMap.set(g.id, Number(g.daily_income)));
      const today = /* @__PURE__ */ new Date();
      userGrades.forEach((ug) => {
        const dailyIncome = gradeMap.get(ug.id_grade) ?? 0;
        const activationDate = new Date(ug.date_creation.replace(" ", "T"));
        const days = (today.getTime() - activationDate.getTime()) / (1e3 * 60 * 60 * 24);
        totalGradeGains += dailyIncome * days;
      });
    }
    const walletBalance = totalRecharges + totalGradeGains - totalWithdrawals;
    return {
      totalRecharges,
      totalWithdrawals,
      totalGradeGains,
      walletBalance
    };
  }
};
const useGainStore = defineStore("gain", () => {
  const totalRecharges = ref(parseFloat(localStorage.getItem("totalRecharges") || "0"));
  const totalWithdrawals = ref(parseFloat(localStorage.getItem("totalWithdrawals") || "0"));
  const totalGradeGains = ref(parseFloat(localStorage.getItem("totalGradeGains") || "0"));
  const walletBalance = ref(parseFloat(localStorage.getItem("walletBalance") || "0"));
  const loading = ref(false);
  const error = ref(null);
  watch(totalRecharges, (val) => localStorage.setItem("totalRecharges", val.toString()));
  watch(totalWithdrawals, (val) => localStorage.setItem("totalWithdrawals", val.toString()));
  watch(totalGradeGains, (val) => localStorage.setItem("totalGradeGains", val.toString()));
  watch(walletBalance, (val) => localStorage.setItem("walletBalance", val.toString()));
  const fetchUserGains = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await gainApi.getUserGains();
      totalRecharges.value = data.totalRecharges;
      totalWithdrawals.value = data.totalWithdrawals;
      totalGradeGains.value = data.totalGradeGains;
      walletBalance.value = data.walletBalance;
    } catch (err) {
      error.value = err.message || "Erreur lors de la récupération des gains";
    } finally {
      loading.value = false;
    }
  };
  const clearStore = () => {
    totalRecharges.value = 0;
    totalWithdrawals.value = 0;
    totalGradeGains.value = 0;
    walletBalance.value = 0;
    localStorage.removeItem("totalRecharges");
    localStorage.removeItem("totalWithdrawals");
    localStorage.removeItem("totalGradeGains");
    localStorage.removeItem("walletBalance");
  };
  return {
    totalRecharges,
    totalWithdrawals,
    totalGradeGains,
    walletBalance,
    loading,
    error,
    fetchUserGains,
    clearStore
  };
});

export { gainApi as g, useGainStore as u };
//# sourceMappingURL=gainStore-Ds-26nhl.mjs.map
