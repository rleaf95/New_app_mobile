import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function SimpleBackground() {
  return (
    <LinearGradient
      colors={[
        '#8FA5B8',
        '#A8BCC9',
        '#B8C8D4',
      ]}
      locations={[0, 0.5, 1.0]}
      style={StyleSheet.absoluteFillObject}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    />
  );
}