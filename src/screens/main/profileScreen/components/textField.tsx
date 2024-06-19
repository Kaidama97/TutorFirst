import React from 'react'
import { View, Text } from 'react-native'


interface TextFieldProps {
    label: string;
    data: any;
  }

const TextField: React.FC<TextFieldProps> = ({ label, data }) => {
    return (
        <View className='rounded-lg border border-gray-300 p-4 mb-4'>
            <Text className='text-lg'>{label} <Text className='text-gray-600 ml-2'>{data}</Text></Text>
        </View>
    )
}

export default TextField;