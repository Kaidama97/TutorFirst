import { AuthContext } from '@/src/provider/authProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Material Community Icons

const HomeScreenCards: React.FC<{ navigation: any, userData: any }> = ({ navigation, userData }) => {
  //const { userData } = useContext(AuthContext);
  return (
    <View className="flex-row flex-wrap justify-between mx-2 bg-white">
      <View className='flex-col w-[48%]'>
        <TouchableOpacity
          className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
          onPress={() => navigation.navigate('classRecommendation')}
        >
          <Ionicons name="search" size={24} color="black" />
          <Text className="text-lg font-bold mt-2 text-center">Recomendation</Text>
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
          {/* Replace the Ionicons search icon with a Material Community Icons search icon */}
          <Icon name="account-search" size={24} color="black" />
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
  )
}

export default HomeScreenCards;
