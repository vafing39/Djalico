import { AuthContext } from '@/contexts/authContext'
import React, { useContext } from 'react'
import { Button, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const login = () => {
  const authState = useContext(AuthContext)

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