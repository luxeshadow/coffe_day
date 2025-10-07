import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { b as useNuxtApp } from './server.mjs';

const gradeApi = {
  createGrade: async (grade) => {
    const { $supabase } = useNuxtApp();
    const { data, error } = await $supabase.from("grades").insert([{
      grade_name: grade.grade_name,
      amounts: grade.amounts ?? 0,
      daily_income: grade.daily_income ?? 0,
      description: grade.description ?? null
    }]).select().single();
    if (error) throw error;
    return data;
  },
  assignGradeToUser: async (id_grade) => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const { data, error } = await $supabase.from("assigne_user_grade").insert([{
      id_user: user.id,
      id_grade
    }]).select().single();
    if (error) throw error;
    return data;
  },
  getAllGrades: async () => {
    const { $supabase } = useNuxtApp();
    const { data, error } = await $supabase.from("grades").select("*").order("id", { ascending: true });
    if (error) throw error;
    return data;
  },
  getUserGrades: async () => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const { data, error } = await $supabase.from("assigne_user_grade").select("id_grade, grades(*)").eq("id_user", user.id);
    if (error) throw error;
    if (!data) return [];
    return data.map((row) => row.grades);
  },
  getUserDailyIncomeAndTopGrade: async () => {
    const { $supabase } = useNuxtApp();
    const { data: { user }, error: userError } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const { data: assignedGrades, error } = await $supabase.from("assigne_user_grade").select("id_grade, grades(*)").eq("id_user", user.id);
    if (error) throw error;
    if (!assignedGrades || assignedGrades.length === 0) {
      return { dailyIncome: 0, topGradeName: null };
    }
    const grades = assignedGrades.map((row) => row.grades);
    const dailyIncome = grades.reduce((sum, g) => sum + (g.daily_income ?? 0), 0);
    const topGrade = grades.reduce((prev, curr) => {
      return (curr.daily_income ?? 0) > (prev.daily_income ?? 0) ? curr : prev;
    }, grades[0]);
    return {
      dailyIncome,
      topGradeName: topGrade.grade_name
    };
  }
};
const gradeCreateValidate = (grade) => {
  if (!grade.grade_name || grade.grade_name.trim().length < 2) {
    throw new Error("Le nom du grade est requis (au moins 2 caractères).");
  }
  if (grade.amounts !== void 0 && (isNaN(grade.amounts) || grade.amounts < 0)) {
    throw new Error("Le montant doit être un nombre positif.");
  }
  if (grade.description && grade.description.trim().length < 5) {
    throw new Error("La description doit contenir au moins 5 caractères si elle est renseignée.");
  }
  return true;
};
const gradeAssignValidate = (payload) => {
  if (!payload.id_grade || isNaN(payload.id_grade)) {
    throw new Error("Un grade valide est requis pour l’assignation.");
  }
  if (payload.id_grade <= 0) {
    throw new Error("L'identifiant du grade doit être un entier positif.");
  }
  return true;
};
class GradeService {
  async createGrade(grade) {
    gradeCreateValidate(grade);
    return gradeApi.createGrade(grade);
  }
  async assignGradeToUser(id_grade) {
    gradeAssignValidate({ id_grade });
    return gradeApi.assignGradeToUser(id_grade);
  }
  async getAllGrades() {
    return gradeApi.getAllGrades();
  }
  async getUserGrades() {
    return gradeApi.getUserGrades();
  }
  async getUserDailyIncomeAndTopGrade() {
    return gradeApi.getUserDailyIncomeAndTopGrade();
  }
}
const GradeService$1 = new GradeService();
const useGradeStore = defineStore("gradeStore", () => {
  const grades = ref(JSON.parse(localStorage.getItem("grades") || "[]"));
  const userGrades = ref(JSON.parse(localStorage.getItem("userGrades") || "[]"));
  const dailyIncome = ref(parseFloat(localStorage.getItem("dailyIncome") || "0"));
  const topGradeName = ref(localStorage.getItem("topGradeName") || null);
  const loading = ref(false);
  const error = ref(null);
  watch(grades, (val) => localStorage.setItem("grades", JSON.stringify(val)), { deep: true });
  watch(userGrades, (val) => localStorage.setItem("userGrades", JSON.stringify(val)), { deep: true });
  watch(dailyIncome, (val) => localStorage.setItem("dailyIncome", val.toString()));
  watch(topGradeName, (val) => val ? localStorage.setItem("topGradeName", val) : localStorage.removeItem("topGradeName"));
  const fetchGrades = async () => {
    if (grades.value.length) return;
    loading.value = true;
    error.value = null;
    try {
      const response = await GradeService$1.getAllGrades();
      grades.value = response.data ?? response;
    } catch (err) {
      error.value = err.message || "Erreur inconnue";
    } finally {
      loading.value = false;
    }
  };
  const fetchUserGrades = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await GradeService$1.getUserGrades();
      userGrades.value = response;
    } catch (err) {
      error.value = err.message || "Erreur inconnue";
    } finally {
      loading.value = false;
    }
  };
  const fetchUserDailyIncome = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await GradeService$1.getUserDailyIncomeAndTopGrade();
      dailyIncome.value = response.dailyIncome;
      topGradeName.value = response.topGradeName;
    } catch (err) {
      error.value = err.message || "Erreur inconnue";
      dailyIncome.value = 0;
      topGradeName.value = null;
    } finally {
      loading.value = false;
    }
  };
  const isGradeActivated = (id_grade) => {
    return userGrades.value.some((g) => g.id === id_grade);
  };
  const clearStore = () => {
    grades.value = [];
    userGrades.value = [];
    dailyIncome.value = 0;
    topGradeName.value = null;
    localStorage.removeItem("grades");
    localStorage.removeItem("userGrades");
    localStorage.removeItem("dailyIncome");
    localStorage.removeItem("topGradeName");
  };
  return {
    grades,
    userGrades,
    dailyIncome,
    topGradeName,
    loading,
    error,
    fetchGrades,
    fetchUserGrades,
    fetchUserDailyIncome,
    isGradeActivated,
    clearStore
  };
});

export { useGradeStore as u };
//# sourceMappingURL=gradeStore-hozZWqTP.mjs.map
