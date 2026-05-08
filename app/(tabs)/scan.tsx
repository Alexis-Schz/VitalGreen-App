import { StyleSheet, Text, View } from "react-native";

export default function ScanRoute() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Pantalla de Cámara en construcción 📷</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FBF9",
  },
  texto: { fontSize: 18, color: "#666" },
});
