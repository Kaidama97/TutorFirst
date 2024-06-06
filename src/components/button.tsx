import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { theme } from "../assets/theme/theme";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps {
  type: 'primary' | 'secondary';
  text: string;
  onPress: () => void;
  color?: string; // Add color prop
}

const Button: React.FC<ButtonProps> = ({ type, text, onPress, color }) => {
  const backgroundColor = type === "primary" ? theme.colors.buttonPrimary : theme.colors.buttonSecondary;
  const textColor = type === "primary" ? theme.colors.textPrimary : theme.colors.textSecondary;

  return (
    <StyledTouchableOpacity
      className="py-3 rounded-xl mx-7 mb-4"
      style={{ backgroundColor: color || backgroundColor }} // Use color prop if provided, else use default theme color
      onPress={onPress}
    >
      <StyledText className="text-xl text-center text-white font-bold" style={{ color: textColor }}>
        {text}
      </StyledText>
    </StyledTouchableOpacity>
  );
};

export default Button;
