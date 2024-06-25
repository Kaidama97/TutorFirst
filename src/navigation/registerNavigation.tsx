import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import Profile from '../screens/register/profileScreen/index';
import { AuthContext } from '../provider/authProvider';
import LoadingScreen from '../screens/register/loadingScreen/';
type RegisterStackParamList = {
    Profile: undefined;
    Loading: undefined;
}

const RegisterStack = createNativeStackNavigator<RegisterStackParamList>();




const RegisterNavigation: React.FC = () => {
    const { loading } = useContext(AuthContext);

    return (
        <RegisterStack.Navigator initialRouteName='Loading'>
            {loading ? (
                <RegisterStack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
            ) : (
                <RegisterStack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            )}

        </RegisterStack.Navigator>

    );

}

export default RegisterNavigation;