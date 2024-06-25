import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Button from '../../../../components/button';

import { supabase } from '../../../../initSupabase';
import { AuthContext } from "@/src/provider/authProvider";
import { AuthApiError } from "@supabase/supabase-js";

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);


interface FormProps {
  navigation: any; // Adjust the type according to the actual navigation prop type
}

const Form: React.FC<FormProps> = ({ navigation }) => {

  
const { handleLogin } = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const login = async () => {
    if(validateEmail(email)) {
      setIsValidEmail(true);
      setLoading(true);
        if (handleLogin) {
          try {
            await handleLogin(email, password);
          } catch (error) {

            console.log(error);
            alert("Invaild Credentials");
          }
          
        } 
      
    } else {
      setIsValidEmail(false);
    }
  }


  return (
    <View className="form space-y-2">
      <TextInput
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        className={`p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 ${!isValidEmail ? 'border-red-500' : 'border-gray-300'}`}
        onChangeText={(text) => setEmail(text)}
      />
      {!isValidEmail && <Text className="text-red-500 mt-1">Please enter a valid email address</Text>}
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
        onChangeText={(text) => setPassword(text)}
      />
      
      <TouchableOpacity className="flex items-end mb-5">
        <Text>Forgot Password?</Text>
      </TouchableOpacity>
      <Button
        type="primary"
        text="Log In"
        onPress={() => login()}
      />


      <View className="flex-row justify-center">
        <Text className="text-gray-500 font-semibold">
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="font-semibold text-yellow-500"> Click Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Form;
