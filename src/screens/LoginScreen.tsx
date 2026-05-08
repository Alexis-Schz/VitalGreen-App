import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthService } from "../api/AuthService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await AuthService.signIn(email, password);
      Alert.alert("¡Bienvenido!", "Has iniciado sesión correctamente.");
      // Aquí podrías usar una función para refrescar el estado global de la app
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await AuthService.signUp(email, password);
      Alert.alert(
        "Verifica tu correo",
        "Te enviamos un enlace de confirmación.",
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>VitalGreen</Text>
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Entrar" onPress={handleLogin} color="#2D5A27" />
      <Text style={{ marginVertical: 10, textAlign: "center" }}>o</Text>
      <Button title="Registrarse" onPress={handleRegister} color="#888" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#F9FBF9",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D5A27",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
});
