import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Image, StyleSheet, Modal, Button, Alert } from 'react-native';
import { AuthContext } from "@/src/provider/authProvider";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/src/initSupabase';

interface ProfilePictureProps {
  userid: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ userid }) => {
  const { session } = useContext(AuthContext);
  const [imageUri, setImageUri] = useState<string | null>(null); // Initialize with null
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
    fetchProfileImage();
  }, [userid]);

  const fetchProfileImage = async () => {
    setLoading(true);
    try {
      if (!userid) {
        throw new Error('User ID is undefined or null');
      }
  
      const { data, error } = await supabase
        .from('users')
        .select('profilepicture')
        .eq('userid', userid)
        .single();
  
      console.log('Fetch Profile Image Data:', data);
      console.log('Fetch Profile Image Error:', error);
  
      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('User with provided userid not found');
      }
  
      const { profilepicture } = data;
  
      if (!profilepicture) {
        throw new Error('Profile picture not found');
      }
  
      const { data: imageData, error: downloadError } = await supabase.storage.from('avatars').download(profilepicture);
      if (downloadError) {
        throw downloadError;
      }
  
      const fr = new FileReader();
      fr.readAsDataURL(imageData);
      fr.onload = () => {
        setImageUri(fr.result as string);
        setLoading(false);
      };
    } catch (error) {
      console.error('Error fetching profile image: ', error);
      setLoading(false);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : imageUri ? (
          <Image style={styles.image} source={{ uri: imageUri }} />
        ) : (
          <View style={styles.noImage}>
            <Image
              source={require('../../../../assets/images/profile-picture-placeholder.png')}
              style={styles.placeholderImage}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Modal to display profile picture */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {imageUri ? (
            <Image style={styles.modalImage} source={{ uri: imageUri }} />
          ) : (
            <View style={styles.noImageModal}>
              <Image
                source={require('../../../../assets/images/profile-picture-placeholder.png')}
                style={styles.placeholderImageModal}
              />
            </View>
          )}
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  noImage: {
    backgroundColor: '#9d9d9d',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 50,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    resizeMode: 'cover',
  },
  noImageModal: {
    backgroundColor: '#9d9d9d',
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImageModal: {
    width: 150,
    height: 150,
  },
});

export default ProfilePicture;
