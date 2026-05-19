import * as Location from "expo-location";

const WEATHER_API_KEY = "bd5e378503939ddaee76f12ad7a97608";

// VARIABLES DE CACHÉ (Memoria temporal de la sesión)
let cachedLocation: { latitude: number; longitude: number } | null = null;
let cachedWeather: any = null;
let lastWeatherFetch: number = 0;
const CACHE_EXPIRATION_MS = 1000 * 60 * 30; // 30 minutos

export const WeatherService = {
  // 1. OBTENER UBICACIÓN (Optimizada a 1 milisegundo)
  async getCurrentLocation() {
    // Si ya tenemos la ubicación en esta sesión, no encendemos el GPS de nuevo
    if (cachedLocation) return cachedLocation;

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permiso de ubicación denegado.");
    }

    // Usamos getLastKnownPositionAsync (es instantáneo).
    // Solo usamos getCurrentPositionAsync si es la primera vez que se usa el celular.
    let location = await Location.getLastKnownPositionAsync();
    if (!location) {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    }

    cachedLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    return cachedLocation;
  },

  // 2. DETERMINAR LA ESTACIÓN DEL AÑO (Sin cambios)
  getSeason(latitude: number): "verano" | "invierno" {
    const currentMonth = new Date().getMonth() + 1;
    const isNorthernHemisphere = latitude >= 0;

    if (isNorthernHemisphere) {
      if (currentMonth >= 4 && currentMonth <= 9) return "verano";
      return "invierno";
    } else {
      if (currentMonth >= 10 || currentMonth <= 3) return "verano";
      return "invierno";
    }
  },

  // 3. OBTENER EL CLIMA ACTUAL (Con Patrón Caché)
  async getWeatherData(lat: number, lon: number) {
    const ahora = Date.now();

    // Verificamos si tenemos clima guardado y si NO han pasado 30 minutos
    if (cachedWeather && ahora - lastWeatherFetch < CACHE_EXPIRATION_MS) {
      console.log("Usando clima guardado en caché (ultra rápido) ⚡");
      return cachedWeather;
    }

    try {
      console.log("Descargando clima de OpenWeatherMap ☁️...");
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`,
      );
      const data = await response.json();

      // Guardamos la respuesta en la memoria temporal
      cachedWeather = {
        temperatura: data.main.temp,
        humedad: data.main.humidity,
        condicion: data.weather[0].main,
      };
      lastWeatherFetch = ahora; // Registramos a qué hora descargamos esto

      return cachedWeather;
    } catch (error) {
      console.error("Error al obtener clima:", error);
      // Si falla el internet pero tenemos caché viejo, mejor devolvemos el viejo
      if (cachedWeather) return cachedWeather;
      throw new Error("No se pudo conectar con el servicio meteorológico.");
    }
  },
};
