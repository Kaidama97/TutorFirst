import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from '../provider/authProvider';

import AuthNavigation from './AuthNavigation';
import MainNavigation from './mainNavigation';
import RegisterNavigation from './registerNavigation';
import BottomNavigation from './mainNavigation';

const AppNavigation = () => {

    const auth = useContext(AuthContext);
    const user = auth.user;
    console.log("Auth: " + auth.session + " User " + user + " username:" + auth.username);

    return (
        <NavigationContainer>
          {auth.session && auth.username && !auth.loading ? <BottomNavigation/> : auth.session && !auth.username ? <RegisterNavigation/> : <AuthNavigation/>}
        </NavigationContainer>
    );
}


export default AppNavigation;