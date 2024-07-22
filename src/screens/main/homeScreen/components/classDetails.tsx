import { AuthContext } from '@/src/provider/authProvider';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { addClassAttendee, fetchUserBookedClasses } from '../../bookingScreen/components/insertClasses';

const ClassDetailsScreen = ({ route, navigation }: any) => {
  const { selectedClass, selectedTeacher } = route.params;
  const { session, userData } = useContext(AuthContext); // Assuming userData is part of AuthContext
  const [modalVisible, setModalVisible] = useState(false);
  
  const roleid = Number(userData?.roleid); // Retrieve roleid from userData
  console.log("roleid", roleid);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options = { weekday: 'long' } as const;
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

  const handleBookClass = async () => {
    try {
      const userId = session?.user.id;
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const bookedClasses = await fetchUserBookedClasses(userId);
      const isConflict = checkForConflicts(bookedClasses, selectedClass);

      if (isConflict) {
        Alert.alert(
          "Time Conflict",
          "You have another class booked at the same time. Please choose a different time slot.",
          [{ text: "OK", style: "cancel" }]
        );
        navigation.goBack();
      } else {
        Alert.alert(
          "Confirm Booking",
          `Are you sure you want to book the class "${selectedClass.title}"?`,
          [
            {
              text: "No",
              style: "cancel"
            },
            {
              text: "Yes",
              onPress: () => bookClass(selectedClass)
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Error checking conflicts:', error.message);
    }
  };

  const checkForConflicts = (bookedClasses: any[], newClass: any) => {
    const newClassDate = new Date(newClass.class_date);
    const newClassStartTime = new Date(newClass.class_date + 'T' + newClass.start_time);
    const newClassEndTime = new Date(newClass.class_date + 'T' + newClass.end_time);

    for (const cls of bookedClasses) {
      const bookedClassDate = new Date(cls.class_date);
      const bookedClassStartTime = new Date(cls.class_date + 'T' + cls.start_time);
      const bookedClassEndTime = new Date(cls.class_date + 'T' + cls.end_time);

      if (newClassDate.getTime() === bookedClassDate.getTime()) {
        if (
          (newClassStartTime >= bookedClassStartTime && newClassStartTime < bookedClassEndTime) ||
          (newClassEndTime > bookedClassStartTime && newClassEndTime <= bookedClassEndTime) ||
          (newClassStartTime <= bookedClassStartTime && newClassEndTime >= bookedClassEndTime)
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const bookClass = async (cls: any) => {
    if (!session?.user.id) {
      console.error('User ID not found');
      return;
    }
    try {
      await addClassAttendee(session?.user.id, cls.classid);
      console.log('Successfully booked class:', cls.classid);
      Alert.alert(
        "Success",
        "Successfully booked class",
        [{ text: "OK", style: "cancel" }]
      );
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Error booking class:', error.message);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{selectedClass.title}</Text>
        <Text style={styles.description}>{selectedClass.description}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Icon name="graduation-cap" size={20} color="black" />
          <Text style={{ marginLeft: 5, color: '#666666' }}>{selectedClass.level}</Text>
        </View>
        <View style={{ marginTop: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="map-marker" size={20} color="black" />
            <Text style={{ marginLeft: 12, color: '#666666' }}>{selectedClass.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Icon name="book" size={20} color="black" />
            <Text style={{ marginLeft: 12, color: '#666666' }}>{selectedClass.lesson_type}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Icon name="calendar" size={20} color="black" />
            <Text style={{ marginLeft: 5, color: '#666666' }}>{formatDate(selectedClass.class_date)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Icon name="repeat" size={20} color="black" />
            <Text style={{ marginLeft: 5, color: '#666666' }}>{selectedClass.isrecursing ? 'Recurring' : 'One-time'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Icon name="clock-o" size={20} color="black" />
            <Text style={{ marginLeft: 5, color: '#666666' }}>
              {formatTime(selectedClass.start_time)} ({calculateDuration(selectedClass.start_time, selectedClass.end_time)})
            </Text>
          </View>
        </View>
        <Text style={[{ marginTop: 5, fontWeight: 'bold' }, getSlotStyle(selectedClass.class_size - selectedClass.classattendee.length)]}>
          Slots Available: {selectedClass.class_size - selectedClass.classattendee.length}
        </Text>
        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Teacher: {selectedTeacher.firstname} {selectedTeacher.lastname}</Text>

        {/* Conditionally Render Book Button */}
        {roleid === 2 && (
          <TouchableOpacity style={styles.bookButton} onPress={handleBookClass}>
            <Text style={styles.buttonText}>Book</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  content: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    marginTop: 10,
  },
  bookButton: {
    backgroundColor: 'tomato',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  teacherButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    color: '#666666',
  },
});

export default ClassDetailsScreen;
