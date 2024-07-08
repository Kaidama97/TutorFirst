import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, ScrollView, Button } from 'react-native';
import { styled } from 'nativewind';
import { supabase } from '@/src/initSupabase'; // Adjust the path to your Supabase client
import { AuthContext } from '@/src/provider/authProvider';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

const ClassChatScreen = ({ route }: { route: any }) => {
  const { classId } = route.params;
  const { session, userData } = useContext(AuthContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
      .from('messages')
      .select('*, users!inner(firstname, lastname, roleid)')
      .eq('class_id', classId)
      .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel(`public:messages:class_id=eq.${classId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessageWithUser = { ...payload.new, users: { firstname: userData?.firstname || 'Unknown', lastname: userData?.lastname || '', role: userData?.roleid } };
        setMessages((prevMessages) => [...prevMessages, newMessageWithUser]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [classId, session?.user?.id]);

  // Function to send a new message
  const sendMessage = async () => {
    if (newMessage.trim() === '') return; // Prevent sending empty messages

    if (!session?.user?.id) {
      console.error('User not authenticated');
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          class_id: classId,
          user_id: session.user.id,
          content: newMessage,
        },
      ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

// Function to render the user's name with role
const renderUserName = (user: any) => {
  if (!userData) {
    return 'Unknown';
  }

  let fullName = `${user.firstname} ${user.lastname}`;
  let role = userData.roleid == "1" ? 'Teacher' : userData.roleid == "2" ? 'Student' : 'Unknown Role';
  return `${fullName} (${role})`;
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
            <StyledText style={{ fontWeight: 'bold' }}>{renderUserName(msg.users)}</StyledText>
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
