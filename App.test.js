import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingScreen from '/Users/johannsenlum/tutorfirst/src/screens/register/loadingScreen/index.tsx';


describe('LoadingScreen', () => {
  test('renders correctly', () => {
    const { getByText } = render(<LoadingScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });
});
