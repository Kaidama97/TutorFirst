import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { theme } from "../assets/theme/theme";

const Button = ({ type, text, onPress }) => {
    const backgroundColor = type === "primary" ? theme.colors.buttonPrimary : theme.colors.buttonSecondary;
    const textColor = type === "primary" ? theme.colors.textPrimary : theme.colors.textSecondary;
    return (
        <TouchableOpacity
            className={'py-3 rounded-xl mx-7 mb-4'}
            style={{ backgroundColor: backgroundColor }}
            onPress={onPress}>
            <Text className={'text-xl text-center text-white font-bold'} style={{ color: textColor }}>{text}</Text>
        </TouchableOpacity>
    );
};

export default Button;
