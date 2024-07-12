import React, { useContext } from 'react';
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
import ClassDetailsScreenClasses from '../screens/main/classesScreen/components/classDetails';
import ChatScreen from '../screens/main/chatScreen/components/chat';
import classChatScreen from '../screens/main/chatScreen/components/classChatScreen';
import teacherDetail from '../screens/main/homeScreen/components/teacherDetails';
import CreateClassScreen from '../screens/main/createClassScreen';
import { AuthContext } from '../provider/authProvider';

import ClassDetailsScreenHome from '../screens/main/homeScreen/components/classDetails';

const HomeStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
      name="Home"
      component={Home} 
      options={{ headerShown: false }} // Adjust options as necessary
      />
      <HomeStack.Screen
      name="teacherDetail"
      component={teacherDetail} 
      options={{ title: "" }} // Adjust options as necessary
      />
   <HomeStack.Screen
        name="ClassDetails"
        component={ClassDetailsScreenHome}
        options={{ title: 'Class Details' }}
      />
    </HomeStack.Navigator>
  );
}
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
      <ClassesStack.Screen
        name="ClassScreenDetails"
        component={ClassDetailsScreenClasses}
        options={{ title: 'Class Details' }}
      />
      <ClassesStack.Screen
        name="Create Class"
        component={CreateClassScreen}
        options={{ title: 'Create Class' }}
      />
      <ClassesStack.Screen
        name="Edit Class"
        component={CreateClassScreen}
        options={{ title: 'Edit Class' }}
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

const ChatStack = createStackNavigator();

function ChatStackNavigator() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ headerShown: false }} // Adjust options as necessary
      />
      <ChatStack.Screen 
        name="ClassChat" 
        component={classChatScreen} 
        options={{ title: 'Class Chat' }}
      />
    </ChatStack.Navigator>
  );
}


const Tab = createBottomTabNavigator();

function MyTabs() {
  const { userData } = useContext(AuthContext);
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
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="My Classes" component={ClassesStackNavigator} />
      {userData?.roleid != "1" && (
        <Tab.Screen name="Book Classes" component={BookingStackNavigator} />
      )}
      <Tab.Screen name="Resources" component={Resources} />
      <Tab.Screen name="Chat" component={ChatStackNavigator} />
      <Tab.Screen name="Profile" component={Profile} />

    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <MyTabs />
  );
}