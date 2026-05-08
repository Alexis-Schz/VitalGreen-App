import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PlantService } from "../../src/api/PlantService";

export default function PlantInfoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter(); // Para regresar al dashboard tras eliminar

  const [plantData, setPlantData] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllInfo();
  }, [id]);

  const loadAllInfo = async () => {
    try {
      // 1. Obtener detalles técnicos de la planta y su especie
      const details = await PlantService.getPlantDetails(id as string);
      setPlantData(details);

      // 2. Obtener el historial de cuidados
      const logs = await PlantService.getCareHistory(id as string);
      setHistory(logs);
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Error de Conexión",
        "No se pudo sincronizar con VitalGreen.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleManualCare = async (tipo: string) => {
    try {
      await PlantService.addCareRecord(id as string, tipo);
      Alert.alert("¡Registro Exitoso!", `Has registrado: ${tipo}`);
      loadAllInfo(); // Recargamos para ver el nuevo evento en la lista
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo guardar el registro de cuidado.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Planta",
      "¿Estás seguro de que quieres quitar esta planta de tu jardín? Perderás todo su historial.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await PlantService.deletePlant(id as string);
              Alert.alert("Eliminada", "La planta ha sido removida con éxito.");
              router.replace("/(tabs)"); // Regresamos al Dashboard automáticamente
            } catch (e) {
              Alert.alert(
                "Error",
                "Hubo un problema al intentar eliminar la planta.",
              );
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#F9FBF9",
        }}
      >
        <ActivityIndicator size="large" color="#2D5A27" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* TARJETA DE INFORMACIÓN PRINCIPAL */}
      <View style={styles.headerCard}>
        <Text style={styles.apodo}>{plantData?.apodo}</Text>
        <Text style={styles.especie}>{plantData?.especies?.nombre_comun}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Ionicons name="sunny" size={22} color="#FFA000" />
            <Text style={styles.infoLabel}>Luz</Text>
            <Text style={styles.infoVal}>{plantData?.luz_recibida}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="leaf" size={22} color="#4CAF50" />
            <Text style={styles.infoLabel}>Entorno</Text>
            <Text style={styles.infoVal}>{plantData?.entorno}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="swap-horizontal" size={22} color="#2196F3" />
            <Text style={styles.infoLabel}>Ventilación</Text>
            <Text style={styles.infoVal}>{plantData?.ventilacion}</Text>
          </View>
        </View>
      </View>

      {/* REGISTRO DE CUIDADOS RÁPIDOS */}
      <Text style={styles.sectionTitle}>Registrar Cuidado Manual</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#2196F3" }]}
          onPress={() => handleManualCare("Riego")}
        >
          <Ionicons name="water" size={24} color="#FFF" />
          <Text style={styles.btnText}>Regar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#8BC34A" }]}
          onPress={() => handleManualCare("Abono")}
        >
          <Ionicons name="flask" size={24} color="#FFF" />
          <Text style={styles.btnText}>Abonar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#FF9800" }]}
          onPress={() => handleManualCare("Poda")}
        >
          <Ionicons name="cut" size={24} color="#FFF" />
          <Text style={styles.btnText}>Podar</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE HISTORIAL */}
      <Text style={styles.sectionTitle}>Historial de la Planta</Text>
      {history.length === 0 ? (
        <Text style={styles.emptyHistory}>No hay registros aún.</Text>
      ) : (
        history.map((log: any) => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.logIconBg}>
              <Ionicons
                name={
                  log.tipo_cuidado === "Riego" ? "water" : "checkmark-circle"
                }
                size={20}
                color="#2D5A27"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.logText}>{log.tipo_cuidado}</Text>
              <Text style={styles.logDate}>
                {new Date(log.fecha).toLocaleDateString()} -{" "}
                {new Date(log.fecha).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        ))
      )}

      {/* BOTÓN DE ELIMINACIÓN */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color="#FF5252" />
        <Text style={styles.deleteText}>Eliminar de mi jardín</Text>
      </TouchableOpacity>

      {/* Espaciador final */}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBF9", padding: 20 },

  headerCard: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 20,
    marginTop: 40,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  apodo: { fontSize: 28, fontWeight: "bold", color: "#2D5A27" },
  especie: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 20,
  },

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 20,
  },
  infoItem: { alignItems: "center", width: "30%" },
  infoLabel: { fontSize: 12, color: "#999", marginTop: 5 },
  infoVal: { fontSize: 14, fontWeight: "bold", color: "#333" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 35,
    marginBottom: 15,
    color: "#333",
  },

  actionRow: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    width: "31%",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    elevation: 2,
  },
  btnText: { color: "#FFF", fontWeight: "bold", marginTop: 6, fontSize: 13 },

  logCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  logIconBg: { backgroundColor: "#E8F5E9", padding: 10, borderRadius: 12 },
  logText: { fontSize: 16, fontWeight: "600", color: "#333" },
  logDate: { fontSize: 12, color: "#999", marginTop: 2 },
  emptyHistory: {
    color: "#999",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    paddingVertical: 16,
    borderRadius: 15,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FFEBEE",
  },
  deleteText: {
    color: "#FF5252",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 10,
  },
});
