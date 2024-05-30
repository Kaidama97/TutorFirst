import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from "@/src/provider/authProvider";
const ProfileScreen = () => {
  const { signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    if (signOut) {
      signOut();
    }
  };
  return (
    <View>
      <Text>Profile Screen</Text>
      <Button
        title="Log Out"
        onPress={handleSignOut}
      />
    </View>
  );
};

export default ProfileScreen;