
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import ClassListComponent from './components/classListComponent';

const ResourcesScreen = () => {

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <ClassListComponent />
    </ScrollView>
  );
};

export default ResourcesScreen;