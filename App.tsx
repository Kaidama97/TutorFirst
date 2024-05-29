import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './src/provider/authProvider';

import AuthNavigation from './src/navigation/AuthNavigation';
import MainNavigation from './src/navigation/MainNavigation';
import BottomNavigation from './src/navigation/bottomNavigation';
const App = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  
  return (
    <BottomNavigation/>
  );
  
};

export default App;