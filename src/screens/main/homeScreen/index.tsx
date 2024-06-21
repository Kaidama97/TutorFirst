import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { theme } from '../../../assets/theme/theme';
//import MainNavBar from '../../../navigation/mainNavBar'; // Import the MainNavBar component
import Home from './components/home';
import { Ionicons } from '@expo/vector-icons';


const StyledView = styled(View);

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleCardPress = (screen: string) => {
    // navigation.navigate(screen);
  };

  return (
    <ScrollView className='flex-1 '>
      <Home navigation={navigation} />
      <Text
        className="text-black text-xl font-bold text-left mb-2"
      >
        Reminder:
      </Text>

      <Text>Reminder</Text>
      <View className="flex-row flex-wrap justify-between mx-2">
        <View className='flex-col w-[48%]'>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => handleCardPress('ExploreClasses')}
          >
            <Ionicons name="search" size={24} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">Explore classes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => handleCardPress('MyClasses')}
          >
            <Ionicons name="book" size={24} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">My classes</Text>
          </TouchableOpacity>
        </View>
        <View className='flex-col w-[48%]'>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => handleCardPress('Reminders')}
          >
            <Ionicons name="notifications" size={24} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">Reminders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => handleCardPress('MyProfile')}
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