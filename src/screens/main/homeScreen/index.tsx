import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Home from './components/home';
import { AuthContext } from '@/src/provider/authProvider';
import ReminderList from './components/reminderList';
import HomeScreenCards from './components/homeScreenCards';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { session, userData } = useContext(AuthContext);


  return (
    <ScrollView className='flex-1 '>
      <Home userData={userData} />

      <ReminderList userData={userData}/>
      <HomeScreenCards navigation={navigation} userData={userData}/>

    </ScrollView>
  );
};

export default HomeScreen;
