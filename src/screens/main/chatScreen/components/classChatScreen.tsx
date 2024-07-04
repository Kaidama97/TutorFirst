import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, ScrollView, Button } from 'react-native';
import { styled } from 'nativewind';
import { AuthContext } from '@/src/provider/authProvider';
import { supabase } from '../../../../initSupabase';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

const ClassChatScreen = ({ route }: { route: any }) => {
  const { classId } = route.params;
  const { session } = useContext(AuthContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Function to fetch initial messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('class_id', classId)
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        setMessages(data || []);
      } catch (error: unknown) {
        console.error('Error fetching messages:', (error as Error).message);
      }
    };

    // Fetch initial messages
    fetchMessages();

    // Subscribe to real-time events
    const subscription = supabase
  .from(`messages:class_id=eq.${classId}`)
  .on('INSERT', (payload: { new: any; }) => {
    console.log('New message received:', payload.new);
    // Handle the new message update in your state or UI
    setMessages(prevMessages => [...prevMessages, payload.new]);
  })
  .subscribe();


    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [classId, session]); // Ensure to include classId and session in dependencies if needed

  // Function to handle new message sending
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ class_id: classId, content: newMessage, user_id: session?.user?.id }]);

      if (error) {
        throw error;
      }

      setNewMessage('');
    } catch (error: unknown) {
      console.error('Error sending message:', (error as Error).message);
    }
  };

  return (
    <StyledView style={{ flex: 1 }}>
      <StyledScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        {messages.map((msg) => (
          <StyledView
            key={msg.id}
            style={{
              alignSelf: msg.user_id === session?.user?.id ? 'flex-end' : 'flex-start',
              backgroundColor: msg.user_id === session?.user?.id ? '#DCF8C6' : '#E5E5EA',
              borderRadius: 8,
              padding: 10,
              margin: 5,
              maxWidth: '80%',
            }}
          >
            <StyledText>{msg.content}</StyledText>
            <StyledText style={{ fontSize: 12, alignSelf: 'flex-end', marginTop: 5 }}>
              {new Date(msg.created_at).toLocaleString()}
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
