import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


interface TextFieldProps {
    icon: string
    label: string;
    data: any;
}

const TextField: React.FC<TextFieldProps> = ({ icon, label, data }) => {
    return (
        <View className='rounded-md border border-gray-300 p-3 mb-2 flex-row items-center bg-gray-300'>
            <Icon name={icon} size={22} color="black" style={{ marginRight: 8 }} />
            <Text className='text-lg font-bold mr-1'>{label}</Text>
            <Text className='text-xl text-gray-500'>{data}</Text>
        </View>
    )
}

export default TextField;