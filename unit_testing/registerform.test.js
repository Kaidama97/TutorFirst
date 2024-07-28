import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Form from '../src/screens/auth/registerScreen/components/form'; // Adjust the path as necessary
import { supabase } from '../src/initSupabase'; // Adjust the path as necessary

jest.mock('../src/initSupabase');

describe('Form', () => {
  it('validates email input', async () => {
    const { getByPlaceholderText, getByText } = render(<Form navigation={{ navigate: jest.fn() }} />);
    
    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent(emailInput, 'blur');

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('calls signUp function with correct inputs', async () => {
    supabase.auth.signUp.mockResolvedValue({ data: {}, error: null });

    const { getByPlaceholderText, getByText } = render(<Form navigation={{ navigate: jest.fn() }} />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Re-type Password');
    const signUpButton = getByText('Sign Up');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: { emailRedirectTo: 'https://example.com/welcome' },
      });
    });
  });
});
