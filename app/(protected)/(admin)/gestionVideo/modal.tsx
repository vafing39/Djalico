import { Ionicons } from "@expo/vector-icons";
import { PickerIOS } from '@react-native-picker/picker';
import React, { useState } from "react";
import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


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


export default function ModalView({onVisible, onCloseModal}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [picker, setPicker] = useState();

    return (
        <SafeAreaView>
            <Modal 
                visible={onVisible}
                animationType='slide'
                onRequestClose={() => {onCloseModal}}
                presentationStyle="formSheet"
            >
                <View style={{flex:1,gap:20, justifyContent:'center', alignItems:'center', paddingHorizontal:20, backgroundColor:COLORS.bgGradientTop}}>
                    {/* Titre */}   
                    <TouchableOpacity style={styles.addButton} onPress={()=>setModalVisible(true)}>
                        <Ionicons name="cloud-upload-outline" size={20} color={COLORS.deepBlue} />
                        <Text style={styles.addButtonText}>Importer la vidéo</Text>
                    </TouchableOpacity>
                    <View style={{width:'90%', gap:10}}>
                        <Text>Titre</Text>
                        <TextInput 
                            placeholder="Percussion..." 
                            placeholderTextColor="#8B8B8B"
                            value=""
                            style={styles.input}
                            />
                    </View>
                    <View style={{width:'90%', gap:10}}>
                        <Text>Description</Text>
                        <TextInput 
                            placeholder="Percussion..." 
                            placeholderTextColor="#8B8B8B"
                            value=""
                            style={[styles.input, {height:100}]}
                            multiline
                            />
                    </View>  
                    <View style={{width:'90%', gap:10}}>
                        <Text>Categorie</Text>
                        <PickerIOS
                          selectedValue={picker}
                          
                          onValueChange={(itemValue, itemIndex) =>
                            setPicker(itemValue)
                          }
                          
                          >
                          <PickerIOS.Item label="Java" value="java" />
                          <PickerIOS.Item label="JavaScript" value="js" />
                        </PickerIOS>
                    </View>          
                    <Button title="Close Modal" onPress={onCloseModal}/>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGradientTop,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.yellow,
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    width:'90%'
  },
  addButtonText: {
    marginLeft: 8,
    color: COLORS.deepBlue,
    fontWeight: "600",
  },
  input: {
    borderWidth: 0,
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111",
    width:'100%'
  },

});