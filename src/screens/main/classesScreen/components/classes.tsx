import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert, Button } from 'react-native';
import { fetchClasses, deleteClass } from './fetchUserClasses'; // Adjust path as needed
import { AuthContext } from '@/src/provider/authProvider'; // Import the AuthContext
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';

interface ClassesListProps {
  navigation: NavigationProp<ParamListBase>;
}

const ClassesList: React.FC<ClassesListProps> = ({ navigation }) => {
  const [classes, setClasses] = useState<any[]>([]); // Define type for classes state
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const { session } = useContext(AuthContext); // Access user session from AuthContext

  const fetchUserClasses = async () => {
    if (!session?.user?.id) {
      console.error('User ID not found');
      setLoading(false); // Set loading state to false on error
      return;
    }

    try {
      const userId = session.user.id; // Assuming userId is accessible from user object in AuthContext
      if (!userId) {
        throw new Error('User ID not found');
      }

      const classesData = await fetchClasses(userId);
      setClasses(classesData);
      setLoading(false); // Set loading state to false after data is fetched
    } catch (error) {
      console.error('Error fetching user classes:', error);
      setLoading(false); // Ensure loading state is set to false on error
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserClasses();
    }, [session]) // Depend on user object from AuthContext
  );

  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#ffffff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Your Classes</Text>
        <Button title="View Calendar" onPress={() => navigation.navigate('Calendar')} />
      </View>
      {classes.length === 0 ? (
        <Text>No classes found.</Text>
      ) : (
        classes.map((cls) => (
          <TouchableOpacity
            key={cls.classid}
            style={{ marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#dddddd', borderRadius: 8, backgroundColor: '#f9f9f9' }}
            onPress={() => navigation.navigate('ClassScreenDetails', { selectedClass: cls })}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{cls.title}</Text>
                <Text style={{ fontSize: 14, color: '#666666', marginBottom: 4 }}>Location: {cls.location}</Text>
                <Text style={{ fontSize: 14, color: '#666666', marginBottom: 4 }}>Date: {cls.class_date}</Text>
                <Text style={{ fontSize: 14, color: '#666666', marginBottom: 4 }}>Time: {cls.start_time} - {cls.end_time}</Text>
              </View>
              
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default ClassesList;
