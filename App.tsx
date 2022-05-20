/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import Toast from 'react-native-toast-message';
import Button from './src/Button';
import Setup from './src/Setup';
import Zeroconf from 'react-native-zeroconf';
import Clipboard from '@react-native-community/clipboard';

const zeroconf = new Zeroconf();

const storage = new MMKV();

const Shutdown: React.FC = () => {
  const [settingsPanel, setSettingsPanel] = useState(false);
  const [IPs, setIPs] = useState<string[]>([]);
  const [requestIP, setRequestIP] = useState('');
  const [password, setPassword] = useState('');
  const [port, setPort] = useState('');
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const showToast = (type: string, text1: string, text2: string) => {
    Toast.show({type, text1, text2});
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });
    return () => {
      subscription.remove();
    };
  }, []);

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
    if (appStateVisible === 'active') {
      setIPs([]);
      zeroconf.scan();
    }
  }, [appStateVisible]);

  useEffect(() => {
    console.log('calling ue');
    zeroconf.on('start', () => {
      console.log('start');
    });
    zeroconf.on('found', e => {
      console.log('found', e);
    });
    zeroconf.on('resolved', e => {
      console.log('resolved', e.addresses, !IPs.includes(e.addresses[0]), IPs);
      e.addresses.map(ip => {
        if (ip.startsWith('192')) {
          if (!IPs.includes(e.addresses[0])) {
            console.log('adding');
            setIPs(p => [...p, e.addresses[0]]);
            setRequestIP(e.addresses[0]);
          }
        }
      });
    });
    return () => {
      console.log('cleanup');
      zeroconf.removeDeviceListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postRequest = (mode: string, json: string) => {
    console.log(`http://${requestIP}:${port}/${password}/${mode}`, json);
    fetch(`http://${requestIP}:${port}/${password}/${mode}`, {
      body: json,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        res.json().then(data => {
          console.log(data);
          if (data.status) {
            showToast(data.status, data.status, data.data);
          }
        });
      })
      .catch(e => {
        console.error(e);
        showToast(
          'error',
          'Error',
          'Fetch request error, check credentials and wifi',
        );
      });
  };

  const getRequest = (mode: string) => {
    console.log(`http://${requestIP}:${port}/${password}/${mode}`);
    fetch(`http://${requestIP}:${port}/${password}/${mode}`)
      .then(res => {
        res.json().then(data => {
          console.log(data);
          if (data.data) {
            Clipboard.setString(data.data);
            showToast('success', data.data, 'Set clipboard successfully');
          } else {
            showToast('success', 'Success', 'Set clipboard successfully');
          }
        });
      })
      .catch(e => {
        console.error(e);
        showToast(
          'error',
          'Error',
          'Fetch request error, check credentials and wifi',
        );
      });
  };

  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: '#fff',
          height: '100%',
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
            margin: 0,
            justifyContent: 'space-around',
          }}>
          <Button
            onPress={() =>
              Clipboard.getString().then(str => {
                postRequest('writeclip', JSON.stringify({clip: str}));
              })
            }
            title="Send Clip"
            color="#ff77cc"
          />
          <Button
            onPress={() => getRequest('readclip')}
            title="Get Clip"
            color="#cc77ff"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            margin: 25,
            justifyContent: 'space-around',
          }}>
          <Button onPress={() => getRequest('screen')} title="Screen Off" />
          <Button
            onPress={() => getRequest('sleep')}
            title="Sleep"
            color="#ffbb00"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            margin: 0,
            justifyContent: 'space-around',
          }}>
          <Button
            onPress={() => getRequest('shutdown')}
            title="Shutdown"
            color="#ff1157"
          />
          <Button
            onPress={() => getRequest('restart')}
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
              Sending request to {`http://${requestIP}:${port}`} with password "
              {storage.getString('password')}"
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
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setRequestIP(pc);
                }}>
                <Text> {pc} </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
      <Toast position="bottom" />
    </>
  );
};

export default Shutdown;
