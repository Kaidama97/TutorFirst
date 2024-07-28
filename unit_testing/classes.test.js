import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ClassesList from '../src/screens/main/classesScreen/components/classes'; // Adjust path as needed
import { AuthContext } from '@/src/provider/authProvider';
import { NavigationContainer } from '@react-navigation/native';
import { fetchClasses } from '../src/screens/main/classesScreen/components/fetchUserClasses'; // Adjust path as needed

jest.mock('../src/screens/main/classesScreen/components/fetchUserClasses', () => ({
  fetchClasses: jest.fn(),
  deleteClass: jest.fn(),
}));

const mockClasses = [
  {
    classid: 'class123',
    title: 'Math Class',
    description: 'An advanced math class',
    level: 'Advanced',
    location: 'Room 101',
    lesson_type: 'Lecture',
    class_date: '2024-07-28',
    start_time: '10:00',
    end_time: '12:00',
    isrecursing: false,
    class_size: 15,
    classattendee: [],
    classtutor: [{ users: { firstname: 'John', lastname: 'Doe' } }],
  },
];

const mockNavigation = {
  navigate: jest.fn(),
};

describe('ClassesList', () => {
  const session = { user: { id: 'user123' } };
  const userData = { roleid: '2' };

  beforeEach(() => {
    jest.clearAllMocks();
    fetchClasses.mockResolvedValue(mockClasses);
  });

  it('renders classes and handles navigation', async () => {
    const { getByText } = render(
      <AuthContext.Provider value={{ session, userData }}>
        <NavigationContainer>
          <ClassesList navigation={mockNavigation} />
        </NavigationContainer>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Math Class')).toBeTruthy();
    });

    const classItem = getByText('Math Class');
    fireEvent.press(classItem);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('ClassScreenDetails', {
        selectedClass: mockClasses[0],
        selectedTeacher: mockClasses[0].classtutor[0].users,
      });
    });
  });

  it('shows create class button for teachers', async () => {
    const teacherUserData = { roleid: '1' };

    const { getByText } = render(
      <AuthContext.Provider value={{ session, userData: teacherUserData }}>
        <NavigationContainer>
          <ClassesList navigation={mockNavigation} />
        </NavigationContainer>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Click to create class')).toBeTruthy();
    });

    const createClassButton = getByText('Click to create class');
    fireEvent.press(createClassButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Create Class');
    });
  });

});
