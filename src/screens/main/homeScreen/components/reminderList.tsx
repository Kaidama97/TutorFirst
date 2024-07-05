import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { supabase } from '@/src/initSupabase';
import { AuthContext } from '@/src/provider/authProvider';
import { useFocusEffect } from '@react-navigation/native';

interface ClassItem {
    classid: number;
    title: string;
    description: string;
    location: string;
    class_date: string;
    start_time: string;
    end_time: string;
    lesson_type: string;
}

const ReminderList: React.FC<{ userData: any }> = ({userData }) => {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { session } = useContext(AuthContext);

    const fetchClasses = async () => {
        const today = new Date().getDay();
        const nextThreeDays = [(today + 1) % 7, (today + 2) % 7, (today + 3) % 7];

        setLoading(true);

        const { data, error } = userData?.roleid =="1"
        ? await supabase
        .from('classtutor')
        .select('classid')
        .eq('userid', session?.user.id)
        : await supabase
        .from('classattendee')
        .select('classid')
        .eq('userid', session?.user.id)

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        const classIds = data.map((attendee: { classid: number }) => attendee.classid);

        const { data: classesData, error: classesError } = await supabase
            .from('classes')
            .select('*')
            .in('classid', classIds);

        if (classesError) {
            console.error(classesError);
            setLoading(false);
            return;
        }

        // Filter classes based on the next three days
        const filteredClasses = classesData.filter((classItem: ClassItem) => {
            const classDay = new Date(classItem.class_date).getDay();
            return nextThreeDays.includes(classDay);
        });

        // Sort the filtered classes by date
        filteredClasses.sort((a: ClassItem, b: ClassItem) => new Date(a.class_date).getTime() - new Date(b.class_date).getTime());
        setClasses(filteredClasses);
        setLoading(false);
    };

    // Use useFocusEffect to refetch data when the screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchClasses();
        }, [])
    );

    const renderClassItem = (classItem: ClassItem) => (
        <View
            key={classItem.classid}
            className="p-2 border border-gray-300 rounded-lg mb-2 bg-white shadow-md">
            <Text className="text-lg font-bold mb-2">{classItem.title} ({classItem.lesson_type})</Text>
            <Text className="text-sm text-gray-600 mb-1">Location: {classItem.location}</Text>
            <Text className="text-sm text-gray-600 mb-1">Time: {classItem.start_time} - {classItem.end_time} </Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white p-2">
            <Text className="text-black text-xl font-bold text-left mb-2">
                Reminder:
            </Text>
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                classes.length > 0 ? (
                    classes.map(renderClassItem)
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-lg text-gray-600">No current reminder</Text>
                    </View>
                )
            )}
        </View>
    );
};

export default ReminderList;
