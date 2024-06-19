import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Button as RNButton, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { styled } from 'nativewind';
import { AuthContext } from '@/src/provider/authProvider'; // Import the AuthContext
import { fetchClasses } from './fetchClasses'; // Import the fetchClasses function
import { addClassAttendee } from './insertClasses'; // Import the addClassAttendee function

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const BookingScreen = () => {
  const { session } = useContext(AuthContext); // Access user session from AuthContext
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState<any[]>([]); // State to store fetched classes data

  // Fetch classes data when component mounts 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesData = await fetchClasses(); // Fetch classes data
        setClasses(classesData); // Update state with fetched classes data
      } catch (error: any) { // Specify the type of error as 'any'
        console.error('Error fetching classes:', error.message);
      }
    };

    fetchData(); // Call fetchData function
  }, []); // Run this effect only once when the component mounts

  const filteredClasses = classes.filter((cls) =>
    cls.description && cls.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClassSelect = (cls: any) => {
    setSelectedClass(cls);
  };

  const closeModal = () => {
    setSelectedClass(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options = { weekday: 'long'/*, year: 'numeric', month: 'long', day: 'numeric' */} as const;
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

  const confirmBooking = (cls: any) => {
    Alert.alert(
      "Confirm Booking",
      `Are you sure you want to book the class "${cls.description}"?`,
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => bookClass(cls)
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
      await addClassAttendee(session?.user.id, cls.classid); // Call addClassAttendee with userId and classId

      // Example: Update UI or fetch new classes after booking
      console.log('Successfully booked class:', cls.classid);
      // Perform additional UI updates or data refetching as needed
    } catch (error: any) {
      console.error('Error booking class:', error.message);
      // Handle error or display error message to user
    }
  };

  return (
    <StyledView className="flex-1 p-5" style={{ backgroundColor: '#B0C4DE' }}>
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
              onPress={() => handleClassSelect(cls)}
              className="p-4 mb-4 bg-white rounded-2xl shadow-md border border-gray-300"
              style={{ backgroundColor: '#ffffff', borderRadius: 15 }}
            >
              <StyledView className="flex-row justify-between items-center">
                <StyledView style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                  <StyledView>
                    <StyledText className="font-bold mb-2" style={{ color: '#333333' }}>{cls.description} ({firstName})</StyledText>
                    <View style={{ marginTop: 5 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="map-marker" size={20} color="black" />
                        <StyledText style={{ marginLeft: 12, color: '#666666' }}>{cls.location}</StyledText>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <Icon name="calendar" size={20} color="black" />
                        <StyledText style={{ marginLeft: 5, color: '#666666' }}>{formatDate(cls.class_date)}</StyledText>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <Icon name="clock-o" size={20} color="black" />
                        <StyledText style={{ marginLeft: 5, color: '#666666' }}>
                          {formatTime(cls.start_time)} ({calculateDuration(cls.start_time, cls.end_time)})
                        </StyledText>
                      </View>
                    </View>
                    <StyledText style={[{ marginTop: 5, fontWeight: 'bold' }, getSlotStyle(cls.class_size - cls.classattendee.length)]}>
                      Slots Available: {cls.class_size - cls.classattendee.length}
                    </StyledText>
                  </StyledView>
                </StyledView>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <RNButton title="View Details" onPress={() => handleClassSelect(cls)} />
                  <View style={{ marginTop: 10 }}>
                    <RNButton title="Book" onPress={() => confirmBooking(cls)} />
                  </View>
                </View>
              </StyledView>
            </StyledTouchableOpacity>
          );
        })}
      </StyledScrollView>
      {selectedClass && (
        <StyledView className="absolute top-5 left-5 w-full h-full bg-opacity-50 bg-gray-800 flex justify-center items-center">
          <StyledView className="bg-white p-5 rounded-lg" style={{ width: '90%', borderRadius: 15 }}>
            <StyledText className="text-lg font-bold mb-2">{selectedClass.description} ({selectedClass.teacher})</StyledText>
            <StyledText>Location: {selectedClass.location}</StyledText>
            <StyledText>Date: {formatDate(selectedClass.class_date)}</StyledText>
            <StyledText>Start Time: {formatTime(selectedClass.start_time)} (Duration: {calculateDuration(selectedClass.start_time, selectedClass.end_time)})</StyledText>
            <StyledText>Slots Available: {selectedClass.class_size - selectedClass.classattendee.length}</StyledText>
            <RNButton title="Book Here" onPress={() => confirmBooking(selectedClass)} />
            <View style={{ marginTop: 10 }}>
              <RNButton title="Close" onPress={closeModal} />
            </View>
          </StyledView>
        </StyledView>
      )}
    </StyledView>
  );
};

export default BookingScreen;
