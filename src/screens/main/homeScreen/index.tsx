import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Home from './components/homeBanner';
import { AuthContext } from '@/src/provider/authProvider';
import ReminderList from './components/reminderList';
import HomeScreenCards from './components/homeScreenCards';
import { Ionicons } from '@expo/vector-icons';
import HomeScreenBanner from './components/homeBanner';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { session, userData } = useContext(AuthContext);


  return (
    <ScrollView className='flex-1 '>
      <HomeScreenBanner userData={userData} />

      <ReminderList userData={userData}/>
      <HomeScreenCards navigation={navigation} userData={userData}/>

      
    </ScrollView>
  );
};

export default HomeScreen;
