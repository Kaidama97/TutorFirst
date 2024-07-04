import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Button } from 'react-native';
import { styled } from 'nativewind';
import { AuthContext } from '@/src/provider/authProvider';
import { fetchClasses } from './fetchClasses';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

const ChatScreen = ({ navigation }: { navigation: any }) => {
  const { session } = useContext(AuthContext);
  const [userClasses, setUserClasses] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      // Fetch user's classes
      const classesData = await fetchClasses(userId);
      setUserClasses(classesData);
    } catch (error:any) {
      console.error('Error fetching classes:', error.message);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClassSelect = (classId: number) => {
    // Navigate to ClassChatScreen with classId as a parameter
    navigation.navigate('ClassChat', { classId });
  };

  return (
    <StyledView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StyledScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {userClasses.map((cls) => (
          <TouchableOpacity key={cls.classid} onPress={() => handleClassSelect(cls.classid)}>
            <StyledView
              style={{
                padding: 20,
                marginVertical: 10,
                backgroundColor: '#ffffff',
                borderRadius: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <StyledText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
                {cls.title}
              </StyledText>
              <StyledText style={{ fontSize: 16 }}>{cls.level}</StyledText>
            </StyledView>
          </TouchableOpacity>
        ))}
      </StyledScrollView>
    </StyledView>
  );
};

export default ChatScreen;
