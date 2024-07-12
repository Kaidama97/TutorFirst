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
