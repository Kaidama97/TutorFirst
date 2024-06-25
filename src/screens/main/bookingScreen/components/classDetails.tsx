import { AuthContext } from '@/src/provider/authProvider';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { addClassAttendee } from './insertClasses';

const ClassDetailsScreen = ({ route, navigation }: any) => {
  const { selectedClass } = route.params;
  const { session } = useContext(AuthContext)
  
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

  const handleBookClass = () => {
    // Logic to handle booking action goes here
    // For example, you can navigate to a booking screen
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
  };

  const bookClass = async (cls: any) => {
    if (!session?.user.id) {
      console.error('User ID not found');
      return;
    }
    try {
      await addClassAttendee(session?.user.id, cls.classid);
      console.log('Successfully booked class:', cls.classid);
      navigation.navigate('Booking', { selectedClass });
    } catch (error: any) {
      console.error('Error booking class:', error.message);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{selectedClass.title}</Text>
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
            <Icon name="calendar" size={20} color="black" />
            <Text style={{ marginLeft: 5, color: '#666666' }}>{formatDate(selectedClass.class_date)}</Text>
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

        {/* Book Button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBookClass}>
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
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
});

export default ClassDetailsScreen;
