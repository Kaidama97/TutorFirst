import { AuthContext } from '@/src/provider/authProvider';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { fetchClasses } from '../function/function';
import ClassSubtitle from './classSubtitle';
import ClassResourceModal from './classResourceModal';

const ClassListComponent = () => {
    const [classes, setClasses] = useState<any[]>([]); // Define type for classes state
    const [loading, setLoading] = useState(true); // State to manage loading indicator
    const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
    const [selectedClass, setSelectedClass] = useState<any[]>([]); // State to manage selected class title
    const { session, userData } = useContext(AuthContext); // Access user session from AuthContext
    
    useFocusEffect(
        React.useCallback(() => {
            if (session && session.user) {
                fetchUserClasses();
            }
        }, [session]) // Depend on user object from AuthContext
    );

    useEffect(() => {
        if (!modalVisible) {
            fetchUserClasses();
        }
    }, [modalVisible]);

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
            console.log(classesData);
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
    const openModal = (classDetails: any) => {
        setSelectedClass(classDetails);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };
    return (
        <View>
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold">Your Classes</Text>
            </View>
            {classes.length === 0 ? (
        <Text>No classes found.</Text>
      ) : (
        classes.map((cls) => {
   
          return (
            <TouchableOpacity
              key={cls.classid}
              className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-100"
              onPress={() => openModal(cls)}
            //   onPress={() => navigation.navigate('ClassScreenDetails', { selectedClass: cls, selectedTeacher: tutor })}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-lg font-bold mb-2">{cls.title}</Text>
                  <ClassSubtitle resourceCount={cls.class_resource.length} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
      <ClassResourceModal
                visible={modalVisible}
                onClose={closeModal}
                classDetails={selectedClass}
            />
        </View>

    );
};

export default ClassListComponent;