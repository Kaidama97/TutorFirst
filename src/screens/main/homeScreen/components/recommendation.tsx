import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '@/src/provider/authProvider';
import { getUserFavouriteSubjects, getRecommendedClasses } from './fetchRecommendation';

// Ensure this interface is consistent and correctly imported
interface Class {
  id: string;
  title: string;
  subject: string | string[] | null; // Adjust based on your database structure or API response
  description: string;
}

const RecommendationPage: React.FC = () => {
  const { session } = useContext(AuthContext);
  const [recommendedClasses, setRecommendedClasses] = useState<Class[]>([]); // Explicitly specify Class[]

  useEffect(() => {
    const fetchRecommendedClasses = async () => {
      if (!session?.user?.id) return;

      const favouriteSubjects = await getUserFavouriteSubjects(session.user.id);
      const classes = await getRecommendedClasses(favouriteSubjects);
      setRecommendedClasses(classes);
    };

    fetchRecommendedClasses();
  }, [session]);

  const renderItem = ({ item }: { item: Class }) => (
    <View style={styles.classItem}>
      <Text style={styles.classTitle}>{item.title}</Text>
      <Text style={styles.classSubject}>{item.subject}</Text>
      <Text style={styles.classDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recommended Classes</Text>
      <FlatList
        data={recommendedClasses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
});

export default RecommendationPage;
