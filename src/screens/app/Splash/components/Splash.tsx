import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {NavigationProps} from '../../../../routes/types';
import {styles} from './Splash.style';

interface SplashScreenProps {
  navigation: NavigationProps;
}
const Splash = (props: SplashScreenProps) => {
  const {navigation} = props;

  const getStoreData = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      if (value && JSON.parse(value)) {
        const user = JSON.parse(value);
        if (user.email && user.username) {
          navigation.replace('Inventory');
        }
      } else {
        navigation.replace('Login');
      }
    } catch (e) {
      console.log(e);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getStoreData();
    }, [navigation]),
  );
  return (
    <View style={styles.root}>
      <View>
        <Text style={styles.welcomeText}>Welcome to Inventory Management</Text>
      </View>
    </View>
  );
};
export default Splash;
