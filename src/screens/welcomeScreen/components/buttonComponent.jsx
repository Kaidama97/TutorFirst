import { View, Text } from 'react-native';
import React from 'react';
import Button  from '../../../components/button';

const ButtonComponent = ({navigation}) => {
  return(
    <View className={'space-y-3'}>
      <Button type='primary' 
        text="Sign In" 
        onPress={() => navigation.navigate('Login')}/>
        <Button type='primary' 
        text="Sign Up" 
        onPress={() => navigation.navigate('Register')}/>
      </View>
  );

};

export default ButtonComponent;