import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Button } from 'react-native';
import { styled } from 'nativewind';

// Mock data for messages (replace with actual data fetching)
const mockMessages = [
  { id: 1, userId: 1, content: 'Hello!', timestamp: '2024-07-05T10:30:00Z' },
  { id: 2, userId: 2, content: 'Hi there!', timestamp: '2024-07-05T10:31:00Z' },
  { id: 3, userId: 1, content: 'How are you?', timestamp: '2024-07-05T10:32:00Z' },
  { id: 4, userId: 2, content: 'I\'m good, thanks!', timestamp: '2024-07-05T10:33:00Z' },
];

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

const ClassChatScreen = ({ route }: { route: any }) => {
  const { classId } = route.params;
  const [messages, setMessages] = useState<any[]>(mockMessages); // State to hold messages
  const [newMessage, setNewMessage] = useState(''); // State for new message input

  // Function to mock sending a new message
  const sendMessage = () => {
    if (newMessage.trim() === '') return; // Prevent sending empty messages

    const newMsg = {
      id: messages.length + 1,
      userId: 1, // Replace with actual user ID from context or state
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <StyledView style={{ flex: 1 }}>
      <StyledScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        {messages.map((msg) => (
          <StyledView
            key={msg.id}
            style={{
              alignSelf: msg.userId === 1 ? 'flex-end' : 'flex-start',
              backgroundColor: msg.userId === 1 ? '#DCF8C6' : '#E5E5EA',
              borderRadius: 8,
              padding: 10,
              margin: 5,
              maxWidth: '80%',
            }}
          >
            <StyledText>{msg.content}</StyledText>
            <StyledText style={{ fontSize: 12, alignSelf: 'flex-end', marginTop: 5 }}>
              {new Date(msg.timestamp).toLocaleString()}
            </StyledText>
          </StyledView>
        ))}
      </StyledScrollView>
      <StyledView style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
        <StyledTextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
          }}
        />
        <Button title="Send" onPress={sendMessage} />
      </StyledView>
    </StyledView>
  );
};

export default ClassChatScreen;
