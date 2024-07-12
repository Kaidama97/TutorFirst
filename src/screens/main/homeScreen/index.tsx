import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { theme } from '../../../assets/theme/theme';
//import MainNavBar from '../../../navigation/mainNavBar'; // Import the MainNavBar component
import Home from './components/home';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '@/src/provider/authProvider';
import { fetchClasses } from '../classesScreen/components/fetchUserClasses';
import ReminderList from './components/reminderList';
import { useFocusEffect } from '@react-navigation/native';
import ButtonsNavigation from './components/homeScreenCards';
import HomeScreenCards from './components/homeScreenCards';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [classes, setClasses] = useState<any[]>([]); // Define type for classes state
  const [loading, setLoading] = useState(true); // State to manage loading indicator
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
