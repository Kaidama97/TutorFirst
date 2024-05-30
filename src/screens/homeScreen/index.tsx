import { View, Text, Button } from 'react-native';
import React, { useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { AuthContext } from "@/src/provider/authProvider";

const Index = () => {
  const { signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    if (signOut) {
      signOut();
    }
  };

  return (
    <View>
      <Text>index</Text>
      <Button
        title="Log Out"
        onPress={handleSignOut}
      />
    </View>
  );
};

export default Index;