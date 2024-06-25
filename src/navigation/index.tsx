import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from '../provider/authProvider';

import AuthNavigation from './AuthNavigation';
import MainNavigation from './MainNavigation';
import RegisterNavigation from './registerNavigation';
import BottomNavigation from './bottomNavigation';

const AppNavigation = () => {

    const auth = useContext(AuthContext);
    const user = auth.user;
    console.log("Auth: " + auth.session + " User " + user + " username:" + auth.username);

    if (auth.loading) {
      return <LoadingScreen />;
  }

  return (
      <NavigationContainer>
        {auth.session && auth.username ? <MainNavigation/> : auth.session && !auth.username ? <RegisterNavigation/> : <AuthNavigation/>}
      </NavigationContainer>
  );
}



export default AppNavigation;