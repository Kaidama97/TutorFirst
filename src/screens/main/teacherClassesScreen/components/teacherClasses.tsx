import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Button } from 'react-native';
import { fetchTeacherClasses } from './fetchTeacherClasses'; // Adjust path as needed
import { AuthContext } from '@/src/provider/authProvider'; // Import the AuthContext
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import { styled } from 'nativewind';

const StyledScrollView = styled(ScrollView);

interface TeacherClassesListProps {
  navigation: NavigationProp<ParamListBase>;
}

const TeacherClassesList: React.FC<TeacherClassesListProps> = ({ navigation }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useContext(AuthContext);

  const fetchClassesByTeacher = async () => {
    if (!session || !session.user || !session.user.id) {
      console.error('User ID not found or session not initialized');
      setLoading(false);
      return;
    }

    try {
      const teacherId = session.user.id; // Assuming session.user.id is the teacher's userid
      const classesData = await fetchTeacherClasses(teacherId);
      setClasses(classesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (session && session.user) {
        fetchClassesByTeacher();
      }
    }, [session])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <StyledScrollView style={{ flex: 1, padding: 16, backgroundColor: '#ffffff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Your Classes</Text>
        <Button title="View Calendar" onPress={() => navigation.navigate('Calendar')} />
      </View>
      {classes.length === 0 ? (
        <Text>No classes found.</Text>
      ) : (
        classes.map((cls) => {
          const tutor = cls.classtutor?.[0]?.users || { firstname: 'Unknown', lastname: 'Tutor' };
          return (
            <TouchableOpacity
              key={cls.classid}
              style={{ marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#dddddd', borderRadius: 8, backgroundColor: '#f9f9f9' }}
              onPress={() => navigation.navigate('ClassScreenDetails', { selectedClass: cls, selectedTeacher: tutor })}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{cls.title}</Text>
                  <Text style={{ fontSize: 14, color: '#666666', marginBottom: 4 }}>Location: {cls.location}</Text>
                  <Text style={{ fontSize: 14, color: '#666666', marginBottom: 4 }}>Date: {cls.class_date}</Text>
                  <Text style={{ fontSize: 14, color: '#666666', marginBottom: 4 }}>Time: {cls.start_time} - {cls.end_time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </StyledScrollView>
  );
};

export default TeacherClassesList;
