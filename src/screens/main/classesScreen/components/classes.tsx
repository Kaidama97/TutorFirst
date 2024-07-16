import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Button } from 'react-native';
import { fetchClasses, deleteClass } from './fetchUserClasses'; // Adjust path as needed
import { AuthContext } from '@/src/provider/authProvider'; // Import the AuthContext
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import { styled } from 'nativewind';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const StyledScrollView = styled(ScrollView);

interface ClassesListProps {
  navigation: NavigationProp<ParamListBase>;
}

const ClassesList: React.FC<ClassesListProps> = ({ navigation }) => {

  const [classes, setClasses] = useState<any[]>([]); // Define type for classes state
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const { session, userData } = useContext(AuthContext); // Access user session from AuthContext

  useFocusEffect(
    React.useCallback(() => {
      if (session && session.user) {
        fetchUserClasses();
      }
    }, [session]) // Depend on user object from AuthContext
  );
  const fetchUserClasses = async () => {
    setLoading(true); // Set loading state to false after data is fetched
    if (!session || !session.user || !session.user.id) {
      console.error('User ID not found or session not initialized');
      setLoading(false); // Set loading state to false on error

      return;
    }

    try {
      const userId = session.user.id;
      const classesData = await fetchClasses(userId, userData);

      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching user classes:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Your Classes</Text>
        <Button title="View Calendar" onPress={() => navigation.navigate('Calendar')} />
      </View>
      {userData?.roleid == "1" && (
        <View className="flex justify-center items-center w-full mb-4">
          <TouchableOpacity
            className="flex items-center p-4 border border-gray-300 rounded-md w-full"
            onPress={() => navigation.navigate("Create Class")}>
            <View className="flex items-center justify-center">
              <Icon name="plus" size={24} color="tomato" />
              <Text className="mt-2 text-gray-700">Click to create class</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {classes.length === 0 ? (
        <Text>No classes found.</Text>
      ) : (
        classes.map((cls) => {
          const tutor = cls.classtutor?.[0]?.users || { firstname: 'Unknown', lastname: 'Tutor' };
          return (
            <TouchableOpacity
              key={cls.classid}
              className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-100"
              onPress={() => navigation.navigate('ClassScreenDetails', { selectedClass: cls, selectedTeacher: tutor })}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-lg font-bold mb-2">{cls.title}</Text>
                  <View className="flex-row items-center mb-1">
                    <Icon name="map-marker" size={16} color="#4A4A4A" />
                    <Text className="text-base text-gray-600 ml-2">{cls.location}</Text>
                  </View>

                  <View className="flex-row items-center mb-1">
                    <Icon name="calendar" size={16} color="#4A4A4A" />
                    <Text className="text-base text-gray-600 ml-2">{cls.class_date}</Text>
                  </View>

                  <View className="flex-row items-center mb-1">
                    <Icon name="clock" size={16} color="#4A4A4A" />
                    <Text className="text-base text-gray-600 ml-2">{cls.start_time} - {cls.end_time}</Text>
                  </View>

                  {userData?.roleid != "1" && (
                    <View className="flex-row items-center mb-1">
                      <Icon name="account" size={16} color="#4A4A4A" />
                      <Text className="text-base text-gray-600 ml-2">{tutor.firstname} {tutor.lastname}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

export default ClassesList;
