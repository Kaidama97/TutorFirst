import React from 'react';
import { View, Text } from 'react-native';

interface ClassSubtitleProps {
    resourceCount: number;
  }
  
  const ClassSubtitle: React.FC<ClassSubtitleProps> = ({ resourceCount }) => {
  return (
    <View className="mt-2">
      <Text className="text-md mb-2">
        {`Resources available in this class: ${resourceCount}`}
      </Text>
    </View>
  );
};

export default ClassSubtitle;