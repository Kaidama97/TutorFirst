import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Button from '../../../components/button';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface FormProps {
  navigation: any; // Adjust the type according to the actual navigation prop type
}

const Form: React.FC<FormProps> = ({ navigation }) => {
  return (
    <StyledView className="form space-y-2">
      <StyledTextInput
        placeholder="Username"
        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
      />
      <StyledTextInput
        placeholder="Password"
        secureTextEntry
        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
      />
      <StyledTouchableOpacity className="flex items-end mb-5">
        <StyledText>Forgot Password?</StyledText>
      </StyledTouchableOpacity>
      <Button
        type="primary"
        text="Log In"
        onPress={() => navigation.navigate('Home')}
      />

      <StyledView className="flex-row justify-center">
        <StyledText className="text-gray-500 font-semibold">
          Don't have an account?
        </StyledText>
        <StyledTouchableOpacity onPress={() => navigation.navigate('Register')}>
          <StyledText className="font-semibold text-yellow-500"> Click Here</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
};

export default Form;
