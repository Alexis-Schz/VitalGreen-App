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

  // Función para guardar una planta en el jardín del usuario
  async addPlantToUserGarden(
    usuarioId: string,
    especieId: string,
    apodo: string,
  ) {
    const { data, error } = await supabase.from("plantas").insert([
      {
        usuario_id: usuarioId,
        especie_id: especieId,
        apodo: apodo,
        salud_actual: 100,
      },
    ]);

    if (error) throw error;
    return data;
  },
};
