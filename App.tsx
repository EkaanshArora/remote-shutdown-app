/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import Toast from 'react-native-toast-message';
import Button from './src/Button';
import Setup from './src/Setup';
import Zeroconf from 'react-native-zeroconf'

const zeroconf = new Zeroconf()

const storage = new MMKV();

const Shutdown: React.FC = () => {
  const [settingsPanel, setSettingsPanel] = useState(false);
  const [IPs, setIPs] = useState<string[]>([]);
  const [requestIP, setRequestIP] = useState('');
  const [password, setPassword] = useState('');
  const [port, setPort] = useState('');

  useEffect(() => {
    const cacheIP = storage.getString('ip');
    if (cacheIP) {
      setRequestIP(cacheIP);
    } else {
      setSettingsPanel(true);
    }
    const cachePassword = storage.getString('password');
    if (cachePassword) {
      setPassword(cachePassword);
    } else {
      setSettingsPanel(true);
    }
    const cachePort = storage.getString('port');
    if (cachePort) {
      setPort(cachePort);
    } else {
      setSettingsPanel(true);
    }
  }, [settingsPanel]);

  useEffect(() => {
    console.log('calling ue')
    zeroconf.scan('http')
    zeroconf.on('start', () => {
      console.log('start')
    })
    zeroconf.getServices()
    zeroconf.on('found', (e) => {
      console.log('found', e)
    })
    zeroconf.on('resolved', (e) => {
      console.log('resolved', e.addresses, !IPs.includes(e.addresses[0]), IPs)
      e.addresses.map(ip => {
        if (ip.startsWith('192')) {
          if (!IPs.includes(e.addresses[0])) {
            console.log('adding')
            setIPs(p => [...p, e.addresses[0]]);
          }
        }
      })
    })
    return(()=>{
      console.log('cleanup')
      zeroconf.removeDeviceListeners()
    })
  }, [])

  const request = (mode: string) => {
    console.log(`http://${requestIP}:${port}/${password}/${mode}`);
    fetch(`http://${requestIP}:${port}/${password}/${mode}`)
      .then(e => {
        console.log(e);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Sent request successfully 👋',
        });
      })
      .catch(e => {
        console.error(e);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Fetch request error, check credentials and wifi',
        });
      });
  };

  return (
    <>
      <SafeAreaView style={{
        backgroundColor: '#fff',
        height: '100%'
      }}>
        <Text
          style={{
            textAlign: 'center',
            margin: 10,
            fontSize: 26,
            fontWeight: '700',
            marginBottom: '20%',
          }}>
          Shutdown Remote
        </Text>
        <View
          style={{
            flexDirection: 'row',
            margin: 10,
            justifyContent: 'space-around',
          }}>
          <Button onPress={() => request('screen')} title="Screen Off" />
          <Button
            onPress={() => request('sleep')}
            title="Sleep"
            color="#ffbb00"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            margin: 10,
            justifyContent: 'space-around',
          }}>
          <Button
            onPress={() => request('shutdown')}
            title="Shutdown"
            color="#ff1157"
          />
          <Button
            onPress={() => request('restart')}
            title="Restart"
            color="#00da55"
          />
        </View>
        {settingsPanel ? (
          <Setup setSettingsPanel={setSettingsPanel} />
        ) : (
          <>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 50,
                margin: 40,
                marginBottom: 10,
              }}>
              Sending request to {`http://${requestIP}:${port}`} with password "{storage.getString('password')}"
            </Text>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
                justifyContent: 'space-around',
              }}>
              <Button
                title="Change"
                onPress={() => {
                  setSettingsPanel(!settingsPanel);
                }}
              />
            </View>
          </>
        )}
        <View style={{marginTop: 'auto', marginBottom: '20%'}}>
          <Text>PCs found:</Text>
          {IPs.map((pc, index) => {
            return (
              <Text
                onPress={() => {
                  setRequestIP(pc);
                }}
                key={index}>
                {pc}
              </Text>
            );
          })}
        </View>
      </SafeAreaView>
      <Toast position="bottom" />
    </>
  );
};

export default Shutdown;
