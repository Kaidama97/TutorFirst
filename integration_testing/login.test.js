import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthContext } from "@/src/provider/authProvider";
import Form from '../src/screens/auth/loginScreen/components/form';

const mockNavigate = jest.fn();

const mockHandleLogin = jest.fn().mockResolvedValue();

const authContextValue = {
  handleLogin: mockHandleLogin,
};

const navigation = {
  navigate: mockNavigate,
};

describe('Form', () => {
  it('should call login function with correct email and password', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={authContextValue}>
        <Form navigation={navigation} />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'tester1@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.press(getByText('Log In'));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith('tester1@gmail.com', '123456');
    });
  });

  it('should show validation error for invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={authContextValue}>
        <Form navigation={navigation} />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.press(getByText('Log In'));

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('should navigate to Register screen when clicking on "Click Here"', () => {
    const { getByText } = render(
      <AuthContext.Provider value={authContextValue}>
        <Form navigation={navigation} />
      </AuthContext.Provider>
    );

    fireEvent.press(getByText('Click Here'));
    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });
});
