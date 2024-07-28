import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { AuthContext } from '@/src/provider/authProvider';
import { getUsersSubjects, getRecommendedClasses } from './fetchRecommendation';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Icon for the dropdown
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Class {
  classtutor: Array<{
    users: {
      firstname: string;
      lastname: string;
      description: string;
      profilepicture: string;
      userid: string;
      subjects_taught: string[];
      gender: string; // Ensure this field is present
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
  const [sortOption, setSortOption] = useState<string>('subject'); // Default to sorting by subject
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [genderFilter, setGenderFilter] = useState<string | null>(null); // New state for gender filtering
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchRecommendedClasses = async () => {
      if (!session?.user?.id) return;

      const favouriteSubjects = await getUsersSubjects(session.user.id);
      const classes = await getRecommendedClasses(favouriteSubjects, sortOption, genderFilter); // Pass genderFilter
      setRecommendedClasses(classes);
    };

    fetchRecommendedClasses();
  }, [session, sortOption, genderFilter]); // Added genderFilter dependency

  const handleViewDetail = (selectedClass: Class) => {
    const selectedTeacher = selectedClass.classtutor[0]?.users;
    navigation.navigate('ClassDetails', { selectedClass, selectedTeacher });
  };

  const renderItem = ({ item }: { item: Class }) => (
    <View style={styles.classItem}>
      <Text style={styles.classTitle}>{item.title}</Text>
      <Text style={styles.classDescription}>{item.level}</Text>
      <Text style={styles.classDescription}>{item.description}</Text>
      <TouchableOpacity
        style={styles.viewDetailButton}
        onPress={() => handleViewDetail(item)}
        testID={`classDetailsButton-${item.id}`} // Use unique testID
      >
        <Text style={styles.buttonText}>View Detail</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSortOptionSelect = (option: string) => {
    setSortOption(option);
    setModalVisible(false);
  };

  const handleGenderFilterSelect = (gender: string | null) => {
    setGenderFilter(gender);
    setSortOption('gender'); // Change sort option to 'gender' for gender filtering
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Recommended Classes</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setModalVisible(true)}
          testID="openModalButton"
        >
          <MaterialIcons name="sort" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {recommendedClasses.length === 0 ? (
        <Text>No classes found</Text>
      ) : (
        <FlatList
          data={recommendedClasses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id} // Ensure a unique key for each item
          contentContainerStyle={styles.listContainer}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent} testID="sortingModal">
            <Text style={styles.modalTitle}>Sort by</Text>
            <Pressable style={styles.modalOption} onPress={() => handleSortOptionSelect('subject')}>
              <Text style={styles.modalOptionText}>Subjects you are looking for</Text>
            </Pressable>
            <Pressable style={styles.modalOption} onPress={() => handleGenderFilterSelect('male')}>
              <Text style={styles.modalOptionText}>Male Teacher</Text>
            </Pressable>
            <Pressable style={styles.modalOption} onPress={() => handleGenderFilterSelect('female')}>
              <Text style={styles.modalOptionText}>Female Teacher</Text>
            </Pressable>
            <Pressable style={styles.modalOption} onPress={() => handleGenderFilterSelect(null)}>
              <Text style={styles.modalOptionText}>All Genders</Text>
            </Pressable>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
              testID="closeModalButton"
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sortButton: {
    padding: 10,
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
  listContainer: {
    paddingBottom: 20, // Ensure space at the bottom
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default RecommendationPage;
