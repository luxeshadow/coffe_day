import { c as useAuthStore, b as useNuxtApp } from './server.mjs';

const authApi = {
  // -------------------- REGISTER --------------------
  register: async (user) => {
    const { $supabase } = useNuxtApp();
    const phoneWithoutCode = user.phone.replace(/^\+\d{1,3}/, "");
    const email = phoneWithoutCode + "@dummy.com";
    const { data: authData, error: authError } = await $supabase.auth.signUp({
      email,
      password: user.password,
      options: {
        data: {
          phone: user.phone,
          parent_invitecode: user.parent_invitecode
        }
      }
    });
    if (authError) throw authError;
    if (!authData.user) throw new Error("Utilisateur non créé dans Supabase Auth");
    const { error: insertError } = await $supabase.from("users").insert([{
      auth_id: authData.user.id,
      // <-- lien avec Supabase Auth
      user_name: user.user_name,
      phone: user.phone,
      parent_invitecode: user.parent_invitecode
    }]);
    if (insertError) throw insertError;
    return authData;
  },
  // -------------------- LOGIN --------------------
  login: async (phone, password) => {
    const { $supabase } = useNuxtApp();
    const phoneWithoutCode = phone.replace(/^\+\d{1,3}/, "");
    const email = phoneWithoutCode + "@dummy.com";
    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Utilisateur non trouvé.");
    const { data: userData, error: userError } = await $supabase.from("users").select(`
        id,
        user_name,
        phone,
        auth_id,
        id_role,
        roles (role_name)
      `).eq("auth_id", data.user.id).single();
    if (userError || !userData) throw new Error("Impossible de récupérer les informations utilisateur.");
    return {
      session: data.session,
      user: {
        auth_id: userData.auth_id,
        user_name: userData.user_name,
        phone: userData.phone,
        role: userData.roles?.role_name || "user"
      }
    };
  },
  // -------------------- LOGOUT --------------------
  logout: async () => {
    const { $supabase } = useNuxtApp();
    const { error } = await $supabase.auth.signOut();
    if (error) throw error;
  }
};
class AuthService {
  async register(user) {
    return authApi.register(user);
  }
  async login(phone, password) {
    return authApi.login(phone, password);
  }
  async logout() {
    try {
      await authApi.logout();
    } finally {
      const authStore = useAuthStore();
      authStore.logout();
    }
  }
}
const authService = new AuthService();
const loginValidate = (user) => {
  const { phone, password } = user;
  if (!phone || !/^\+?[0-9]{7,15}$/.test(phone)) {
    throw new Error("Numéro de téléphone invalide (7 à 15 chiffres).");
  }
  if (!password || password.length < 8) {
    throw new Error("Mot de passe trop court (8 caractères minimum).");
  }
  return true;
};
const registerValidate = (user) => {
  const countryCodeRegex = /^\+\d{1,4}$/;
  if (!user.countryCode || !countryCodeRegex.test(user.countryCode)) {
    throw new Error("Indicatif pays invalide (ex: +228).");
  }
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (!user.phone || !phoneRegex.test(user.phone)) {
    throw new Error("Numéro de téléphone invalide (7 à 15 chiffres).");
  }
  if (!user.password || user.password.length < 8) {
    throw new Error("Mot de passe trop court (8 caractères minimum).");
  }
  if (user.password !== user.confirmPassword) {
    throw new Error("Les mots de passe ne correspondent pas.");
  }
  if (user.parent_invitecode && user.parent_invitecode.trim().length !== 6) {
    throw new Error("Code de parrain invalide (6 chiffres).");
  }
  return true;
};

export { authService as a, loginValidate as l, registerValidate as r };
//# sourceMappingURL=authValidation-C9e88gIV.mjs.map
