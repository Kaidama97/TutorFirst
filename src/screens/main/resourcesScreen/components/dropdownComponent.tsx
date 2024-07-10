import { supabase } from '@/src/initSupabase';
import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';


interface DropdownComponentProps {
  onSubmit: () => void;
  classId: string;

}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ onSubmit, classId }) => {

  const [title, setTitle] = useState('');
  const [docFile, setDocFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  
  const removeFileExtension = (fileName: string): string => {
    // Find the last dot in the file name
    const lastDotIndex = fileName.lastIndexOf('.');
    
    // If there's no dot or it's the first character
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return fileName;
    }
    
    // Return the file name without the extension
    return fileName.substring(0, lastDotIndex);
  };
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });

      if (result && !result.canceled) {
        console.log('DocumentPicker result:', result);

        if (result.assets[0]) {
          setDocFile(result.assets[0]);
        } else {
          console.error('DocumentPicker did not return a valid file.');
        }
      } else {
        console.error('DocumentPicker cancelled or returned invalid result.');
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleUpload = async () => {
    if (docFile && docFile.uri) {
      const date = new Date();
      const fileExt = docFile.name?.split('.').pop();
      const name = removeFileExtension(docFile.name);
      const fileName = `${name}-${date.getTime()}.${fileExt}`;

      try {
        const fileUri = docFile.uri;
        const response = await fetch(docFile.uri);
      const arrayBuffer = await response.arrayBuffer();

      // Convert ArrayBuffer to a Uint8Array
      const uint8Array = new Uint8Array(arrayBuffer);
        const { data, error } = await supabase.storage
          .from('resource')
          .upload(fileName, uint8Array, {
            cacheControl: '3600',
            upsert: false,
            contentType: docFile.mimeType,
          });

        if (error) {
          console.error('Error uploading file:', error);
          return;
        }

        const { data: insertData, error: insertError } = await supabase
          .from('class_resource')
          .insert([{ class_id: classId, title: title, url: data.path }]);

        if (insertError) {
          console.error('Error inserting URL:', insertError);
        } else {
          onSubmit();
        }
      } catch (uploadError) {
        console.error('Error during file upload:', uploadError);
      }
    }
  };



  return (
    // <View className='mt-4 p-4 border border-gray-300 rounded-md w-full'>
    <View className='mt-4 p-4 w-full w-full border border-gray-300 rounded-md'>
      <Text className='mb-2 text-gray-700'>Title</Text>
      <TextInput
        className='mb-4 p-2 border border-gray-300 rounded-md'
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Pick a file" onPress={handleFilePick} />
      {docFile && 'uri' in docFile && <Text className="mt-2">Selected: {docFile.name}</Text>}
      <Button title="Upload" onPress={handleUpload} />

    </View>
  );
};

export default DropdownComponent;