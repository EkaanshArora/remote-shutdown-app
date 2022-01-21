import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { MMKV } from 'react-native-mmkv'
import Toast from 'react-native-toast-message';
import Setup from './Setup';

const storage = new MMKV()

const Shutdown: React.FC = () => {
  const [settingsPanel, setSettingsPanel] =  useState(false)
  let ip: string, password: string
  
  useEffect(()=>{
    const ip2 = storage.getString('ip')
    if(ip2) {
      ip = ip2
    } else {
      setSettingsPanel(true)
    }
    const password2 = storage.getString('password')
    if(password2) {
      password = password2
    } else {
      setSettingsPanel(true)
    }
  }, [settingsPanel])

  const request = (mode: string) => {
    console.log(`http://${ip}/${password}/${mode}`)
    fetch(`http://${ip}/${password}/${mode}`).then(e => {
      console.log(e)
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Sent request successfully 👋',
      });
    }).catch(e => {
      // console.error(e)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Fetch request error, check credentials and wifi',
      });
    })
  }

  return (
    <>
      <SafeAreaView>
      <Text style={{textAlign: 'center', margin: 10, fontSize: 22, fontWeight: '700'}}>Shutdown Remote</Text>
        <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'space-around' }}>
          <Button onPress={() => request('Turn screen off')} title='screen off' />
          <Button onPress={() => request('suspend')} title='sleep' color='#ffbb00' />
          <Button onPress={() => request('shutdown')} title='shutdown' color='#ff1157' />
        </View>
        {settingsPanel ?
          <Setup setSettingsPanel={setSettingsPanel} /> :
          <>
            <Text style={{textAlign: 'center', marginTop: 50}}>Sending request to {storage.getString('ip')}, with password '{storage.getString('password')}'</Text>
            <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'space-around' }}>
              <Button title='Change' onPress={() => { setSettingsPanel(!settingsPanel) }} />
            </View>
          </>}
      </SafeAreaView>
      <Toast position='bottom' />
    </>
  )
}

export default Shutdown