import { AuthContext } from '@/src/provider/authProvider';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Material Community Icons

const HomeScreenCards: React.FC<{ navigation: any, userData: any }> = ({ navigation, userData }) => {
  const roleid = userData?.roleid; // Assuming userData contains roleid

  return (
    <View style={styles.container}>
      {roleid === 2 && (
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardContent}
            onPress={() => navigation.navigate('classRecommendation')}
          >
            <Ionicons name="search" size={24} color="black" />
            <Text style={styles.cardText}>Recommendation</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('teacherDetail')}
        >
          <Icon name="account-search" size={24} color="black" />
          <Text style={styles.cardText}>Search Teachers</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('My Classes')}
        >
          <Ionicons name="book" size={24} color="black" />
          <Text style={styles.cardText}>My classes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={24} color="black" />
          <Text style={styles.cardText}>My profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    width: '48%',
    marginBottom: 10,
  },
  cardContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150, // Adjust height for square boxes
    elevation: 3, // For Android shadow effect
    shadowColor: '#000', // For iOS shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default HomeScreenCards;
