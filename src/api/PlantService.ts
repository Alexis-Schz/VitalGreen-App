// src/api/PlantService.ts
import { supabase } from "./SupabaseConfig";

export const PlantService = {
  // Función para obtener el catálogo de 50+ especies
  async getCatalog() {
    const { data, error } = await supabase
      .from("especies")
      .select("*")
      .order("nombre_comun", { ascending: true });

    if (error) throw error;
    return data;
  },

  // DEBES TENER ESTA FUNCIÓN AQUÍ:
  async getUserPlants(usuarioId: string) {
    const { data, error } = await supabase
      .from("plantas")
      .select(
        `
        id,
        apodo,
        salud_actual,
        especies (
          nombre_comun
        )
      `,
      )
      .eq("usuario_id", usuarioId);

    if (error) throw error;
    return data;
  },

  // Función para guardar una planta en el jardín del usuario
  async addPlantToUserGarden(
    userId: string,
    especieId: string,
    apodo: string,
    entorno: string,
    ventilacion: string,
    luz: string,
  ) {
    const { error } = await supabase.from("plantas").insert({
      usuario_id: userId,
      especie_id: especieId,
      apodo: apodo,
      entorno: entorno,
      ventilacion: ventilacion, // Cambiado
      luz_recibida: luz,
      salud_actual: 100,
    });

    if (error) throw error;
  },

  // 1. FUNCIÓN PARA TRAER DETALLES DE UNA SOLA PLANTA (Asegúrate de tenerla)
  async getPlantDetails(plantaId: string) {
    const { data, error } = await supabase
      .from("plantas")
      .select(
        `
        *,
        especies (nombre_comun)
      `,
      )
      .eq("id", plantaId)
      .single();

    if (error) throw error;
    return data;
  },

  // 2. FUNCIÓN PARA TRAER EL HISTORIAL DE CUIDADOS (La que te está marcando error)
  async getCareHistory(plantaId: string) {
    const { data, error } = await supabase
      .from("historial_cuidados")
      .select("*")
      .eq("planta_id", plantaId)
      .order("fecha", { ascending: false });

    if (error) throw error;
    return data;
  }, // <-- Ojo con la coma

  // 3. FUNCIÓN PARA REGISTRAR UN NUEVO CUIDADO
  async addCareRecord(plantaId: string, tipo: string, notas: string = "") {
    const { error } = await supabase.from("historial_cuidados").insert({
      planta_id: plantaId,
      tipo_cuidado: tipo,
      notas: notas,
    });

    if (error) throw error;
  },

  //4. FUNCIÓN PARA ELIMINAR UNA PLANTA (Opcional pero útil para pruebas)
  async deletePlant(plantaId: string) {
    const { error } = await supabase
      .from("plantas")
      .delete()
      .eq("id", plantaId);

    if (error) throw error;
  },
};
