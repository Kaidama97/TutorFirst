import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styled } from 'nativewind';
import { AuthContext } from '@/src/provider/authProvider';
import { fetchClasses } from './fetchClasses';
import { useFocusEffect } from '@react-navigation/native';
import ProfilePicture from './profilePicture';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const BookingScreen = ({ navigation }: { navigation: any }) => {
  const { session } = useContext(AuthContext);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) {
        console.error('User ID not found');
        return;
      }
      const classesData = await fetchClasses(userId);
      setClasses(classesData);
    } catch (error: any) {
      console.error('Error fetching classes:', error.message);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );
  const currentDate = new Date();

  const filteredClasses = classes.filter((cls) => {
    // Compare class date and time with current date and time
    const classDateTime = new Date(`${cls.class_date}T${cls.start_time}`);
    
    // Example: Only show classes that haven't started yet
    return classDateTime > currentDate;
  });
  
  
  const handleClassSelect = (cls: any) => {
    setSelectedClass(cls);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedClass(null);
    setSelectedTeacher(null);
    setModalVisible(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    return `${hour}:${minute}`;
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const durationHours = endHour - startHour;
    const durationMinutes = endMinute - startMinute;
    return `${durationHours}h ${durationMinutes}m`;
  };

  const getSlotStyle = (availableSlots: number) => {
    if (availableSlots > 10) {
      return { color: 'green' };
    } else if (availableSlots > 0) {
      return { color: 'orange' };
    } else {
      return { color: 'red' };
    }
  };
  
  const handleTeacherSelect = (teacher: any) => {
    setSelectedTeacher(teacher);
    setModalVisible(true); // Open the modal when a teacher is selected
  };

  return (
    <StyledView className="flex-1 p-5" style={{ backgroundColor: '#F0F0F0' }}>
      <StyledTextInput
        className="h-10 border border-gray-400 mb-2 px-2"
        placeholder="Search for a class"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ backgroundColor: '#ffffff', borderRadius: 10 }}
      />
      <StyledScrollView className="flex-1 mb-0" contentContainerStyle={{ paddingBottom: 10 }}>
        {filteredClasses.map((cls) => {
          const tutor = cls.classtutor[0];
          const firstName = tutor?.users?.firstname || 'Unknown Tutor';

          return (
            <StyledTouchableOpacity
              key={cls.classid}
              onPress={() => {
                const selectedTeacher = cls.classtutor[0]?.users;
                navigation.navigate('ClassDetails', { selectedClass: cls, selectedTeacher });
              }}
              className="p-4 mb-4 bg-white rounded-2xl shadow-md border border-gray-300"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <StyledView className="flex-row justify-between items-center">
                <StyledView style={{ flexDirection: 'column', flex: 1 }}>
                  <StyledText className="font-bold mb-2" style={{ color: '#333333' }}>
                    {cls.title}
                    <StyledTouchableOpacity onPress={() => handleTeacherSelect(tutor.users)}>
                      <StyledText style={{ color: '#1E90FF' }}> ({firstName})</StyledText>
                    </StyledTouchableOpacity>
                  </StyledText>
                  <StyledView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Icon name="graduation-cap" size={20} color="black" />
                    <StyledText style={{ marginLeft: 5, color: '#666666' }}>{cls.level}</StyledText>
                  </StyledView>
                  <View style={{ marginTop: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="map-marker" size={20} color="black" />
                      <StyledText style={{ marginLeft: 12, color: '#666666' }}>{cls.location}</StyledText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                      <Icon name="calendar" size={20} color="black" />
                      <StyledText style={{ marginLeft: 5, color: '#666666' }}>
                        {cls.isrecursing ? formatDate(cls.class_date).split(',')[0] : formatDate(cls.class_date)}
                      </StyledText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                      <Icon name="clock-o" size={20} color="black" />
                      <StyledText style={{ marginLeft: 5, color: '#666666' }}>
                        {formatTime(cls.start_time)} ({calculateDuration(cls.start_time, cls.end_time)})
                      </StyledText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                      <Icon name="dollar" size={20} color="black" />
                      <StyledText style={{ marginLeft: 5, color: '#666666' }}>{cls.price}</StyledText>
                    </View>
                  </View>
                  <StyledText style={[{ marginTop: 5, fontWeight: 'bold' }, getSlotStyle(cls.class_size - cls.classattendee.length)]}>
                    Slots Available: {cls.class_size - cls.classattendee.length}
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledTouchableOpacity>
          );
        })}
      </StyledScrollView>

      {/* Modal to display selected teacher's profile */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <StyledView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          {selectedTeacher && (
            <StyledView style={{ alignItems: 'center', backgroundColor: '#ffffff', padding: 20, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, width: '80%' }}>
              <ProfilePicture userid={selectedTeacher.userid} />
              <StyledText className="text-lg font-bold mb-2"><Text>{selectedTeacher.firstname}</Text></StyledText>
              <StyledText style={{ textAlign: 'center', marginBottom: 10 }}>Description: {selectedTeacher.description}</StyledText>
              <StyledText style={{ textAlign: 'center', marginBottom: 10 }}>Subjects Taught: {selectedTeacher.subjects_taught.join(', ')}</StyledText>
              <View style={{ marginTop: 10 }}>
                <Button title="Close" onPress={closeModal} />
              </View>
            </StyledView>
          )}
        </StyledView>
      </Modal>
    </StyledView>
  );
};

export default BookingScreen;
