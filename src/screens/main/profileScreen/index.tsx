import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { AuthContext } from "@/src/provider/authProvider";
import { supabase } from '@/src/initSupabase';
import ProfilePicture from './components/profilePicture';

import EditProfileModal from './components/editProfileModal';
import UserInfo from './components/userInfo';
import ClassesComponent from './components/classesComponent';
const ProfileScreen = () => {

  const { signOut, userData, refreshUserData } = useContext(AuthContext);

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





  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };
  return (
    <ScrollView className="flex-1 p-5">
      <View className='justify-center items-center mb-3'>
        <ProfilePicture />

      </View>
      <View className='flex-1 justify-center items-center mb-5'>
        <Text className='text-3xl font-bold'>{userProfile?.username}</Text>
        <Text className='text-lg text-gray-600'>{userProfile?.description}</Text>
        <Text className='text-sm text-gray-600'>Member since: {userProfile?.createdat ? formatDate(userProfile.createdat) : 'N/A'}</Text>
      </View>

      <ClassesComponent />
      <UserInfo userProfile={userProfile} />
      <View className='flex-1 mb-4 p-4'>
        <Button
          title="Log Out"
          onPress={handleSignOut}
        />
      </View>

    </ScrollView>
  );
};

export default ProfileScreen;