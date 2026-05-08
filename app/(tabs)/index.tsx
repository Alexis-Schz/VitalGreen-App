import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router"; // <-- Importamos Link aquí
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthService } from "../../src/api/AuthService";
import { PlantService } from "../../src/api/PlantService";

export default function DashboardScreen() {
  const [myPlants, setMyPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMyGarden();
    }, []),
  );

  const loadMyGarden = async () => {
    setLoading(true);
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        const plantas = await PlantService.getUserPlants(user.id);
        setMyPlants(plantas);
      }
    } catch (error) {
      console.error("Error al cargar jardín:", error);
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
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Mi Jardín</Text>

      {myPlants.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={60} color="#CCC" />
          <Text style={styles.emptyText}>Aún no tienes plantas.</Text>
          <Text style={styles.emptySub}>
            Ve al catálogo para agregar tu primera especie.
          </Text>
        </View>
      ) : (
        <FlatList
          data={myPlants}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            /* AQUÍ ESTÁ LA MAGIA DE LA NAVEGACIÓN */
            <Link href={`/plant/${item.id}`} asChild>
              <TouchableOpacity style={styles.plantCard}>
                <View>
                  <Text style={styles.plantApodo}>{item.apodo}</Text>
                  <Text style={styles.plantEspecie}>
                    {Array.isArray(item.especies)
                      ? item.especies[0]?.nombre_comun
                      : item.especies?.nombre_comun}
                  </Text>
                </View>
                <View style={styles.healthBadge}>
                  <Ionicons name="heart" size={16} color="#FFF" />
                  <Text style={styles.healthText}>
                    {item.salud_actual || 100}%
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBF9", padding: 20 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D5A27",
    marginBottom: 20,
    marginTop: 40,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#666", marginTop: 10 },
  emptySub: { fontSize: 14, color: "#999", textAlign: "center", marginTop: 5 },

  plantCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  plantApodo: { fontSize: 18, fontWeight: "bold", color: "#333" },
  plantEspecie: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
  },

  healthBadge: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  healthText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
});
