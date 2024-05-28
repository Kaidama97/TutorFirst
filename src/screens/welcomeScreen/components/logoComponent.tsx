import React from 'react';
import { View, Image } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledImage = styled(Image);

const LogoComponent: React.FC = () => {
  return (
    <StyledView className="flex-2 flex-row justify-center">
      <StyledImage
        source={require('../../../assets/icons/logo.png')}
        style={{ width: 350, height: 350 }}
        tintColor="#FFFFFF"
        resizeMode="contain"
      />
    </StyledView>
  );
};

export default LogoComponent;
