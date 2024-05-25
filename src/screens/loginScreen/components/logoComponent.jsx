import { SafeAreaView, View, Image} from 'react-native'

const LogoComponent = () => {
  return (
<SafeAreaView className='flex'>
          <View className={'flex-row justify-center'}>
          <Image
            source={require('../../../assets/icons/logo.png')}
            style={{width: 250, height: 250}}
            tintColor={'#FFFFFF'}
          />
        </View>
        </SafeAreaView>
  );
};

export default LogoComponent;