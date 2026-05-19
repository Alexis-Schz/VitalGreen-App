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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos vacíos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await AuthService.signIn(email, password);
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error de Inicio de Sesión",
        error.message || "Credenciales incorrectas.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      /* ESTA ES LA CLAVE: Forzamos el empuje hacia arriba en Android y iOS */
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      /* Agregamos un pequeño margen para que el teclado no quede al ras del input */
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={80} color="#4CAF50" />
          <Text style={styles.appTitle}>VitalGreen</Text>
          <Text style={styles.appSubtitle}>
            Asistente Inteligente de Jardinería Urbana
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>¡Hola de nuevo!</Text>
          <Text style={styles.instructionText}>
            Inicia sesión para cuidar de tus plantas
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
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
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.registerLinkText}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.registerLinkBold}>Regístrate aquí</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F9FBF9" },
  /* El flexGrow: 1 es vital para que el ScrollView se pueda encoger cuando sale el teclado */
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 24 },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D5A27",
    marginTop: 10,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  welcomeText: { fontSize: 24, fontWeight: "bold", color: "#333" },
  instructionText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 25,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: "#333" },
  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  loginButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  registerLink: { marginTop: 24, alignItems: "center" },
  registerLinkText: { color: "#666", fontSize: 14 },
  registerLinkBold: { color: "#2D5A27", fontWeight: "bold" },
});
