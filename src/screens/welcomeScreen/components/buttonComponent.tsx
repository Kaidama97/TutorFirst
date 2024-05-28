import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import Button from '../../../components/button';

const StyledView = styled(View);

interface ButtonComponentProps {
  navigation: any; // Adjust the type according to the actual navigation prop type
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ navigation }) => {
  return (
    <StyledView className="space-y-3">
      <Button
        type="primary"
        text="Sign In"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        type="primary"
        text="Sign Up"
        onPress={() => navigation.navigate('Register')}
      />
    </StyledView>
  );
};

export default ButtonComponent;
