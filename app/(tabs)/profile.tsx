import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthService } from "../../src/api/AuthService";
import { PlantService } from "../../src/api/PlantService";
import { supabase } from "../../src/api/SupabaseConfig";

export default function ProfileScreen() {
  const [stats, setStats] = useState({ plantasASalvo: 0, diasRacha: 0 });
  const [logros, setLogros] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Usuario");

  // ESTADOS PARA EL MODO VIAJE AVANZADO
  const [modalVisible, setModalVisible] = useState(false);
  const [modoViaje, setModoViaje] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, []),
  );

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        const realName =
          user.user_metadata?.username ||
          user.email?.split("@")[0] ||
          "Usuario";
        setUserName(realName);

        // Cargar datos del viaje guardados
        setModoViaje(user.user_metadata?.modoViaje || false);
        setFechaInicio(user.user_metadata?.viajeInicio || "");
        setFechaFin(user.user_metadata?.viajeFin || "");

        const data = await PlantService.getUserStats(user.id);
        setStats(data.estadisticas);
        setLogros(data.logros);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Guardar o desactivar el viaje en Supabase
  const handleGuardarViaje = async (activar: boolean) => {
    if (activar && (!fechaInicio || !fechaFin)) {
      Alert.alert("Datos faltantes", "Por favor ingresa ambas fechas.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          modoViaje: activar,
          viajeInicio: activar ? fechaInicio : "",
          viajeFin: activar ? fechaFin : "",
        },
      });

      if (error) throw error;

      setModoViaje(activar);
      if (!activar) {
        setFechaInicio("");
        setFechaFin("");
      }
      setModalVisible(false);
      Alert.alert(
        activar ? "✈️ ¡Buen viaje!" : "🌿 Bienvenido de vuelta",
        activar
          ? "Modo viaje activado. Tus alertas se han pausado."
          : "Alertas de riego reactivadas.",
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, salir",
        style: "destructive",
        onPress: async () => {
          await AuthService.signOut();
        },
      },
    ]);
  };

  const badgeDescriptions: { [key: string]: string } = {
    "Protector del Bosque": "Registra 10 o más plantas en tu jardín.",
    "Riego Perfecto":
      "Registra la acción de riego al menos 5 veces en tu historial.",
    "Experto Monsteras":
      "Ten al menos 3 plantas de la especie Monstera en tu jardín.",
    "Rescate Exitoso":
      "Registra un cuidado avanzado (Abono o Poda) para mantener sanas a tus plantas.",
    Coleccionista: "Ten al menos 3 especies diferentes en tu jardín botánico.",
    "Jardín Botánico":
      "Alcanza el nivel máximo registrando 20 plantas en tu jardín.",
  };

  const showBadgeInfo = (title: string, isUnlocked: boolean) => {
    const description =
      badgeDescriptions[title] ||
      "Sigue cuidando tus plantas para desbloquear este logro.";
    const status = isUnlocked
      ? "🔓 ¡Logro Desbloqueado!"
      : "🔒 Logro Bloqueado";
    Alert.alert(`${title}\n${status}`, description);
  };

  const renderBadge = (
    title: string,
    iconName: any,
    isUnlocked: boolean,
    bgColor: string,
    iconColor: string,
  ) => {
    return (
      <TouchableOpacity
        style={styles.badgeCard}
        key={title}
        activeOpacity={0.7}
        onPress={() => showBadgeInfo(title, isUnlocked)}
      >
        {isUnlocked ? (
          <>
            <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
              <Ionicons name={iconName} size={28} color={iconColor} />
            </View>
            <Text style={styles.badgeTitle}>{title}</Text>
          </>
        ) : (
          <>
            <View style={[styles.iconCircle, { backgroundColor: "#F5F5F5" }]}>
              <Ionicons name={iconName} size={28} color="#BDBDBD" />
              {/* AQUÍ ESTABA EL ERROR. YA ESTÁ CORREGIDO: */}
              <View style={styles.lockIcon}>
                <Ionicons name="lock-closed" size={12} color="#888" />
              </View>
            </View>
            <Text style={styles.badgeTitleLocked}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    );
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
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userName}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#4CAF50" />
          <Text style={styles.locationText}>VitalGreen</Text>
        </View>
      </View>

      {/* BOTÓN DE CONFIGURACIÓN DEL MODO VIAJE */}
      <View
        style={[styles.travelContainer, modoViaje && styles.travelActiveBorder]}
      >
        <View style={styles.travelLeft}>
          <Ionicons
            name="airplane"
            size={24}
            color={modoViaje ? "#2196F3" : "#757575"}
          />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.travelTitle}>Planificador de Viajes</Text>
            <Text style={styles.travelDesc}>
              {modoViaje
                ? `Ausente hasta el ${fechaFin}`
                : "Configura tus vacaciones"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.travelButton,
            modoViaje ? styles.travelButtonActive : styles.travelButtonInactive,
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={[styles.travelButtonText, modoViaje && { color: "#2196F3" }]}
          >
            {modoViaje ? "Ver Plan" : "Configurar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* VENTANA EMERGENTE (MODAL DE VIAJE) */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalMainTitle}>
                  ✈️ Modo Viaje VitalGreen
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>¿Cuándo te vas?</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="AAAA-MM-DD (Ej: 2026-06-15)"
                value={fechaInicio}
                onChangeText={setFechaInicio}
              />

              <Text style={styles.inputLabel}>¿Cuándo regresas?</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="AAAA-MM-DD (Ej: 2026-06-22)"
                value={fechaFin}
                onChangeText={setFechaFin}
              />

              {/* SECCIÓN SOLICITADA: CONSEJOS BOTÁNICOS DE SUPERVIVENCIA */}
              <View style={styles.tipsBox}>
                <Text style={styles.tipsHeaderTitle}>
                  📋 Guía de Preparación Botánica:
                </Text>
                <Text style={styles.tipItem}>
                  •{" "}
                  <Text style={{ fontWeight: "bold" }}>Riego de Reserva:</Text>{" "}
                  Riega profundamente tus plantas 1 día antes de salir sin
                  inundar la maceta.
                </Text>
                <Text style={styles.tipItem}>
                  •{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    Efecto Invernadero Urbano:
                  </Text>{" "}
                  Agrupa tus macetas en el centro de la habitación; al estar
                  juntas conservan la humedad del aire por más tiempo.
                </Text>
                <Text style={styles.tipItem}>
                  •{" "}
                  <Text style={{ fontWeight: "bold" }}>Control Lumínico:</Text>{" "}
                  Aleja las plantas de las ventanas de sol directo absoluto para
                  reducir la evaporación de agua.
                </Text>
              </View>

              {/* ACCIONES DEL MODAL */}
              <TouchableOpacity
                style={styles.saveTravelBtn}
                onPress={() => handleGuardarViaje(true)}
              >
                <Text style={styles.saveTravelBtnText}>Activar Modo Viaje</Text>
              </TouchableOpacity>

              {modoViaje && (
                <TouchableOpacity
                  style={styles.cancelTravelBtn}
                  onPress={() => handleGuardarViaje(false)}
                >
                  <Text style={styles.cancelTravelBtnText}>
                    Desactivar y Reanudar Alertas
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ESTADÍSTICAS Y LOGROS (Se mantienen igual) */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#009688" }]}>
            {stats.plantasASalvo}
          </Text>
          <Text style={styles.statLabel}>PLANTAS A SALVO</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#FF9800" }]}>
            {stats.diasRacha}
          </Text>
          <Text style={styles.statLabel}>ACCIONES DE CUIDADO</Text>
        </View>
      </View>

      <View style={styles.sectionTitleContainer}>
        <Ionicons name="trophy-outline" size={24} color="#FF9800" />
        <Text style={styles.sectionTitle}>Mis Logros Botánicos</Text>
      </View>

      <View style={styles.grid}>
        {renderBadge(
          "Protector del Bosque",
          "shield-checkmark-outline",
          logros.protectorBosque,
          "#E8F5E9",
          "#4CAF50",
        )}
        {renderBadge(
          "Riego Perfecto",
          "water-outline",
          logros.riegoPerfecto,
          "#E3F2FD",
          "#2196F3",
        )}
        {renderBadge(
          "Experto Monsteras",
          "leaf-outline",
          logros.expertoMonsteras,
          "#F1F8E9",
          "#8BC34A",
        )}
        {renderBadge(
          "Rescate Exitoso",
          "medkit-outline",
          logros.rescateExitoso,
          "#FFF3E0",
          "#FF9800",
        )}
        {renderBadge(
          "Coleccionista",
          "star-outline",
          logros.coleccionista,
          "#F3E5F5",
          "#9C27B0",
        )}
        {renderBadge(
          "Jardín Botánico",
          "trophy-outline",
          logros.jardinBotanico,
          "#FFF8E1",
          "#FFC107",
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FF5252" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#F9FBF9",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
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

  /* NUEVOS ESTILOS PARA LA TARJETA DE VIAJE */
  travelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    elevation: 1,
  },
  travelActiveBorder: { borderColor: "#2196F3", backgroundColor: "#F4F9FF" },
  travelLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  travelTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  travelDesc: { fontSize: 12, color: "#666", marginTop: 2 },
  travelButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  travelButtonInactive: { backgroundColor: "#4CAF50" },
  travelButtonActive: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  travelButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },

  /* ESTILOS DEL MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalMainTitle: { fontSize: 20, fontWeight: "bold", color: "#1A1A1A" },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 6,
    marginTop: 10,
  },
  dateInput: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  tipsBox: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  tipsHeaderTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#F57F17",
    marginBottom: 8,
  },
  tipItem: { fontSize: 13, color: "#5D4037", lineHeight: 18, marginBottom: 6 },

  saveTravelBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
  },
  saveTravelBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  cancelTravelBtn: {
    backgroundColor: "#FFEBEE",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  cancelTravelBtnText: { color: "#FF5252", fontSize: 14, fontWeight: "bold" },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 25,
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
  },
  statNumber: { fontSize: 32, fontWeight: "900", marginBottom: 5 },
  statLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#888",
    letterSpacing: 1,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 35,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
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
