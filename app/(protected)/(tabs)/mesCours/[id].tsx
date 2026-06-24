import { Collapsible } from "@/components/Archives/Collapsible";
import { ThemedText } from "@/components/Archives/ThemedText";
import { Activity, Image as Img, Music } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Id = () => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        marginVertical: 10,
        paddingBottom: 20,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          marginHorizontal: 20,
          gap: 30,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/** Header */}
        <View
          style={{
            width: "100%",
            height: 400,
            borderRadius: 30,
            position: "relative",
            shadowColor: "#000",
            shadowOffset: { width: 10, height: 15 },
            shadowOpacity: 0.25,
            shadowRadius: 6.5,
          }}
        >
          <Image
            resizeMode="cover"
            source={require("@/assets/images/maison.jpg")}
            style={{ width: "100%", height: "100%", borderRadius: 30 }}
          />
          <View
            style={{ position: "absolute", right: 30, bottom: 35, gap: 10 }}
          >
            {[...Array(3)].map((_, i) => (
              <View
                key={i}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "grey",
                  opacity: 0.6,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 41,
                    height: 41,
                    backgroundColor: "#112e46ff",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Img size={20} color={"#e0e8efff"} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/** Section */}
        <View style={{ width: "90%" }}>
          <ThemedText type="subtitle">Vue d'ensemble</ThemedText>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "90%",
            justifyContent: "space-between",
            marginHorizontal: 20,
          }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                borderRadius: 50,
                backgroundColor: "#d3d3d3",
                width: 35,
                height: 35,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Activity size={25} color={"#e76f51"} />
            </View>
            <View>
              <ThemedText type="defaultSemiBold">Guitare</ThemedText>
              <ThemedText type="transparent">Instrument</ThemedText>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                borderRadius: 50,
                backgroundColor: "#d3d3d3",
                width: 35,
                height: 35,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Music size={25} color={"#e76f51"} />
            </View>
            <View>
              <ThemedText type="defaultSemiBold">Shape of You</ThemedText>
              <ThemedText type="transparent">Ed Sheeran</ThemedText>
            </View>
          </View>
        </View>

        {/** Partition */}
        <View style={{ width: "90%" }}>
          <Collapsible title="Partition">
            <ThemedText>
              Ajouter une partition afin de permettre le suivi
            </ThemedText>
          </Collapsible>
        </View>

        {/** Description */}
        <View style={{ width: "90%" }}>
          <ThemedText>
            Paru en 2017 sur l’album Divide (÷), Shape of You est l’un de ses
            plus grands succès. Ce titre au rythme entraînant, porté par des
            sonorités dancehall et pop, célèbre l’attraction et la spontanéité
            des rencontres. Avec plus d’un milliard d’écoutes en streaming et un
            impact mondial, la chanson est devenue un incontournable des
            playlists et un hymne de soirée.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Id;

const styles = StyleSheet.create({});
