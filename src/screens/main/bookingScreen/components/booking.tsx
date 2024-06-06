import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const BookingScreen = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const availableClasses = [
    { label: 'Yoga - 10:00 AM', value: 'yoga-10am' },
    { label: 'Pilates - 12:00 PM', value: 'pilates-12pm' },
    { label: 'Zumba - 2:00 PM', value: 'zumba-2pm' },
    // Add more classes here
  ];

  const filteredClasses = availableClasses.filter((cls) =>
    cls.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClassSelect = (value: React.SetStateAction<string>) => {
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
