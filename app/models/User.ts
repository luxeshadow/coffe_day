// models/Use.ts
export interface User {    
  phone: string
  password: string
  parent_invitecode: string
  user_name: string
  role?: string  
  auth_id?: string  
}
