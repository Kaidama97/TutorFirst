import React from 'react'
import Home from '../screens/homeScreen/index'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type MainStackParamList = {
    Home: undefined;
}

const MainStack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigation() {
  return (
    <MainStack.Navigator initialRouteName='Home'>
        <MainStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    </MainStack.Navigator>
  );
}