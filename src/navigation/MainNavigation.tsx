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

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'; // Default value to avoid 'used before assigned' error

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Book Classes':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Resources':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'My Classes':
              iconName = focused ? 'school' : 'school-outline';
              break;
            case 'Chat':
              iconName = focused ? 'chatbox' : 'chatbox-outline';
              break;
            default:
              break;
          }

          // Return the Ionicons component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="My Classes" component={ClassesStackNavigator} />
      <Tab.Screen name="Book Classes" component={Bookings} />
      <Tab.Screen name="Resources" component={Resources} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
      <MyTabs />
  );
}
