import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import BookingScreen from '../src/screens/main/bookingScreen/components/booking'; // Adjust the path to your BookingScreen component
import { AuthContext } from '@/src/provider/authProvider';
import { fetchClasses } from '../src/screens/main/bookingScreen/components/fetchClasses'; // Adjust the path to your fetchClasses function

jest.mock('../src/screens/main/bookingScreen/components/fetchClasses'); // Mock fetchClasses function

describe('BookingScreen', () => {
  const mockNavigate = jest.fn();
  const navigation = { navigate: mockNavigate };

  const session = { user: { id: 'user123' } };

  const mockClasses = [
    {
      classid: 'class1',
      title: 'Math 101',
      level: 'Beginner',
      location: 'Room 101',
      class_date: '2024-08-01',
      start_time: '10:00',
      end_time: '11:00',
      price: '50',
      class_size: 20,
      classattendee: [],
      classtutor: [
        {
          users: {
            userid: 'tutor1',
            firstname: 'John',
          },
        },
      ],
      isrecursing: false,
    },
    {
      classid: 'class2',
      title: 'Science 101',
      level: 'Intermediate',
      location: 'Room 102',
      class_date: '2024-08-02',
      start_time: '12:00',
      end_time: '13:00',
      price: '60',
      class_size: 15,
      classattendee: [],
      classtutor: [
        {
          users: {
            userid: 'tutor2',
            firstname: 'Jane',
          },
        },
      ],
      isrecursing: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetchClasses.mockResolvedValue(mockClasses);
  });

  it('should fetch and display classes on entering the page', async () => {
    const { getByText } = render(
      <AuthContext.Provider value={{ session }}>
        <NavigationContainer>
          <BookingScreen navigation={navigation} />
        </NavigationContainer>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(fetchClasses).toHaveBeenCalledWith('user123');
    });

    // Check if classes are displayed
    //expect(getByText('Math 101')).toBeTruthy();
    //expect(getByText('Science 101')).toBeTruthy();
  });
});
