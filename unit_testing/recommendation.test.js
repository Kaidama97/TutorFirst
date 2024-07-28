import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import RecommendationPage from '../src/screens/main/homeScreen/components/recommendation';
import * as fetchRecommendationModule from '../src/screens/main/homeScreen/components/fetchRecommendation';
import { AuthContext } from '@/src/provider/authProvider';

// Mock the getUsersSubjects and getRecommendedClasses functions
jest.mock('../src/screens/main/homeScreen/components/fetchRecommendation', () => ({
  getUsersSubjects: jest.fn(),
  getRecommendedClasses: jest.fn()
}));

const mockNavigation = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigation,
    }),
  };
});

describe('RecommendationPage', () => {
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    fetchRecommendationModule.getUsersSubjects.mockResolvedValue(['Math', 'Science']);
    fetchRecommendationModule.getRecommendedClasses.mockResolvedValue([
      {
        id: '1',
        title: 'Class 1',
        level: 'Beginner',
        description: 'Introduction to Math',
        classtutor: [{ users: { firstname: 'John', lastname: 'Doe', description: '', profilepicture: '', userid: 't1', subjects_taught: ['Math'], gender: 'male' } }],
      },
      {
        id: '2',
        title: 'Class 2',
        level: 'Intermediate',
        description: 'Intermediate Science',
        classtutor: [{ users: { firstname: 'Jane', lastname: 'Doe', description: '', profilepicture: '', userid: 't2', subjects_taught: ['Science'], gender: 'female' } }],
      }
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithContext = (ui) => {
    return render(
      <AuthContext.Provider value={{ session: { user: { id: mockUserId } } }}>
        <NavigationContainer>
          {ui}
        </NavigationContainer>
      </AuthContext.Provider>
    );
  };

  test('displays "No classes found" when no classes are available', async () => {
    fetchRecommendationModule.getRecommendedClasses.mockResolvedValueOnce([]);
    const { getByText } = renderWithContext(<RecommendationPage />);
    expect(await getByText('No classes found')).toBeTruthy();
  });

  test('renders recommended classes and handles class detail button press', async () => {
    const { getByText, getByTestId } = renderWithContext(<RecommendationPage />);
    
    // Wait for the component to fetch and display classes
    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Class 1')).toBeTruthy();
    expect(getByText('Class 2')).toBeTruthy();
    
    const classDetailButton = getByTestId('classDetailsButton-1'); // Select the specific button for Class 1
    fireEvent.press(classDetailButton);
    
    expect(mockNavigation).toHaveBeenCalledWith('ClassDetails', {
      selectedClass: expect.objectContaining({ id: '1' }),
      selectedTeacher: expect.any(Object),
    });
  });

  test('opens and closes sorting modal', async () => {
    const { getByTestId, queryByTestId } = renderWithContext(<RecommendationPage />);
    
    const openModalButton = getByTestId('openModalButton');
    fireEvent.press(openModalButton);

    expect(getByTestId('sortingModal')).toBeTruthy();

    const closeModalButton = getByTestId('closeModalButton');
    fireEvent.press(closeModalButton);

    expect(queryByTestId('sortingModal')).toBeNull();
  });

  test('displays sorting options in the modal', async () => {
    const { getByText, getByTestId } = renderWithContext(<RecommendationPage />);
    
    // Wait for the component to fetch and display classes
    await act(async () => {
      await Promise.resolve();
    });

    // Open the modal
    const openModalButton = getByTestId('openModalButton');
    fireEvent.press(openModalButton);

    // Check if the sorting options are displayed
    expect(getByText('Subjects you are looking for')).toBeTruthy();
    expect(getByText('Male Teacher')).toBeTruthy();
    expect(getByText('Female Teacher')).toBeTruthy();
    expect(getByText('All Genders')).toBeTruthy();
  });
});
