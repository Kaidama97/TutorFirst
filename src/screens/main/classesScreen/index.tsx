import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { AuthProvider } from '@/src/provider/authProvider';
import ClassesList from './components/classes'; // Adjust path as needed

const StyledView = styled(View);

const ClassesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (

      <StyledView className="flex-1">
        <ClassesList navigation={navigation} />
      </StyledView>

  );
};

export default ClassesScreen;
