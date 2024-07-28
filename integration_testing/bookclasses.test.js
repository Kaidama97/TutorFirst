import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ClassDetailsScreen from '../src/screens/main/bookingScreen/components/classDetails';
import { AuthContext } from '@/src/provider/authProvider';
import { addClassAttendee, fetchUserBookedClasses } from '../src/screens/main/bookingScreen/components/insertClasses';
import { Alert } from 'react-native';

// Mock the dependencies
jest.mock('../src/screens/main/bookingScreen/components/insertClasses');

describe('ClassDetailsScreen', () => {
  const mockNavigate = jest.fn();
  const session = { user: { id: 'test-user-id' } };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // Call the "OK" button's onPress function
      if (buttons && buttons.length > 0 && buttons[0].onPress) {
        buttons[0].onPress();
      }
      if (buttons && buttons.length > 1 && buttons[1].onPress) {
        buttons[1].onPress();
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should book a class successfully', async () => {
    fetchUserBookedClasses.mockResolvedValue([]);
    addClassAttendee.mockResolvedValue();

    // Mock the context and navigation
    jest.spyOn(React, 'useContext').mockReturnValue({ session });
    const navigation = { navigate: mockNavigate };
    const route = {
      params: {
        selectedClass: {
          classid: 'class-id-1',
          title: 'Test Class',
          description: 'This is a test class.',
          class_date: '2024-08-01',
          start_time: '10:00',
          end_time: '11:00',
          class_size: 10,
          classattendee: [],
          level: 'Beginner',
          location: 'Test Location',
          lesson_type: 'Online',
          isrecursing: false,
        },
        selectedTeacher: {
          firstname: 'John',
          lastname: 'Doe',
          subjects_taught: ['Math', 'Science'],
        },
      },
    };

    const { getByText } = render(
      <AuthContext.Provider value={{ session }}>
        <ClassDetailsScreen route={route} navigation={navigation} />
      </AuthContext.Provider>
    );

    fireEvent.press(getByText('Book'));

    await waitFor(() => {
      expect(addClassAttendee).toHaveBeenCalledWith('test-user-id', 'class-id-1');
      expect(mockNavigate).toHaveBeenCalledWith('Booking', { selectedClass: route.params.selectedClass });
    });
  });

  it('should show conflict alert if there is a time conflict', async () => {
    fetchUserBookedClasses.mockResolvedValue([
      {
        classid: 'class-id-2',
        class_date: '2024-08-01',
        start_time: '10:00',
        end_time: '11:00',
      },
    ]);

    jest.spyOn(React, 'useContext').mockReturnValue({ session });
    const navigation = { navigate: mockNavigate };
    const route = {
      params: {
        selectedClass: {
          classid: 'class-id-1',
          title: 'Test Class',
          description: 'This is a test class.',
          class_date: '2024-08-01',
          start_time: '10:00',
          end_time: '11:00',
          class_size: 10,
          classattendee: [],
          level: 'Beginner',
          location: 'Test Location',
          lesson_type: 'Online',
          isrecursing: false,
        },
        selectedTeacher: {
          firstname: 'John',
          lastname: 'Doe',
          subjects_taught: ['Math', 'Science'],
        },
      },
    };

    const { getByText } = render(
      <AuthContext.Provider value={{ session }}>
        <ClassDetailsScreen route={route} navigation={navigation} />
      </AuthContext.Provider>
    );

    fireEvent.press(getByText('Book'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Time Conflict',
        'You have another class booked at the same time. Please choose a different time slot.',
        expect.any(Array)
      );
      //expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
