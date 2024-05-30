import React from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import { styled } from 'nativewind';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledImage = styled(Image);

const LogoComponent: React.FC = () => {
  return (
    <StyledSafeAreaView className="flex">
      <StyledView className="flex-row justify-center">
        <StyledImage
          source={require('../../../../assets/icons/logo.png')}
          style={{ width: 250, height: 250 }}
          tintColor="#FFFFFF"
        />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default LogoComponent;
