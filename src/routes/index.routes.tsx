import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Inventory from '../screens/app/Inventory/components/Inventory';
import Splash from '../screens/app/Splash/components/Splash';
import LoginScreen from '../screens/auth/Login/components/Login';

export const Routes = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Inventory" component={Inventory} />
    </Stack.Navigator>
  );
};
