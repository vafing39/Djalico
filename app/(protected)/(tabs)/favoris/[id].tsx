import { ThemedText } from '@/components/ThemedText'
import React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const heart = () => {

     const instrument = [
        {id:"Guitare", name:"Guitare"},
        {id:"Basse", name:"Basse"},
        {id:"Trompette", name:"Trompette"},
        {id:"Flutte", name:"Flutte"},
        {id:"Saxophone", name:"Saxophone"},
    ]
  return (
    <SafeAreaView style={{gap : 15}}>
      <View style={{backgroundColor:"red", width:"100%", height:580}}> 
      </View>
      <View style={{marginHorizontal:20}}>
        <View style={{width:'100%', gap:20}}>
        <ThemedText type="subtitle">Videos favorites</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{display:'flex', flexDirection:'row', gap:15}}>
            {instrument.map( item => {
              return (
                <View key={item.id} style={{position:'relative',backgroundColor:'#e0e8efff',padding:5, width:100, height:150, borderRadius:15, alignItems:'center'}}>
                  <View style={{width: 90, height:100, padding:5, shadowColor: "#000",
                      shadowOffset: { width: 10, height: 15 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6.5,}}>
                    <Image source={require('@/assets/images/template.jpg')} style={{width:'100%', height:'100%', borderRadius:15}}/>
                    <Text style={{fontSize:10,position:'absolute', right:10, top:15, padding:5, backgroundColor:'black', borderRadius:10, textAlign:'center', color:'white', opacity:0.6}}>Expert</Text>
                  </View>
                  <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'100%', alignItems:'center',padding:3}}>
                      <Text style={{fontWeight:'bold', fontSize:10}}>Chemin vers la guitare</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>
      </View>
    </SafeAreaView>
  )
}

export default heart

const styles = StyleSheet.create({})