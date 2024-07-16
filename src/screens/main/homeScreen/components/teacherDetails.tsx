import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { supabase } from '../../../../initSupabase';
import ProfilePicture from '../components/profilePicture';

const StyledView = styled(View);
const StyledText = styled(Text);

type Teacher = {
  id: string;
  classid: any;
  firstname: string;
  lastname: string;
  profilepicture: string;
  description: string;
  subjects_taught: string[];
  classes_taught: { id: string; title: string; class_date: string; class_day: string; isrecursing: boolean;
    start_time: any; end_time: any; class_size: any; classattendee: any; description: any; location: any; level: any; lesson_type: any;
  }[];
};

const SearchTeacherScreen = ({ navigation }: { navigation: any }) => {
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

      if (!teachers) {
        teachers = [];
      }

      // Fetch classes for each teacher and add to teacher object
      const teacherPromises = teachers.map(async (teacher) => {
        let { data: classTutors, error: classTutorError } = await supabase
          .from('classtutor')
          .select('classid')
          .eq('userid', teacher.userid);

        if (classTutorError) {
          throw classTutorError;
        }

        const classIds = classTutors ? classTutors.map((entry: any) => entry.classid) : [];

        let { data: classes, error: classError } = await supabase
          .from('classes')
          .select(`*,
            classattendee (
              *
            )`
          )
          .in('classid', classIds);

        if (classError) {
          throw classError;
        }

        // Filter classes based on date and isrecursing flag
        const currentDate = new Date();
        const classes_taught = classes ? classes.filter((cls: any) => {
          const classDate = new Date(cls.class_date);
          if (classDate < currentDate && !cls.isrecursing) {
            return false; // Filter out classes with past dates and not recursing
          }
          return true; // Include all other classes
        }).map((cls: any) => ({
          id: cls.id,
          title: cls.title,
          class_date: cls.class_date,
          class_day: cls.class_day,
          isrecursing: cls.isrecursing,
          start_time: cls.start_time,
          end_time: cls.end_time,
          class_size: cls.class_size,
          classattendee: cls.classattendee,
          location: cls.location,
          description: cls.description,
          level: cls.level,
          lesson_type: cls.lesson_type,
          classid: cls.classid,

        })) : [];

        return { ...teacher, classes_taught };
      });

      const teachersWithClasses = await Promise.all(teacherPromises);

      setTeachersData(teachersWithClasses);
    } catch (error: any) {
      console.error('Error fetching teachers:', error.message);
    }
  };

  const filteredTeachers = teachersData.filter(teacher =>
    `${teacher.firstname} ${teacher.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateToClassDetails = (selectedClass: any, selectedTeacher: any) => {
    navigation.navigate('ClassDetails', { selectedClass, selectedTeacher });
  };

  return (
    <StyledView style={{ flex: 1, padding: 10 }}>
      {/* Teachers List */}
      <ScrollView showsVerticalScrollIndicator={false}>
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {teacher.classes_taught.length > 0 ? (
                  teacher.classes_taught.map((cls) => (
                    <TouchableOpacity
                      key={cls.id}
                      onPress={() => navigateToClassDetails(cls, teacher)}
                      style={styles.classCard}
                    >
                      <StyledText style={styles.classTitle}>{cls.title}</StyledText>
                      <StyledText style={styles.classDescription}>
                        {cls.isrecursing ? cls.class_day : `${cls.class_date} - ${cls.class_day}`}
                      </StyledText>
                    </TouchableOpacity>
                  ))
                ) : (
                  <StyledText key={`${teacher.id}-no-classes`}>No classes found</StyledText>
                )}
              </ScrollView>
            </View>
          </StyledView>
        ))}
      </ScrollView>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  teacherContainer: {
    width: '100%', // Full width for each teacher box
    marginBottom: 20, // Margin bottom between teacher containers
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
    width: 150, // Fixed width for each class card
    marginRight: 10, // Margin right between class cards
    padding: 8, // Padding inside class card
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  classTitle: {
    fontSize: 14, // Font size for class title
    fontWeight: 'bold',
    marginBottom: 4, // Margin bottom for class title
  },
  classDescription: {
    fontSize: 12, // Font size for class description
    color: '#666',
  },
});

export default SearchTeacherScreen;
