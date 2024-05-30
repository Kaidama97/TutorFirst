import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { theme } from '../../../assets/theme/theme';
//import MainNavBar from '../../../navigation/mainNavBar'; // Import the MainNavBar component
import Home from './components/home';

const StyledView = styled(View);

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <StyledView className="flex-1 bg-white" style={{ backgroundColor: theme.colors.primary }}>
      <StyledView className="flex-1 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 65, borderTopRightRadius: 65 }}>
        <Home navigation={navigation} />
      </StyledView>
    </StyledView>
  );
};

export default HomeScreen;