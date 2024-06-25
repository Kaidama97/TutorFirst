import React, { useContext } from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import Button from '../../../../components/button';
import { AuthContext } from '@/src/provider/authProvider';

const StyledView = styled(View);

interface ButtonComponentProps {
  navigation: any; // Adjust the type according to the actual navigation prop type
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ navigation }) => {
  const { handleWelcomePressed } = useContext(AuthContext);

  const handleButtonPressed = (screenName: string) => {
    handleWelcomePressed;
    navigation.navigate(screenName);
  }
  return (
    <StyledView className="space-y-3">
      <Button
        type="primary"
        text="Sign In"
        onPress={() => handleButtonPressed('Login')}
      />
      <Button
        type="primary"
        text="Sign Up"
        onPress={() => handleButtonPressed('Register')}
      />
    </StyledView>
  );
};

export default ButtonComponent;
