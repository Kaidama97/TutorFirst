import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { fetchClasses } from './fetchClasses'; // Import the fetchClasses function

const BookingScreen = () => {
  const [selectedClass, setSelectedClass] = useState('');
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
    cls.label && cls.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClassSelect = (value: string) => {
    setSelectedClass(value);
    // Handle class selection logic here, such as fetching available spots for the selected class
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
        placeholder="Search for a class"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView style={{ marginBottom: 20 }}>
        {filteredClasses.map((cls) => (
          <TouchableOpacity
            key={cls.value}
            onPress={() => handleClassSelect(cls.value)}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
            }}
          >
            <Text>{cls.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Additional UI components for displaying available spots and booking form */}
    </View>
  );
};

export default BookingScreen;
