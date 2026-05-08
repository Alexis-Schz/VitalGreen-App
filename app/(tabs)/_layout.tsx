import { Ionicons } from "@expo/vector-icons"; // Librería de iconos de Expo
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2D5A27", // Tu verde principal
        tabBarInactiveTintColor: "#888888", // Gris para los inactivos
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
          height: 65, // Un poco más alta para que sea cómoda
          paddingBottom: 10,
          paddingTop: 5,
        },
        headerTitleStyle: {
          color: "#2D5A27",
          fontWeight: "bold",
          fontSize: 20,
        },
        headerShadowVisible: false, // Quita la línea fea debajo del título superior
      }}
    >
      {/* Pestaña 1: Dashboard (La que ya tienes) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Mi Jardín",
          tabBarIcon: ({ color }) => (
            <Ionicons name="leaf" size={26} color={color} />
          ),
        }}
      />

      {/* Pestaña 2: Catálogo (La que acabamos de programar) */}
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Añadir",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add" size={26} color={color} />
          ),
        }}
      />

      {/* Pestaña 3: Escanear Plagas (Del CU-03 de tu documento) */}
      <Tabs.Screen
        name="scan"
        options={{
          title: "Escanear",
          tabBarIcon: ({ color }) => (
            <Ionicons name="camera" size={26} color={color} />
          ),
        }}
      />

      {/* Pestaña 4: Perfil del Usuario */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
