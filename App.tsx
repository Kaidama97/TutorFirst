import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from './src/provider/authProvider';
import AppNavigation from './src/navigation';
import { LogBox } from 'react-native';



const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <AuthProvider>
      <AppNavigation/>
    </AuthProvider>
  );
  
};

export default App;