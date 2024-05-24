import React from 'react';
//import { useNavigation } from '@react-navigation/native';
import { View, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
//const navigation = useNavigation();
const WelcomeScreen = ({navigation}) => {
  return (
    <SafeAreaView className={'flex-1 justify-center items-center bg-gray-100'}>
      {/* <Image
        source={require('../assets/icons/logo.png')}
        style={'w-13 h-13 mb-8'}
        resizeMode="contain"
      /> */}
      <Text className={'text-3xl font-bold mb-4'}>Welcome</Text>
      <Text className={'text-lg mb-8'}>Please login or register to continue</Text>
      <View className={'w-4/5'}>
        <TouchableOpacity
          className={'bg-blue-500 py-3 rounded-full mb-4'}
          onPress={() => navigation.navigate('Login')}
        >
          <Text className={'text-center text-white font-bold'}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={'bg-green-500 py-3 rounded-full'}
          onPress={() => navigation.navigate('Login')}
        >
          <Text className={'text-center text-white font-bold'}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;