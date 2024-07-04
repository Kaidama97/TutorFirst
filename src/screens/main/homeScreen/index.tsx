import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { theme } from '../../../assets/theme/theme';
//import MainNavBar from '../../../navigation/mainNavBar'; // Import the MainNavBar component
import Home from './components/home';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '@/src/provider/authProvider';
import { fetchClassesWithTutors } from '../classesScreen/components/fetchUserClasses';
import ReminderList from './components/reminderList';
import { useFocusEffect } from '@react-navigation/native';
import ButtonsNavigation from './components/homeScreenCards';
import HomeScreenCards from './components/homeScreenCards';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [classes, setClasses] = useState<any[]>([]); // Define type for classes state
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const { session, userData } = useContext(AuthContext);

  const handleCardPress = (screen: string) => {
    navigation.navigate(screen);
  };

  const fetchUserClasses = async () => {
    if (!session?.user?.id) {
      console.error('User ID not found');
      setLoading(false); // Set loading state to false on error
      return;
    }

    try {
      const userId = session.user.id; // Assuming userId is accessible from user object in AuthContext
      if (!userId) {
        throw new Error('User ID not found');
      }

      const classesData = await fetchClassesWithTutors(userId);
      setClasses(classesData);
      setLoading(false); // Set loading state to false after data is fetched
    } catch (error) {
      console.error('Error fetching user classes:', error);
      setLoading(false); // Ensure loading state is set to false on error
    }
  };

  // Use useFocusEffect to refetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserClasses();
    }, [])
  );

  return (
    <ScrollView className='flex-1 '>
      <Home userData={userData} />

      <ReminderList userData={userData}/>
      <HomeScreenCards navigation={navigation} userData={userData}/>

    </ScrollView>
  );
};

export default HomeScreen;
