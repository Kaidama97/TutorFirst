import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import Home from '../screens/main/homeScreen/index'; // Update this path as necessary
import Profile from '../screens/main/profileScreen/index'; // Update this path as necessary
import Bookings from '../screens/main/bookingScreen/index'; // Update this path as necessary
import Resources from '../screens/main/resourcesScreen/index'; // Update this path as necessary
import Chat from '../screens/main/chatScreen/index'; // Import the Chat screen component

import { createStackNavigator } from '@react-navigation/stack';
import Classes from '../screens/main/classesScreen/index'; // Update this path as necessary
import Calendar from '../screens/main/classesScreen/components/calendar'; // Create this component if not done yet
import ClassDetailsScreen from '../screens/main/bookingScreen/components/classDetails';

const ClassesStack = createStackNavigator();

function ClassesStackNavigator() {
  return (
    <ClassesStack.Navigator>
      <ClassesStack.Screen 
        name="Classes"
        component={Classes} 
        options={{ headerShown: false }} // Adjust options as necessary
      />
      <ClassesStack.Screen 
        name="Calendar"
        component={Calendar}
        options={{ title: 'Calendar' }} // Adjust options as necessary
      />
    </ClassesStack.Navigator>
  );
}

const BookingStack = createStackNavigator();

function BookingStackNavigator() {
  return (
    <BookingStack.Navigator>
      <BookingStack.Screen 
        name="Booking" 
        component={Bookings} 
        options={{ headerShown: false }}
      />
      <BookingStack.Screen 
        name="ClassDetails" 
        component={ClassDetailsScreen} 
        options={{ title: 'Class Details' }}
      />
    </BookingStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (

  );
}

export default function App() {
  return (
      <MyTabs />
  );
}
