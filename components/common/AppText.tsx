import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';

interface AppTextProps {
  children: React.ReactNode;
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  style?: TextStyle | TextStyle[];
}

export function AppText({ children, variant = 'body', style }: AppTextProps) {
  return (
    <Text style={[styles.base, styles[variant], style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: '#000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  body: {
    fontSize: 17,
  },
  caption: {
    fontSize: 14,
    color: '#666',
  },
});
