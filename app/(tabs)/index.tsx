// app/(tabs)/index.tsx
import { PlantCard } from "@//components/PlantCard";
import { Colors } from "@//constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react"; // Importamos useState
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

export default function DashboardScreen() {
  // 1. Estado para el Modo Viaje (RN-08)
  const [isTravelMode, setIsTravelMode] = useState(false);

  // 2. Color dinámico: Verde si está en casa, Ámbar si está de viaje
  const themeColor = isTravelMode ? Colors.accent : Colors.primary;

  return (
    <ScrollView style={styles.container}>
      {/* Header Dinámico */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: themeColor }]}>
            {isTravelMode ? "Modo Viaje Activo ✈️" : "Hola, Alexis 👋"}
          </Text>
          <Text style={styles.subGreeting}>
            {isTravelMode
              ? "Tus plantas están protegidas."
              : "Tus plantas te extrañaban."}
          </Text>
        </View>

        {/* Switch para activar/desactivar (Simulando Ajustes) */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Viaje</Text>
          <Switch
            value={isTravelMode}
            onValueChange={setIsTravelMode}
            trackColor={{ false: "#767577", true: Colors.accent }}
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Sección de Consejos Dinámicos (RN-08) */}
        {isTravelMode && (
          <View style={styles.travelNotice}>
            <Ionicons name="sunny" size={20} color="#856404" />
            <Text style={styles.travelText}>
              Consejo: Aleja tu Monstera de la ventana mientras no estás.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Mi Jardín Urbano</Text>

        {/* Pasamos el color dinámico a las tarjetas si queremos (opcional) */}
        <PlantCard apodo="Monstera" especie="Monstera Deliciosa" salud={85} />
        <PlantCard apodo="Poto" especie="Epipremnum aureum" salud={92} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    padding: 30,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 22, fontWeight: "bold" },
  subGreeting: { fontSize: 14, color: "#666" },
  switchContainer: { alignItems: "center" },
  switchLabel: { fontSize: 10, fontWeight: "bold", color: "#888" },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1A1A1A",
  },
  // Estilos para el aviso de viaje
  travelNotice: {
    backgroundColor: "#FFF3CD", // Amarillo suave de alerta
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFEEBA",
  },
  travelText: { color: "#856404", fontSize: 13, marginLeft: 10, flex: 1 },
});
