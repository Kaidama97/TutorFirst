import React, { useContext, useEffect } from 'react';
import { View, Text, ScrollView, Button, Dimensions, ImageBackground } from 'react-native';
import { theme } from '../../../../assets/theme/theme';
import moment from 'moment-timezone';
import { AuthContext } from '@/src/provider/authProvider';
import { studentsQuotes, teachersQuotes } from '@/src/constants/constants';
import { Ionicons } from '@expo/vector-icons';
//import Carousel from 'react-native-reanimated-carousel';


const HomeScreen: React.FC<{ userData: any }> = ({ userData }) => {
  const currentDateTime = moment();
  const timeZone = moment.tz.guess();
  const formattedDateTime = currentDateTime.format('DD/MM/YYYY HH:mm:ss');

  const getGreeting = () => {
    const currentHour = currentDateTime.hour();
    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }
  const getRandomQuote = () => {
    const quotes = userData?.roleid == "1" ? teachersQuotes : studentsQuotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };


  const screenHeight = Dimensions.get('window').height;
  const bannerHeight = screenHeight / 4;
  const greeting = getGreeting();
  const quote = getRandomQuote();


  return (

    <ImageBackground
      style={{ height: bannerHeight, borderRadius: 10}}
      className="rounded-xl justify-center items-center"
      source={require('../../../../assets/images/Home-screen-banner.png')}
      imageStyle={{ borderRadius: 10 }}
    >
      <View className="flex-1 justify-center pl-4 pr-4">
        <Text
          className="text-black text-xl font-bold text-left mb-2"
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {greeting}, {userData.username}!
        </Text>
        <Text
          className="text-black text-left mt-2 font-semibold"
          adjustsFontSizeToFit
          numberOfLines={2}  // Adjust the number of lines as needed
        >
          {quote}
        </Text>
      </View>
    </ImageBackground>

    

  );
};

export default HomeScreen;

