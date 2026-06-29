import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { color } from "@/config/adminTheme";

type Props = {
  coverImage: string | null;
  setCoverImage: (v: string | null) => void;
};

export default function CoverImagePicker({ coverImage, setCoverImage }: Props) {
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Autorise l'accès à ta galerie pour choisir une image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Image de couverture</Text>
      <Pressable style={styles.picker} onPress={pickImage}>
        {coverImage ? (
          <>
            <Image source={{ uri: coverImage }} style={styles.preview} />
            <View style={styles.overlay}>
              <Ionicons name="camera-outline" size={20} color={color.white} />
              <Text style={styles.overlayText}>Changer</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.iconWrap}>
              <Ionicons name="image-outline" size={28} color={color.navy} />
            </View>
            <Text style={styles.pickerTitle}>Choisir une image</Text>
            <Text style={styles.pickerSub}>Format 16:9 recommandé</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 7 },
  label: { fontSize: 13, fontWeight: "700", color: color.textPrimary },
  picker: {
    height: 160,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: color.border,
    borderStyle: "dashed",
    backgroundColor: color.deepBlue,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  preview: { width: "100%", height: "100%", resizeMode: "cover" },
  overlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  overlayText: { fontSize: 12, fontWeight: "600", color: color.white },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#E9F2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerTitle: { fontSize: 14, fontWeight: "700", color: color.white },
  pickerSub: { fontSize: 12, color: color.yellow },
});
