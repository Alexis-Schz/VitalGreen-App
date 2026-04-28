// src/components/PlantCard.tsx
import { Ionicons } from "@expo/vector-icons"; // Iconos gratuitos de Expo
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";

interface PlantProps {
  apodo: string;
  especie: string;
  salud: number;
}

export const PlantCard = ({ apodo, especie, salud }: PlantProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.apodoText}>{apodo}</Text>
        <Text style={styles.especieText}>{especie}</Text>

        {/* Barra de Salud Visual */}
        <View style={styles.healthTrack}>
          <View style={[styles.healthBar, { width: `${salud}%` }]} />
        </View>
        <Text style={styles.percentageText}>{salud}% Salud</Text>
      </View>

      {/* Botón de Riego Rápido */}
      <TouchableOpacity style={styles.waterButton} activeOpacity={0.7}>
        <Ionicons name="water" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    elevation: 3, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  infoContainer: { flex: 1 },
  apodoText: { fontSize: 18, fontWeight: "bold", color: Colors.textMain },
  especieText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 10,
  },
  healthTrack: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    width: "80%",
  },
  healthBar: {
    height: "100%",
    backgroundColor: Colors.healthBar,
  },
  percentageText: { fontSize: 12, color: "#888", marginTop: 4 },
  waterButton: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
