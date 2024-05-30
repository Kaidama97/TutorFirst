import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from '../provider/authProvider';

import AuthNavigation from './AuthNavigation';
import MainNavigation from './MainNavigation';

const AppNavigation = () => {

    const auth = useContext(AuthContext);
    const user = auth.user;
    console.log("Auth: " + auth.session + " User " + user);

    return (
        <NavigationContainer>
          {auth.session && auth.user ? <MainNavigation/> : <AuthNavigation/>}
        </NavigationContainer>
    );
}

export default AppNavigation;