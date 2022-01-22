import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import Button from './Button';

const storage = new MMKV();

const Setup = (props: {
  setSettingsPanel: Dispatch<SetStateAction<boolean>>;
}) => {
  const [ip, setIp] = useState('');
  const [password, setPassword] = useState('');
  const {setSettingsPanel} = props;

  useEffect(() => {
    const ip = storage.getString('ip');
    if (ip) {
      setIp(ip);
    }
    const password = storage.getString('password');
    if (password) {
      setPassword(password);
    }
  }, []);

  const save = () => {
    storage.set('ip', ip);
    storage.set('password', password);
    console.log(ip, password);
    if (ip && password) {
      setSettingsPanel(false);
    } else {
      console.error('cant save');
    }
  };
  return (
    <View style={{marginHorizontal: 10, marginVertical: 20}}>
      <Text>IP (host:port)</Text>
      <TextInput
        value={ip}
        style={{borderBottomWidth: 1, marginBottom: 15, marginTop: 5}}
        onChangeText={text => {
          setIp(text);
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
