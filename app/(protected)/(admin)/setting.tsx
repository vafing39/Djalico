// AdminSettingsPage.js
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  deepBlue: "#0E2B45",
  navy: "#103149",
  paleBlue: "#F3F8FB",
  bgGradientTop: "#ECF6FF",
  bgGradientBottom: "#FFFFFF",
  yellow: "#FFD66B",
  yellowDark: "#F6C04F",
  softGray: "#9AA6B2",
};

export default function setting() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const SettingItem = ({ icon, label, onPress, toggle, value }) => (
    <TouchableOpacity
      style={styles.settingItem}
      activeOpacity={toggle ? 1 : 0.7}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={COLORS.navy} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {toggle ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: COLORS.softGray, true: COLORS.yellow }}
          thumbColor={COLORS.deepBlue}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={COLORS.softGray} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgGradientBottom }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.pageTitle}>Paramètres administrateur</Text>

        {/* Section Profil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <SettingItem icon="person" label="Modifier le profil" onPress={() => {}} />
          <SettingItem icon="mail" label="Changer l'email" onPress={() => {}} />
          <SettingItem icon="lock-closed" label="Modifier mot de passe" onPress={() => {}} />
        </View>

        {/* Section Préférences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <SettingItem
            icon="moon"
            label="Mode sombre"
            toggle
            value={darkMode}
            onPress={() => setDarkMode(!darkMode)}
          />
          <SettingItem
            icon="notifications"
            label="Notifications"
            toggle
            value={notifications}
            onPress={() => setNotifications(!notifications)}
          />
        </View>

        {/* Section Sécurité & Gestion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité & gestion</Text>
          <SettingItem icon="people" label="Gérer les rôles utilisateurs" onPress={() => {}} />
          <SettingItem icon="log-out" label="Se déconnecter" onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.deepBlue,
    marginBottom: 20,
  },
  section: {
    backgroundColor: COLORS.paleBlue,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.navy,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgGradientBottom,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.deepBlue,
    fontWeight: "500",
  },
});
