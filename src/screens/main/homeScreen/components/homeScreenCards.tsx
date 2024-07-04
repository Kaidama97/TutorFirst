import { AuthContext } from '@/src/provider/authProvider';
import React, { useContext } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreenCards: React.FC<{ navigation: any, userData: any }> = ({ navigation, userData }) => {

    //const { userData } = useContext(AuthContext);
  return (
    <View className="flex-row flex-wrap justify-between mx-2 bg-white">
        <View className='flex-col w-[48%]'>
          { userData?.roleid == '1' 
          ? <TouchableOpacity
          className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
          onPress={() => navigation.navigate('Create Class')}
        >
          <Icon name="note-plus" size={24} color="black" />
          <Text className="text-lg font-bold mt-2 text-center">Create Class</Text>
        </TouchableOpacity>
          : <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => navigation.navigate('Book Classes')}
          >
            <Icon name="magnify" size={24} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">Explore classes</Text>
          </TouchableOpacity>}
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => navigation.navigate('My Classes')}
          >
            <Icon name="book" size={24} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">My classes</Text>
          </TouchableOpacity>
        </View>
        <View className='flex-col w-[48%]'>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => navigation.navigate('My Classes')}
          >
            <Icon name="bell" size={24} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">Reminders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg p-4 m-2 shadow-lg items-center justify-center h-48"
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="account" size={26} color="black" />
            <Text className="text-lg font-bold mt-2 text-center">My profile</Text>
          </TouchableOpacity>
        </View>
      </View>
  )
}

export default HomeScreenCards