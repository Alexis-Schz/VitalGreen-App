import { Alert } from "react-native";

export const NotificationService = {
  // Simulamos la petición de permisos para que la app no se rompa
  async requestPermissions() {
    console.log("Simulando permisos en Expo Go...");
    return true;
  },

  // Disparamos directamente nuestra alerta nativa (Fallback)
  async scheduleWateringAlert(nombresPlantas: string[], temperatura: number) {
    let titulo = "¡Hora de regar! 💧";
    let mensaje = `Tus plantas necesitan agua: ${nombresPlantas.join(", ")}.`;

    if (temperatura >= 30) {
      titulo = "¡Alerta de Calor! ☀️💧";
      mensaje = `Hace ${Math.round(temperatura)}°C. ¡Tus plantas (${nombresPlantas.join(", ")}) se están secando, dales agua hoy!`;
    }

    console.log("Expo Go detectado: Usando Alerta Nativa en lugar de Push.");
    this.triggerFallbackAlert(titulo, mensaje);
  },

  // Nuestra función segura que NUNCA mostrará pantallas rojas
  triggerFallbackAlert(titulo: string, mensaje: string) {
    setTimeout(() => {
      Alert.alert(titulo, mensaje, [{ text: "Entendido", style: "default" }]);
    }, 5000); // Aparece a los 5 segundos dentro de la app
  },
};
