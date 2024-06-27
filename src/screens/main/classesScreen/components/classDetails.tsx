import { AuthContext } from '@/src/provider/authProvider';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfilePicture from './profilePicture';
import { deleteClass } from './fetchUserClasses';

const ClassDetailsScreen = ({ route, navigation }: any) => {
  const { selectedClass} = route.params;
  const { session } = useContext(AuthContext);
  const [classes, setClasses] = useState<any[]>([]); // Define type for classes state
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const [modalVisible, setModalVisible] = useState(false);

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


  const handleCancelClass = async (classId: string) => {
    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      await deleteClass(userId, classId); // Implement deleteClass function in fetchUserClasses
      setClasses(classes.filter(cls => cls.classid !== classId));
      navigation.navigate('Classes', { selectedClass });
    } catch (error) {
      console.error('Error cancelling class:', error);
    }
  };

  const confirmCancelClass = (classId: string) => {
    Alert.alert(
      "Cancel Class",
      "Are you sure you want to cancel this class?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => handleCancelClass(classId)
        }
      ]
    );
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
    
        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => confirmCancelClass(selectedClass.classid)}>
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Cancel Class</Text>
        </TouchableOpacity>

  
      </View>

      {/* Modal */}
      
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
  teacherButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'tomato',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default ClassDetailsScreen;
