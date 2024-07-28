import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Form from '../src/screens/auth/registerScreen/components/form'; // Adjust the path to your Form component

describe('Form Component', () => {
  const mockNavigate = jest.fn();
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to login screen on "Log In" press', () => {
    const { getByText } = render(<Form navigation={navigation} />);

    fireEvent.press(getByText(' Log In'));

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});
