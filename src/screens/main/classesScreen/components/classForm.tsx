import React, { useContext, useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, StyleSheet, Button, Switch, Alert, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { fetchSubject, getDays, createClass, validateTime } from '../functions/function';
import { LogBox } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { AuthContext } from '@/src/provider/authProvider';
import { fetchClasses } from './fetchUserClasses';

// Ignore specific warnings
LogBox.ignoreLogs([
    'Warning: TextInputComponent: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
])
LogBox.ignoreAllLogs();
const ClassForm: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { session, userData } = useContext(AuthContext);
    interface FormattedJson {
        value: string;
        label: string;
    }
    const [classSize, setClassSize] = useState<number | undefined>(undefined);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date(new Date().getTime() + 60 * 60 * 1000));
    const [location, setLocation] = useState<string>('');
    const [classDay, setClassDay] = useState<string>('');
    const [isRecursive, setIsRecursive] = useState<boolean>(false);
    const [level, setLevel] = useState<string>('');
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [lesson, setLesson] = useState<string>('');

    const [typeValue, setTypeValue] = useState<string>("");
    const [subjectValue, setSubjectValue] = useState<string>("");
    const [subjectItem, setSubjectItem] = useState<FormattedJson[]>([]);
    const [dayOfTheWeekValue, setDayOfTheWeekValue] = useState<string>("");
    const [dayOfTheWeekItem, setDayOfTheWeekItem] = useState<FormattedJson[]>([]);
    const [dayValue, setDayValue] = useState<string>("");

    const [classes, setClasses] = useState<any[]>([]); // Define type for classes state

    const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
    const handleCreateClass = () => {
        const markedDatesArray = Object.keys(markedDates).map(dateString => new Date(dateString));
        if (
            title !== "" &&
            subjectValue !== "" &&
            level !== "" &&
            price !== undefined &&
            classSize !== undefined &&
            typeValue !== "" &&
            dayOfTheWeekValue !== "" &&
            location !== "" &&
            description !== "" &&
            markedDatesArray.length !== 0
        ) {
            createClass({
                title,
                subject: subjectValue,
                level,
                price,
                classSize,
                type: typeValue,
                startTime,
                endTime,
                day: dayOfTheWeekValue,
                location,
                description,
                isRecursive,
                dates: markedDatesArray
            }, session);
            setTitle('');
            setSubjectValue('');
            setLevel('');
            setPrice(undefined);
            setClassSize(undefined);
            setTypeValue('');
            setDayOfTheWeekValue('');
            setLocation('');
            setDescription('');
            setIsRecursive(false);
            setMarkedDates({});
            setStartTime(new Date());
            setEndTime(new Date(new Date().getTime() + 60 * 60 * 1000));


            navigation.navigate("My Classes");
        } else {
            Alert.alert('Fill up all details');
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchSubject();
                if (data) {
                    setSubjectItem(data);
                }
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }

            if (!session || !session.user || !session.user.id) {
                console.error('User ID not found or session not initialized');

                return;
            }

            try {
                const classesData = await fetchClasses(session.user.id, userData);

                setClasses(classesData);
            } catch (error) {
                console.error('Error fetching user classes:', error);
            }
        };

        fetchData();
        setDayOfTheWeekItem(getDays());
    }, []);

    const renderDay = (props: any) => {
        const { date } = props;
        const day = new Date(date.dateString).getDay().toString();
        const today = new Date();
        const selectedDate = new Date(date.dateString);

        if (selectedDate < today || day !== dayValue.toString()) {
            return (
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'lightgray' }}>{date.day}</Text>
                </View>
            );
        } else {
            return (
                <View style={{ alignItems: 'center', }}>
                    <Text>{date.day}</Text>
                </View>
            );
        }
    };
    const onDayPress = (day: DateData) => {
        const selectedDay = new Date(day.dateString).getDay().toString();
        const today = new Date();
        const selectedDate = new Date(day.dateString);
        if (selectedDate >= today && selectedDay === dayValue.toString()) {
            setMarkedDates({
                [day.dateString]: {
                    selected: true,
                    selectedColor: 'blue'
                }
            });
        } else if (selectedDate < today) {
            Alert.alert('Please select a date from today onwards');
        } else {
            Alert.alert(`Please select a ${dayOfTheWeekItem.find(d => d.value === dayValue)?.label}`);
        }
    };

    const onStartTimeChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || startTime;

        if (!validateTime(classes, dayOfTheWeekValue, currentDate)) {
            
            if (currentDate >= endTime) {
                setEndTime(new Date(currentDate.getTime() + 60 * 60 * 1000)); // Adjust end time if necessary
            }
            setStartTime(currentDate);
        } else {
            alert('Start time collides with another class time.');
        }

    };

    const onEndTimeChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || endTime;

        if (!validateTime(classes, dayOfTheWeekValue, currentDate)) {
            if (currentDate > startTime) {
                setEndTime(currentDate);
            } else {
                setEndTime(new Date(startTime.getTime() + 60 * 60 * 1000)); // Adjust end time if necessary
                alert("End time must be later than start time.");
            }
        }
        else {
            alert('end time collides with another class time.');
        }


    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <ScrollView>
                <View className="flex-1 p-4 bg-white">
                    <Text className="text-xl font-bold mb-4">Create a Class</Text>
                    <Text className="mb-1 ml-1">Title:</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 border"
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <View>
                        <Text className='text-md mb-1 ml-1'>Select Subject</Text>
                        <Dropdown
                            style={styles.container}
                            placeholderStyle={styles.placeholder}
                            itemTextStyle={styles.text}
                            data={subjectItem}
                            search
                            searchField="label"
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select subject"
                            searchPlaceholder="Search..."
                            value={subjectValue}
                            onChange={(subject) => {
                                setSubjectValue(subject.value);
                            }}
                        />

                    </View>

                    <View>
                        <Text className='text-md mb-1 ml-1'>Education Level:</Text>
                        <Dropdown
                            style={styles.container}
                            placeholderStyle={styles.placeholder}
                            itemTextStyle={styles.text}
                            data={[{ label: 'Primary' }, { label: 'Secondary' }, { label: 'Junior College' }]}
                            maxHeight={300}
                            labelField="label"
                            valueField="label"
                            placeholder="Select education level"
                            searchPlaceholder="Search..."
                            value={level}
                            onChange={(level) => {
                                setLevel(level.label);
                            }}
                        />

                    </View>

                    <Text className="mb-1 ml-1">Price per lesson:</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 border"
                        placeholder="Price"
                        keyboardType="numeric"
                        value={price !== undefined ? price.toString() : ''}
                        onChangeText={(text) => setPrice(Number(text))}
                    />
                    <Text className="mb-1 ml-1">Class Size:</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 border"
                        placeholder="Class Size"
                        keyboardType="numeric"
                        value={classSize?.toString()}
                        onChangeText={(text) => setClassSize(Number(text))}
                    />
                    <Text className="mb-1 ml-1">Lesson type:</Text>
                    <Dropdown
                        style={styles.container}
                        placeholderStyle={styles.placeholder}
                        itemTextStyle={styles.text}
                        data={[{ label: 'Physical', value: 'Physical' }, { label: 'Online', value: 'Online' }]}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select type of class"
                        value={typeValue}
                        onChange={(val) => {
                            setTypeValue(val.value);
                        }}
                    />




                    <Text className='text-md font-bold mb-1 ml-1'>Day of class</Text>
                    <Dropdown
                        style={styles.container}
                        placeholderStyle={styles.placeholder}
                        itemTextStyle={styles.text}
                        data={dayOfTheWeekItem}
                        maxHeight={300}
                        labelField="label"
                        valueField="label"
                        placeholder="Select day of class"
                        value={dayOfTheWeekValue}
                        onChange={(day) => {
                            setDayOfTheWeekValue(day.label);
                            setDayValue(day.value);
                        }}
                    />
                    <Text className="text-md font-bold mb-1 ml-1">Select Start Date</Text>
                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={markedDates}
                        //dayComponent={renderDay}
                        theme={{
                            selectedDayBackgroundColor: 'blue',
                            selectedDayTextColor: 'white'
                        }}
                    />
                    <View className="flex items-center mb-4">
                        <Text className="mb-1 justify-center items-center">Start Time - End Time</Text>
                        <View className="flex-row items-center">
                            <DateTimePicker
                                value={startTime}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={onStartTimeChange}
                            />
                            <View className='mx-1'>
                                <Icon name='arrow-right' size={30} />
                            </View>
                            <DateTimePicker
                                value={endTime}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={onEndTimeChange}
                            />
                        </View>
                    </View>
                    <Text className="mb-1 ml-1">Location:</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 border"
                        placeholder="Location"
                        value={location}
                        onChangeText={setLocation}
                    />



                    <Text className="mb-1 ml-1">Description:</Text>
                    <TextInput
                        multiline
                        numberOfLines={5}
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 border"
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                    />







                    <View className="flex-row items-center mb-4">
                        <Text className="mr-2">Is Recursive?:</Text>
                        <Switch value={isRecursive} onValueChange={setIsRecursive} />
                    </View>



                    <Button title="Create Class" onPress={handleCreateClass} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default ClassForm;

const styles = StyleSheet.create({
    container: {
        padding: 10, // p-4
        backgroundColor: '#f7fafc', // bg-gray-100
        borderRadius: 16, // rounded-2xl
        marginBottom: 12, // mb-3
        borderWidth: 1, // border
        borderColor: 'black', // Add a border color to match Tailwind's default border color
    },
    text: {
        color: '#4a5568', // text-gray-700
    },
    placeholder: {
        fontSize: 14, // Reduced font size for placeholder text
        color: '#4a5568', // text-gray-700
    },
});