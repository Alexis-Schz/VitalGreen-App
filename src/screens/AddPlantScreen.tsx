import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthService } from "../api/AuthService";
import { PlantService } from "../api/PlantService";

export default function AddPlantScreen() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const [apodo, setApodo] = useState("");
  const [entorno, setEntorno] = useState("Interior");
  const [luz, setLuz] = useState("Media");
  const [ventilacion, setVentilacion] = useState("Media"); // Nuevo estado

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const data = await PlantService.getCatalog();
      setCatalog(data);
    } catch (error) {
      Alert.alert("Error", "No pudimos conectar con el catálogo");
    } finally {
      setLoading(false);
    }
  };

  const openForm = (especie) => {
    setSelectedPlant(especie);
    setModalVisible(true);
    setApodo("");
    setEntorno("Interior");
    setLuz("Media");
    setVentilacion("Media");
  };

  // Esta función hace la validación
  // 1. PRIMERO declaramos executeSave para que el sistema ya la conozca
  const executeSave = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user && selectedPlant) {
        await PlantService.addPlantToUserGarden(
          user.id,
          selectedPlant.id,
          apodo,
          entorno,
          ventilacion,
          luz,
        );
        Alert.alert("¡Listo!", `${apodo} se guardó bien en tu jardín.`);
        setModalVisible(false);
      }
    } catch (err) {
      Alert.alert("Error al guardar", "Inténtalo de nuevo.");
      console.error(err);
    }
  };

  // 2. DESPUÉS declaramos handleSavePlant, que ahora sí encontrará a executeSave sin problema
  const handleSavePlant = async () => {
    if (!apodo)
      return Alert.alert("Error", "Debes ponerle un apodo a tu planta.");

    // REGLA DE NEGOCIO: Validar si el entorno es óptimo
    let esOptimo = true;
    let advertencia = "";

    if (luz === "Baja" && selectedPlant?.luz_requerida?.includes("Alta")) {
      esOptimo = false;
      advertencia =
        "Esta especie requiere luz Alta y seleccionaste Baja. Su salud podría empeorar rápidamente.";
    } else if (
      entorno === "Exterior" &&
      selectedPlant?.luz_requerida?.includes("Baja")
    ) {
      esOptimo = false;
      advertencia = "Esta planta es de sombra y el exterior podría quemarla.";
    }

    // DECISIÓN DEL SISTEMA
    if (!esOptimo) {
      Alert.alert(
        "Condiciones no óptimas ⚠️",
        `${advertencia}\n\n¿Deseas registrarla de todos modos?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Guardar de todos modos", onPress: executeSave },
        ],
      );
    } else {
      executeSave();
    }
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#2D5A27"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Catálogo de Especies</Text>

      <FlatList
        data={catalog}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() => openForm(item)}
          >
            <Text style={styles.plantName}>{item.nombre_comun}</Text>
            <Text style={styles.scientificName}>{item.nombre_cientifico}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Configurar Entorno</Text>
              <Text style={styles.modalSub}>{selectedPlant?.nombre_comun}</Text>

              <Text style={styles.label}>Apodo de la planta</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Mi Monstera"
                value={apodo}
                onChangeText={setApodo}
              />

              <Text style={styles.label}>Entorno</Text>
              <View style={styles.row}>
                {["Interior", "Exterior"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setEntorno(opt)}
                    style={[styles.chip, entorno === opt && styles.chipActive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        entorno === opt && styles.chipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Luz recibida</Text>
              <View style={styles.row}>
                {["Alta", "Media", "Baja"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setLuz(opt)}
                    style={[styles.chip, luz === opt && styles.chipActive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        luz === opt && styles.chipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* NUEVA SECCIÓN DE VENTILACIÓN */}
              <Text style={styles.label}>Ventilación</Text>
              <View style={styles.row}>
                {["Alta", "Media", "Baja"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setVentilacion(opt)}
                    style={[
                      styles.chip,
                      ventilacion === opt && styles.chipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        ventilacion === opt && styles.chipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSavePlant}
              >
                <Text style={styles.saveButtonText}>Guardar Planta</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBF9", padding: 20 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D5A27",
    marginBottom: 20,
    marginTop: 40,
  },
  itemCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
  },
  plantName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  scientificName: { fontSize: 14, color: "#666", fontStyle: "italic" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 20,
    maxHeight: "80%",
  },
  closeButton: { alignSelf: "flex-end" },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#2D5A27" },
  modalSub: { fontSize: 16, color: "#666", marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  row: { flexDirection: "row", gap: 10 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  chipActive: { backgroundColor: "#2D5A27", borderColor: "#2D5A27" },
  chipText: { color: "#666", fontWeight: "bold" },
  chipTextActive: { color: "#FFF" },
  saveButton: {
    backgroundColor: "#2D5A27",
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
