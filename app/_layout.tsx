import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../src/api/SupabaseConfig"; // Importamos supabase directamente

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // 1. Revisar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setInitializing(false);
    });

    // 2. ESCUCHAR CAMBIOS (Login/Logout)
    // Esto es lo que faltaba: avisar a la app cuando el usuario entra o sale
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (initializing) return;

    // ¡CAMBIO IMPORTANTE AQUÍ!
    // Ahora el sistema sabe que "login" y "register" son pantallas para invitados
    const inAuthGroup = segments[0] === "login" || segments[0] === "register";

    // Si no hay usuario y no está en login/register, mandarlo a login
    if (!user && !inAuthGroup) {
      router.replace("/login");
    }
    // Si hay usuario y está atrapado en login/register, mandarlo al home
    else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, segments, initializing]);

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#F9FBF9",
        }}
      >
        <ActivityIndicator size="large" color="#2D5A27" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />

      {/* ¡NUEVA PANTALLA! Registro de usuarios */}
      <Stack.Screen
        name="register"
        options={{ title: "Crear Cuenta", headerShown: true }}
      />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* ¡NUEVA PANTALLA! Detalles y cuidados de la planta */}
      <Stack.Screen
        name="plant/[id]"
        options={{ title: "Detalle de la Planta" }}
      />
    </Stack>
  );
}
