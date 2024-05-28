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
}

const Button: React.FC<ButtonProps> = ({ type, text, onPress }) => {
  const backgroundColor = type === "primary" ? theme.colors.buttonPrimary : theme.colors.buttonSecondary;
  const textColor = type === "primary" ? theme.colors.textPrimary : theme.colors.textSecondary;

  return (
    <StyledTouchableOpacity
      className="py-3 rounded-xl mx-7 mb-4"
      style={{ backgroundColor: backgroundColor }}
      onPress={onPress}
    >
      <StyledText className="text-xl text-center text-white font-bold" style={{ color: textColor }}>
        {text}
      </StyledText>
    </StyledTouchableOpacity>
  );
};

export default Button;
