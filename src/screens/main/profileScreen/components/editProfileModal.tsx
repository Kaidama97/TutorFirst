import { handleCountriesJson, handleGenderJson, handleSchoolJson, handleSubjectJson, validateFirstName, validateLastName, validatePhoneNumber, validateUsername } from '@/src/screens/register/profileScreen/functions/function';
import { COUNTRIES_URL } from '@env';
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet,TouchableOpacity, TextInput, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, Alert } from 'react-native';
import { Modal as DateModal } from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { AuthContext } from '@/src/provider/authProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const gender = require('../../../../constants/gender.json');
const school = require('../../../../constants/schoolData.json');
const allSubjects = require('../../../../constants/subjects.json');

interface EditProfileProp {
    isModalVisible: boolean;
    toggleModal: () => void;
    userData: any;
};

const EditProfileModal: React.FC<EditProfileProp> = ({ userData, isModalVisible, toggleModal }) => {
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
    const [genderValue, setGenderValue] = useState<any>("");
    const [nationalityValue, setNationalityValue] = useState<any>("");
    const [schoolValue, setSchoolValue] = useState<any>("");
    const [genderPicker, setGenderPicker] = useState<any[]>([]);
    const [nationalityPicker, setNationalityPicker] = useState<any[]>([]);
    const [schoolPicker, setSchoolPicker] = useState<any[]>([]);
    const [subjectsValue, setSubjectsValue ] = useState<any[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);

    const { editProfile, refreshUserData } = useContext(AuthContext);

    const fetchCountries = async () => {
        try {
            const response = await fetch(COUNTRIES_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const json = await response.json();
            setNationalityPicker(handleCountriesJson(json));
            //console.log(json);
        } catch (error) {
            console.error(error);
            setNationalityPicker([{ value: 'Singapore', label: 'Singapore' }])
            //setError(error.message || 'Something went wrong');
        } finally {
            //setLoading(false);
        }
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
            genderValue !== "" &&
            nationalityValue !== "" &&
            schoolValue !== "" &&
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
                    gender: genderValue,
                    nationality: nationalityValue,
                    school: schoolValue,
                    description,
                    favourite_subjects: selectedSubjects,
                });

            } catch (error) {
                console.error('Error during update:', error);
                Alert.alert('Update failed, please try again.');
            } finally {
                toggleModal();
            }
        } else {
            Alert.alert('Please fix the errors in the form.');
        }


    }

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
    };
    const formatJson = () => {

        setGenderPicker(handleGenderJson(gender));
        setSchoolPicker(handleSchoolJson(school));
        setSubjectsValue(handleSubjectJson(allSubjects));
    }

    useEffect(() => {
        setUsername(userData.username);
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
        setPhoneNumber(userData.phonenumber);
        setBirthDate(new Date(userData.dateofbirth));
        setGenderValue(userData.gender);
        setNationalityValue(userData.nationality);
        setSchoolValue(userData.school);
        setDescription(userData.description);
        formatJson();
        fetchCountries();
    }, []);


    return (
        <View>
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
            >
                <SafeAreaView className='flex-1'>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className='flex-1'
                    >
                        <ScrollView className='w-full bg-white p-5 rounded-lg'>
                            <Text className='text-black text-lg font-bold mb-4'>Edit Profile</Text>
                            <Text className={'text-md font-bold mb-1 ml-3'}>Enter Username</Text>
                            <TextInput
                                placeholder={username}
                                autoCapitalize="none"
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 w-full"
                                onChangeText={(text) => setUsername(text)}
                                onFocus={() => setScrollEnabled(false)}
                                onBlur={() => {
                                    setScrollEnabled(true)

                                }}
                                value={username}
                            />

                            <Text className={'text-md font-bold mb-2 ml-3'}>Enter first name</Text>
                            <TextInput
                                placeholder={firstname}
                                autoCapitalize="none"
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 w-full"
                                onChangeText={(text) => setFirstname(text)}
                                onFocus={() => setScrollEnabled(false)}
                                onBlur={() => setScrollEnabled(true)}
                                value={firstname}
                            />

                            <Text className={'text-md font-bold mb-2 ml-3'}>Enter last name</Text>
                            <TextInput
                                placeholder={lastname}
                                autoCapitalize="none"
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 w-full"
                                onChangeText={(text) => setLastname(text)}
                                onFocus={() => setScrollEnabled(false)}
                                onBlur={() => setScrollEnabled(true)}
                                value={lastname}
                            />
                            
                            <Text className={'text-md font-bold ml-3'}>Select your gender</Text>
                            <Dropdown
                                style={{
                                    margin: 16,
                                    height: 50,
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 0.5,
                                }}
                                placeholderStyle={{ fontSize: 16, }}
                                data={genderPicker}

                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={genderValue}
                                searchPlaceholder="Search..."
                                value={genderValue}
                                onChange={item => {
                                    setGenderValue(item.value);
                                }}
                            />
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
                            {genderValue === "" && <Text className={'text-red-500 ml-2 mb-1'}>Select your gender</Text>}

                            <Text className={'text-md font-bold ml-3'}>Select your nationality</Text>
                            <Dropdown
                                style={{
                                    margin: 16,
                                    height: 50,
                                    borderBottomColor: 'gray',
                                    borderBottomWidth: 0.5,
                                }}
                                placeholderStyle={{ fontSize: 16, }}
                                data={nationalityPicker}
                                search
                                searchField="label"
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={nationalityValue}
                                searchPlaceholder="Search..."
                                value={nationalityPicker}
                                onChange={country => {
                                    setNationalityValue(country.value);
                                }}
                            />
                            {nationalityValue === "" && <Text className={'text-red-500 ml-2 mb-1'}>Select your nationality</Text>}

                            <Text className={'text-md font-bold ml-3'}>Select your school</Text>
                            <Dropdown
                                style={{
                                    margin: 16,
                                    height: 50,
                                    borderBottomColor: 'gray',
                                    borderBottomWidth: 0.5,

                                }}
                                placeholderStyle={{ fontSize: 16, }}
                                data={schoolPicker}
                                search
                                searchField="label"
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={schoolValue || "Select your school"}
                                searchPlaceholder="Search..."
                                value={schoolPicker}
                                onChange={school => {
                                    setSchoolValue(school.value);
                                }}
                            />

                            <Text className={'text-md font-bold mb-2 ml-3'}>Enter phone number</Text>
                            <TextInput
                                placeholder={phoneNumber}
                                autoCapitalize="none"
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 w-full"
                                keyboardType='numeric'
                                onChangeText={(text) => setPhoneNumber(text)}
                                onFocus={() => setScrollEnabled(false)}
                                onBlur={() => setScrollEnabled(true)}
                                value={phoneNumber}
                            />
                            <Text className={'text-md font-bold mb-2 ml-3'}>Select D.O.B</Text>
                            <TouchableOpacity onPress={showDatePicker} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 w-full">
                                <Text>{birthDate ? birthDate.toLocaleDateString('en-GB') : "Select Birthdate"}</Text>
                            </TouchableOpacity>
                            {isDatePickerVisible && Platform.OS === 'ios' && (
                                <DateModal
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
                                </DateModal>
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

                            <Text className={'text-md font-bold mb-2 ml-2'}>Tell us more about yourself</Text>
                            <TextInput
                                multiline
                                numberOfLines={5} // Set the number of lines you want to display initially
                                placeholder={description}
                                value={description}
                                className='p-2 bg-gray-100 text-gray-700 rounded-xl mb-2'
                                onChangeText={(text) => {
                                    setDescription(text);
                                }}
                                style={{ height: 100, textAlignVertical: 'top' }}
                                onFocus={() => setScrollEnabled(false)}
                                onBlur={() => setScrollEnabled(true)}
                            />


                            {schoolValue === "" && <Text className={'text-red-500 ml-2 mb-1'}>Select your school</Text>}
                            <View className='items-end mb-10 flex-row justify-end'>
                                <View className='mr-2'>
                                    <Button title="Update" onPress={handleSubmit} />
                                </View>

                                <Button title="Close" onPress={toggleModal} />
                            </View>
                        </ScrollView>

                    </KeyboardAvoidingView>
                </SafeAreaView>

            </Modal>
        </View>
    );
}

export default EditProfileModal;
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