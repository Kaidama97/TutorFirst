import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, Alert, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { AuthContext } from "@/src/provider/authProvider";
import { supabase } from '@/src/initSupabase';
import TopSection from './components/topSection';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import TextField from './components/textField';
import EditProfileModal from './components/editProfileModal';
const ProfileScreen = () => {

  const { signOut, userData, refreshUserData} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(userData);

  const handleSignOut = () => {
    if (signOut) {
      signOut();
    }
  };

  useEffect(() => {
    if (refreshUserData) {
      refreshUserData;
      setUserProfile(userData);
    }
  }, [refreshUserData]);




  const toggleModal = () => {
    setModalVisible(!isModalVisible);

  };
  return (
    <ScrollView className="flex-1 p-5">
      <View className='flex-row items-center mb-4'>
        <TopSection />
        <View className='flex-col justify-center pl-5'>
          <Text className='text-2xl font-bold'> {userProfile?.username} </Text>
          <Text className='text-md text-gray-600'> {userProfile?.school}</Text>

        </View>
        <TouchableOpacity onPress={toggleModal}>
          <Icon name="pencil" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <View className='flex-auto mt-5'>
        <TextField label='First Name: ' data={userProfile?.firstname} />
        <TextField label='Last Name: ' data={userProfile?.lastname} />
        <TextField label='Date Of Birth: ' data={ userProfile?.dateofbirth } />
        <TextField label='Nationality: ' data={userProfile?.nationality} />
        <TextField label='Phone Number: ' data={userProfile?.phonenumber} />
        <TextField label='Description: ' data={userProfile?.description} />
        <View className='items-end justify-center mb-10 flex-row'>
          <Button
            title="Log Out"
            onPress={handleSignOut}
          />
        </View>
      </View>
      <EditProfileModal userData={ userProfile } isModalVisible={isModalVisible} toggleModal={toggleModal} />

    </ScrollView>
  );
};

export default ProfileScreen;