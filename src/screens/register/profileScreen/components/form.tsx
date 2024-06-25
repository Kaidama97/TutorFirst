import { View, Button, Text, TextInput, TouchableOpacity, Platform, Modal, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { COUNTRIES_URL } from '@env';
import { validatePhoneNumber, validateFirstName, validateLastName, validateUsername, handleGenderJson, handleCountriesJson, handleSchoolJson, handleSubjectJson } from '../functions/function';
import ButtonComponent from '@/src/components/button';
import { AuthContext } from "@/src/provider/authProvider";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
interface FormProps {
    navigation: any; // Adjust the type according to the actual navigation prop type
}

interface Item {
    label: string;
    value: string;
}
const gender = require('../../../../constants/gender.json');
const school = require('../../../../constants/schoolData.json');
const allSubjects = require('../../../../constants/subjects.json');

const Form: React.FC<FormProps> = ({ navigation }) => {

    const [username, setUsername] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [firstname, setFirstname] = useState<string>("");
    const [firstNameError, setFirstNameError] = useState<string | null>(null);
    const [lastname, setLastname] = useState<string>("");
    const [lastNameError, setLastNameError] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [phonenumberError, setPhoneNumberError] = useState<string | null>(null);
    const [description, setDescription] = useState<string>("");
    const [birthDate, setBirthDate] = useState<Date>(new Date());
    const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
    const [valuePicker1, setValuePicker1] = useState<any>("");
    const [valuePicker2, setValuePicker2] = useState<any>("");
    const [valuePicker3, setValuePicker3] = useState<any>("");
    const [itemsPicker1, setItemsPicker1] = useState<any[]>([]);
    const [itemsPicker2, setItemsPicker2] = useState<any[]>([]);
    const [itemsPicker3, setItemsPicker3] = useState<any[]>([]);
    const [subjectsValue, setSubjectsValue] = useState<any[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);

    const { editProfile, signOut } = useContext(AuthContext);
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(COUNTRIES_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const json = await response.json();
                setItemsPicker2(handleCountriesJson(json));
                //console.log(json);
            } catch (error) {
                console.error(error);
                setItemsPicker2([{ value: 'Singapore', label: 'Singapore' }])
                //setError(error.message || 'Something went wrong');
            } finally {
                //setLoading(false);
            }
        };

        const formatJson = () => {

            setItemsPicker1(handleGenderJson(gender));
            setItemsPicker3(handleSchoolJson(school));
            setSubjectsValue(handleSubjectJson(allSubjects));
        }


        formatJson();
        fetchCountries();
    }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || birthDate;
        setDatePickerVisibility(Platform.OS === 'ios'); // Keep the picker visible on iOS until explicitly closed
        setBirthDate(currentDate);
        console.log("Date selected:", currentDate);
    };


    const renderItem = ({ item }: { item: Item }) => {
        return (
            <View style={{
                padding: 17,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Text style={{
                    flex: 1,
                    fontSize: 16,
                }}>{item.label}</Text>
            </View>
        );
    };
    const handleSubmit = async () => {

        setUsernameError(validateUsername(username));
        setFirstNameError(validateFirstName(firstname));
        setLastNameError(validateLastName(lastname));
        setPhoneNumberError(validatePhoneNumber(phoneNumber));
        if (
            usernameError === null &&
            firstNameError === null &&
            lastNameError === null &&
            phonenumberError === null &&
            valuePicker1 !== "" &&
            valuePicker2 !== "" &&
            valuePicker3 !== "" &&
            description !== "" &&
            editProfile
        ) {
            try {
                editProfile({
                    username,
                    firstname,
                    lastname,
                    phonenumber: phoneNumber,
                    dateOfBirth: birthDate,
                    gender: valuePicker1,
                    nationality: valuePicker2,
                    school: valuePicker3,
                    description,
                    favourite_subjects: selectedSubjects,
                });

            } catch (error) {
                console.error('Error during registration:', error);
                Alert.alert('Registration failed, please try again.');
            }
        } else {
            Alert.alert('Please fix the errors in the form.');
        }
        signOut;

    }
    return (
        <ScrollView >
            {/* <KeyboardAvoidingView className="form space-y-2 bg-slate-500" > */}
            <Text className={'text-md font-bold mb-1 ml-3'}>Enter Username</Text>
            <TextInput
                placeholder="Username"
                autoCapitalize="none"
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                onChangeText={(text) => setUsername(text)}
                onFocus={() => setScrollEnabled(false)}
                onBlur={() => {
                    setScrollEnabled(true)

                }}
                value={username}
            />
            {usernameError != null && <Text className={'text-red-500 ml-2 mb-1'}>{usernameError}</Text>}
            <Text className={'text-md font-bold mb-2 ml-3'}>Enter first name</Text>
            <TextInput
                placeholder="First Name"
                autoCapitalize="none"
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                onChangeText={(text) => setFirstname(text)}
                onFocus={() => setScrollEnabled(false)}
                onBlur={() => setScrollEnabled(true)}
                value={firstname}
            />
            {firstNameError != null && <Text className={'text-red-500 ml-2 mb-1'}>{firstNameError}</Text>}
            <Text className={'text-md font-bold mb-2 ml-3'}>Enter last name</Text>
            <TextInput
                placeholder="Last Name"
                autoCapitalize="none"
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                onChangeText={(text) => setLastname(text)}
                onFocus={() => setScrollEnabled(false)}
                onBlur={() => setScrollEnabled(true)}
                value={lastname}
            />
            {lastNameError != null && <Text className={'text-red-500 ml-2 mb-1'}>{lastNameError}</Text>}

            <View style={styles.container}>
                <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    search
                    data={subjectsValue}
                    labelField="label"
                    valueField="value"
                    placeholder="Select favourite subjects"
                    searchPlaceholder="Search..."
                    value={selectedSubjects}
                    onChange={item => {
                        setSelectedSubjects(item);
                    }}
                    renderLeftIcon={() => (
                        <Icon
                            style={styles.icon}
                            color="book-education-outline"
                            name="book-education-outline"
                            size={20}
                        />
                    )}
                    selectedStyle={styles.selectedStyle}
                />
            </View>

            <Text className={'text-md font-bold mb-2 ml-3'}>Enter phone number</Text>
            <TextInput
                placeholder="Phone Number"
                autoCapitalize="none"
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                keyboardType='numeric'
                onChangeText={(text) => setPhoneNumber(text)}
                onFocus={() => setScrollEnabled(false)}
                onBlur={() => setScrollEnabled(true)}
                value={phoneNumber}
            />
            {phonenumberError != null && <Text className={'text-red-500 ml-2 mb-1'}>{phonenumberError}</Text>}
            <Text className={'text-md font-bold mb-2 ml-3'}>Select D.O.B</Text>
            <TouchableOpacity onPress={showDatePicker} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3">
                <Text>{birthDate ? birthDate.toLocaleDateString('en-GB') : "Select Birthdate"}</Text>
            </TouchableOpacity>
            {isDatePickerVisible && Platform.OS === 'ios' && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={isDatePickerVisible}
                    onRequestClose={hideDatePicker}
                >
                    <View className="flex-1 justify-center items-center">
                        <View className="bg-white rounded-2xl p-5 w-80">
                            <DateTimePicker
                                value={birthDate ? birthDate : new Date()}
                                textColor='black'
                                mode="date"
                                display="spinner"
                                onChange={handleConfirm}
                                maximumDate={new Date()}
                                style={{ width: '100%' }}
                            />
                            <Button onPress={hideDatePicker} title="Done" />
                        </View>
                    </View>
                </Modal>
            )}
            {isDatePickerVisible && Platform.OS !== 'ios' && (
                <DateTimePicker
                    value={birthDate ? birthDate : new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleConfirm}
                    maximumDate={new Date()}
                />
            )}

            <View>
                <Text className={'text-md font-bold mb-2 ml-3'}>Select your gender</Text>
                <Dropdown
                    style={{
                        margin: 16,
                        height: 50,
                        borderBottomColor: 'grey',
                        borderBottomWidth: 0.5,
                    }}
                    placeholderStyle={{ fontSize: 16, }}
                    data={itemsPicker1}

                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select your gender"
                    searchPlaceholder="Search..."
                    value={valuePicker1}
                    onChange={item => {
                        setValuePicker1(item.value);
                    }}
                //renderItem={renderItem}
                />
                {valuePicker1 === "" && <Text className={'text-red-500 ml-2 mb-1'}>Select your gender</Text>}
            </View>
            <View>
                <Text className={'text-md font-bold mb-2 ml-3'}>Select your nationality</Text>
                <Dropdown
                    style={{
                        margin: 16,
                        height: 50,
                        borderBottomColor: 'gray',
                        borderBottomWidth: 0.5,
                    }}
                    placeholderStyle={{ fontSize: 16, }}
                    data={itemsPicker2}
                    search
                    searchField="label"
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select your nationality"
                    searchPlaceholder="Search..."
                    value={valuePicker2}
                    onChange={country => {
                        setValuePicker2(country.value);
                    }}
                //renderItem={ renderItem }
                />
                {valuePicker2 === "" && <Text className={'text-red-500 ml-2 mb-1'}>Select your nationality</Text>}
            </View>
            <View>
                <Text className={'text-md font-bold mb-2 ml-3'}>Select your school</Text>
                <Dropdown
                    style={{
                        margin: 16,
                        height: 50,
                        borderBottomColor: 'gray',
                        borderBottomWidth: 0.5,
                    }}
                    placeholderStyle={{ fontSize: 16, }}
                    data={itemsPicker3}
                    search
                    searchField="label"
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select your school"
                    searchPlaceholder="Search..."
                    value={valuePicker3}
                    onChange={school => {
                        setValuePicker3(school.value);
                    }}
                />
                {valuePicker3 === "" && <Text className={'text-red-500 ml-2 mb-1'}>Select your school</Text>}
            </View>
            {/* <KeyboardAvoidingView className='flex-1 p-4' behavior="padding"> */}
            <View className='p-5'>
                <Text className={'text-md font-bold mb-2 ml-2'}>Tell us more about yourself</Text>
                <TextInput
                    multiline
                    numberOfLines={5} // Set the number of lines you want to display initially
                    placeholder="Description"
                    className='p-2 bg-gray-100 text-gray-700 rounded-xl'
                    onChangeText={(text) => {
                        setDescription(text);
                    }}
                    style={{ height: 100, textAlignVertical: 'top' }}
                    onFocus={() => setScrollEnabled(false)}
                    onBlur={() => setScrollEnabled(true)}
                />

            </View>
            {/* <KeyboardAvoidingView /> */}

            <ButtonComponent
                type="primary"
                text="Update Profile"
                onPress={handleSubmit}
            />

            {/* </KeyboardAvoidingView> */}
        </ScrollView>
    );
};
export default Form;

const styles = StyleSheet.create({
    container: { padding: 16 },
    dropdown: {
        height: 50,
        backgroundColor: 'transparent',
        borderBottomColor: '#909090',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    selectedStyle: {
        borderRadius: 12,
    },
});