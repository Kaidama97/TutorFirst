import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Button, Alert, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { AuthContext } from "@/src/provider/authProvider";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/src/initSupabase';

export default function ProfilePicture() {

  const { session, userData } = useContext(AuthContext);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
    fetchProfileImage();

  }, []);


  const fetchProfileImage = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('profilepicture')
      .eq('userid', session?.user?.id)
      .single();
    console.log("print profile url", data);
    if (error) throw error;

    const { profilepicture } = data;
    setProfilePictureUrl(profilepicture);

    try {

      const { data, error } = await supabase.storage.from('avatars').download(profilepicture)
      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setImageUri(fr.result as string)
      }
    } catch (error) {
      console.error('Error fetching profile image: ', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const removeImage = async function removeProfilePicture(profilePictureUrl: string) {
    try {
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .remove([profilePictureUrl]);
  
      if (error) {
        console.error('Error removing profile picture:', error.message);
      } else {
        console.log('Profile picture removed successfully:', data);
      }
    } catch (error) {
      console.error('Error in removeProfilePicture:', error);
    }
  }
  const uploadImage = async (path: string, arrayBuffer: any, image: any) => {
    removeImage(profilePictureUrl);

    try {
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arrayBuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        })

      if (uploadError) {
        throw uploadError
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ profilepicture: path })
        .eq('userid', session?.user?.id);

      if (updateError) {
        console.error('Update Profile Error:', updateError);
        throw updateError;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      fetchProfileImage();
    }
  };
  const pickImage = async () => {

    try {

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        aspect: [1, 1],
        exif: false, // We don't want nor need that data.
      })

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.')
        return
      }

      const image = result.assets[0]
      console.log('Got image', image)

      if (!image.uri) {
        throw new Error('No image uri!') // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
      const path = `${Date.now()}.${fileExt}`


      uploadImage(path, arraybuffer, image);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      } else {
        throw error
      }
    } finally {
    }

  }



  return (
    <View className="p-6 flex-row items-center">
      <TouchableOpacity
        onPress={pickImage}
        disabled={loading}
        className={" w-16 h-16 rounded-full items-center justify-center"}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : imageUri ? (
          <Image
            className={"w-16, h-16, rounded-Full"}
            style={[{ height: 100, width: 100, borderWidth: 0 }, styles.avatar, styles.image]}
            accessibilityLabel="Profile Picture"
            source={{ uri: imageUri }}
          />
        ) : (
          <View
            className={" w-16 h-16 rounded-full bg-gray-200 items-center justify-center"}
          >
            <Image
              source={require('../../../../assets/images/profile-picture-placeholder.png')}
              style={[{ height: 100, width: 100, borderWidth: 0 }, styles.avatar, styles.noImage]}
            />

          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#333',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 50,
    overflow: 'hidden',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: '#9d9d9d',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 50,
  },
})