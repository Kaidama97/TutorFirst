//import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
//import { tailwind } from 'react-native-tailwindcss';
//const navigation = useNavigation();
const LogInScreen = ({navigation}) => {
    return (
        <View className={'flex-1 justify-center items-center bg-gray-100'}>
          {/* <Image
            source={require('../assets/icons/logo.png')}
            style={'w-24 h-24 mb-8'}
            resizeMode="contain"
          /> */}
          <Text className={'text-2xl font-bold mb-8'}>Login</Text>
          <View className={'w-4/5'}>
            <TextInput
              placeholder="Email"
              className={'border-b border-gray-400 py-2 mb-4'}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              className={'border-b border-gray-400 py-2 mb-8'}
            />
            <TouchableOpacity className={'bg-blue-500 py-3 rounded-full'} onPress={console.log("pressed")}>
              <Text className={'text-center text-white font-bold'}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

export default LogInScreen;