import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import BookingScreen from '../src/screens/main/bookingScreen/components/booking';
import { AuthContext } from '@/src/provider/authProvider';
import { fetchClasses } from '../src/screens/main/bookingScreen/components/fetchClasses';

// Mock fetchClasses to return some test data
jest.mock('../src/screens/main/bookingScreen/components/fetchClasses', () => ({
  fetchClasses: jest.fn(),
}));

const mockAuthContext = {
  user: true,
  session: {
    user: {
      id: '6a3b05a0-33d0-4d50-b76a-af800e3c03be',
    },
  },
};

const mockNavigation = {
  navigate: jest.fn(),
};

const mockClasses = [
  {
    classid: '1',
    title: 'Math 101',
    classtutor: [{ users: { userid: '1', firstname: 'Tutor A', description: 'Math Tutor', subject: 'Math', bio: 'Experienced Math Tutor' } }],
    level: 'Beginner',
    location: 'Room 101',
    class_date: '2024-07-30',
    start_time: '10:00',
    end_time: '12:00',
    price: '50',
    class_size: 20,
    classattendee: [],
    isrecursing: false,
  },
  {
    classid: '2',
    title: 'Science 101',
    classtutor: [{ users: { userid: '2', firstname: 'Tutor B', description: 'Science Tutor', subject: 'Science', bio: 'Experienced Science Tutor' } }],
    level: 'Intermediate',
    location: 'Room 102',
    class_date: '2024-08-01',
    start_time: '14:00',
    end_time: '16:00',
    price: '60',
    class_size: 15,
    classattendee: [],
    isrecursing: false,
  },
];

describe('BookingScreen', () => {
  it('renders correctly', async () => {
    fetchClasses.mockResolvedValueOnce(mockClasses);

    const { getByPlaceholderText, getByText, debug } = render(
      <NavigationContainer>
        <AuthContext.Provider value={mockAuthContext}>
          <BookingScreen navigation={mockNavigation} />
        </AuthContext.Provider>
      </NavigationContainer>
    );

    // Verify the TextInput placeholder is rendered
    expect(getByPlaceholderText('Search for a class')).toBeTruthy();

    
    // You can use debug() to print the component tree if needed
    //debug();
  });
});
