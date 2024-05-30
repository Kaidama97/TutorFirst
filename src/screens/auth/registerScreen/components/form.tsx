import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Button from '../../../../components/button';

import { supabase } from '../../../../initSupabase';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);


interface FormProps {
  navigation: any; // Adjust the type according to the actual navigation prop type
}

const Form: React.FC<FormProps> = ({ navigation }) => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string): void => {
    setIsValidEmail(validateEmail(email));
  };

  async function signUp() {

    if (validateEmail(email)) {
      setIsValidEmail(true);
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: 'https://example.com/welcome',
        },
      });
      if (!error && !data) {
        setLoading(false);
        console.log(data);
      }
      if (error) {
        setLoading(false);
        alert(error.message);
      }
    } else {
      setIsValidEmail(false);
      console.log(isValidEmail);

    }
  }


  return (
    <StyledView className="form space-y-2">
      <StyledTextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        className= {`p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 ${!isValidEmail ? 'border-red-500' : 'border-gray-300'}`}
        onChangeText={(text) => setEmail(text)}
      />
      {!isValidEmail && <Text className="text-red-500 mt-1">Please enter a valid email address</Text>}
      <StyledTextInput
        placeholder="Password"
        secureTextEntry
        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
        onChangeText={(text) => setPassword(text)}
      />

      <Button
        type="primary"
        text="Sign Up"
        onPress={() => signUp()}
      />

      <StyledView className="flex-row justify-center">
        <StyledText className="text-gray-500 font-semibold">
         Already have an account?
        </StyledText>
        <StyledTouchableOpacity onPress={() => navigation.navigate('Login')}>
          <StyledText className="font-semibold text-yellow-500"> Log In</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
};

export default Form;
