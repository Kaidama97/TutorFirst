import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import Login from '../screens/loginScreen/index';
import Welcome from '../screens/welcomeScreen/index';
import Register from '../screens/registerScreen/index';
import Home from '../screens/homeScreen/index';

// Define the type for the navigation stack
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;