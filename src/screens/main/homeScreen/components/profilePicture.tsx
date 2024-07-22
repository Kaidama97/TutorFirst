import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, StyleSheet, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { AuthContext } from "@/src/provider/authProvider";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/src/initSupabase';

const ProfilePicture: React.FC<{ userId: any }> = ({ userId }) => {
  const { session } = useContext(AuthContext);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isEnlarged, setIsEnlarged] = useState<boolean>(false);

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
    try {
      const { data, error } = await supabase
        .from('users')
        .select('profilepicture')
        .eq('userid', userId)
        .single();

      if (error) {
        throw error;
      }

      const { profilepicture } = data;
      setProfilePictureUrl(profilepicture);

      const { data: imageData, error: downloadError } = await supabase.storage
        .from('avatars')
        .download(profilepicture);

      if (downloadError) {
        throw downloadError;
      }

      const fr = new FileReader();
      fr.readAsDataURL(imageData);

      fr.onload = () => {
        setImageUri(fr.result as string);
      };
    } catch (error) {
      console.error('Error fetching profile image:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEnlarged = () => {
    setIsEnlarged(!isEnlarged);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleEnlarged} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[{ height: 75, width: 75, borderWidth: 0 }, styles.avatar, styles.image]}
          />
        ) : (
          <View style={styles.placeholder}>
            <Image
              source={require('../../../../assets/images/profile-picture-placeholder.png')}
              style={styles.placeholderImage}
            />
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={isEnlarged} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback onPress={toggleEnlarged}>
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={styles.enlargedImage}
              />
            )}
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: '#9d9d9d',
  },
  placeholderImage: {
    width: 80,
    height: 80,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  enlargedImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 20,
  },
});

export default ProfilePicture;