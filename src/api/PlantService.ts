// src/api/PlantService.ts
import { supabase } from "./SupabaseConfig";
import { WeatherService } from "./WeatherService";

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

  // FUNCIÓN PARA TRAER DETALLES DE UNA SOLA PLANTA (Asegúrate de tenerla)
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

  // FUNCIÓN PARA TRAER EL HISTORIAL DE CUIDADOS (La que te está marcando error)
  async getCareHistory(plantaId: string) {
    const { data, error } = await supabase
      .from("historial_cuidados")
      .select("*")
      .eq("planta_id", plantaId)
      .order("fecha", { ascending: false });

    if (error) throw error;
    return data;
  }, // <-- Ojo con la coma

  // FUNCIÓN PARA REGISTRAR UN NUEVO CUIDADO
  async addCareRecord(plantaId: string, tipo: string, notas: string = "") {
    const { error } = await supabase.from("historial_cuidados").insert({
      planta_id: plantaId,
      tipo_cuidado: tipo,
      notas: notas,
    });

    if (error) throw error;
  },

  // FUNCIÓN PARA ELIMINAR UNA PLANTA (Opcional pero útil para pruebas)
  async deletePlant(plantaId: string) {
    const { error } = await supabase
      .from("plantas")
      .delete()
      .eq("id", plantaId);

    if (error) throw error;
  },

  // FUNCIÓN: MOTOR DE ESTADÍSTICAS Y LOGROS
  async getUserStats(usuarioId: string) {
    // 1. Traemos todas las plantas del usuario
    const { data: plantas, error: plantasError } = await supabase
      .from("plantas")
      .select(
        `
        id,
        especie_id,
        especies (nombre_comun)
      `,
      )
      .eq("usuario_id", usuarioId);

    if (plantasError) throw plantasError;

    // 2. Traemos todo el historial de cuidados de ese usuario
    const plantasIds = plantas.map((p) => p.id);
    let historial: any[] = [];

    if (plantasIds.length > 0) {
      const { data: cuidados, error: cuidadosError } = await supabase
        .from("historial_cuidados")
        .select("*")
        .in("planta_id", plantasIds);

      if (cuidadosError) throw cuidadosError;
      historial = cuidados || [];
    }

    // --- CÁLCULOS DE ESTADÍSTICAS PRINCIPALES ---
    const totalPlantas = plantas.length;
    // Simplificamos la racha al total de acciones de cuidado registradas
    const diasRacha = historial.length;

    // --- EVALUACIÓN DE LOGROS (True / False) ---

    // Riego Perfecto: 5 o más riegos en el historial
    const totalRiegos = historial.filter(
      (h) => h.tipo_cuidado === "Riego",
    ).length;
    const riegoPerfecto = totalRiegos >= 5;

    // Rescate Exitoso: Al menos 1 Abono o Poda
    const rescateExitoso = historial.some(
      (h) => h.tipo_cuidado === "Abono" || h.tipo_cuidado === "Poda",
    );

    // Experto en Monsteras: (¡Tu nueva regla!) 3 o más plantas que sean "Monstera"
    const totalMonsteras = plantas.filter((p) => {
      // Sacamos el nombre de la especie
      const nombre = Array.isArray(p.especies)
        ? p.especies[0]?.nombre_comun
        : p.especies?.nombre_comun;
      // Verificamos si incluye la palabra monstera
      return nombre?.toLowerCase().includes("monstera");
    }).length;
    const expertoMonsteras = totalMonsteras >= 3;

    // Coleccionista: 3 o más especies diferentes (usamos Set para eliminar duplicados)
    const especiesUnicas = new Set(plantas.map((p) => p.especie_id));
    const coleccionista = especiesUnicas.size >= 3;

    // Logros de Cantidad
    const protectorBosque = totalPlantas >= 10;
    const jardinBotanico = totalPlantas >= 20;

    // 3. Empaquetamos todo y lo devolvemos a la pantalla de Perfil
    return {
      estadisticas: {
        plantasASalvo: totalPlantas,
        diasRacha: diasRacha,
      },
      logros: {
        protectorBosque,
        riegoPerfecto,
        expertoMonsteras,
        rescateExitoso,
        coleccionista,
        jardinBotanico,
      },
    };
  },
  // ... (tus otras funciones en PlantService)

  // NUEVO: MOTOR INTELIGENTE DE RIEGO
  async checkWateringNeeds(usuarioId: string) {
    try {
      // 1. Obtenemos el contexto ambiental en tiempo real
      const coords = await WeatherService.getCurrentLocation();
      const season = WeatherService.getSeason(coords.latitude);
      const weather = await WeatherService.getWeatherData(
        coords.latitude,
        coords.longitude,
      );

      // 2. Traemos todas las plantas del usuario y sus reglas de especie
      const { data: plantas, error } = await supabase
        .from("plantas")
        .select(
          `
          id,
          apodo,
          especies (
            nombre_comun,
            riego_dias_verano,
            riego_dias_invierno
          )
        `,
        )
        .eq("usuario_id", usuarioId);

      if (error) throw error;

      let plantasNecesitanAgua: string[] = [];

      // 3. Evaluamos planta por planta
      for (const planta of plantas || []) {
        // Buscar cuándo fue la última vez que se regó
        const { data: ultimoRiego } = await supabase
          .from("historial_cuidados")
          .select("fecha")
          .eq("planta_id", planta.id)
          .eq("tipo_cuidado", "Riego")
          .order("fecha", { ascending: false })
          .limit(1)
          .single();

        let diasDesdeUltimoRiego = 999; // Si nunca se ha regado, necesita agua urgente
        if (ultimoRiego) {
          const fechaRiego = new Date(ultimoRiego.fecha);
          const hoy = new Date();
          const diferenciaMs = hoy.getTime() - fechaRiego.getTime();
          diasDesdeUltimoRiego = Math.floor(
            diferenciaMs / (1000 * 60 * 60 * 24),
          );
        }

        // 4. Seleccionar la frecuencia base según la estación del año
        const especie = Array.isArray(planta.especies)
          ? planta.especies[0]
          : planta.especies;
        let frecuenciaBase =
          season === "verano"
            ? especie?.riego_dias_verano
            : especie?.riego_dias_invierno;

        // Si por alguna razón la especie no tiene el dato, usamos 7 días por defecto
        if (!frecuenciaBase) frecuenciaBase = 7;

        // 5. MODIFICADOR DE CLIMA (La magia de VitalGreen)
        let frecuenciaAjustada = frecuenciaBase;

        if (weather.temperatura > 30 && weather.humedad < 40) {
          // Si hace mucho calor y está seco, el agua se evapora rápido: ACELERAMOS EL RIEGO (-1 día)
          frecuenciaAjustada -= 1;
        } else if (weather.condicion === "Rain" || weather.humedad > 80) {
          // Si llueve o hay mucha humedad, la tierra sigue mojada: RETRASAMOS EL RIEGO (+1 día)
          frecuenciaAjustada += 1;
        }

        // 6. El Veredicto Final
        if (diasDesdeUltimoRiego >= frecuenciaAjustada) {
          plantasNecesitanAgua.push(planta.apodo || especie?.nombre_comun);
        }
      }

      // Devolvemos el clima actual y la lista de plantas que tienen sed
      return {
        clima: weather,
        estacion: season,
        plantasAlertadas: plantasNecesitanAgua,
      };
    } catch (error) {
      console.error("Error en el Motor de Riego:", error);
      return null; // En caso de que el GPS esté apagado o sin internet
    }
  },
};
