import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Button, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { AuthContext } from "@/src/provider/authProvider";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/src/initSupabase';

export default function TopSection() {

    const { session } = useContext(AuthContext);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect( () => {
        fetchProfileImage();
    }, []);

      const fetchProfileImage = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('users')
            .select('profilepicture')
            .eq('userid', session?.user)
            .single();
    
          if (error) throw error;
    
          const { profilepicture } = data;
          if (profilepicture) {
            const { data: signedURL, error: urlError } = await supabase.storage
              .from('avatars')
              .createSignedUrl(profilepicture, 60); // URL valid for 60 seconds
    
            if (urlError) throw urlError;
            setImageUri(signedURL.signedUrl);
          }
        } catch (error) {
          console.error('Error fetching profile image: ', error);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          await uploadImage(uri);
        }
      };
    
      const uploadImage = async (uri: string) => {
        setLoading(true);
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const filename = `${session?.user}-${Date.now()}.jpg`;
    
          const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filename, blob);
    
          if (error) throw error;
    
          const { data: signedURL, error: urlError } = await supabase.storage
            .from('avatars')
            .createSignedUrl(filename, 60); // URL valid for 60 seconds
    
          if (urlError) throw urlError;
          setImageUri(signedURL.signedUrl);
    
          // Update user profile with the new image URL
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: filename })
            .eq('id', session?.user);
    
          if (updateError) throw updateError;
        } catch (error) {
          console.error('Error uploading image: ', error);
          Alert.alert('Error', 'Failed to upload image');
        } finally {
          setLoading(false);
        }
      };
  return (
    <View className = "p-6 flex-row items-center">
        <TouchableOpacity
        onPress={pickImage}
        disabled={loading}
        className={" w-16 h-16 rounded-full items-center justify-center"}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : imageUri ? (
          <Image
            className={"w-16, h-16, rounded-Full"}
            source={{ uri: imageUri }}
          />
        ) : (
          <View
             className={" w-16 h-16 rounded-full bg-gray-200 items-center justify-center"}
          >
            <Image
              source={require('../../../../assets/images/profile-picture-placeholder.png')}
              className={"w-16 h-16"}
            />

          </View>
        )}
      </TouchableOpacity>
    </View> 
  )
}
