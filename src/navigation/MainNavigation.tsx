import React from 'react'
import Home from '../screens/main/homeScreen/index'
import { createNativeStackNavigator } from '@react-navigation/native-stack';


type MainStackParamList = {
    Home: undefined;
}

const MainStack = createNativeStackNavigator();


export default function MainNavigation() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="Home" component={Home} />
    </MainStack.Navigator>
  );
}