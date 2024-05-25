import React from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../assets/theme/theme';
import ButtonComponent  from './components/buttonComponent';
import Header  from './components/header';
import LogoComponent from './components/logoComponent';
const WelcomeScreen = ({navigation}) => {
  return (
    <SafeAreaView className='flex-1' style={{backgroundColor: theme.colors.primary}}> 
    <View className={'flex-1 justify-around my-10'}>
      <Header/>
      <LogoComponent/>
      <ButtonComponent navigation={navigation}/>
    </View>

    </SafeAreaView>
  );
};

export default WelcomeScreen;