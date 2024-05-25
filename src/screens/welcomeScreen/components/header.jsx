import { View, Text } from 'react-native'

const header = () => {
  return (
    <View clasName={'flex-row justify-center items-center'}>
        <Text className={'text-3xl font-bold text-center text-white'}>
          Welcome To TutorFirst!
        </Text>
        <Text className={'text-lg mb-8 text-center text-white'}>Empowering Students to Excel</Text>
    </View>
  );
};

export default header;