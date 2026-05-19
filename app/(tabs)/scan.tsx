import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function ScanScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnostic, setDiagnostic] = useState<any>(null);

  // 1. ABRIR LA GALERÍA / CÁMARA
  const pickImage = async () => {
    // Pedimos permiso para acceder a las fotos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a tu galería para analizar la planta.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Calidad baja para que sea rápido (MVP)
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setDiagnostic(null); // Limpiamos diagnósticos anteriores
    }
  };

  // 2. SIMULADOR DEL MOTOR DE INTELIGENCIA ARTIFICIAL (CU-08)
  const analyzeImage = () => {
    if (!imageUri) return;

    setAnalyzing(true);

    // Simulamos el retraso de red de una API de IA (3 segundos)
    setTimeout(() => {
      setAnalyzing(false);
      // Diagnóstico "Mock" (Preprogramado)
      setDiagnostic({
        plaga: "Cochinilla Algodonosa",
        confianza: "92%",
        severidad: "Media",
        tratamiento:
          "Limpia las hojas con un algodón empapado en alcohol isopropílico. Luego, aplica aceite de Neem diluido en agua cada 5 días.",
      });
    }, 3000);
  };

  // 3. CONTACTAR AL EXPERTO HUMANO (CU-09)
  const contactExpert = () => {
    Alert.alert(
      "Contactar Botánico",
      "¿Deseas enviar esta fotografía y el pre-diagnóstico a un experto humano para una segunda opinión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar Ticket",
          onPress: () => {
            // Aquí en un MVP demostramos la intención de conexión.
            // Podrías cambiar esto a Linking.openURL('whatsapp://send?phone=TUNUMERO') si quisieras.
            Alert.alert(
              "✅ Ticket Enviado",
              "Un experto revisará tu caso. Recibirás una notificación con su respuesta en un máximo de 30 minutos (Horario Laboral).",
            );
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Clínica VitalGreen</Text>
        <Text style={styles.subtitle}>
          Sube una foto clara de la hoja enferma
        </Text>
      </View>

      {/* ÁREA DE LA IMAGEN */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera-outline" size={60} color="#BDBDBD" />
            <Text style={styles.placeholderText}>
              Ninguna imagen seleccionada
            </Text>
          </View>
        )}
      </View>

      {/* BOTONES DE ACCIÓN */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={pickImage}
          disabled={analyzing}
        >
          <Ionicons name="image-outline" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Seleccionar Foto</Text>
        </TouchableOpacity>

        {imageUri && !diagnostic && (
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzeImage}
            disabled={analyzing}
          >
            {analyzing ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="scan-outline" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Analizar con IA</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* RESULTADO DE LA IA */}
      {diagnostic && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Ionicons name="warning-outline" size={24} color="#FF9800" />
            <Text style={styles.resultTitle}>Diagnóstico Completado</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Anomalía detectada:</Text>
            <Text style={styles.resultValue}>{diagnostic.plaga}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Precisión de la IA:</Text>
            <Text style={[styles.resultValue, { color: "#4CAF50" }]}>
              {diagnostic.confianza}
            </Text>
          </View>

          <Text style={styles.treatmentTitle}>Plan de Tratamiento:</Text>
          <Text style={styles.treatmentText}>{diagnostic.tratamiento}</Text>
        </View>
      )}

      {/* CONTACTO CON EXPERTO (Se muestra siempre, pero es más útil tras el escaneo) */}
      <TouchableOpacity style={styles.expertButton} onPress={contactExpert}>
        <Ionicons name="chatbubbles-outline" size={24} color="#2196F3" />
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.expertTitle}>¿Dudas? Consulta a un experto</Text>
          <Text style={styles.expertSubtitle}>
            Respuesta garantizada en 30 minutos
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBF9" },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 32, fontWeight: "900", color: "#1A1A1A" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 5 },

  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#EEEEEE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  placeholderText: { marginTop: 10, color: "#9E9E9E", fontWeight: "500" },
  image: { width: "100%", height: 250, borderRadius: 20 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  selectButton: {
    flexDirection: "row",
    backgroundColor: "#757575",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  analyzeButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: { color: "#FFF", fontWeight: "bold", marginLeft: 8 },

  resultCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  resultLabel: { fontSize: 14, color: "#666", fontWeight: "500" },
  resultValue: { fontSize: 14, fontWeight: "bold", color: "#333" },
  treatmentTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2D5A27",
    marginTop: 10,
    marginBottom: 5,
  },
  treatmentText: { fontSize: 14, color: "#444", lineHeight: 22 },

  expertButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  expertTitle: { fontSize: 16, fontWeight: "bold", color: "#1976D2" },
  expertSubtitle: { fontSize: 12, color: "#1565C0", marginTop: 2 },
});
