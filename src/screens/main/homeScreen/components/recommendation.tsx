import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '@/src/provider/authProvider';
import { getUserFavouriteSubjects, getRecommendedClasses } from './fetchRecommendation';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface Class {
  classtutor: Array<{
    users: {
      firstname: string;
      lastname: string;
      description: string;
      profilepicture: string;
      userid: string;
      subjects_taught: string[];
    };
  }>;
  id: string;
  title: string;
  subject: string | string[] | null;
  description: string;
  level: string;
}


type RootStackParamList = {
  ClassDetails: { selectedClass: Class; selectedTeacher: any };
  // Add other screens and their params here if needed
};

const RecommendationPage: React.FC = () => {
  const { session } = useContext(AuthContext);
  const [recommendedClasses, setRecommendedClasses] = useState<Class[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchRecommendedClasses = async () => {
      if (!session?.user?.id) return;

      const favouriteSubjects = await getUserFavouriteSubjects(session.user.id);
      const classes = await getRecommendedClasses(favouriteSubjects);
      setRecommendedClasses(classes);
    };

    fetchRecommendedClasses();
  }, [session]);

  const handleViewDetail = (selectedClass: Class) => {
    console.log(selectedClass.classtutor); // Log the entire classtutor object
    const selectedTeacher = selectedClass.classtutor[0]?.users;
    console.log(selectedTeacher); // Log selectedTeacher to see its value
    navigation.navigate('ClassDetails', { selectedClass, selectedTeacher });
  };

  const renderItem = ({ item }: { item: Class }) => (
    <View style={styles.classItem}>
      <Text style={styles.classTitle}>{item.title}</Text>
      <Text style={styles.classDescription}>{item.level}</Text>
      <Text style={styles.classDescription}>{item.description}</Text>
      <TouchableOpacity style={styles.viewDetailButton} onPress={() => handleViewDetail(item)}>
        <Text style={styles.buttonText}>View Detail</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recommended Classes</Text>
      <FlatList
        data={recommendedClasses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} // Ensure a unique key for each item
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  classItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  classSubject: {
    fontSize: 16,
    color: '#555',
  },
  classDescription: {
    fontSize: 14,
    color: '#777',
  },
  viewDetailButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RecommendationPage;
