import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import Login from '../screens/auth/loginScreen/index';
import Welcome from '../screens/auth/welcomeScreen/index';
import Register from '../screens/auth/registerScreen/index';
import { AuthContext } from '../provider/authProvider';

// Define the type for the navigation stack
type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation: React.FC = () => {
  const { isWelcomeCompleted } = useContext(AuthContext);
  const initialRouteName = isWelcomeCompleted ? 'Login' : 'Welcome';
  return (
    <AuthStack.Navigator initialRouteName={initialRouteName}>

      <AuthStack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <AuthStack.Screen name="Register" component={Register} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigation;