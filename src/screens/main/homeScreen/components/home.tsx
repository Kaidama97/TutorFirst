import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface FormProps {
  navigation: any; // Adjust the type according to the actual navigation prop type
}

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <StyledView className="flex-1 justify-center items-center bg-white p-6">
      <StyledText className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to Tuition Center
      </StyledText>
      <StyledText className="text-lg text-gray-600 text-center mb-10">
        Enhance your learning with our wide range of courses and expert tutors.
      </StyledText>

      <StyledTouchableOpacity
        className="bg-yellow-500 p-4 rounded-2xl mb-4"
        onPress={() => navigation.navigate('Courses')}
      >
        <StyledText className="text-white font-semibold">Browse Courses</StyledText>
      </StyledTouchableOpacity>

      <StyledTouchableOpacity
        className="bg-gray-700 p-4 rounded-2xl mb-4"
        onPress={() => navigation.navigate('Profile')}
      >
        <StyledText className="text-white font-semibold">Your Profile</StyledText>
      </StyledTouchableOpacity>

      <StyledTouchableOpacity
        className="bg-blue-500 p-4 rounded-2xl mb-4"
        onPress={() => navigation.navigate('Settings')}
      >
        <StyledText className="text-white font-semibold">Settings</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default Home;
