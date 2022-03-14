import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import Button from './Button';

const storage = new MMKV();

const Setup = (props: {
  setSettingsPanel: Dispatch<SetStateAction<boolean>>;
}) => {
  const [IP, setIP] = useState('');
  const [port, setPort] = useState('5001');
  const [password, setPassword] = useState('');
  const {setSettingsPanel} = props;

  useEffect(() => {
    const ipCache = storage.getString('ip');
    if (ipCache) {
      setIP(ipCache);
    }
    const passwordCache = storage.getString('password');
    if (passwordCache) {
      setPassword(passwordCache);
    }
    const portCache = storage.getString('port');
    if (portCache) {
      setPort(portCache);
    }
  }, []);

  const save = () => {
    storage.set('ip', IP);
    storage.set('password', password);
    storage.set('port', port);
    console.log(IP, password, port);
    if (IP && password && port) {
      setSettingsPanel(false);
    } else {
      console.error('cant save');
    }
  };

  return (
    <View style={{marginHorizontal: 10, marginVertical: 20}}>
      <Text>IP (host)</Text>
      <TextInput
        value={IP}
        style={{borderBottomWidth: 1, marginBottom: 15, marginTop: 5}}
        onChangeText={text => {
          setIP(text);
        }}
      />
      <Text>Port</Text>
      <TextInput
        value={port}
        style={{borderBottomWidth: 1, marginBottom: 15, marginTop: 5}}
        onChangeText={text => {
          setPort(text);
        }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        style={{borderBottomWidth: 1, marginBottom: 15, marginTop: 5}}
        onChangeText={text => {
          setPassword(text);
        }}
      />
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Button title="Save" onPress={save} />
      </View>
    </View>
  );
};


export default Setup;
