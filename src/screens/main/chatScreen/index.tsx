import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { AuthProvider } from '@/src/provider/authProvider';
import ChatComponent from './components/chat'; // Adjust path as needed


const StyledView = styled(View);

const ChatScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <AuthProvider>
      <StyledView className="flex-1">
        <ChatComponent navigation={navigation} />
      </StyledView>
    </AuthProvider>
  );
}

export default ChatScreen;
