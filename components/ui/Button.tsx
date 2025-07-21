import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.text : colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            isDisabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  // Variants
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.border,
    shadowColor: colors.glow,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    shadowColor: colors.glow,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
    shadowColor: colors.glow,
  },
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  // Text styles
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  primaryText: {
    color: colors.text,
  },
  secondaryText: {
    color: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  disabledText: {
    opacity: 0.5,
  },
});