import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import Login from '../screens/auth/loginScreen/index';
import Welcome from '../screens/auth/welcomeScreen/index';
import Register from '../screens/auth/registerScreen/index';

// Define the type for the navigation stack
type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation: React.FC = () => {
  return (
      <AuthStack.Navigator initialRouteName='Welcome'>
        <AuthStack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <AuthStack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      </AuthStack.Navigator>
  );
};

export default AuthNavigation;