import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import {colorConfig} from '../../assets/colors/setup.color';
import {clearStorageData} from '../../helper/utils';
interface MyCustomAppbarProps {
  title: string;
}

export default function Header(props: MyCustomAppbarProps) {
  const {title} = props;
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  const getUsernameFromStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      if (value) {
        const user = JSON.parse(value);
        setUsername(user.username);
      }
    } catch (error) {
      console.error('Error retrieving username from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    getUsernameFromStorage();
  }, []);
  const handleLogout = async () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
    await clearStorageData('isLoggedIn')
      .then(() => {
        navigation.dispatch(resetAction);
      })
      .catch(() => {
        Alert.alert('Failed to Logout', 'Please try again');
      });
  };
  return (
    <Appbar.Header
      style={{
        backgroundColor: colorConfig.container,
      }}>
      <Appbar.Content
        title={title}
        titleStyle={{
          color: colorConfig.black,
        }}
      />
      <Text style={{color: colorConfig.black}}>{username}</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Appbar.Action icon="logout" color={colorConfig.black} />
      </TouchableOpacity>
    </Appbar.Header>
  );
}
