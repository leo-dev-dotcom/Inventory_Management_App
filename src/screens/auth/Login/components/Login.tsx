import React, {useState} from 'react';
import {Alert, Keyboard, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Text, TextInput} from 'react-native-paper';
import {clearStorageData, storeStorageData} from '../../../../helper/utils';
import {NavigationProps} from '../../../../routes/types';
import {style} from './Login.style';

interface LoginProps {
  navigation: NavigationProps;
}
export default function Login(props: LoginProps) {
  const {navigation} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };
  const handleLogin = async () => {
    Keyboard.dismiss();

    // Check if email, password, and username are provided and valid
    if (email && password && validateEmail(email)) {
      clearStorageData('isLoggedIn');
      if (email === 'department@nomail.com' && password === '1234') {
        await storeStorageData('isLoggedIn', {
          username: username,
          email: email,
          role: 'DEPARTMENT_MANAGER',
        });
        navigation.navigate('Inventory');
        setEmail('');
        setUsername('');
        setPassword('');
      } else if (email === 'store@nomail.com' && password === '1234') {
        await storeStorageData('isLoggedIn', {
          username: username,
          email: email,
          role: 'STORE_MANAGER',
        });
        navigation.navigate('Inventory');
        setEmail('');
        setUsername('');
        setPassword('');
      } else {
        Alert.alert('Invalid username or password');
      }
    } else {
      Alert.alert('Please enter valid email');
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={style.root}>
      <View style={style.image_box}>
        <Text style={style.loginHeader}>Login</Text>
      </View>

      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={style.input}
        keyboardType="email-address"
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={style.input}
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={style.input}
        keyboardType="visible-password"
      />

      <View style={style.loginBtn}>
        {username && email && password ? (
          <Button onPress={handleLogin} mode="contained">
            Login
          </Button>
        ) : (
          <Button onPress={handleLogin} mode="contained" disabled>
            Login
          </Button>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}
