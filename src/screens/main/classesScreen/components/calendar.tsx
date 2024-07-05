import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AuthContext } from '@/src/provider/authProvider'; // Adjust the path as needed
import { fetchClasses, getRecurringDates } from './fetchUserClasses'; // Adjust path as needed

interface ClassDetails {
  title: string;
  description: string;
  location: string;
  class_date: string;
  start_time: string;
  end_time: string;
  isrecursing: boolean;
}

const CalendarScreen = () => {
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [selectedClasses, setSelectedClasses] = useState<ClassDetails[]>([]);
  const { session, userData } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserClasses = async () => {
      if (!session?.user?.id) {
        console.error('User ID not found');
        return;
      }

      try {
        const userId = session.user.id;
        const classesData = await fetchClasses(userId, userData);

        const markedDatesObject: { [date: string]: any } = {};
        classesData.forEach(cls => {
          if (cls.isrecursing) {
            const recurringDates = getRecurringDates(cls.class_date);
            recurringDates.forEach(date => {
              if (!markedDatesObject[date]) {
                markedDatesObject[date] = { marked: true, dots: [], classes: [] };
              }
              markedDatesObject[date].dots.push({ color: 'red' });
              markedDatesObject[date].classes.push(cls);
            });
          } else {
            const formattedDate = cls.class_date;
            if (!markedDatesObject[formattedDate]) {
              markedDatesObject[formattedDate] = { marked: true, dots: [], classes: [] };
            }
            markedDatesObject[formattedDate].dots.push({ color: 'red' });
            markedDatesObject[formattedDate].classes.push(cls);
          }
        });
        setMarkedDates(markedDatesObject);
      } catch (error) {
        console.error('Error fetching user classes:', error);
      }
    };

    fetchUserClasses();
  }, [session]);

  const handleDayPress = (day: { dateString: string | number; }) => {
    const classesOnSelectedDate = markedDates[day.dateString]?.classes || [];
    setSelectedClasses(classesOnSelectedDate);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Calendar
        style={{ marginBottom: 16 }}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        markingType={'multi-dot'}
        theme={{
          dotColor: '#ff0000',
          selectedDotColor: '#ffffff',
          todayTextColor: '#00adf5',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
      />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {selectedClasses.length === 0 ? (
          <Text>No classes found for this day.</Text>
        ) : (
          selectedClasses.map((cls, index) => (
            <View key={index} style={{ marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#dddddd', borderRadius: 8, backgroundColor: '#f9f9f9' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{cls.title}</Text>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Location: {cls.location}</Text>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Date: {cls.class_date}</Text>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Time: {cls.start_time} - {cls.end_time}</Text>
              
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default CalendarScreen;
