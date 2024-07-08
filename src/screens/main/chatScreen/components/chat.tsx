import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '@/src/provider/authProvider';
import { fetchClasses, fetchTutorClasses } from './fetchClasses';

const ChatScreen = ({ navigation }: { navigation: any }) => {
  const { session, userData } = useContext(AuthContext);
  const [userClasses, setUserClasses] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const userId = session?.user?.id;
      const userRole = userData?.roleid;
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      let classesData;

      if (userRole == '2') {
        console.log("Student");
        classesData = await fetchClasses(userId);
      } else {
        console.log("Teacher");
        classesData = await fetchTutorClasses(userId);
      }

      setUserClasses(classesData);
    } catch (error: any) {
      console.error('Error fetching classes:', error.message);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleClassSelect = (classId: number) => {
    navigation.navigate('ClassChat', { classId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Classes</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {userClasses.map((cls) => (
          <TouchableOpacity
            key={cls.classid}
            style={styles.classContainer}
            onPress={() => handleClassSelect(cls.classid)}
          >
            <Text style={styles.classTitle}>{cls.title}</Text>
            <Text style={styles.classLevel}>Level: {cls.level}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Light gray background color
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333', // Dark gray text color
  },
  scrollView: {
    alignItems: 'center',
  },
  classContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF', // White background color
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333', // Dark gray text color
  },
  classLevel: {
    fontSize: 16,
    color: '#666666', // Medium gray text color
    marginTop: 5,
  },
});

export default ChatScreen;
