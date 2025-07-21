/**
 * Pixel Art Icon Component for gaming themed navigation
 */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export type PixelIconType = 'sword' | 'heart' | 'chat' | 'profile' | 'settings' | 'plus' | 'arrow' | 'cloud' | 'users' | 'person';

interface PixelIconProps {
  type: PixelIconType;
  size?: number;
  style?: ViewStyle;
  active?: boolean;
}

export const PixelIcon: React.FC<PixelIconProps> = ({ 
  type, 
  size = 24, 
  style, 
  active = false 
}) => {
  const { colors } = useTheme();
  const pixelSize = size / 8; // 8x8 pixel grid

  const renderPixelGrid = (pattern: number[][]) => {
    return pattern.map((row, rowIndex) => (
      <View key={rowIndex} style={{ flexDirection: 'row' }}>
        {row.map((pixel, colIndex) => (
          <View
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: getPixelColor(pixel, active),
            }}
          />
        ))}
      </View>
    ));
  };

  const getPixelColor = (pixel: number, isActive: boolean) => {
    if (pixel === 0) return 'transparent';
    if (pixel === 1) return isActive ? colors.primary : colors.textSecondary;
    if (pixel === 2) return isActive ? colors.accent : colors.border;
    return colors.text;
  };

  const getIconPattern = (iconType: PixelIconType): number[][] => {
    switch (iconType) {
      case 'sword':
        return [
          [0, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 0, 1, 2, 1, 0, 0],
          [0, 0, 1, 2, 2, 2, 1, 0],
          [0, 0, 0, 1, 2, 1, 0, 0],
          [0, 0, 0, 0, 1, 0, 0, 0],
        ];
      case 'heart':
        return [
          [0, 0, 1, 1, 0, 1, 1, 0],
          [0, 1, 2, 2, 1, 2, 2, 1],
          [1, 2, 2, 2, 2, 2, 2, 2],
          [1, 2, 2, 2, 2, 2, 2, 2],
          [0, 1, 2, 2, 2, 2, 2, 1],
          [0, 0, 1, 2, 2, 2, 1, 0],
          [0, 0, 0, 1, 2, 1, 0, 0],
          [0, 0, 0, 0, 1, 0, 0, 0],
        ];
      case 'chat':
        return [
          [0, 1, 1, 1, 1, 1, 0, 0],
          [1, 2, 2, 2, 2, 2, 1, 0],
          [1, 2, 2, 2, 2, 2, 1, 0],
          [1, 2, 2, 2, 2, 2, 1, 0],
          [1, 2, 2, 2, 2, 2, 1, 0],
          [0, 1, 1, 1, 1, 1, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0],
        ];
      case 'profile':
        return [
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 2, 2, 2, 2, 1, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [0, 1, 2, 2, 2, 2, 1, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 2, 2, 2, 2, 2, 2, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
        ];
      case 'settings':
        return [
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 1, 1, 2, 2, 1, 1, 0],
          [0, 1, 2, 2, 2, 2, 1, 0],
          [1, 2, 2, 1, 1, 2, 2, 1],
          [1, 2, 2, 1, 1, 2, 2, 1],
          [0, 1, 2, 2, 2, 2, 1, 0],
          [0, 1, 1, 2, 2, 1, 1, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
        ];
      case 'plus':
        return [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 1, 1, 2, 2, 1, 1, 0],
          [0, 1, 1, 2, 2, 1, 1, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ];
      case 'arrow':
        return [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 0],
          [0, 1, 2, 0, 0, 0, 0, 0],
          [1, 2, 2, 1, 1, 1, 1, 0],
          [1, 2, 2, 1, 1, 1, 1, 0],
          [0, 1, 2, 0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ];
      case 'cloud':
        return [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 1, 1, 0, 0, 0],
          [0, 1, 2, 2, 2, 1, 0, 0],
          [1, 2, 2, 2, 2, 2, 1, 0],
          [1, 2, 2, 2, 2, 2, 2, 1],
          [1, 2, 2, 2, 2, 2, 2, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ];
      case 'users':
        return [
          [0, 1, 1, 0, 0, 1, 1, 0],
          [1, 2, 2, 1, 1, 2, 2, 1],
          [1, 2, 2, 1, 1, 2, 2, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [1, 2, 2, 1, 1, 2, 2, 1],
          [1, 2, 2, 2, 2, 2, 2, 1],
          [1, 2, 2, 2, 2, 2, 2, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
        ];
      case 'person':
        return [
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 2, 2, 2, 2, 1, 0],
          [0, 1, 2, 2, 2, 2, 1, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 1, 2, 2, 1, 0, 0],
          [0, 1, 2, 2, 2, 2, 1, 0],
          [0, 1, 1, 0, 0, 1, 1, 0],
        ];
      default:
        return Array(8).fill(Array(8).fill(0));
    }
  };

  return (
    <View style={[{ width: size, height: size }, style]}>
      {renderPixelGrid(getIconPattern(type))}
    </View>
  );
};