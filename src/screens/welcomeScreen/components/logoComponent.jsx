import { View, Image} from 'react-native'

const LogoComponent = () => {
  return (
    <View className={'flex-2 flex-row justify-center'}>
    <Image
      source={require('../../../assets/icons/logo.png')}
      style={{width: 350, height: 350}}
      tintColor={'#FFFFFF'}
      resizeMode="contain"
    />
  </View>
  );
};

export default LogoComponent;