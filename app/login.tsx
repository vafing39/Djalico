import { logIn } from '@/contexts/api'
import { AuthContext } from '@/contexts/authContext'
import { router } from 'expo-router'
import React, { useContext, useState } from 'react'
import { Button, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const login = () => {
  const authState = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  
  const handleLogin = async () => {
    try {
      const token = await logIn(username, password)
      if (token) {
        router.replace('/(protected)/(admin)/home');
      } else {
        console.error('Échec de la connexion');
      }
    }catch (error) {
      console.error("Impossible de recuperer les users",error)
    }
  }

  return (
    <SafeAreaView>
      <Text>login</Text>
        <Button title='Login as user' onPress={authState.logIn}/>
        <Button title='Login as admin' onPress={authState.logInAsAdmin}/>
    </SafeAreaView>
  )
}

export default login

const styles = StyleSheet.create({})