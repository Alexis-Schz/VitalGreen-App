import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthService } from "../../src/api/AuthService";

export default function ProfileScreen() {
  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, salir",
        style: "destructive",
        onPress: async () => {
          try {
            await AuthService.signOut();
            // No necesitamos hacer router.replace('/login') aquí
            // porque nuestro _layout.tsx ya está escuchando y lo hará automáticamente.
          } catch (e) {
            Alert.alert("Error", "No se pudo cerrar sesión.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* CABECERA DEL PERFIL */}
      <View style={styles.header}>
        {/* Usamos una imagen de placeholder tipo avatar */}
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Alexis</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#4CAF50" />
          <Text style={styles.locationText}>Puebla, MX</Text>
        </View>
      </View>

      {/* SECCIÓN: LOGROS BOTÁNICOS */}
      <View style={styles.sectionTitleContainer}>
        <Ionicons name="trophy-outline" size={24} color="#FF9800" />
        <Text style={styles.sectionTitle}>Mis Logros Botánicos</Text>
      </View>

      <View style={styles.grid}>
        {/* Logros Desbloqueados */}
        <View style={styles.badgeCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#E8F5E9" }]}>
            <Ionicons
              name="shield-checkmark-outline"
              size={28}
              color="#4CAF50"
            />
          </View>
          <Text style={styles.badgeTitle}>Protector del Bosque</Text>
        </View>

        <View style={styles.badgeCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#E3F2FD" }]}>
            <Ionicons name="water-outline" size={28} color="#2196F3" />
          </View>
          <Text style={styles.badgeTitle}>Riego Perfecto</Text>
        </View>

        <View style={styles.badgeCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#F1F8E9" }]}>
            <Ionicons name="leaf-outline" size={28} color="#8BC34A" />
          </View>
          <Text style={styles.badgeTitle}>Experto en Monsteras</Text>
        </View>

        {/* Logros Bloqueados (Gris) */}
        <View style={styles.badgeCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#F5F5F5" }]}>
            <Ionicons name="disc-outline" size={28} color="#BDBDBD" />
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={12} color="#888" />
            </View>
          </View>
          <Text style={styles.badgeTitleLocked}>Rescate Exitoso</Text>
        </View>

        <View style={styles.badgeCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#F5F5F5" }]}>
            <Ionicons name="star-outline" size={28} color="#BDBDBD" />
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={12} color="#888" />
            </View>
          </View>
          <Text style={styles.badgeTitleLocked}>Coleccionista</Text>
        </View>

        <View style={styles.badgeCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#F5F5F5" }]}>
            <Ionicons name="trophy-outline" size={28} color="#BDBDBD" />
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={12} color="#888" />
            </View>
          </View>
          <Text style={styles.badgeTitleLocked}>Jardín Botánico</Text>
        </View>
      </View>

      {/* SECCIÓN: ESTADÍSTICAS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#009688" }]}>12</Text>
          <Text style={styles.statLabel}>PLANTAS A SALVO</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#FF9800" }]}>45</Text>
          <Text style={styles.statLabel}>DÍAS DE RACHA</Text>
        </View>
      </View>

      {/* BOTÓN DE CERRAR SESIÓN */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FF5252" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Espacio extra al final para que la barra de navegación no tape nada */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  // Cabecera
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#F9FBF9",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: "#E0E0E0",
  },
  name: { fontSize: 28, fontWeight: "900", color: "#1A1A1A" },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
    marginLeft: 4,
  },

  // Título de sección
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },

  // Cuadrícula de Logros
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  badgeCard: {
    width: "31%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  lockIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 2,
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 2,
  },
  badgeTitleLocked: {
    fontSize: 11,
    fontWeight: "600",
    color: "#BDBDBD",
    textAlign: "center",
    paddingHorizontal: 2,
  },

  // Estadísticas
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
  },
  statNumber: { fontSize: 32, fontWeight: "900", marginBottom: 5 },
  statLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#888",
    letterSpacing: 1,
  },

  // Botón Salir
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: "#FFEBEE",
  },
  logoutText: {
    color: "#FF5252",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
