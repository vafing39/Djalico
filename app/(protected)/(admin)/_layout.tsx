import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/Archives/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useLanguage } from "@/hooks/useLanguage";

export default function AdminLayout() {
  const colorScheme = useColorScheme();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            backgroundColor: "transparent",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("admin.tabs.home"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gestionVideo"
        options={{
          title: t("admin.tabs.videos"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="play.rectangle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gestionCours"
        options={{
          title: t("admin.tabs.courses"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gestionParcours"
        options={{
          title: t("admin.tabs.parcours"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="map.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gestionUser"
        options={{
          title: t("admin.tabs.users"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.badge.plus.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: t("admin.tabs.settings"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
