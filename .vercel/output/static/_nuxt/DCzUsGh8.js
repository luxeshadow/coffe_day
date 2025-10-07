import{B as i,C as p}from"#entry";const u={register:async e=>{const{$supabase:r}=i(),h=e.phone.replace(/^\+\d{1,3}/,"")+"@dummy.com",{data:a,error:t}=await r.auth.signUp({email:h,password:e.password,options:{data:{phone:e.phone,parent_invitecode:e.parent_invitecode}}});if(t)throw t;if(!a.user)throw new Error("Utilisateur non créé dans Supabase Auth");const{error:s}=await r.from("users").insert([{auth_id:a.user.id,user_name:e.user_name,phone:e.phone,parent_invitecode:e.parent_invitecode}]);if(s)throw s;return a},login:async(e,r)=>{const{$supabase:o}=i(),a=e.replace(/^\+\d{1,3}/,"")+"@dummy.com",{data:t,error:s}=await o.auth.signInWithPassword({email:a,password:r});if(s)throw new Error(s.message);if(!t.user)throw new Error("Utilisateur non trouvé.");const{data:n,error:c}=await o.from("users").select(`
        id,
        user_name,
        phone,
        auth_id,
        id_role,
        roles (role_name)
      `).eq("auth_id",t.user.id).single();if(c||!n)throw new Error("Impossible de récupérer les informations utilisateur.");return{session:t.session,user:{auth_id:n.auth_id,user_name:n.user_name,phone:n.phone,role:n.roles?.role_name||"user"}}},logout:async()=>{const{$supabase:e}=i(),{error:r}=await e.auth.signOut();if(r)throw r}};class d{async register(r){return u.register(r)}async login(r,o){return u.login(r,o)}async logout(){try{await u.logout()}finally{p().logout()}}}const m=new d;export{m as a};
