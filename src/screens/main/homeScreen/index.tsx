import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { theme } from '../../../assets/theme/theme';
//import MainNavBar from '../../../navigation/mainNavBar'; // Import the MainNavBar component
import Home from './components/home';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '@/src/provider/authProvider';
import { fetchClassesWithTutors } from '../classesScreen/components/fetchUserClasses';
import ReminderList from './components/reminderList';
import { useFocusEffect } from '@react-navigation/native';

const StyledView = styled(View);

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [classes, setClasses] = useState<any[]>([]); // Define type for classes state
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const { session } = useContext(AuthContext);
  
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
      <Home navigation={navigation} />

      <ReminderList/>

      <View className="flex-row flex-wrap justify-between mx-2 bg-white">
        <View className='flex-col w-[48%]'>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => navigation.navigate('Book Classes')}
          >
            <Ionicons name="search" size={24} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">Explore classes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => navigation.navigate('My Classes')}
          >
            <Ionicons name="book" size={24} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">My classes</Text>
          </TouchableOpacity>
        </View>
        <View className='flex-col w-[48%]'>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => navigation.navigate('teacherDetail')}
          >
            <Ionicons name="search" size={24} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">Search Teachers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person" size={24} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">My profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
