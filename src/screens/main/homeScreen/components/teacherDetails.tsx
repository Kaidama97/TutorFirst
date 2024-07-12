import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { supabase } from '../../../../initSupabase';
import ProfilePicture from '../components/profilePicture';

const StyledView = styled(View);
const StyledText = styled(Text);

type Teacher = {
  id: string;
  firstname: string;
  lastname: string;
  profilepicture: string;
  description: string;
  subjects_taught: string[];
  classes_taught: { id: string; title: string; description: string }[];
};

const SearchTeacherScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      let { data: teachers, error } = await supabase
        .from('users')
        .select('*')
        .eq('roleid', 1); // Fetch users where roleid == 1 (teachers)
      
      if (error) {
        throw error;
      }
      
      // Handle null case from Supabase response
      if (!teachers) {
        teachers = [];
      }
      
      setTeachersData(teachers);
    } catch (error:any) {
      console.error('Error fetching teachers:', error.message);
    }
  };

  const filteredTeachers = teachersData.filter(teacher =>
    `${teacher.firstname} ${teacher.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StyledView style={{ flex: 1, padding: 10 }}>
      {/* Teachers List */}
      <ScrollView>
        {filteredTeachers.map((teacher) => (
          <StyledView key={teacher.id} style={styles.teacherContainer}>
            {/* Top Section: Profile, Subjects, Bio */}
            <View style={styles.topContainer}>
            <ProfilePicture />
              <View style={styles.textContainer}>
                <StyledText style={styles.teacherName}>{teacher.firstname} {teacher.lastname}</StyledText>
                <StyledText style={styles.subjects}>{teacher.subjects_taught.join(', ')}</StyledText>
                <StyledText style={styles.description}>{teacher.description}</StyledText>
              </View>
            </View>

            {/* Bottom Section: Classes Taught */}
            <View style={styles.classesContainer}>
              <StyledText style={styles.sectionTitle}>Classes Taught</StyledText>
              {teacher.classes_taught ? (
                teacher.classes_taught.map((cls) => (
                  <View key={cls.id} style={styles.classCard}>
                    <StyledText style={styles.classTitle}>{cls.title}</StyledText>
                    <StyledText style={styles.classDescription}>{cls.description}</StyledText>
                  </View>
                ))
              ) : (
                <StyledText>No classes found</StyledText>
              )}
            </View>
          </StyledView>
        ))}
      </ScrollView>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  teacherContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  teacherImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subjects: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  classesContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  classCard: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  classDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default SearchTeacherScreen;
