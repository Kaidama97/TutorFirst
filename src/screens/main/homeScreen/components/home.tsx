import React from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { styled } from 'nativewind';
import { theme } from '../../../../assets/theme/theme';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(Button);

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      
        {/* Dashboard/Overview */}
        <StyledView className="mb-8">
          <StyledText className="text-2xl font-bold mb-4">Welcome to the App</StyledText>
          <StyledText className="text-lg">Quick overview and announcements</StyledText>
        </StyledView>

        {/* Quick Links */}
        <StyledView className="mb-8">
          <StyledText className="text-xl font-semibold mb-4">Quick Links</StyledText>
          
          {/* Quick Link to Chat */}
          <StyledButton
            title="Chat Function"
            onPress={() => navigation.navigate('Chat')}
            color={theme.colors.secondary}
          />
          
          {/* Quick Link to Classes by Subject */}
          <StyledButton
            title="Classes"
            onPress={() => navigation.navigate('Classes', { filter: 'subject' })}
            color={theme.colors.secondary}
          />
        </StyledView>

        {/* Upcoming Bookings */}
        <StyledView className="mb-8">
          <StyledText className="text-xl font-semibold mb-4">Upcoming Bookings</StyledText>
          <StyledText>No upcoming bookings</StyledText>
          {/* This would be populated with real data */}
        </StyledView>

        {/* Resources */}
        <StyledView className="mb-8">
          <StyledText className="text-xl font-semibold mb-4">Online Resources</StyledText>
          <StyledButton
            title="Access Resources"
            onPress={() => navigation.navigate('Resources')}
            color={theme.colors.secondary}
          />
        </StyledView>

        {/* Achievements */}
        <StyledView className="mb-8">
          <StyledText className="text-xl font-semibold mb-4">Achievements</StyledText>
          <StyledText>No achievements yet</StyledText>
          {/* This would be populated with real data */}
        </StyledView>


    </ScrollView>
  );
};

export default HomeScreen;

