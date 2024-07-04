import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { AuthProvider } from '@/src/provider/authProvider';
import ClassesList from './components/teacherClasses'; // Adjust path as needed

const StyledView = styled(View);

const ClassesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <AuthProvider>
      <StyledView className="flex-1">
        <ClassesList navigation={navigation} />
      </StyledView>
    </AuthProvider>
  );
};

export default ClassesScreen;
