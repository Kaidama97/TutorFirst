import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Button from '../../../components/button';

const Form = ({navigation}) => {
  return (
    <View className={'form space-y-2'}>
            <TextInput
              placeholder="Username"
              className={'p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3'}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              className={'p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3'}
            />
            <TouchableOpacity className='flex items-end mb-5'>
              <Text>Forgot Password?</Text>
            </TouchableOpacity>
            <Button 
            type="primary"
            text='Log In'
            onPress={() => navigation.navigate('Login')}/>

            <View className='flex-row justify-center'>
              <Text className='text-gray-500 font-semibold'>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className='font-semibold text-yellow-500'> Click Here</Text>
            </TouchableOpacity>
            </View>

    </View>
  );
};

export default Form;