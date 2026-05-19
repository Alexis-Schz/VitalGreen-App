// src/api/AuthService.ts
import { supabase } from "./SupabaseConfig";

export const AuthService = {
  // Registro de nuevos usuarios
  async signUp(email: string, pass: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  },

  // Inicio de sesión
  async signIn(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  },

  // Cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obtener el usuario actual
  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },
  // Agrega esto dentro de tu AuthService
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username, // Aquí guardamos el nombre elegido
        },
      },
    });

    if (error) throw error;
    return data;
  },
};
