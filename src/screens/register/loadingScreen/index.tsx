import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const LoadingScreen = () => {
  return (
    <View className={'flex-1 justify-center items-center'}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text className={'mt-2 text-lg text-blue-500'}>Loading...</Text>
    </View>
  );
};

export default LoadingScreen;