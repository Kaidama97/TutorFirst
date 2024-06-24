import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import TextField from './textField';
import EditProfileModal from './editProfileModal';

interface UserProfile {
    username: string;
    createdat: Date;
    description: string;
    firstname: string;
    lastname: string;
    dateofbirth: Date;
    nationality: string;
    phonenumber: string;
  }
  interface UserInfoProps {
    userProfile: UserProfile | null | undefined;
  }
  const UserInfo: React.FC<UserInfoProps> = ({ userProfile }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    
      };
  return (
    <View>
    <View className='flex-row w-full px-5 justify-between items-center mt-3'>
          <Text className='text-lg text-black font-bold'>Personal info:</Text>
          <TouchableOpacity onPress={toggleModal} className=''>
            <Text className='text-sm text-gray-600'>Edit</Text>
            {/* <Icon name="pencil" size={25} color="black" /> */}
          </TouchableOpacity>
      </View>

      <View className='flex-auto mt-1'>
      <TextField icon = 'account-outline' label='First Name: ' data={userProfile?.firstname} />
      <TextField icon = 'account-outline' label='Last Name: ' data={userProfile?.lastname} />
      <TextField icon = 'calendar-month' label='Date Of Birth: ' data={ userProfile?.dateofbirth } />
      <TextField icon = 'home-outline' label='Nationality: ' data={userProfile?.nationality} />
      <TextField icon = 'phone-outline' label='Phone Number: ' data={userProfile?.phonenumber} />
      </View>
      <EditProfileModal userData={ userProfile } isModalVisible={isModalVisible} toggleModal={toggleModal} />
      </View>
  )
};

export default UserInfo;

