import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './src/provider/authProvider';

import AuthNavigation from './src/navigation/AuthNavigation';
import MainNavigation from './src/navigation/MainNavigation';
const App = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  return (
    <NavigationContainer>
        {user == false || user == null  && <AuthNavigation/>}
        {user == true && <MainNavigation/>}
    </NavigationContainer>
  );
  
};

export default App;