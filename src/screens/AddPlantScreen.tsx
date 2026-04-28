// src/screens/AddPlantScreen.tsx
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PlantService } from "../api/PlantService";
import { Colors } from "../constants/Colors";

export default function AddPlantScreen() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargamos el catálogo solo cuando se abre esta pantalla
  useEffect(() => {
    async function loadData() {
      try {
        const data = await PlantService.getCatalog();
        setCatalog(data);
      } catch (error) {
        console.error("Error cargando catálogo:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={Colors.primary}
        style={{ flex: 1 }}
      />
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué vas a plantar hoy?</Text>
      <FlatList
        data={catalog}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemCard}>
            <Text style={styles.plantName}>{item.nombre_comun}</Text>
            <Text style={styles.scientificName}>{item.nombre_cientifico}</Text>
            <Text style={styles.tag}>Luz: {item.luz_requerida}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.primary,
    marginTop: 40,
  },
  itemCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  plantName: { fontSize: 18, fontWeight: "600" },
  scientificName: { fontSize: 14, color: "#888", fontStyle: "italic" },
  tag: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 5,
    fontWeight: "bold",
  },
});
