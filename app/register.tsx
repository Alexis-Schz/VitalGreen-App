import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AuthService } from "../src/api/AuthService";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Campos incompletos", "Por favor llena todos los datos.");
      return;
    }

    setLoading(true);
    try {
      await AuthService.signUp(email, password, username);
      Alert.alert("¡Bienvenido!", "Tu cuenta ha sido creada con éxito.");
    } catch (error: any) {
      Alert.alert(
        "Error de Registro",
        error.message || "No se pudo crear la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      /* ESTA ES LA CLAVE PARA EMPUJAR LA PANTALLA HACIA ARRIBA */
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      /* EL MARGEN DE COMPENSACIÓN */
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="leaf" size={60} color="#4CAF50" />
          <Text style={styles.title}>Únete a VitalGreen</Text>
          <Text style={styles.subtitle}>
            Crea tu cuenta para empezar tu jardín
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="¿Cómo te llamas?"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.registerButtonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F9FBF9" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  header: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2D5A27", marginTop: 10 },
  subtitle: { fontSize: 16, color: "#666", marginTop: 5 },
  form: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: "#333" },
  registerButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  backButton: { marginTop: 20, alignItems: "center" },
  backButtonText: { color: "#2D5A27", fontSize: 14, fontWeight: "600" },
});
