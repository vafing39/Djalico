import { Tabs, usePathname } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/Archives/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useLanguage } from "@/hooks/useLanguage";

const COLORS = {
  deepBlue: "#0E2B45", // text & deep accents
  navy: "#103149",
  paleBlue: "#F3F8FB", // background card
  bgGradientTop: "#ECF6FF", // page gradient top
  bgGradientBottom: "#FFFFFF",
  yellow: "#FFD66B", // accent pastel yellow
  yellowDark: "#F6C04F",
  softGray: "#9AA6B2",
};

const TAB_BAR_STYLE = Platform.select({
  ios: {
    // Use a transparent background on iOS to show the blur effect
    position: "absolute" as const,
    backgroundColor: "transparent",
  },
  default: {},
});

// Settings sub-screens that should render full-screen, without the tab bar
const SETTINGS_SUBSCREENS = ["/settings/language", "/settings/editProfile", "/settings/legal"];

export default function TabLayout() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const hideTabBar = SETTINGS_SUBSCREENS.some((route) => pathname.startsWith(route));

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.navy,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: hideTabBar ? { display: "none" } : TAB_BAR_STYLE,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Explorer"
        options={{
          title: t("tabs.explorer"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mesCours"
        options={{
          title: t("tabs.mesCours"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="play.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sauvegardes"
        options={{
          title: t("tabs.sauvegardes"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bookmark" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.profil"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
