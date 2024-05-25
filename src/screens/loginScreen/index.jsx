import React from 'react';
import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '../../assets/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoComponent from './components/logoComponent';
import form from './components/form';
import Form from './components/form';

const LogInScreen = ({navigation}) => {
    return (
        <View className={'flex-1 bg-white'} style={{backgroundColor: theme.colors.primary}}>
        <LogoComponent/>
        <View className={'flex-1 bg-white px-8 pt-8'}
        style={{borderTopLeftRadius:65, borderTopRightRadius:65}}>
          <Text className={'text-2xl font-bold mb-8'}>Login</Text>
          <Form navigation={navigation}/>
        </View>

        </View>
      );
    };

export default LogInScreen;