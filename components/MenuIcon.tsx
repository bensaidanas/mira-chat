import React from 'react';
import Svg, { Line } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';

const MenuIcon: React.FC<{ size?: number }> = ({ size = 24 }) => {
  const { colors } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Line x1="3" y1="8" x2="21" y2="8" />
      <Line x1="3" y1="16" x2="13" y2="16" />
    </Svg>
  );
};

export default MenuIcon;

