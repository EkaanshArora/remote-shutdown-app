import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { MMKV } from 'react-native-mmkv'
  
const storage = new MMKV()

const Setup = (props: {setSettingsPanel: Dispatch<SetStateAction<boolean>>}) => {
  const [ip, setIp] = useState('')
  const [password, setPassword] = useState('')
  const {setSettingsPanel} = props

  useEffect(()=>{
    const ip = storage.getString('ip')
    if(ip)
      setIp(ip)
    const password = storage.getString('password')
    if(password)
      setPassword(password)
  }, [])

  const save = () => {
    storage.set('ip', ip)
    storage.set('password', password)
    console.log(ip, password)
    if (ip && password) {
      setSettingsPanel(false)
    } else {
      console.error('cant save')
    }
  }
  return (
    <View style={{marginHorizontal: 10}}>
      <Text>IP (host:port)</Text>
      <TextInput value={ip} onChangeText={(text) => { setIp(text) }} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={(text) => { setPassword(text) }} />
      <Button title='save' onPress={save}
      />
    </View>
  )
}

export default Setup