import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, View } from 'react-native';
import { MMKV } from 'react-native-mmkv'
import Toast from 'react-native-toast-message';
import Button from './src/Button';
import Setup from './src/Setup';

const storage = new MMKV()

const Shutdown: React.FC = () => {
  const [settingsPanel, setSettingsPanel] = useState(false)
  let ip: string, password: string

  useEffect(() => {
    const ip2 = storage.getString('ip')
    if (ip2) {
      ip = ip2
    } else {
      setSettingsPanel(true)
    }
    const password2 = storage.getString('password')
    if (password2) {
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
        <Text style={{ textAlign: 'center', margin: 10, fontSize: 26, fontWeight: '700', marginBottom: '20%'}}>Shutdown Remote</Text>
        <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'space-around' }}>
          <Button onPress={() => request('screen')} title='Screen Off' />
          <Button onPress={() => request('sleep')} title='Sleep' color='#ffbb00' />
        </View>
        <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'space-around' }}>
          <Button onPress={() => request('shutdown')} title='Shutdown' color='#ff1157' />
          <Button onPress={() => request('restart')} title='Restart' color='#00da55' />
        </View>
        {settingsPanel ?
          <Setup setSettingsPanel={setSettingsPanel} /> :
          <>
            <Text style={{ textAlign: 'center', marginTop: 50 }}>Sending request to {storage.getString('ip')}, with password '{storage.getString('password')}'</Text>
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