import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function SimpleBackground() {
  return (
    <LinearGradient
      colors={[
        '#8499acff',
        '#c8d0d6ff',
        '#ffffffff',
      ]}
      locations={[0, 0.8, 0.9]}
      style={StyleSheet.absoluteFillObject}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    />
  );
}