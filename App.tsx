import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from './src/provider/authProvider';
import AppNavigation from './src/navigation';

const App = () => {
  
  return (
    <AuthProvider>
      <AppNavigation/>
    </AuthProvider>
  );
  
};

export default App;