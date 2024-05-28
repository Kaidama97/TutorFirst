import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import { theme } from '../../assets/theme/theme';
import ButtonComponent from './components/buttonComponent';
import Header from './components/header';
import LogoComponent from './components/logoComponent';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);

const WelcomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <StyledSafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.primary }}>
      <StyledView className="flex-1 justify-around my-10">
        <Header/>
        <LogoComponent />
        <ButtonComponent navigation={navigation} />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default WelcomeScreen;
