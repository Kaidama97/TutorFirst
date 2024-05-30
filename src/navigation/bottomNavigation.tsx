import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import Home from '../screens/main/homeScreen/index'; // Update this path as necessary
import Profile from '../screens/main/profileScreen/index'; // Update this path as necessary
import Bookings from '../screens/main/bookingScreen/index'; // Update this path as necessary
import Resources from '../screens/main/resourcesScreen/index'; // Update this path as necessary

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
            case 'Bookings':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Resources':
              iconName = focused ? 'book' : 'book-outline';
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
      <Tab.Screen name="Bookings" component={Bookings} />
      <Tab.Screen name="Resources" component={Resources} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (

      <MyTabs />
  );
}
