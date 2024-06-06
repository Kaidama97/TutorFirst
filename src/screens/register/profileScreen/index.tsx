import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Button from '@/src/components/button';
import Form from './components/form';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (

        <SafeAreaView className='flex-1 bg-white'>
            
                <Form navigation={navigation} />

        </SafeAreaView>
    )
}

export default ProfileScreen;