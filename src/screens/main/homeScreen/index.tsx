import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { theme } from '../../../assets/theme/theme';
//import MainNavBar from '../../../navigation/mainNavBar'; // Import the MainNavBar component
import Home from './components/home';

const StyledView = styled(View);

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <StyledView className="flex-1 px-8 pt-8" style={{ borderTopLeftRadius: 65, borderTopRightRadius: 65, backgroundColor: 'white' }}>
      
        <Home navigation={navigation} />
      
    </StyledView>
  );
};

export default HomeScreen;