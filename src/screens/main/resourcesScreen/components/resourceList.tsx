import { AuthContext } from '@/src/provider/authProvider';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropdownComponent from './dropdownComponent';
import { handleFileDownload, handleFileDelete } from '../function/function';
import { supabase } from '@/src/initSupabase';

interface ResourceListProps {
    resourceDetails: any;
    onClose: () => void;
}

interface ResourceDetail {
    resource_id: string;
    title: string;
    url: string;
}

const ResourceList: React.FC<ResourceListProps> = ({ resourceDetails, onClose }) => {
    const { userData } = useContext(AuthContext); // Access user session from AuthContext
    const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
    const [editResourceId, setEditResourceId] = useState<string | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);


    const handleDownload = async (url: string, fileName: string) => {
        handleFileDownload(url, fileName);


    };


    const handleDelete = (url: string, fileName: string, resourceId: string) => {
        Alert.alert(
            "Delete Resource",
            `Are you sure you want to delete ${fileName}?`,
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await handleFileDelete(url, fileName, resourceId);
                        setRefresh(!refresh);
                        onClose();
                    }
                }
            ]
        );
    }

    return (
        <View className="w-full flex-col-reverse">
            {resourceDetails.length === 0 ? (
                <Text>No resource found.</Text>
            ) : (
                resourceDetails.slice().reverse().map((detail: ResourceDetail) => (
                    <View key={detail.resource_id} className="flex-row justify-between items-center mb-4 p-3 border border-gray-300 rounded-md bg-gray-100">
                        <View className="flex-col">
                            <View className="flex">
                                <Text className="text-md font-bold mb-2">{detail.title}</Text>
                                {/* {editResourceId === detail.resource_id && (
                                    <DropdownComponent 
                                        key={detail.resource_id} // Ensure the key is set correctly for each dropdown component
                                        classId={detail.resource_id} 
                                        onSubmit={handleEditSubmit}
                                    />
                                )} */}
                            </View>
                        </View>
                        <View className="relative">
                            <TouchableOpacity
                                onPress={() => setDropdownVisible(detail.resource_id === dropdownVisible ? null : detail.resource_id)}
                                className="p-2 mr-2"
                                activeOpacity={0.7}
                            >
                                <Icon name="ellipsis-v" size={20} color="gray" />
                            </TouchableOpacity>
                            {dropdownVisible === detail.resource_id && (
                                <View className="absolute right-0 top-full mt-1 p-2 border border-gray-300 rounded-md bg-white shadow-lg z-50 min-w-[100px]">
                                    <TouchableOpacity onPress={() => handleDownload(detail.url, detail.title)}>
                                        <Text className="text-gray-700 m-1">Download</Text>
                                    </TouchableOpacity>
                                    {userData?.roleid.toString() === "1" && (
                                        <>
                                            {/* <TouchableOpacity onPress={() => handleEdit(detail.resource_id)}>
                                                <Text className="text-gray-700 m-1">Edit</Text>
                                            </TouchableOpacity> */}
                                            <TouchableOpacity onPress={() => handleDelete(detail.url, detail.title, detail.resource_id)}>
                                                <Text className="text-gray-700 m-1">Delete</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                </View>
                            )}
                        </View>

                    </View>

                ))

            )}


        </View>
    );
}

export default ResourceList;