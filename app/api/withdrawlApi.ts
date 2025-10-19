import { useNuxtApp } from "#app";
import gainApi from "./gainApi";

interface Withdrawl {
  id: number;
  id_user: string;
  amount: number;
  status: string;
}

interface CreateWithdrawlPayload {
  amount: number;
  password: string;
}

const withdrawlApi = {
  // Créer un retrait
  createWithdrawl: async (
    payload: CreateWithdrawlPayload
  ): Promise<Withdrawl> => {
    const { $supabase } = useNuxtApp();

    // Récupérer l'utilisateur
    const {
      data: { user },
      error: userError,
    } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");
    const userId = user.id;

    // Vérifier existence du wallet
    const { data: wallet, error: walletError } = await $supabase
      .from("wallets")
      .select("*")
      .eq("id_user", userId)
      .single();

    if (walletError || !wallet)
      throw new Error("Vous devez d’abord créer un wallet");

    // Vérifier mot de passe du wallet
    if (wallet.password !== payload.password)
      throw new Error("Mot de passe du wallet incorrect");

    // Vérifier le solde via gainApi
    const userGains = await gainApi.getUserGains();
    if (payload.amount > userGains.walletBalance)
      throw new Error("Montant supérieur au solde disponible");

    // --- Vérifier grade et retrait minimum ---
    // On récupère tous les grades assignés et prend celui avec daily_income le plus élevé
    const { data: assignedGrades, error: gradesError } = await $supabase
      .from("assigne_user_grade")
      .select("id_grade, grades(daily_income)")
      .eq("id_user", userId);

    if (gradesError || !assignedGrades || assignedGrades.length === 0) {
      throw new Error("Aucun grade assigné à l’utilisateur");
    }

    // Trouver le grade avec daily_income le plus élevé
    const maxGrade = assignedGrades.reduce((prev, curr) => {
      return curr.grades.daily_income > prev.grades.daily_income ? curr : prev;
    }, assignedGrades[0]);

    const minWithdraw = Number(maxGrade.grades.daily_income) * 10;
    if (payload.amount < minWithdraw) {
      throw new Error(
        `Votre grade autorise un retrait minimum de ${minWithdraw}`
      );
    }
    // --- FIN VERIFICATION ---

    // Créer le retrait
    const { data, error } = await $supabase
      .from("withdrawls")
      .insert([
        {
          id_user: userId,
          amount: payload.amount,
          status: "En cours...",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Withdrawl;
  },

  // Récupérer tous les retraits de l'utilisateur
  getUserWithdrawls: async (): Promise<Withdrawl[]> => {
    const { $supabase } = useNuxtApp();
    const {
      data: { user },
      error: userError,
    } = await $supabase.auth.getUser();
    if (userError || !user) throw new Error("Utilisateur non authentifié");

    const { data, error } = await $supabase
      .from("withdrawls")
      .select("*")
      .eq("id_user", user.id)
      .order("id", { ascending: false });

    if (error) throw error;
    return data as Withdrawl[];
  },

  // Récupérer tous les retraits (pour admin)
  getAllWithdrawls: async (): Promise<Withdrawl[]> => {
    const { $supabase } = useNuxtApp();
    const { data, error } = await $supabase
      .from("withdrawls")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;
    return data as Withdrawl[];
  },
};

export default withdrawlApi;
