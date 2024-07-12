import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
//import ClassForm from './components/classForm';

const CreateClassScreen: React.FC<{ navigation: any }> = ({ navigation }) => {


//<ClassForm navigation = {navigation}/>
  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView>
        
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default CreateClassScreen;