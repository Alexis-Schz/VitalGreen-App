import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthService } from "../../src/api/AuthService";
import { NotificationService } from "../../src/api/NotificationService";
import { PlantService } from "../../src/api/PlantService";

export default function DashboardScreen() {
  // ¡NUEVO! Agregamos el estado para que toda la pantalla reconozca al 'user'
  const [user, setUser] = useState<any>(null);
  const [plantas, setPlantas] = useState<any[]>([]);
  const [thirstyPlants, setThirstyPlants] = useState<string[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, []),
  );

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        // Guardamos el usuario en el estado para que la interfaz lo pueda usar
        setUser(currentUser);

        const userPlants = await PlantService.getUserPlants(currentUser.id);
        setPlantas(userPlants || []);

        const waterCheck = await PlantService.checkWateringNeeds(
          currentUser.id,
        );
        if (waterCheck) {
          setWeather(waterCheck.clima);
          setThirstyPlants(waterCheck.plantasAlertadas);

          // Si hay plantas sedientas Y el modo viaje NO está activo, disparamos la notificación
          if (
            waterCheck.plantasAlertadas.length > 0 &&
            !currentUser.user_metadata?.modoViaje
          ) {
            await NotificationService.scheduleWateringAlert(
              waterCheck.plantasAlertadas,
              waterCheck.clima.temperatura,
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#2D5A27"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* CABECERA CON CLIMA EN TIEMPO REAL */}
      <View style={styles.header}>
        <Text style={styles.title}>Mi Jardín</Text>
        {weather && (
          <View style={styles.weatherBadge}>
            <Ionicons
              name={weather.temperatura > 25 ? "sunny" : "partly-sunny"}
              size={16}
              color="#FF9800"
            />
            <Text style={styles.weatherText}>
              {Math.round(weather.temperatura)}°C
            </Text>
          </View>
        )}
      </View>

      {/* BANNER INTELIGENTE DE MODO VIAJE O RIEGO */}
      {user?.user_metadata?.modoViaje ? (
        <View style={[styles.alertBanner, { backgroundColor: "#2196F3" }]}>
          <View style={styles.alertIcon}>
            <Ionicons name="airplane" size={28} color="#FFF" />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>✈️ Modo Viaje Activado</Text>
            <Text style={styles.alertText}>
              Alertas en pausa hasta tu regreso el{" "}
              <Text style={{ fontWeight: "bold" }}>
                {user.user_metadata?.viajeFin}
              </Text>
              .{"\n"}💡{" "}
              <Text style={{ fontWeight: "bold" }}>Recordatorio:</Text>{" "}
              Asegúrate de haber agrupado tus plantas en una zona fresca antes
              de cerrar la puerta.
            </Text>
          </View>
        </View>
      ) : (
        thirstyPlants.length > 0 && (
          <View style={[styles.alertBanner, { backgroundColor: "#FF9800" }]}>
            <View style={styles.alertIcon}>
              <Ionicons name="water" size={28} color="#FFF" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>¡Acción Requerida!</Text>
              <Text style={styles.alertText}>
                {weather?.temperatura >= 30 ? "Hace mucho calor hoy. " : ""}
                Tus plantas necesitan agua:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {thirstyPlants.join(", ")}
                </Text>
              </Text>
            </View>
          </View>
        )
      )}

      {/* LISTADO DE PLANTAS DEL JARDÍN */}
      {plantas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={60} color="#CCC" />
          <Text style={styles.emptyText}>Tu jardín está vacío.</Text>
          <Text style={styles.emptySubText}>
            Ve a la pestaña "Añadir" para empezar.
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {plantas.map((planta) => (
            <TouchableOpacity
              key={planta.id}
              style={styles.plantCard}
              onPress={() => router.push(`/plant/${planta.id}`)}
            >
              <View style={styles.plantImagePlaceholder}>
                <Ionicons name="leaf" size={40} color="#A5D6A7" />
              </View>
              <Text style={styles.plantName}>
                {planta.apodo || planta.especies?.nombre_comun}
              </Text>
              <Text style={styles.plantSpecies}>
                {planta.especies?.nombre_comun}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBF9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: { fontSize: 32, fontWeight: "900", color: "#1A1A1A" },
  weatherBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  weatherText: { marginLeft: 5, fontWeight: "bold", color: "#E65100" },

  alertBanner: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  alertIcon: { justifyContent: "center", marginRight: 15 },
  alertContent: { flex: 1 },
  alertTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 3,
  },
  alertText: { color: "#E3F2FD", fontSize: 13, lineHeight: 18 },

  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#666", marginTop: 10 },
  emptySubText: { fontSize: 14, color: "#999", marginTop: 5 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  plantCard: {
    width: "47%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  plantImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  plantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  plantSpecies: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 2,
  },
});
