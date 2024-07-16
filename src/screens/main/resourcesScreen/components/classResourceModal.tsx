import { AuthContext } from '@/src/provider/authProvider';
import React, { useContext, useState } from 'react';
import { View, Text, Modal, Button, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropdownComponent from './dropdownComponent';
import ResourceList from './resourceList';

interface ClassModalProps {
    visible: boolean;
    onClose: () => void;
    classDetails: any;
}

const ClassResourceModal: React.FC<ClassModalProps> = ({ visible, onClose, classDetails }) => {
    console.log(classDetails)
    const { session, userData } = useContext(AuthContext);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleButtonPress = () => {
        console.log('Button pressed');
        setDropdownVisible(false);
        onClose();
    };
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >

            <View className="bg-white w-full p-6 rounded-lg flex-1 justify-center items-center bg-opacity-80">
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                    style={{ flex: 1, width: '100%' }}
                >
                    <Text className="text-lg font-bold mb-4">{classDetails.title}</Text>

                    {userData?.roleid.toString() === "1" && (
                        <View className="flex justify-center items-center w-full mb-4">
                            <TouchableOpacity
                                className="flex items-center p-4 border border-gray-300 rounded-md w-full"
                                onPress={() => setDropdownVisible(!isDropdownVisible)}
                            // onPress={() => navigation.navigate("Create Class")}
                            >
                                <View className="flex items-center justify-center">
                                    <Icon name="plus" size={24} color="tomato" />
                                    <Text className="mt-2 text-gray-700">Click here to add resource</Text>
                                </View>
                            </TouchableOpacity>
                            {isDropdownVisible && (
                                <DropdownComponent onSubmit={handleButtonPress} classId={classDetails.classid} />
                            )}
                        </View>
                    )}
                    <ResourceList resourceDetails={classDetails.class_resource} onClose={onClose} />
                    <Button title="Close" onPress={onClose} />
                </ScrollView>
            </View>

        </Modal>
    );
};

export default ClassResourceModal;