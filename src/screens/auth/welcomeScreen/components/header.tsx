import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const Header: React.FC = () => {
  return (
    <StyledView className="flex-row justify-center items-center">
      <StyledText className="text-3xl font-bold text-center text-white">
        Welcome To TutorFirst!
      </StyledText>
      <StyledText className="text-lg mb-8 text-center text-white">
        Empowering Students to Excel
      </StyledText>
    </StyledView>
  );
};

export default Header;
