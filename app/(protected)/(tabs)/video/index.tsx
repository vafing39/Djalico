import { ThemedText } from '@/components/ThemedText'
import { LinearGradient } from 'expo-linear-gradient'
import { Bookmark, Feather, ListFilterPlus } from 'lucide-react-native'
import React from 'react'
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const COLORS = {
  deepBlue: "#0E2B45",       // text & deep accents
  navy: "#103149",
  paleBlue: "#F3F8FB",       // background card
  bgGradientTop: "#ECF6FF",  // page gradient top
  bgGradientBottom: "#FFFFFF",
  yellow: "#FFD66B",         // accent pastel yellow
  yellowDark: "#F6C04F",
  softGray: "#9AA6B2",
};

const { width } = Dimensions.get("window");

const TOP_VIDEOS = [
  {
    id: "v1",
    title: "Chemin vers la guitare",
    subtitle: "7 vidéos",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=60",
    expert: true,
  },
  {
    id: "v2",
    title: "Chemin vers la guitare",
    subtitle: "7 vidéos",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=60",
    expert: true,
  },
  {
    id: "v3",
    title: "Chemin vers la guitare",
    subtitle: "7 vidéos",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=60",
    expert: true,
  },
  {
    id: "v4",
    title: "Chemin vers la guitare",
    subtitle: "7 vidéos",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=60",
    expert: true,
  },
  {
    id: "v5",
    title: "Chemin vers la guitare",
    subtitle: "7 vidéos",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=60",
    expert: true,
  },
];

const Video = () => {
  return (
    <SafeAreaView  style={styles.container}>
      <LinearGradient
              colors={[COLORS.bgGradientTop, COLORS.bgGradientBottom]}
              style={styles.pageGradient}
            >
      <ThemedText type='title'>Catalogue vidéo</ThemedText>
      <View style={{alignItems:'center', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <ThemedText type='paragraphe' style={{fontWeight:'bold'}}>36 contenus vidéo trouvés</ThemedText>
        <View style={{display:'flex', flexDirection:'row', gap:10, justifyContent:'center', alignItems:'center', borderColor:'#c8cccfff', borderWidth:0.5, padding:5, borderRadius:10, shadowColor: "#000",
                      shadowOffset: { width: 5, height:6 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6.5}}>
            <ListFilterPlus size={25}/>
            <ThemedText type='paragraphe'>Modifier filtre</ThemedText>
        </View>
      </View>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather size={20} color={COLORS.deepBlue} />
          <TextInput
            placeholder="Chercher un instrument, une vidéo..."
            placeholderTextColor={COLORS.softGray}
            style={styles.searchInput}
          />
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={TOP_VIDEOS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            
          </View>
        }
        renderItem={({ item }) => <VideoCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
      </LinearGradient>
    </SafeAreaView>
  )
}

function VideoCard({ item }) {
  return (
    <View style={styles.cardRow}>
      <View style={styles.card}>
        <View style={styles.thumbWrap}>
          <Image source={{ uri: item.image }} style={styles.thumbImage} />
          <View style={styles.thumbBadge}>
            <Text style={styles.thumbBadgeText}>Expert</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={2} style={styles.cardTitle}>
              {item.title}
            </Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>

          <Pressable style={styles.iconHeart}>
            <Bookmark size={20} color={COLORS.yellowDark} />
          </Pressable>
        </View>
      </View>

      {/* duplicate for second column if you want side-by-side; here for single-column feed */}
    </View>
  );
}

export default Video

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGradientTop,
  },
  searchRow: {
    marginTop: 5,
  },
  pageGradient: {
    flex: 1,
    paddingHorizontal:20, 
    paddingBottom:20, 
    justifyContent:'center', 
    marginVertical:20, 
    gap:20
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 15,
    color: COLORS.deepBlue,
  }
  ,
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.deepBlue,
    fontWeight: "700",
    marginBottom: 12,
  },
  cardRow: {
    // single column card centered
    alignItems: "center",
  },
  card: {
    width: width - 40,
    backgroundColor: COLORS.paleBlue,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    position:'relative',
    borderWidth:1,
    borderColor:COLORS.yellowDark
  },
  thumbWrap: {
    backgroundColor: "#e8f2f8",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  thumbBadge: {
    position: "absolute",
    top: 20,
    left: 25,
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  thumbBadgeText: {
    fontWeight: "600",
    color: COLORS.deepBlue,
  },
  thumbImage: {
    width: "92%",
    height: "88%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  cardFooter: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    color: COLORS.deepBlue,
    fontWeight: "700",
    fontSize: 18,
  },
  cardSubtitle: {
    color: COLORS.softGray,
    marginTop: 4,
  },
  iconHeart: {
    marginLeft: 12,
    padding: 6,
  }
})