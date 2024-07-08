import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '@/src/provider/authProvider';
import { deleteClass } from './fetchUserClasses';
import ProfilePicture from './profilePicture';

const ClassDetailsScreen = ({ route, navigation }: any) => {
  const { selectedClass, selectedTeacher } = route.params; // Ensure selectedClass and selectedTeacher are correctly passed
  const { session, userData } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  // Function to handle canceling a class
  const handleCancelClass = async (classId: string) => {
    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      await deleteClass(userId, classId); // Implement deleteClass function in fetchUserClasses
      navigation.navigate('Classes');
    } catch (error) {
      console.error('Error cancelling class:', error);
    }
  };

  // Function to confirm canceling a class
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
  const navigateToEditClass = (classDetails: any) => {
    // Navigate to edit class screen, passing necessary parameters if needed
    navigation.navigate('Edit Class', { classDetails });
  };
  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options = { weekday: 'long' } as const;
    return date.toLocaleDateString(undefined, options);
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    return `${hour}:${minute}`;
  };

  // Helper function to calculate duration
  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const durationHours = endHour - startHour;
    const durationMinutes = endMinute - startMinute;
    return `${durationHours}h ${durationMinutes}m`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{selectedClass.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{selectedClass.description}</Text>

        {/* Level */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Icon name="graduation-cap" size={20} color="black" />
          <Text style={{ marginLeft: 5, color: '#666666' }}>{selectedClass.level}</Text>
        </View>

        {/* Location */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Icon name="map-marker" size={20} color="black" />
          <Text style={{ marginLeft: 12, color: '#666666' }}>{selectedClass.location}</Text>
        </View>

        {/* Lesson Type */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Icon name="book" size={20} color="black" />
          <Text style={{ marginLeft: 12, color: '#666666' }}>{selectedClass.lesson_type}</Text>
        </View>

        {/* Class Date */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Icon name="calendar" size={20} color="black" />
          <Text style={{ marginLeft: 5, color: '#666666' }}>{formatDate(selectedClass.class_date)}</Text>
        </View>

        {/* Recurrence */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Icon name="repeat" size={20} color="black" />
          <Text style={{ marginLeft: 5, color: '#666666' }}>{selectedClass.isrecursing ? 'Recurring' : 'One-time'}</Text>
        </View>

        {/* Start Time and Duration */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Icon name="clock-o" size={20} color="black" />
          <Text style={{ marginLeft: 5, color: '#666666' }}>
            {formatTime(selectedClass.start_time)} ({calculateDuration(selectedClass.start_time, selectedClass.end_time)})
          </Text>
        </View>

        {/* Teacher Details */}

        {userData?.roleid == "1"
          ? <TouchableOpacity style={styles.editButton} onPress={() => navigateToEditClass(selectedClass)}>
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Edit Class</Text>
          </TouchableOpacity>

          : <TouchableOpacity style={styles.teacherButton} onPress={() => setModalVisible(true)}>

            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>
              Teacher: {selectedTeacher.firstname} {selectedTeacher.lastname}
            </Text>
          </TouchableOpacity>}


        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => confirmCancelClass(selectedClass.classid)}>
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Cancel Class</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for displaying teacher details */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          { selectedTeacher && userData?.roleid != "1" && (
            <View style={styles.modalContent}>
              <ProfilePicture userid={selectedTeacher.userid} />
              <Text style={styles.modalTitle}>{selectedTeacher.firstname} {selectedTeacher.lastname}</Text>
              <Text style={styles.modalText}>Description: {selectedTeacher.description}</Text>
              <Text style={styles.modalText}>Subjects Taught: {selectedTeacher.subjects_taught.join(', ')}</Text>
              <View style={{ marginTop: 10 }}>
                <Button title="Close" onPress={closeModal} />
              </View>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  teacherButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
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
  editButton: {
    backgroundColor: 'green',
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
