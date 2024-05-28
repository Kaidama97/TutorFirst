import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { theme } from '../../assets/theme/theme';
import LogoComponent from './components/logoComponent';
import Form from './components/form';

const StyledView = styled(View);

const LogInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <StyledView className="flex-1 bg-white" style={{ backgroundColor: theme.colors.primary }}>
      <LogoComponent />
      <StyledView className="flex-1 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 65, borderTopRightRadius: 65 }}>
        <Text className="text-2xl font-bold mb-8">Login</Text>
        <Form navigation={navigation} />
      </StyledView>
    </StyledView>
  );
};

export default LogInScreen;
