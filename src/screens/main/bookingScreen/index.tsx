import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { theme } from '../../../assets/theme/theme';

//import MainNavBar from '../../../navigation/mainNavBar'; // Import the MainNavBar component
import Booking from './components/booking';
import { AuthProvider } from '@/src/provider/authProvider';


const StyledView = styled(View);

const BookingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <AuthProvider>
    <StyledView className="flex-1" /*px-2 pt-2"*/ /*style={{ borderTopLeftRadius: 65, borderTopRightRadius: 65, backgroundColor: 'white' }}*/>
        <Booking/>
    </StyledView>
    </AuthProvider>
  );
};

export default BookingScreen;